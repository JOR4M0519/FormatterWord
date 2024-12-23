from flask import Flask, request, jsonify, render_template, send_file, url_for
from docx import Document
import pandas as pd
from filelock import FileLock, Timeout
import platform
import os
from reportlab.pdfgen import canvas
import win32com.client


app = Flask(__name__)

# Carpetas para almacenar documentos
UPLOAD_FOLDER = "templates_word"  # Carpeta con las plantillas
OUTPUT_FOLDER = "output_word"     # Carpeta con los documentos generados
EXCEL_FILE = "output_word/data_global.xlsx"  # Archivo Excel global compartido
EXCEL_LOCK_FILE = "output_word/data_global.lock"  # Archivo de bloqueo para el Excel
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def replace_and_underline_text(paragraph, field, value, table):
    """
    Reemplaza un campo específico en un párrafo, manteniendo el formato original y aplicando subrayado solo al texto reemplazado.
    """
    runs = paragraph.runs
    full_text = "".join(run.text for run in runs)  # Combinar texto completo del párrafo

    # Si el campo existe en el texto completo
    if field in full_text:
        new_text = full_text.replace(field, value)  # Reemplazar el campo con el valor

        # Limpiar los "runs" existentes
        for run in runs:
            run.text = ""

        # Reconstruir los "runs" con el texto reemplazado y aplicar formato
        for word in new_text.split():
            new_run = paragraph.add_run(f"{word} ")
            if value in word:  # Si es el texto reemplazado, aplicar subrayado
                if not table:    
                    new_run.font.underline = True
            else:  # Mantener el formato original para el resto del texto
                new_run.font.name = runs[0].font.name
                new_run.font.size = runs[0].font.size
                new_run.font.bold = runs[0].font.bold
                new_run.font.italic = runs[0].font.italic

def replace_fields_in_table(table, data):
    """
    Reemplaza los campos dentro de una tabla en un documento Word.
    """
    for row in table.rows:
        for cell in row.cells:
            for paragraph in cell.paragraphs:
                for field, value in data.items():
                    replace_and_underline_text(paragraph, field, value, True)

def wait_for_excel_lock(lock_path, timeout=10):
    """
    Espera a que el archivo Excel esté desbloqueado.
    """
    lock = FileLock(lock_path)
    try:
        lock.acquire(timeout=timeout)
        return lock
    except Timeout:
        raise Exception("El archivo Excel está siendo usado por otro proceso. Inténtalo nuevamente.")


def save_to_excel(data):
    """
    Guarda los datos en un archivo Excel compartido.
    """
    try:
        # Esperar a que el archivo esté disponible
        with wait_for_excel_lock(EXCEL_LOCK_FILE):
            if os.path.exists(EXCEL_FILE):
                df = pd.read_excel(EXCEL_FILE)
                new_row = pd.DataFrame([data])
                df = pd.concat([df, new_row], ignore_index=True)
            else:
                df = pd.DataFrame([data])
            df.to_excel(EXCEL_FILE, index=False)
    except Exception as e:
        print(f"Error al guardar en Excel: {e}")
        raise

def save_pdf_from_docx(docx_path, pdf_path):
    """
    Convierte un archivo Word (.docx) a PDF usando win32com en Windows.
    """
    try:
        word = win32com.client.Dispatch("Word.Application")
        doc = word.Documents.Open(docx_path)
        doc.SaveAs(pdf_path, FileFormat=17)  # 17 es el formato PDF
        doc.Close()
        word.Quit()
        print(f"PDF generado correctamente: {pdf_path}")
    except Exception as e:
        print(f"Error al convertir Word a PDF: {e}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate_words", methods=["POST"])
def generate_words():
    try:
        # Obtener datos fijos del formulario
        data = request.form.to_dict()

        # Obtener datos clave para el nombre de la carpeta
        grado = data.get("{{GRADO}}", "SIN_GRADO").replace(" ", "_")
        nombre = data.get("{{NOMBRE_EST}}", "SIN_NOMBRE").replace(" ", "_")
        apellido = data.get("{{APELLIDO_EST}}", "SIN_APELLIDO").replace(" ", "_")

        # Crear nombre de la carpeta en el formato requerido
        folder_name = f"{grado}_{nombre}_{apellido}"

        # Crear la carpeta específica para el estudiante
        student_folder = os.path.join(OUTPUT_FOLDER, folder_name)
        os.makedirs(student_folder, exist_ok=True)

        # Exportar datos a Excel
        save_to_excel(data)

        # Verificar que existan plantillas en la carpeta
        docx_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".docx")]
        if not docx_files:
            return jsonify({"error": "No hay archivos Word en la carpeta seleccionada."}), 400

        # Procesar cada archivo Word y reemplazar los campos
        for filename in docx_files:
            template_path = os.path.join(UPLOAD_FOLDER, filename)
            output_path = os.path.join(student_folder, f"output_{filename}")

            doc = Document(template_path)

            # Reemplazar campos en párrafos
            for paragraph in doc.paragraphs:
                for field, value in data.items():
                    replace_and_underline_text(paragraph, field, value, False)

            # Reemplazar campos en tablas
            for table in doc.tables:
                replace_fields_in_table(table, data)

            if platform.system() == "Windows":
                os.startfile(student_folder)

            doc.save(output_path)

            # Generar archivo PDF
            pdf_output_path = output_path.replace(".docx", ".pdf")
            save_pdf_from_docx(output_path, pdf_output_path)


        return jsonify({"success": True, "message": "Formatos generados correctamente.", "output_folder": OUTPUT_FOLDER})

    except Exception as e:
        print(f"Error al generar documentos: {e}")
        return jsonify({"error": "Error al generar documentos."}), 500

@app.route("/preview/<folder_name>")
def preview_folder(folder_name):
    folder_path = os.path.join(OUTPUT_FOLDER, folder_name)
    if not os.path.exists(folder_path):
        return jsonify({"error": "La carpeta no existe."}), 404

    # Listar archivos en la carpeta
    files = os.listdir(folder_path)
    file_links = [url_for('download_file', folder_name=folder_name, filename=f) for f in files]
    return render_template("preview.html", folder_name=folder_name, files=zip(files, file_links))

@app.route("/download/<folder_name>/<filename>")
def download_file(folder_name, filename):
    file_path = os.path.join(OUTPUT_FOLDER, folder_name, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "El archivo no existe."}), 404
    return send_file(file_path)


if __name__ == "__main__":
    app.run(debug=True)


