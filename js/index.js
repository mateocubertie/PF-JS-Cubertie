// Le da a la seccion #main un margin-top igual a la altura del header (ya que este tiene position: fixed
// y sale del flujo normal del documento)
let headerHeight = parseInt(document.querySelector('header').offsetHeight)
document.body.style.marginTop = `${headerHeight}px`

let display = document.querySelector('#displayPresupuesto')

let inputHectareas = document.querySelector('#presHectareas')
let inputPulv = document.querySelector('#presPulv')
let inputLargoPulv = document.querySelector('#presLargoPulv')


let formInputs = [inputHectareas, inputPulv, inputLargoPulv]
let form = new Form(document.querySelector('#formPresupuesto'), formInputs)

form.btnSubmit.addEventListener("click", () => {
    if (!form.submitDisable) {
        let hectareas = parseInt(inputHectareas.value)
        let pulv = parseInt (inputPulv.value)
        let largoPulv = parseInt(inputLargoPulv.value)
        generarPresupuesto(hectareas, pulv, largoPulv)
    }
})