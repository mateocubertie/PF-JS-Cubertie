

//! Funciones de operaciones generales

// Pone una mayuscula al principio del string
function meterMayuscula(string) {
    return string[0].toUpperCase().concat(string.slice([1]));
}

// Formatea el string (mayuscula al principio y luego minusculas)
function formatearString(string) {
    return meterMayuscula(string.toLocaleLowerCase());
}

// Genera un numero aleatorio de 2 cifras decimales
function randomNumber(min, max) {
    let difference = max - min;
    return Math.floor((min + Math.random() * difference) * 10) / 10;
}

// Toma un numero y lo ajusta a sus limites establecidos si es necesario
function fitToLimits(num, min, max) {
    if (num < min) {
        num = min;
    }
    else if (num > max) {
        num = max;
    }
    return num;
}

//! Funciones de operaciones con objetos (pendiente: pasarlas a metodos)

function filtrarCampo(campo, celdaFiltro) {
    let campoFiltrado = []
    campo.array.forEach((fila) => {
        // Obtiene las coincidencias en cada fila
        let coincidenciasFila = fila.filter((celda) => compararCelda(celda, celdaFiltro))
        // Las concatena al array del campo filtrado
        campoFiltrado = campoFiltrado.concat(coincidenciasFila);
    })
    return campoFiltrado;
}

// Chequea que las propiedades numericas de la celda se encuentren dentro de los limites
function chequearLimitesCelda(celda) {
    celda.humedad = fitToLimits(celda.humedad, 5, 100);
    celda.temperatura = fitToLimits(celda.temperatura, -5, 35);
    celda.progreso = fitToLimits(celda.progreso, 0, 100);
}

function generarPromedio(campoFiltrado, propiedad) {
    let sumaTotal = campoFiltrado.reduce((accumulator, celda) => accumulator + celda[`${propiedad}`], 0)
    let digitosDecimales = 2
    const redondeoDecimal = Math.pow(10, digitosDecimales)
    let promedio = Math.round((sumaTotal / campoFiltrado.length) * redondeoDecimal) / redondeoDecimal
    return promedio
}

function compararCelda(celda, celdaFiltro) {
    for (let propiedad in celdaFiltro) {
        let valorFiltro = celdaFiltro[`${propiedad}`];
        if (valorFiltro !== 'undefined' && valorFiltro !== 'Undefined') {
            let valorPropiedad = celda[`${propiedad}`];
            if (propiedad == 'cultivo') {
                if (valorPropiedad !== valorFiltro) {
                    return false;
                }
            }
            else {
                let min = valorFiltro[0];
                let max = valorFiltro[1];
                if (valorPropiedad < min || valorPropiedad >= max) {
                    return false;
                }
            }
        }
    }
    return true;
}
function consultarCelda(campo, fila, columna) {
    let arrayFila = campo.array[fila]
    if (arrayFila) {
        let celda = (campo.array[fila])[columna]
        return celda ?? null
    }
    else {
        return null
    }
}

// Genera las celdas del array del campo (guardado como var. global)
function inicializarCampo(form2) {
    arrayCampo = []
    let listaParcelas = form2.node.getElementsByClassName('dataInputs')
    for (let parcela of listaParcelas) {
        let cultivo = formatearString(parcela.querySelector('.nombreCultivo').value)
        let progresoInicial = parcela.querySelector('.progresoInicial').value
        let humedadInicial = parcela.querySelector('.humedadInicial').value
        let largo = parseInt(parcela.querySelector('.largoParcela').value)
        for (let nFila = 0; nFila < largo; nFila++) {
            let fila = [];
            // For que recorre cada celda de la fila
            for (let nColumna = 0; nColumna < anchoCampo; nColumna++) {
                // Genera un id de la forma '(fila;columna)'
                let id = `${nFila};${nColumna}`;
                let celda = new HectareaCultivo(id, cultivo, setHumedadInicial(humedadInicial), setTemperaturaInicial(tempInicial), setProgresoInicial(progresoInicial));
                fila.push(celda);
            }
            arrayCampo.push(fila);
        }
    }
}

//! Funciones flecha para actualizar las celdas del simulador

let actualizarCeldaLluvia = (celda) => {
    celda.humedad += randomNumber(3, 10);
    celda.temperatura -= randomNumber(0.5, 2);
    celda.progreso += randomNumber(1.5, 2.2);
    chequearLimitesCelda(celda);

}
let actualizarCeldaSol = (celda) => {
    celda.humedad -= randomNumber(0.5, 1);
    celda.temperatura += randomNumber(0.2, 1);
    celda.progreso += randomNumber(0.5, 1.2);
    chequearLimitesCelda(celda);

}
let actualizarCeldaNublado = (celda) => {
    celda.humedad -= randomNumber(0.2, 0.8);
    celda.temperatura -= randomNumber(0.2, 0.5);
    celda.progreso += randomNumber(0.2, 1);
    chequearLimitesCelda(celda);
}

//! Funciones para traducir inputs en valores de propiedades

function setTemperaturaInicial(opcion) {
    switch (opcion) {
        case '1':
            return randomNumber(10, 15);
        case '2':
            return randomNumber(15, 20);
        case '3':
            return randomNumber(20, 25);
    }
}

function setHumedadInicial(opcion) {
    switch (opcion) {
        case '1':
            return randomNumber(0, 20);
        case '2':
            return randomNumber(20, 40);
        case '3':
            return randomNumber(40, 60);
        case '4':
            return randomNumber(60, 80);
    }
}

function setProgresoInicial(opcion) {
    switch (opcion) {
        case '1':
            return randomNumber(0, 5);
        case '2':
            return randomNumber(15, 25);
        case '3':
            return randomNumber(40, 50);
        case '4':
            return randomNumber(60, 75);
        case '5':
            return randomNumber(85, 95);
    }
}

function coloresCultivos(cultivo) {
    switch (cultivo) {
        case 'Papa':
            return '#804000'
        case 'Zanahoria':
            return '#ff8000'
        case 'Berenjena':
            return '#EE82EE'
        case 'Soja':
            return '#ebeba4'
        case 'Acelga':
            return '#00913f'
        case 'Tomate':
            return '#FF0000'
        case 'Cebolla':
            return '#c28dc0'
        case 'Maiz':
            return '#ffd000'
    }
}

function getFiltroHumedad(opcion) {
    switch (opcion) {
        case '1':
            return [0, 20];
        case '2':
            return [20, 40];
        case '3':
            return [40, 60];
        case '4':
            return [60, 100];
    }
    return opcion
}

function getFiltroTemperatura(opcion) {
    switch (opcion) {
        case '1':
            return [0, 15];
        case '2':
            return [15, 20];
        case '3':
            return [20, 100];
    }
    return opcion
}

function getFiltroProgreso(opcion) {
    switch (opcion) {
        case '1':
            return [0, 20];
        case '2':
            return [20, 40];
        case '3':
            return [40, 60];
        case '4':
            return [60, 80];
        case '5':
            return [80, 100];
        case '6':
            return [100, 101];
    }
    return opcion
}

//! Funciones que operan con objetos del DOM

function getNodeFromTemplate(templateSelector) {
    return document.querySelector(`${templateSelector}`).content.cloneNode(true).children.item(0)
}

//! Funciones que modifican el contenido mostrado



function saveCheck() {
    let localSave = JSON.parse(localStorage.getItem("campoSave"))
    if (localSave) {
        campo = localSave
        limpiarPantalla()
        menuSimulador()
        toastExitoCarga()
    }
    else {
        toastErrorCarga()
    }
}

function checkLastScreen() {
    let lastScreen = sessionStorage.getItem("lastScreen") ?? 'primerForm'
    switch (lastScreen) {
        case 'primerForm':
            menuForm1()
            break
        case 'simulador':
            campo = JSON.parse(localStorage.getItem("campoSave"))
            // Reconvierte el campo guardado en localStorage en un objeto de prototipo Campo
            // (el parse devuelve un objeto sin prototipo, y por lo tanto sin metodos asociados)
            Object.setPrototypeOf(campo, new Campo())
            limpiarPantalla()
            menuSimulador()
            break
    }
}

function limpiarPantalla() {
    simulador.innerHTML = `<h2>Simulador de campo</h2>`
}

function getGridCampo(campo) {
    let gridCampo = document.createElement('div')
    gridCampo.style.gridTemplateColumns = `repeat(${campo.ancho}, max-content)`
    gridCampo.style.gridTemplateRows = `repeat(${campo.filas}, max-content)`
    for (let nFila = 0; nFila < campo.filas; nFila++) {
        for (let nColumna = 0; nColumna < campo.ancho; nColumna++) {
            let celda = document.createElement('div')
            celda.className = 'celdaHectarea'
            celda.style.backgroundColor = `${campo.array[nFila][nColumna].color}`
            gridCampo.appendChild(celda)
        }
    }
    return gridCampo

}

function centerGrid(gridCampo) {
    if (gridCampo.clientWidth < gridCampo.scrollWidth) {
        gridCampo.style.justifyContent = 'flex-start'
    }
    else {
        gridCampo.style.justifyContent = 'center'
    }
    if (gridCampo.clientHeight < gridCampo.scrollHeight) {
        gridCampo.style.alignContent = 'flex-start'
    }
    else {
        gridCampo.style.alignContent = 'center'
    }
}

//! Menus

function menuForm1() {
    let inputAncho = document.querySelector('#simAnchoCampo')
    let inputCantCultivos = document.querySelector('#simCultivos')
    let inputTemperatura = document.querySelector('#tempInicial')
    let formInputs = [inputAncho, inputCantCultivos, inputTemperatura]

    form1 = new Form(document.querySelector('#formSimulador1'), formInputs)
    form1.btnSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        if (!form1.submitDisable) {
            anchoCampo = parseInt(inputAncho.value)
            cantidadCultivos = parseInt(inputCantCultivos.value)
            tempInicial = inputTemperatura.value
            limpiarPantalla()
            form2()
        }
    })

    let buttonCargarProgreso = document.querySelector('.buttonCargarProgreso')
    buttonCargarProgreso.onclick = (e) => {
        e.preventDefault()
        saveCheck()
    }
}

function form2() {
    let templateClone = document.querySelector('#gridFormTemplate').content.cloneNode(true)
    let formElement = templateClone.querySelector('form')
    let contenedorGrid = templateClone.querySelector('.formGrid')
    let formInputs = []
    for (let i = 1; i <= cantidadCultivos; i++) {
        let inputCard = document.querySelector('#gridInputTemplate').content.cloneNode(true).querySelector('div')
        let tituloParcela = document.createElement('h3')
        tituloParcela.textContent = `Parcela #${i}`
        inputCard.appendChild(tituloParcela)
        let inputCultivo = document.querySelector('#inputNombreCultivo').content.cloneNode(true).querySelector('.formInput')
        let inputProgresoInicial = document.querySelector('#inputProgresoInicial').content.cloneNode(true).querySelector('.formInput')
        let inputHumedadInicial = document.querySelector('#inputHumedadInicial').content.cloneNode(true).querySelector('.formInput')
        let inputLargo = document.querySelector('#inputLargoParcela').content.cloneNode(true).querySelector('.formInput')
        let inputList = [inputCultivo, inputProgresoInicial, inputHumedadInicial, inputLargo]
        inputList.forEach((input) => {
            inputCard.appendChild(input)
            formInputs.push(input.querySelector('input') ?? input.querySelector('select'))
        })
        contenedorGrid.appendChild(inputCard)
    }
    simulador.appendChild(formElement)
    let form2 = new Form(formElement, formInputs)

    form2.btnSubmit.addEventListener("click", () => {
        if (!form2.submitDisable) {
            inicializarCampo(form2)
            console.log(arrayCampo)
            console.log(anchoCampo)
            console.log(arrayCampo.length)
            campo = new Campo(arrayCampo, anchoCampo, arrayCampo.length)
            console.log('reset?')
            limpiarPantalla()
            menuSimulador()
            toastCampoGenerado()
        }
    })
}

function menuSimulador() {
    sessionStorage.setItem("lastScreen", 'simulador')
    let gridCampo = getGridCampo(campo)
    gridCampo.className = 'gridCampo'
    let dataContainer = getNodeFromTemplate('#dataContainerSimulador')
    dataContainer.className = 'simDataContainer'
    dataContainer.querySelector('.gridWrapper').appendChild(gridCampo)
    simulador.appendChild(dataContainer)
    let zoomSlide = simulador.querySelector('.zoomSlide')
    centerGrid(gridCampo)
    zoomSlide.addEventListener('input', (e) => {
        let zoomValue = 1.0 + e.target.value / 100
        document.documentElement.style.setProperty('--sim-display-zoom', `${zoomValue}`)
        console.log('cambiaste el slide')
        centerGrid(gridCampo)
    })

    let gridBotones = document.querySelector('#botonesSimulador').content.cloneNode(true)
    simulador.appendChild(gridBotones)
    let listaBotones = simulador.getElementsByClassName('button')
    for (let boton of listaBotones) {
        boton.addEventListener('click', (event) => {
            let buttonClasses = event.target.classList
            let buttonAction = buttonClasses[buttonClasses.length - 1]
            switch (buttonAction) {
                case 'buttonMenuConsultar':
                    limpiarPantalla()
                    menuConsultar()
                    break
                case 'buttonMenuSimular':
                    limpiarPantalla()
                    menuSimularDia()
                    break
                case 'buttonMenuFiltrar':
                    limpiarPantalla()
                    menuFiltrar()
                    break
                case 'buttonMenuPromedio':
                    limpiarPantalla()
                    menuPromedio()
                    break
                case 'buttonMenuGuardar':
                    localStorage.setItem("campoSave", JSON.stringify(campo))
                    toastExitoGuardado()
                    break
                case 'buttonMenuReiniciar':
                    sessionStorage.setItem("lastScreen", 'primerForm')
                    limpiarPantalla()
                    simulador.appendChild(form1.node)
                    console.log(campo)
                    toastReset()
                    break
            }
        })
    }
}

function menuConsultar() {
    let menuClone = document.querySelector('#menuConsultar').content.cloneNode(true)
    let formNode = menuClone.querySelector('.genericForm')
    let inputs = []
    for (let input of formNode.getElementsByTagName('input')) {
        if (input.getAttribute('type') != 'submit') {
            inputs.push(input)
        }
    }
    let form = new Form(formNode, inputs)
    simulador.appendChild(formNode)
    let display = form.node.querySelector('.dataDisplay')
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            display.innerHTML = ""
            let fila = parseInt(form.node.querySelector('#inputFilaCelda').value)
            let columna = parseInt(form.node.querySelector('#inputColumnaCelda').value)
            let celda = consultarCelda(campo, fila, columna)
            if (celda != null) {
                let tabla = document.createElement('table')
                for (let propiedad in celda) {
                    if (propiedad != 'color') {
                        let fila = document.createElement('tr')
                        fila.innerHTML = `
                            <th class="propiedad">
                                ${formatearString(propiedad)}:
                            </th>
                            <th class="valorPropiedad">
                                ${celda[propiedad]}
                            </th>
                        `
                        tabla.appendChild(fila)
                    }
                }
                display.appendChild(tabla)
            }
            else {
                display.innerHTML = '<h3 class="centerText">No existe la celda buscada</h3>'
            }
        }
    })
    form.node.querySelector('.backButton').addEventListener("click", () => {
        limpiarPantalla()
        menuSimulador()
    })
}

function menuFiltrar() {
    let campoFiltrado
    let menuClone = document.querySelector('#menuFiltrar').content.cloneNode(true)
    let formNode = menuClone.querySelector('.genericForm')
    let dataInputs = formNode.querySelector('.dataInputs')
    let formCultivo = document.querySelector("#inputCultivoFiltro").content.cloneNode(true).querySelector('.formInput')
    let formTemperatura = document.querySelector("#inputTemperaturaFiltro").content.cloneNode(true).querySelector('.formInput')
    let formHumedad = document.querySelector("#inputHumedadFiltro").content.cloneNode(true).querySelector('.formInput')
    let formProgreso = document.querySelector("#inputProgresoFiltro").content.cloneNode(true).querySelector('.formInput')
    let formsFiltros = [formTemperatura, formHumedad, formProgreso, formCultivo]
    let inputs = []
    for (filtro of formsFiltros) {
        dataInputs.prepend(filtro)
        inputs.push(filtro.querySelector('select'))
    }
    let form = new Form(formNode, inputs)
    form.submitDisable = false
    form.formCheckSubmit
    simulador.appendChild(form.node)
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            let cultivoFiltro = formatearString(formCultivo.querySelector('select').value)
            let temperaturaFiltro = getFiltroTemperatura(formTemperatura.querySelector('select').value)
            let humedadFiltro = getFiltroHumedad(formHumedad.querySelector('select').value)
            let progresoFiltro = getFiltroProgreso(formProgreso.querySelector('select').value)
            let celdaFiltro = {
                cultivo: cultivoFiltro,
                temperatura: temperaturaFiltro,
                humedad: humedadFiltro,
                progreso: progresoFiltro
            }
            let arrayFiltrado = []
            for (let fila = 0; fila < campo.filas; fila++) {
                let arrayFila = []
                for (let columna = 0; columna < campo.ancho; columna++) {
                    let celda = new HectareaCultivo(undefined, undefined, undefined, undefined, undefined)
                    if (compararCelda(campo.array[fila][columna], celdaFiltro)) {
                        celda.color = 'green'
                    }
                    else {
                        celda.color = 'grey'
                    }
                    arrayFila.push(celda)
                }
                arrayFiltrado.push(arrayFila)
            }
            campoFiltrado = new Campo(arrayFiltrado, campo.ancho, campo.filas)
            limpiarPantalla()
            let gridCampo = getGridCampo(campoFiltrado)
            gridCampo.className = 'gridCampo'
            let gridWrapper = getNodeFromTemplate('#dataContainerSimulador').querySelector('.gridWrapper')
            gridWrapper.appendChild(gridCampo)
            
            simulador.appendChild(gridWrapper)
            centerGrid(gridCampo)
            let backButton = document.querySelector('#templateBackButton').content.cloneNode(true).querySelector('button')
            simulador.appendChild(backButton)
            backButton.addEventListener('click', (e) => {
                limpiarPantalla()
                menuSimulador()
            })
        }
    })
}

function menuSimularDia() {
    let formNode = document.querySelector('#menuSimulacion').content.cloneNode(true).querySelector('form')
    let selectorClima = formNode.querySelector('select')
    let inputs = [selectorClima]
    let form = new Form(formNode, inputs)
    let backButton = formNode.querySelector('.backButton')
    backButton.addEventListener('click', () => {
        limpiarPantalla()
        menuSimulador()
    })
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            let opcion = selectorClima.value
            switch (opcion) {
                case '1':
                    campo.recorrerCampo(actualizarCeldaSol);
                    toastDiaSoleado()
                    break;
                case '2':
                    campo.recorrerCampo(actualizarCeldaNublado);
                    toastDiaNublado()
                    break;
                case '3':
                    campo.recorrerCampo(actualizarCeldaLluvia);
                    toastDiaLluvia()
                    break;
            }
        }
    })
    simulador.appendChild(formNode)
}

function menuPromedio() {
    let formNode = getNodeFromTemplate('#menuPromedio')
    let dataInputs = formNode.querySelector('.dataInputs')
    let selectInputs = formNode.getElementsByTagName('select')
    let inputs = []
    for (let input of selectInputs) {
        inputs.push(input)
    }
    let form = new Form(formNode, inputs)
    simulador.appendChild(formNode)
    form.btnSubmit.addEventListener
    let backButton = formNode.querySelector('.backButton')
    backButton.addEventListener('click', (e) => {
        e.preventDefault()
        limpiarPantalla()
        menuSimulador()
    })
    let filtroOpcional = formNode.querySelector('#filtrarPromedio')
    let flagFiltro = false
    filtroOpcional.addEventListener('input', (e) => {
        let opcion = e.target.value
        switch (opcion) {
            case 'si':
                let filtros = [getNodeFromTemplate('#inputCultivoFiltro'), getNodeFromTemplate('#inputHumedadFiltro'), getNodeFromTemplate('#inputTemperaturaFiltro'), getNodeFromTemplate('#inputProgresoFiltro')]
                for (let input of filtros) {
                    form.inputs.push(input)
                    dataInputs.insertBefore(input, dataInputs.querySelector('.submitButton'))
                }
                form.inicializarInputs()
                flagFiltro = true
                break
            case 'no':
                if (flagFiltro) {
                    let i = 0
                    let inputs = form.node.getElementsByClassName('formInput')
                    while (i < 4) {
                        inputs[inputs.length - 1].remove()
                        i++
                    }
                    flagFiltro = false
                }
                break
        }
    })
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            let campoPromediado = campo
            let display = form.node.querySelector('.dataDisplay')
            if (flagFiltro) {
                let celdaFiltro = {
                    cultivo: formatearString(form.node.querySelector('#nombreCultivo').value),
                    temperatura: getFiltroTemperatura(form.node.querySelector('#temperaturaFiltro').value),
                    humedad: getFiltroHumedad(form.node.querySelector('#humedadFiltro').value),
                    progreso: getFiltroProgreso(form.node.querySelector('#progresoFiltro').value)
                }
                campoPromediado = filtrarCampo(campo, celdaFiltro)
            }
            else {
                let filasFusionadas = []
                for (let fila of campo.array) {
                    filasFusionadas = filasFusionadas.concat(fila)
                }
                campoPromediado = filasFusionadas
            }
            if (campoPromediado.length == 0) {
                display.innerHTML = `<h3>No hay celdas coincidentes con el filtro</h3>`
                return
            }
            let propiedad = form.node.querySelector('#parametroPromedio').value
            let unidad
            switch (propiedad) {
                case 'temperatura':
                    unidad = '°C'
                    break
                case 'progreso':
                case 'humedad':
                    unidad = '%'
                    break
            }
            let promedio = generarPromedio(campoPromediado, propiedad)
            display.innerHTML = `<h3>Promedio obtenido: <span class="destacado">${promedio}${unidad}<span></h3>`
        }
    })
}

//! Clases y sus metodos
class Campo {
    constructor(array, ancho, filas) {
        this.array = array
        this.ancho = ancho
        this.filas = filas
    }
    recorrerCampo(funcion) {
        this.array.forEach((fila) => {
            fila.forEach((celda) => funcion(celda))
        })
    }
}

class HectareaCultivo {
    // Constructor
    constructor(id, cultivo, humedad, temperatura, progreso) {
        this.id = id;
        this.cultivo = cultivo;
        this.humedad = humedad;
        this.temperatura = temperatura;
        this.progreso = progreso;
        this.color = coloresCultivos(cultivo)
    }
}

//!! PROGRAMA PRINCIPAL

// Le da un margin-top al contenido igual a la altura del header (position: fixed, fuera del flujo del documento)
let headerHeight = parseInt(document.querySelector('header').offsetHeight)
document.body.style.marginTop = `${headerHeight + 30}px`

let simulador = document.querySelector('#simulador')

let arrayCampo = []
let anchoCampo

let cantidadCultivos
let tempInicial

let campo

// Objeto global para el formulario que se muestra por default 
let form1

menuForm1()

checkLastScreen()