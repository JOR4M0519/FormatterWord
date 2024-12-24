# Generador de Matrículas Formulario a PDF
Se digitaliza el diligenciamiento de los formularios a través del cargue de los formatos en word a través de palabras claves en formato de doble corchete para su remplazo en el servidor backend en flask y conversión de pdf con la aplicación de la imagen del estudiante y visualziación de los documentos generados.


---

## **Requisitos Previos**

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes componentes:

### **Software Requerido**
1. **Python 3.8+**

### **Bibliotecas de Python**
Ejecuta el siguiente comando para instalar las dependencias necesarias:
```bash
pip install -r requirements.txt
```

### **Estructura del Proyecto**

```bash
FormatterWord/
├── app.py                # Archivo principal del servidor Flask
├── templates/
│   ├── index.html        # Interfaz HTML principal
│   └── preview.html      # Previsualización de los archivos generados
├── static/
│   ├── css/
│   │   └── styles.css    # Estilos personalizados
│   ├── js/
│   │   └── scripts.js    # Funciones JavaScript
│   └── py/.html
│       └── function.js   # Funciones de python para agregar en el futuro
├── templates_word/       # Carpeta con los formatos de word almacenados
├── output/               # Carpeta donde se almacenan los words, pdf y fotos 
├── requirements.txt      # Lista de dependencias de Python
├── Variables.txt         # Lista de variables aplicadas en los formatos de word
└── README.md             # Este archivo
```
### **Cómo Ejecutar el Proyecto**

# Generador de formatos de Matricula

Este proyecto permite rellenar los formatos de word a partir de un formulario en html, generando sus respectivos PDFs.

---

## **Cómo Ejecutar el Proyecto**

### 1. Clona el Repositorio

Clona el repositorio en tu máquina local utilizando Git:

```bash
git clone https://github.com/JOR4M0519/FormatterWord.git
cd FormatterWord
```

### 2. Configura las Dependencias

Instala las bibliotecas necesarias especificadas en el archivo `requirements.txt` ejecutando:

```bash
pip install -r requirements.txt
```

### 3. Inicia el Servidor Flask

## Forma 1
Ejecuta el archivo start.bat

Esto ejecutará la aplicación y podrás acceder a ella desde tu navegador en la siguiente dirección:
```bash
http://localhost:5000
```

## Forma 2
Ejecuta el archivo principal del proyecto (`app.py`) para iniciar el servidor Flask:

```bash
python app.py
```

Esto ejecutará la aplicación y podrás acceder a ella desde tu navegador en la siguiente dirección:
```bash
http://127.0.0.1:5000
```

### 4. Configuración para Uso en Red

Para permitir que otros equipos conectados a la misma red puedan acceder al servidor Flask, sigue estos pasos:

1. Encuentra tu dirección IP local ejecutando ipconfig (Windows) o ifconfig (Linux/Mac).
2. Edita el archivo app.py para que Flask use la dirección IP local:

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

3. Desde otros dispositivos en la misma red, podrás acceder usando la dirección:

http://<TU_IP_LOCAL>:5000

---

## **Funcionalidades Principales**
### **1. Generación de Documentos Word Personalizados**
- Completa plantillas de documentos Word utilizando los datos proporcionados en el formulario web.
- Reemplaza campos específicos con información ingresada.
- Genera los documentos en una carpeta específica por estudiante.

### **2. Exportación a PDF**
- Convierte automáticamente los documentos Word generados en archivos PDF.
- Guarda los archivos PDF en la misma carpeta que los documentos Word.

### **3. Integración de Imágenes en Documentos PDF**
- Permite añadir una imagen (como una foto de perfil) en una ubicación específica del PDF generado.

### **4. Exportación a Excel**
- Almacena toda la información proporcionada en el formulario web en un archivo Excel centralizado.
- Detecta si el archivo Excel está abierto y espera hasta que esté disponible para actualizarlo.

---

## **Cómo Funciona el Proyecto**

Nota: En los documentos se guardan las variables entre dos corchetes para el remplazo en el código. Como s evisualiza en el archivo Variables.txt 

### **1. Flujo del Usuario**
- El usuario completa un formulario web con la información del estudiante, padre y madre.
- Los datos son enviados al servidor Flask, donde se procesan.
- Se generan documentos Word personalizados, se exportan a PDF y se guardan en carpetas organizadas.
- La información también se registra en un archivo Excel.

### **2. Características Técnicas**
- **Backend**: Flask maneja la lógica del servidor.
- **Frontend**: HTML, CSS y JavaScript.
- **Procesamiento de Documentos**: python-docx y reportlab para manipular documentos Word y PDF.
- **Exportación a Excel**: openpyxl para crear y actualizar archivos Excel.

---

### Licencia
Este proyecto está bajo la Licencia MIT.
