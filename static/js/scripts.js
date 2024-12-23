
document.getElementById("DATAFORM").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el envío automático del formulario

    // Obtener los datos del formulario
    const formData = new FormData(event.target);

    // Convertir los datos del formulario en un objeto JSON
    const data = {};
    formData.forEach((value, key) => {
        // Transformar la clave al formato {{key}}
        data[`{{${key}}}`] = value.toUpperCase();
    });
    
    // Enviar los datos al backend
    try {
        const response = await fetch("/generate_words", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data),
        });

        if (response.ok) {
            const result = await response.json();
            mostrarModal("Se rellenaron correctamente todos los campos",result.message,"success");
        } else {
            const error = await response.json();
            mostrarModal("Error","Error: " + error.error, "error");
        }
    } catch (error) {
        mostrarModal("Error","Hubo un problema al generar los documentos. Inténtalo nuevamente.","error");
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
        alergiaInput.value = "N/A";
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
        enfermedadInput.value = "N/A";
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
    

});
