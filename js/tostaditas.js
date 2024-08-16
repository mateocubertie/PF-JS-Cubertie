
function toastPresupuestoGenerado() {
    Toastify({
        text: "Presupuesto generado ✅",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita exito",
    }).showToast();
}

function toastErrorCargaProductos() {
    Toastify({
        text: "Falló la conexión con la base de datos ⚠",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita error",
    }).showToast();
}

function toastExitoCarga() {
    Toastify({
        text: "Datos cargados con exito ✅",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita exito",
    }).showToast();
}

function toastErrorCargaLocal() {
    Toastify({
        text: "No hay datos guardados ⚠",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita error",
    }).showToast();
}

function toastExitoGuardado() {
    Toastify({
        text: "Datos guardados con exito ☁",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita exito",
    }).showToast();
}

function toastCampoGenerado() {
    Toastify({
        text: "Nuevo campo generado 🚜",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita info",
    }).showToast();
}

function toastReset() {
    Toastify({
        text: "Simulacion reiniciada ♻",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita info",
    }).showToast();
}
function toastDiaSoleado() {
    Toastify({
        text: "Día de sol simulado 🌞",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita info",
    }).showToast();
}
function toastDiaNublado() {
    Toastify({
        text: "Día nublado simulado ☁",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita info",
    }).showToast();
}

function toastDiaLluvia() {
    Toastify({
        text: "Día lluvioso simulado ☔",
        duration: 3500,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true,
        className: "tostadita info",
    }).showToast();
}