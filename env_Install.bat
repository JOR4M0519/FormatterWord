@echo off
REM Crear el entorno virtual
echo Creando entorno virtual...
python -m venv venv

REM Activar el entorno virtual
echo Activando entorno virtual...
call venv\Scripts\activate

REM Crear el archivo .env (vacío por el momento)
echo Creando archivo .env...
echo. > .env

REM Crear el archivo requirements.txt
echo Creando archivo requirements.txt...
echo Flask==2.3.2 > requirements.txt
echo python-docx==0.8.11 >> requirements.txt
echo reportlab==3.6.12 >> requirements.txt
echo pandas >> requirements.txt
echo filelock >> requirements.txt
echo openpyxl >> requirements.txt
echo waitress >> requirements.txt
echo pywin32 >> requirements.txt
echo docx2pdf >> requirements.txt

REM Instalar las dependencias
echo Instalando dependencias desde requirements.txt...
pip install -r requirements.txt

echo Todo listo. El entorno está configurado y las dependencias instaladas.
pause
