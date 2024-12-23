
document.getElementById("DATAFORM").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el envío automático del formulario
    
    var formData;

    try {
        // Mostrar el spinner mientras se hace la solicitud
        document.getElementById("modal").style.display = "flex";

        // Obtener los datos del formulario
        formData = new FormData(event.target);

        const data = {};
        formData.forEach((value, key) => {
            // Solo procesamos los campos de texto, no los archivos
            if (value instanceof File) {
                // Aquí no aplicamos `toUpperCase()` a los archivos, solo los dejamos tal cual
                data[key] = value;  // Los archivos se mantienen tal cual en el FormData
            } else {
                // Aplicamos `toUpperCase()` solo a los valores de texto
                data[key] = value.toUpperCase();
            }
        });


    } catch (error) {
        mostrarModal("Error Web","Hubo un problema al generar los documentos. Inténtalo nuevamente.","error");
        document.getElementById("modal").style.display = "none";
        console.error(error);
    }
    // Enviar los datos al backend
    try {
        const response = await fetch("/generate_words", {
            method: "POST",
            //headers: {"Content-Type": "application/x-www-form-urlencoded",},
            //body: new URLSearchParams(data),
            body: formData,
        });

        // Ocultar el spinner
        document.getElementById("modal").style.display = "none";

        if (response.ok) {
            const result = await response.json();
            mostrarModal("Se rellenaron correctamente todos los campos",result.message,"success");

            // Extraer el nombre de la carpeta de los resultados de la respuesta
            const folderName = result.output_folder;  // Asegúrate de que el servidor te pase esta información

            // Abrir la vista previa en una nueva ventana (usar window.open)
            window.open(`/preview/${folderName}`, "_blank");

        } else {
            const error = await response.json();
            document.getElementById("modal").style.display = "none";
            mostrarModal("Error","Error: " + error.error, "error");
        }
    } catch (error) {
        mostrarModal("Error","Hubo un problema al generar los documentos. Inténtalo nuevamente.","error");
        document.getElementById("modal").style.display = "none";
        console.error(error);
    }
});



function mostrarModal(titulo, mensaje, tipo = 'info') {
    // Establecer el título y mensaje
    document.getElementById('alertaModalLabel').textContent = titulo;
    document.getElementById('modalMensaje').innerHTML = mensaje;

    // Cambiar el estilo según el tipo de alerta
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-info'); // Eliminar clases de color previas
    switch (tipo) {
        case 'success':
            modalContent.classList.add('bg-success', 'text-white');
            break;
        case 'warning':
            modalContent.classList.add('bg-warning', 'text-dark');
            break;
        case 'error':
            modalContent.classList.add('bg-danger', 'text-white');
            break;
        default:
            modalContent.classList.add('bg-info', 'text-white');
    }

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('alertaModal'));
    modal.show();
}

function convertirNumeroALetras(num) {
    const unidades = [
        '', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE',
        'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE',
        'VEINTE', 'VEINTIUNO', 'VEINTIDÓS', 'VEINTITRÉS', 'VEINTICUATRO', 'VEINTICINCO', 'VEINTISÉIS', 'VEINTISIETE', 'VEINTIOCHO', 'VEINTINUEVE',
        'TREINTA', 'TREINTA Y UNO'
    ];
    let letras = '';

    if (num > 0) {
        letras += unidades[num];
    }

    return letras.trim();
}

function calcularEdad() {
    // Obtener los valores de fecha de nacimiento
    const diaNacimiento = parseInt(document.getElementById('DIA_EST').value);
    const mesNacimiento = parseInt(document.getElementById('MES_EST').value);
    const anioNacimiento = parseInt(document.getElementById('ANIO_EST').value);

    // Verificar que todos los campos sean completos
    if (isNaN(diaNacimiento) || isNaN(mesNacimiento) || isNaN(anioNacimiento)) {
        mostrarModal('¡Atención!', 'Por favor, completa todos los campos de la fecha de nacimiento.', 'warning');
        return;
    }

    // Obtener la fecha actual
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const diaActual = fechaActual.getDate();

    // Calcular la edad
    let edad = anioActual - anioNacimiento;

    // Ajustar la edad si no ha cumplido años aún este año
    if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
        edad--;
    }

    // Mostrar la edad calculada
    document.getElementById('EDAD_EST').value = edad;
}

// Función que habilita o deshabilita el campo de alergia según la selección
function toggleAlergiaField() {
    var alergiaSelect = document.getElementById('ALERGIA_V');
    var alergiaInput = document.getElementById('ALERGIA');

    // Si seleccionan 'Sí', habilita el campo de descripción de alergia
    if (alergiaSelect.value === 'SI') {
        alergiaInput.value = "";
        alergiaInput.readOnly  = false;   // Habilita el campo
    } else {
        alergiaInput.value = "NA";
        alergiaInput.readOnly  = true;   // Deshabilita el campo
    }
}

// Función que habilita o deshabilita el campo de enfermedad según la selección
function toggleEnfermedadField() {
    var enfermedadSelect = document.getElementById('ENFERMEDAD_V');
    var enfermedadInput = document.getElementById('ENFERMEDAD');

    // Si seleccionan 'Sí', habilita el campo de descripción de enfermedad
    if (enfermedadSelect.value === 'SI') {
        enfermedadInput.value = "";
        enfermedadInput.readOnly  = false;  // Habilita el campo
    } else {
        enfermedadInput.value = "NA";
        enfermedadInput.readOnly  = true;   // Deshabilita el campo
    }
}

function setRepresentanteData() {
    // Obtener la opción seleccionada
    const representanteSelect = document.getElementById("REPRESENTANTE").value;

    // Campos donde se colocarán los valores
    const nombreInput = document.getElementById("NOMBRE_REPRESENTA");
    const ccInput = document.getElementById("CC_REPRESENTA");

    // Valores de nombre y cédula basados en los IDs del formulario
    const nombrePadre = document.getElementById("NOMBRE_PAPA").value || "No ingresado";
    const ccPadre = document.getElementById("CC_PAPA").value || "No ingresado";
    const nombreMadre = document.getElementById("NOMBRE_MAMA").value || "No ingresado";
    const ccMadre = document.getElementById("CC_MAMA").value || "No ingresado";

    // Asignar valores dependiendo de la selección
    if (representanteSelect === "PADRE") {
        nombreInput.value = nombrePadre;
        ccInput.value = ccPadre;
    } else if (representanteSelect === "MADRE") {
        nombreInput.value = nombreMadre;
        ccInput.value = ccMadre;
    } else {
        // Limpiar los campos si no se selecciona nada
        nombreInput.value = "";
        ccInput.value = "";
    }
}

function export_grado_m(){
        document.getElementById("grado_m").value = document.getElementById("GRADO").value; 
    }

function cargarCostos() {
    const grado = document.getElementById("GRADO").value;

    // Costos por Grado
    const pensionValores = {
        "PARVULOS": 3000000,
        "PREJARDÍN": 3800000,
        "JARDÍN": 3800000,
        "TRANSICIÓN": 3800000,
        "PRIMERO": 4100000,
        "SEGUNDO": 4100000,
        "TERCERO": 4100000,
        "CUARTO": 3225000,
        "QUINTO": 3225000
    };

    const matriculaValores = {
        "PARVULOS": 450000,
        "PREJARDÍN": 750000,
        "JARDÍN": 720650,
        "TRANSICIÓN": 693000,
        "PRIMERO": 657300,
        "SEGUNDO": 657300,
        "TERCERO": 657300,
        "CUARTO": 508300,
        "QUINTO": 508300
    };

    if (grado && pensionValores[grado] && matriculaValores[grado]) {
        // Asignar valores automáticamente
        const pension = pensionValores[grado];
        const matricula = matriculaValores[grado];
        const total = pension + matricula;

        document.getElementById("PENSION_VALOR").value = pension.toLocaleString();
        document.getElementById("COSTO_MATRICULA_VALOR").value = matricula.toLocaleString();
        document.getElementById("COSTO_TOTAL_VALOR").value = total.toLocaleString();

    } else {
        mostrarModal("Alerta","Por favor selecciona un grado válido.","warning");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Referencia al checkbox "Padre No Presente"
    const padreNoPresenteCheckbox = document.getElementById("padre_no_presente");
    
    // Función para actualizar los campos cuando el padre no está presente
    function togglePadreFields() {
        // Seleccionamos los inputs que necesitan ser modificados
        const fields = [
            "NOMBRE_PAPA", "CC_PAPA", "CEL_PAPA", "TEL_OFIC_PAPA", "EMAIL_PAPA", "DIRECCION_PAPA",
            "LUGAR_EXPEDICION_CC_PAPA", "OCUPACION_PAPA", "TIPO_DOC_PAPA", "LUGAR_NACIMIENTO_PAPA",
            "ESTADO_CIVIL_PAPA", "FECHA_NACIMIENTO_PAPA", "REGMEN_FISCAL_PAPA", "RESPONSABILIDAD_FISCAL_PAPA",
            "EMPRESA_PAPA", "DIRECCION_LABORAL_PAPA", "CARGO_PAPA", "P_P", "P_S", "P_T", "P_U"
        ];

       

        // Función para restaurar los campos a su estado original
        function enableField(fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.readOnly = false;
                if (field.type !== "checkbox") {
                    field.value = ""; // Limpiamos el valor
                }
            }
        }

        // Si el checkbox está marcado, deshabilitamos y configuramos los campos
        if (padreNoPresenteCheckbox.checked) {
            // Cambiar todos los campos a "NA" y deshabilitarlos
            fields.forEach(fieldId => {
                readOnlyAndSetFieldToNA(fieldId);
            });

            // Cambiar los tipos de inputs a "text" para permitir "NA" en lugar de valores numéricos o de correo
            const fieldsToChangeType = [
                "EMAIL_PAPA", "TEL_OFIC_PAPA", "CC_PAPA", "CEL_PAPA", "FECHA_NACIMIENTO_PAPA"
            ];
            fieldsToChangeType.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.type = "text"; // Cambiar el tipo de los campos problemáticos
                }
            });
        } else {
            // Restaurar los campos a su estado original
            fields.forEach(fieldId => {
                enableField(fieldId);
            });

            // Restaurar los tipos originales de los inputs
            const fieldsToRestoreType = [
                "EMAIL_PAPA", "TEL_OFIC_PAPA", "CC_PAPA", "CEL_PAPA", "FECHA_NACIMIENTO_PAPA"
            ];
            fieldsToRestoreType.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    // Restauramos los tipos según corresponda
                    if (fieldId === "EMAIL_PAPA") field.type = "email";
                    else if (fieldId === "TEL_OFIC_PAPA") field.type = "tel";
                    else if (fieldId === "CC_PAPA" || fieldId === "CEL_PAPA") field.type = "number";
                    else if (fieldId === "FECHA_NACIMIENTO_PAPA") field.type = "date";
                }
            });
        }

        function readOnlyAndSetFieldToNA(fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                // Si el campo es un input de tipo "checkbox", lo desmarcamos
                if (field.type === "checkbox") {
                    field.checked = false;
                } else if (field.type === "number" || field.type === "date") {
                    field.type = "text";
                    field.value = "NA";
                } else {
                    // Para otros tipos de campo, llenamos con "NA"
                    field.value = "NA";
                }
                field.readOnly = true;
            }
        }

    }

    // Llamamos a la función cuando el checkbox cambie
    padreNoPresenteCheckbox.addEventListener("change", togglePadreFields);

    // Ejecutar la función al cargar la página para asegurarse de que los campos estén correctamente configurados
    togglePadreFields();
});

document.addEventListener("DOMContentLoaded", function() {
    // Referencia al checkbox "Madre No Presente"
    const madreNoPresenteCheckbox = document.getElementById("madre_no_presente");
    
    // Función para actualizar los campos cuando la madre no está presente
    function toggleMadreFields() {
        // Seleccionamos los inputs que necesitan ser modificados
        const fields = [
            "NOMBRE_MAMA", "CC_MAMA", "CEL_MAMA", "TEL_OFIC_MAMA", "EMAIL_MAMA", "DIRECCION_MAMA",
            "LUGAR_EXPEDICION_CC_MAMA", "OCUPACION_MAMA", "TIPO_DOC_MAMA", "LUGAR_NACIMIENTO_MAMA",
            "ESTADO_CIVIL_MAMA", "FECHA_NACIMIENTO_MAMA", "REGMEN_FISCAL_MAMA", "RESPONSABILIDAD_FISCAL_MAMA",
            "EMPRESA_MAMA", "DIRECCION_LABORAL_MAMA", "CARGO_MAMA", "M_P", "M_S", "M_T", "M_U"
        ];

        

        // Función para restaurar los campos a su estado original
        function enableField(fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.readOnly = false;
                if (field.type !== "checkbox") {
                    field.value = ""; // Limpiamos el valor
                }
            }
        }

        // Si el checkbox está marcado, deshabilitamos y configuramos los campos
        if (madreNoPresenteCheckbox.checked) {
            // Cambiar todos los campos a "NA" y deshabilitarlos
            fields.forEach(fieldId => {
                readOnlyAndSetFieldToNA(fieldId);
            });

            // Cambiar los tipos de inputs a "text" para permitir "NA" en lugar de valores numéricos o de correo
            const fieldsToChangeType = [
                "EMAIL_MAMA", "TEL_OFIC_MAMA", "CC_MAMA", "CEL_MAMA", "FECHA_NACIMIENTO_MAMA"
            ];
            fieldsToChangeType.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.type = "text"; // Cambiar el tipo de los campos problemáticos
                }
            });
        } else {
            // Restaurar los campos a su estado original
            fields.forEach(fieldId => {
                enableField(fieldId);
            });

            // Restaurar los tipos originales de los inputs
            const fieldsToRestoreType = [
                "EMAIL_MAMA", "TEL_OFIC_MAMA", "CC_MAMA", "CEL_MAMA", "FECHA_NACIMIENTO_MAMA"
            ];
            fieldsToRestoreType.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    // Restauramos los tipos según corresponda
                    if (fieldId === "EMAIL_MAMA") field.type = "email";
                    else if (fieldId === "TEL_OFIC_MAMA") field.type = "tel";
                    else if (fieldId === "CC_MAMA" || fieldId === "CEL_MAMA") field.type = "number";
                    else if (fieldId === "FECHA_NACIMIENTO_MAMA") field.type = "date";
                }
            });
        }

        function readOnlyAndSetFieldToNA(fieldId) {
            const field = document.getElementById(fieldId);
            if (field) {
                // Si el campo es un input de tipo "checkbox", lo desmarcamos
                if (field.type === "checkbox") {
                    field.checked = false;
                } else if (field.type === "number" || field.type === "date") {
                    // Si el campo es de tipo "number" o "date", lo dejamos vacío en lugar de asignar "NA"
                    field.type = "text";
                    field.value = "NA"; // Limpiamos el valor
                } else {
                    // Para otros tipos de campo, llenamos con "NA"
                    field.value = "NA";
                }
                field.readOnly = true;
            }
        }
    }

    // Llamamos a la función cuando el checkbox cambie
    madreNoPresenteCheckbox.addEventListener("change", toggleMadreFields);

    // Ejecutar la función al cargar la página para asegurarse de que los campos estén correctamente configurados
    toggleMadreFields();
});

document.addEventListener("DOMContentLoaded", () => {

    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];

    const fecha = new Date();
    const anioActual = fecha.getFullYear();
    const diaActual =  fecha.getDate();;
    const mesActual = meses[fecha.getMonth()];
    const mesActualNum = fecha.getMonth()+1;

    // Colocar el año actual en el input
    document.getElementById("ANIO").value = anioActual;
    document.getElementById("MES").value = mesActual;
    document.getElementById("MES_NUM").value = mesActualNum;
    document.getElementById("DIA").value = diaActual;
    document.getElementById("DIA_LETRA").value = convertirNumeroALetras(diaActual);



});
