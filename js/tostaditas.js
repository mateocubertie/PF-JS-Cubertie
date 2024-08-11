
function toastPresupuesto() {
    Toastify({
        text: "Presupuesto generado ✅",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita exito",
    }).showToast();
}

function toastExitoCarga() {
    Toastify({
        text: "Datos cargados con exito ✅",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita exito",
    }).showToast();
}

function toastErrorCarga() {
    Toastify({
        text: "No hay datos guardados ⚠",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita error",
    }).showToast();
}

function toastExitoGuardado() {
    Toastify({
        text: "Datos guardados con exito ☁",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita exito",
    }).showToast();
}

function toastCampoGenerado() {
    Toastify({
        text: "Nuevo campo generado 🚜",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita info",
    }).showToast();
}

function toastReset() {
    Toastify({
        text: "Simulacion reiniciada ♻",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita info",
    }).showToast();
}
function toastDiaSoleado() {
    Toastify({
        text: "Día de sol simulado 🌞",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita info",
    }).showToast();
}
function toastDiaNublado() {
    Toastify({
        text: "Día nublado simulado ☁",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita info",
    }).showToast();
}

function toastDiaLluvia() {
    Toastify({
        text: "Día lluvioso simulado ☔",
        duration: 3500,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        className: "tostadita info",
    }).showToast();
}