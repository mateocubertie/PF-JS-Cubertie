// Le da a la seccion #main un margin-top igual a la altura del header (ya que este tiene position: fixed
// y sale del flujo normal del documento)
let headerHeight = parseInt(document.querySelector('header').offsetHeight)
document.body.style.marginTop = `${headerHeight}px`

// Obtenemos del DOM los nodos del display y de las entradas de datos
let display = document.querySelector('#displayPresupuesto')
let inputHectareas = document.querySelector('#presHectareas')
let inputPulv = document.querySelector('#presPulv')
let inputLargoPulv = document.querySelector('#presLargoPulv')

// Lista de inputs del form
let formInputs = [inputHectareas, inputPulv, inputLargoPulv]
// Inicializamos el Form
let form = new Form(document.querySelector('#formPresupuesto'), formInputs)
// Accion del boton de submit
form.btnSubmit.addEventListener("click", () => {
    if (!form.submitDisable) {
        // Leemos los inputs
        let hectareas = parseInt(inputHectareas.value)
        let pulv = parseInt(inputPulv.value)
        let largoPulv = parseInt(inputLargoPulv.value)
        // Creamos un objeto con los datos del campo
        let datosCampo = {
            'hectareas': hectareas,
            'metrosPulv': pulv * largoPulv
        }
        // Generamos el presupuesto y lo mostramos en pantalla
        generarPresupuesto(datosCampo)
    }
})
