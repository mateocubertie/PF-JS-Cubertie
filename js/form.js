class Form {
    constructor(node, inputs) {
        this.node = node
        this.btnSubmit = node.querySelector('.submitButton')
        this.inputs = inputs
        this.submitDisable = true

        this.btnSubmit.addEventListener("click", (e)=> {
            e.preventDefault()
        })
        this.inicializarInputs()
    }
    formCheckSubmit() {
        this.submitDisable = false
        for (let input of this.inputs) {
            if (input.invalidInput || input.value == "") {
                this.submitDisable = true
            }
        }
        if(this.submitDisable) {
            this.btnSubmit.classList.add('disabledButton')
        } 
        else {
            this.btnSubmit.classList.remove('disabledButton')
        }
    }
    inicializarInputs() {
        for (let input of this.inputs) {
            if (input.value == "" || input.value == 'default') {
                input.invalidInput = true
            }
            else {
                input.invalidInput = false
            }
            input.addEventListener('input', () => {
                if (input.tagName == 'INPUT'){
                    switch(input.getAttribute('type')) {
                    case 'number':
                        input.invalidInput = formNumberCheck(input)
                        break
                    case 'text':
                        input.invalidInput = input.value == ""
                        break;
                    default:
                        input.invalidInput = false
                        break
                    }
                }
                else if (input.tagName == 'SELECT') {
                    input.invalidInput = (input.value == 'default')
                }
                this.formCheckSubmit()
            })
        }
        this.formCheckSubmit()
    }
}

function formShowInputAlert(inputElement, alertMessage) {
    let parentNode = inputElement.parentNode
    let alertElement = document.createElement('h4')
    alertElement.textContent = alertMessage
    alertElement.classList.add('inputAlert')
    parentNode.insertBefore(alertElement, parentNode.querySelector('input'))
}

function formNumberCheck(inputElement) {
    let inputValue = parseInt(inputElement.value)
    let alertElement = inputElement.parentNode.querySelector('.inputAlert')
    // chequea si hay una alerta en pantalla
    if (alertElement) {
        // la borra
        alertElement.remove()
    }
    if (Number.isNaN(inputValue)) {
        formShowInputAlert(inputElement, 'Ingrese un numero')
        return true
    }
    else if (inputValue <= 0) {
        formShowInputAlert(inputElement, 'Ingrese un numero positivo')
        return true
    }
    return false
}