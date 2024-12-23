import os
from PIL import Image
from pdfrw import PdfReader, PdfWriter, PageMerge
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# Configuración de carpetas
OVERLAY_TEMP = "overlay_temp.pdf"

def get_pdf_page_size(pdf_path):
    """Obtiene el tamaño de la primera página del PDF."""
    pdf = PdfReader(pdf_path)
    first_page = pdf.pages[0]
    media_box = first_page.MediaBox
    width = float(media_box[2]) - float(media_box[0])
    height = float(media_box[3]) - float(media_box[1])
    return width, height

def create_image_overlay(output_path, image_path, x, y, max_width, max_height, page_width, page_height):
    """Crea un PDF temporal con la imagen superpuesta."""
    c = canvas.Canvas(output_path, pagesize=(page_width, page_height))
    c.drawImage(ImageReader(image_path), x, y, max_width, max_height)
    c.save()

def merge_image_with_pdf(base_pdf_path, overlay_pdf_path, output_pdf_path):
    """Combina un PDF base con una imagen superpuesta preservando los formularios."""
    base_pdf = PdfReader(base_pdf_path)
    overlay_pdf = PdfReader(overlay_pdf_path)

    for base_page, overlay_page in zip(base_pdf.pages, overlay_pdf.pages):
        PageMerge(base_page).add(overlay_page).render()

    PdfWriter(output_pdf_path, trailer=base_pdf).write()
    os.remove(overlay_pdf_path)
    print(f"PDF generado correctamente: {output_pdf_path}")

def find_image_file():
    """Busca el primer archivo de imagen válido en la carpeta actual."""
    valid_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
    for file in os.listdir():
        if os.path.splitext(file)[1].lower() in valid_extensions:
            return file
    return None

def main():
    # Nombre del archivo PDF de entrada y salida
    pdf_path = "output_F03. MATRICULA.pdf"  # Cambia por el nombre del archivo PDF de entrada
    output_pdf_path = "output_F03. MATRICULA.pdf"  # Archivo PDF de salida

    # Verificar que el archivo PDF exista
    if not os.path.exists(pdf_path):
        print(f"El archivo {pdf_path} no existe. Por favor, coloca un PDF en la misma carpeta.")
        return

    # Buscar una imagen en la carpeta
    photo_path = find_image_file()
    if not photo_path:
        print("No se encontró ninguna imagen válida en la carpeta actual.")
        return
    print(f"Imagen encontrada: {photo_path}")

    # Obtener tamaño de la página del PDF
    page_width, page_height = get_pdf_page_size(pdf_path)

    # Definir dimensiones máximas de la imagen
    max_width = 105
    max_height = (max_width / 3 * 4)

    # Crear el overlay de la imagen
    create_image_overlay(OVERLAY_TEMP, photo_path, x=457, y=755, max_width=max_width, max_height=max_height,
                         page_width=page_width, page_height=page_height)

    # Combinar la imagen con el PDF
    merge_image_with_pdf(pdf_path, OVERLAY_TEMP, output_pdf_path)
    print(f"PDF generado en: {output_pdf_path}")

if __name__ == "__main__":
    main()
