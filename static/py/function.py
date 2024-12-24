def replace_and_underline_text(paragraph, field, value):
    """
    Reemplaza un campo específico en un párrafo, manteniendo el formato original y aplicando color al texto reemplazado.
    """
    if field in paragraph.text:
        # Combinar todos los "runs" del párrafo en un solo texto
        full_text = paragraph.text
        updated_text = full_text.replace(field, value)

        # Limpiar todos los "runs" existentes
        for run in paragraph.runs:
            run.text = ""

        # Reconstruir el texto con los nuevos valores
        start_index = 0
        for part in updated_text.split(value):
            if part:
                # Agregar texto previo al campo reemplazado
                run = paragraph.add_run(part)
                run.font.size = paragraph.style.font.size
                run.font.name = paragraph.style.font.name
                run.font.color.rgb = paragraph.style.font.color.rgb

            # Agregar el valor reemplazado con color amarillo
            if start_index < len(updated_text.split(value)) - 1:
                run = paragraph.add_run(value)
                run.font.color.rgb = RGBColor(196, 171, 0)  # Color amarillo
                run.bold = True

            start_index += 1