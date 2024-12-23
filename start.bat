@echo off
python -m waitress --listen=0.0.0.0:5000 --threads=2 app:app
pause

