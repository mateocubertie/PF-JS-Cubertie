//! Clases y sus metodos

// Objeto que representa el campo
class Campo {
    // Constructor
    constructor(array, ancho, filas) {
        this.array = array
        this.ancho = ancho
        this.filas = filas
    }
    // Recorre cada celda del campo aplicando la funcion pasada
    recorrerCampo(funcion) {
        this.array.forEach((fila) => {
            fila.forEach((celda) => funcion(celda))
        })
    }
    // Fusiona todas las filas del campo en un solo array y lo devuelve
    fusionarArrays() {
        let filasFusionadas = []
        this.array.forEach((fila) => filasFusionadas = filasFusionadas.concat(fila))
        return filasFusionadas
    }
}

// Objeto que representa cada hectarea (celda) del campo
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

// Objeto que representa un estado del campo en un cierto dia (fecha + copia en formato JSON string del objeto Campo)
class DatosDia {
    // Constructor
    constructor(fecha, datosCampo) {
        this.fecha = fecha
        this.datosCampo = datosCampo
    }
}

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

// Redondea el valor de una propiedad (si es numerico) a una cantidad especifica de decimales despues del punto 
// (borrando los ceros a la derecha que puedan quedar)
function roundPropertyValue(value, decimales) {
    if (!isNaN(value)) {
        return Math.round(value * (10 ** decimales)) / (10 ** decimales)
    }
    else {
        return value
    }
}


//! Funciones de operaciones con objetos (pendiente: pasarlas a metodos)

// Devuelve un array con todas las celdas del campo cuyas propiedades coinciden con las de la celda "filtro" pasada
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

// Genera el promedio de la propiedad solicitada a partir del array (unidimensional) de celdas pasado
function generarPromedio(campoFiltrado, propiedad) {
    let sumaTotal = campoFiltrado.reduce((accumulator, celda) => accumulator + celda[`${propiedad}`], 0)
    let promedio = (sumaTotal / campoFiltrado.length)
    return roundPropertyValue(promedio, 2)
}

// Compara una celda del campo con un filtro dado 
function compararCelda(celda, celdaFiltro) {
    for (let propiedad in celdaFiltro) {
        let valorFiltro = celdaFiltro[`${propiedad}`];
        // Si la propiedad comparada tiene valor 'undefined' en el filtro, la ignoramos
        if (valorFiltro !== 'undefined' && valorFiltro !== 'Undefined') {
            let valorPropiedad = celda[`${propiedad}`];
            // Si la propiedad comparada es el nombre del cultivo, buscamos una coincidencia exacta
            if (propiedad == 'cultivo') {
                if (valorPropiedad !== valorFiltro) {
                    return false;
                }
            }
            // Si la propiedad es numerica, asignamos el valor que toma en cada celda a un determinado rango, y buscamos 
            // que este coincida en ambas
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

// 
function consultarCelda(campo, fila, columna) {
    let arrayFila = campo.array[fila]
    if (arrayFila) {
        let celda = (campo.array[fila])[columna]
        // Si no existe celda con ese numero dentro de la fila, devolvemos null (creo que ya lo hace por default)
        return celda ?? null
    }
    // Si no existe la fila, devolvemos null (creo que ya lo hace por default)
    else {
        return null
    }
}

// Genera las celdas del array del campo (guardado como var. global)
function inicializarCampo(form2) {
    arrayCampo = []
    let nFilasPrev = 0
    let listaParcelas = form2.node.getElementsByClassName('dataInputs')
    // Por cada parcela de cultivo, leemos los valores ingresados en el form
    for (let parcela of listaParcelas) {
        let cultivo = formatearString(parcela.querySelector('.nombreCultivo').value)
        let progresoInicial = parcela.querySelector('.progresoInicial').value
        let humedadInicial = parcela.querySelector('.humedadInicial').value
        let largo = parseInt(parcela.querySelector('.largoParcela').value)
        // For que construye las celdas del campo
        for (let nFila = 0; nFila < largo; nFila++) {
            let fila = [];
            // For que recorre cada celda de la fila
            for (let nColumna = 0; nColumna < anchoCampo; nColumna++) {
                // Genera un id de la forma '(fila;columna)'
                let id = `${nFila+nFilasPrev};${nColumna}`;
                let celda = new HectareaCultivo(id, cultivo, setHumedadInicial(humedadInicial), setTemperaturaInicial(tempInicial), setProgresoInicial(progresoInicial));
                fila.push(celda);
            }
            arrayCampo.push(fila);
        }
        nFilasPrev += largo
    }
    // Construimos el campo
    campo = new Campo(arrayCampo, anchoCampo, arrayCampo.length)
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

// Devuelve el primer elemento dentro de la template pasada (el id debe incluir el '#')
function getNodeFromTemplate(templateSelector) {
    return document.querySelector(`${templateSelector}`).content.cloneNode(true).children.item(0)
}

//! Funciones que modifican el contenido mostrado

// Chequea si hay datos guardados en el localStorage
function saveCheck() {
    let estadoFinalCampo = JSON.parse(localStorage.getItem("estadoFinalCampo"))
    let datosRecolectados = JSON.parse(localStorage.getItem("datosRecolectados"))
    if (estadoFinalCampo && datosRecolectados) {
        campo = estadoFinalCampo
        // Le asignamos de vuelta la clase Campo al objeto campo (ya que JSON.parse() lo devuelve sin la clase original)
        Object.setPrototypeOf(campo, new Campo())
        datosPorDia = datosRecolectados
        // Busca el ultimo numero de dia en la fecha del ultimo elemento del array datosPorDia
        dia = datosPorDia.slice(-1)[0].fecha
        limpiarPantalla()
        menuSimulador()
        toastExitoCarga()
    }
    else {
        toastErrorCargaLocal()
    }
}

// Chequea cual fue el ultimo menu de simulador.html visitado por el usuario
function checkLastScreen() {
    let lastScreen = sessionStorage.getItem("lastScreen") ?? 'primerForm'
    switch (lastScreen) {
        case 'primerForm':
            menuForm1()
            break
        case 'simulador':
            saveCheck()
            break
    }
}

// Limpia la pantalla del simulador
function limpiarPantalla() {
    charts.forEach((chart) => {
        // Destruye todos los charts dibujados
        chart.destroy()
    })
    // Vacía el array de charts dibujados en pantalla
    charts.length = 0
    simulador.innerHTML = `<h2>Simulador de campo</h2>`
}

// Devuelve una grid (en forma de div) con las celdas del campo dibujadas 
function getGridCampo(campo) {
    let gridCampo = document.createElement('div')
    // Determina la cantidad de filas y columnas de la grid segun las filas y el ancho del campo
    gridCampo.style.gridTemplateColumns = `repeat(${campo.ancho}, max-content)`
    gridCampo.style.gridTemplateRows = `repeat(${campo.filas}, max-content)`
    // Loop que mete cada celda del campo dentro de la grid y le da la clase correspondiente para que se le apliquen estilos
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

// Centra la grid del campo dibujada en la pantalla del simulador (si no overflowea su wrapper, ya que en ese caso
// debe colocarse al principio del wrapper para poder scrollear por todo su contenido)
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

// Cambia la variable de styles.css con la que se calcula el tamaño de ciertos elementos zoomeables (grid dibujada del campo)
function setDisplayZoom(zoomSlider) {
    let zoomValue = 1.0 + zoomSlider.value / 100
    document.documentElement.style.setProperty('--sim-display-zoom', `${zoomValue}`)
}

// Renderiza (dentro del contenedor asignado) un chart del tipo deseado con los datos pasados (de la libreria ApexCharts.js)
function renderLineChart(chartsArray, dataX, dataY, containerElement, propiedad = '', unidadX, unidadY, titulo) {
    var options = {
        chart: {
            type: `line`,
            foreColor: '#AAAAAA'
        },
        series: [{
            name: `${propiedad}`,
            data: dataY
        }],
        xaxis: {
            labels: {
                formatter: (categoria) => `${unidadX} ${categoria}`
            },
            categories: dataX
        },
        yaxis: {
            labels: {
                formatter: (dato) => `${dato}${unidadY}`
            }
        },
        title: {
            text: `${titulo}`,
            style: {
                color: 'var(--main-text-color)',
                fontSize: '18px',
                fontWeight: '400',
                textAlign: 'center',
                fontFamily: 'var(--main-font-regular)',
            }
        }
    }
    let chart = new ApexCharts(containerElement, options)
    chartsArray.push(chart);
    chart.render();
}

//! Menus

// Menu del primer formulario
function menuForm1() {
    // Mete en un array todos los inputs y selects del formulario
    let formInputs = Array.from(document.getElementsByClassName("formInput"))
    formInputs = formInputs.map((div) => {
        return div.querySelector('input') ?? div.querySelector('select')
    })
    // Construye el Form
    form1 = new Form(document.querySelector('#formSimulador1'), formInputs)
    // Acción del boton "continuar"/submit
    form1.btnSubmit.addEventListener("click", (e) => {
        e.preventDefault()
        if (!form1.submitDisable) {
            anchoCampo = parseInt(document.querySelector('#simAnchoCampo').value)
            cantidadCultivos = parseInt(document.querySelector('#simCultivos').value)
            tempInicial = document.querySelector('#tempInicial').value
            limpiarPantalla()
            menuForm2()
        }
    })
    // Accion del boton "cargar progreso local"
    let buttonCargarProgreso = document.querySelector('.buttonCargarProgreso')
    buttonCargarProgreso.onclick = (e) => {
        e.preventDefault()
        saveCheck()
    }
}

// Menu del segundo formulario (cantidad variable de inputs segun las cantidad de cultivos/parcelas)
function menuForm2() {
    // Obtiene los nodos de la template del formulario
    let formElement = getNodeFromTemplate('#gridFormTemplate')
    let contenedorGrid = formElement.querySelector('.formGrid')
    let formInputs = []
    // For que agrega cada input de cada parcela a la lista de inputs del formulario
    for (let i = 1; i <= cantidadCultivos; i++) {
        let inputCard = getNodeFromTemplate('#gridInputTemplate')
        let tituloParcela = document.createElement('h3')
        tituloParcela.textContent = `Parcela #${i}`
        inputCard.appendChild(tituloParcela)
        // Obtiene los nodos de cada input de cada parcela
        let inputList = [
            getNodeFromTemplate('#inputNombreCultivo'),
            getNodeFromTemplate('#inputProgresoInicial'),
            getNodeFromTemplate('#inputHumedadInicial'),
            getNodeFromTemplate('#inputLargoParcela')
        ]
        //
        inputList.forEach((input) => {
            inputCard.appendChild(input)
            formInputs.push(input.querySelector('input') ?? input.querySelector('select'))
        })
        contenedorGrid.appendChild(inputCard)
    }
    simulador.appendChild(formElement)
    let form2 = new Form(formElement, formInputs)
    // Acción del boton de submit
    form2.btnSubmit.addEventListener("click", () => {
        if (!form2.submitDisable) {
            inicializarCampo(form2)
            // Guardamos los datos del campo en datosPorDia (lo tenemos que convertir en un JSON string para 
            // copiar sus valores, ya que los objetos en JS se copian por referencia y no por valor)
            datosPorDia.push(new DatosDia(dia, JSON.stringify(campo)))
            limpiarPantalla()
            menuSimulador()
            toastCampoGenerado()
        }
    })
}

// Menu principal del simulador
function menuSimulador() {
    // Cambia la ultima pantalla visitada por el usuario (guardada en sessionStorage) al simulador 
    sessionStorage.setItem("lastScreen", 'simulador')
    // Obtiene la grid del campo
    let gridCampo = getGridCampo(campo)
    gridCampo.className = 'gridCampo'
    // Obtiene el div de los datos mostrados de su template
    let dataContainer = getNodeFromTemplate('#dataContainerSimulador')
    // Mete la grid del campo dentro del gridWrapper
    dataContainer.querySelector('.gridWrapper').appendChild(gridCampo)
    // Obtiene el wrapper que contiene la dashboard
    let dashboardWrapper = getNodeFromTemplate('#templateDashboardWrapper')
    dataContainer.appendChild(dashboardWrapper)
    simulador.appendChild(dataContainer)
    // Define como datos del eje X de los charts a un array con los nros. de dias pasados
    let datosX = datosPorDia.map((datosDia) => datosDia.fecha)
    // Parsea los estados guardados del campo
    let estadosGuardados = datosPorDia.map((datosDia) => JSON.parse(datosDia.datosCampo))
    // Los reconvierte a objetos de clase Campo
    estadosGuardados.forEach((objeto) => {
        Object.setPrototypeOf(objeto, new Campo())
    })
    // Crea un array con los estados guardados del campo simplificados a una fila sola
    let arraysEstadosGuardados = estadosGuardados.map((estado) => estado.fusionarArrays())
    // Obtiene los nodos en que van los charts
    let chart1Node = document.querySelector('#chart1')
    let chart2Node = document.querySelector('#chart2')
    // Dibujamos los charts
    renderLineChart(charts, datosX, arraysEstadosGuardados.map((estado) => generarPromedio(estado, 'temperatura')), chart1Node, 'Temperatura', 'Dia', '°C', 'Temperatura promedio del campo')
    renderLineChart(charts, datosX, arraysEstadosGuardados.map((estado) => generarPromedio(estado, 'humedad')), chart2Node, 'Humedad', 'Dia', '%', 'Humedad promedio del campo')
    // Obtiene el slider que determina el zoom
    let zoomSlider = simulador.querySelector('.zoomSlide')
    // Inicia con el zoom en su valor por defecto
    setDisplayZoom(zoomSlider)
    // Centra la grid del campo
    centerGrid(gridCampo)
    // Funcion a llamar cuando el usuario mueve el slider
    zoomSlider.addEventListener('input', (e) => {
        setDisplayZoom(e.target)
        centerGrid(gridCampo)
    })
    // Crea e inserta en el simulador la grid con los botones
    let gridBotones = getNodeFromTemplate('#botonesSimulador')
    simulador.appendChild(gridBotones)
    // Crea un array con la lista de botones
    let listaBotones = simulador.getElementsByClassName('button')
    // Añade a cada boton un evento onclick que determina la accion a realizar
    for (let boton of listaBotones) {
        boton.addEventListener('click', (event) => {
            let buttonClasses = event.target.classList
            // Escribimos siempre la clase del boton que representa su accion al final de su lista de clases
            // Asi que alli buscamos la accion del boton
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
                    // Guardamos los datos recolectados del campo y su estado final en localStorage
                    localStorage.setItem("estadoFinalCampo", JSON.stringify(campo))
                    localStorage.setItem("datosRecolectados", JSON.stringify(datosPorDia))
                    toastExitoGuardado()
                    break
                case 'buttonMenuReiniciar':
                    sessionStorage.setItem("lastScreen", 'primerForm')
                    // Vacía el array de datos almacenados
                    datosPorDia.length = 0
                    limpiarPantalla()
                    // Muestra el primer formulario
                    simulador.appendChild(form1.node)
                    toastReset()
                    break
            }
        })
    }
}

// Menu para consultar una celda del campo
function menuConsultar() {
    // Obtiene el formulario del menu de su template
    let formNode = getNodeFromTemplate('#menuConsultar')
    let inputs = []
    // Mete en el array inputs todas las inputs del form
    for (let input of formNode.getElementsByTagName('input')) {
        if (input.getAttribute('type') != 'submit') {
            inputs.push(input)
        }
    }
    // Inicializa el form
    let form = new Form(formNode, inputs)
    // Mete el form en la pantalla del simulador
    simulador.appendChild(formNode)
    let display = form.node.querySelector('.dataDisplay')
    // Accion del boton de submit (consulta)
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            // Vacia el display del resultado
            display.innerHTML = ""
            // Parsea la fila y la columna de las inputs
            let fila = parseInt(form.node.querySelector('#inputFilaCelda').value)
            let columna = parseInt(form.node.querySelector('#inputColumnaCelda').value)
            // Consulta la celda
            let celda = consultarCelda(campo, fila, columna)
            // Si existe la celda, creamos una tabla para mostrar cada una de sus propiedades
            if (celda != null) {
                // Crea una tabla
                let tabla = document.createElement('table')
                // Recorre cada propiedad de la celda y añade una fila a la tabla con el nombre y valor de esta
                for (let propiedad in celda) {
                    if (propiedad != 'color') {
                        let fila = document.createElement('tr')
                        fila.innerHTML = `
                            <th class="propiedad">
                                ${formatearString(propiedad)}:
                            </th>
                            <th class="valorPropiedad">
                                ${roundPropertyValue(celda[propiedad], 2)}
                            </th>
                        `
                        tabla.appendChild(fila)
                    }
                }
                display.appendChild(tabla)
            }
            // Si no existe la celda, lo informamos con un h3
            else {
                display.innerHTML = '<h3 class="centerText">No existe la celda buscada</h3>'
            }
        }
    })
    // Accion del boton "volver"
    form.node.querySelector('.backButton').addEventListener("click", () => {
        limpiarPantalla()
        menuSimulador()
    })
}

// Menu para filtar el campo
function menuFiltrar() {
    let campoFiltrado
    // Obtiene el nodo del menu de su template
    let formNode = getNodeFromTemplate('#menuFiltrar')
    // Nodo en que se insertan los inputs
    let dataInputs = formNode.querySelector('.dataInputs')
    let formsFiltros = [ 
        getNodeFromTemplate("#inputCultivoFiltro"),
        getNodeFromTemplate("#inputTemperaturaFiltro"),
        getNodeFromTemplate("#inputHumedadFiltro"),
        getNodeFromTemplate("#inputProgresoFiltro")
    ]
    let inputs = []
    // Loop que añade cada filtro a la lista de inputs y lo inserta en el nodo dataInputs
    for (filtro of formsFiltros) {
        dataInputs.prepend(filtro)
        inputs.push(filtro.querySelector('select'))
    }
    // Inicializa el Form
    let form = new Form(formNode, inputs)
    // Dado que la opción por defecto de los filtros es "No filtrar por X", habilitamos el boton de submit
    form.submitDisable = false
    form.formCheckSubmit
    // Insertamos el form en el simulador
    simulador.appendChild(form.node)
    // Accion del boton de submit
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            // Objeto a utilizar como "filtro" con las propiedades de celda seleccionadas
            let celdaFiltro = {
                cultivo: formatearString(formsFiltros[0].querySelector('select').value),
                temperatura: getFiltroTemperatura(formsFiltros[1].querySelector('select').value),
                humedad: getFiltroHumedad(formsFiltros[2].querySelector('select').value),
                progreso: getFiltroProgreso(formsFiltros[3].querySelector('select').value)
            }
            // Array que replica el array de celdas del campo original, pero sus celdas solo tienen un color
            // (es necesario crear un campo de cero ya que en JS objetos se copian por referencia, no por valor)
            let arrayFiltrado = []
            // Ciclos anidados que recorren cada celda del campo y le cambia el color segun coincide o no con el filtro
            for (let fila = 0; fila < campo.filas; fila++) {
                let arrayFila = []
                for (let columna = 0; columna < campo.ancho; columna++) {
                    // Crea una celda con todas sus propiedades indefinidas
                    // (Necesitamos crear u)
                    let celda = new HectareaCultivo(undefined, undefined, undefined, undefined, undefined)
                    // Si coincide con el filtro, le damos color verde
                    if (compararCelda(campo.array[fila][columna], celdaFiltro)) {
                        celda.color = 'green'
                    }
                    // Si no coincide, su color sera gris
                    else {
                        celda.color = 'grey'
                    }
                    arrayFila.push(celda)
                }
                arrayFiltrado.push(arrayFila)
            }
            // Inicializamos un nuevo campo con las celdas coloreadas segun coinciden o no con el filtro
            campoFiltrado = new Campo(arrayFiltrado, campo.ancho, campo.filas)
            limpiarPantalla()
            // Creamos la grid del campo filtrado
            let gridCampo = getGridCampo(campoFiltrado)
            gridCampo.className = 'gridCampo'
            let gridWrapper = getNodeFromTemplate('#dataContainerSimulador').querySelector('.gridWrapper')
            gridWrapper.appendChild(gridCampo)
            // Insertamos la grid con su contenedor dentro del simulador
            simulador.appendChild(gridWrapper)
            // Centramos la grid (si no hace overflow)
            centerGrid(gridCampo)
            // Obtiene e inserta en la pantalla el nodo del boton de "volver"
            let backButton = getNodeFromTemplate('#templateBackButton')
            simulador.appendChild(backButton)
            // Accion del boton de "volver"
            backButton.addEventListener('click', (e) => {
                limpiarPantalla()
                menuSimulador()
            })
        }
    })
}

// Menu para simular el paso de los dias
function menuSimularDia() {
    // Obtiene el menu de su template
    let formNode = getNodeFromTemplate('#menuSimulacion')
    let selectorClima = formNode.querySelector('select')
    // Crea la lista de inputs del formulario
    let inputs = [selectorClima]
    // Inicializa el Form
    let form = new Form(formNode, inputs)
    // Accion del boton de "volver"
    let backButton = formNode.querySelector('.backButton')
    backButton.addEventListener('click', () => {
        limpiarPantalla()
        menuSimulador()
    })
    // Accion del boton de submit
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            // Lee la opcion elegida
            let opcion = selectorClima.value
            // Determina la accion a realizar segun la opcion elegida
            switch (opcion) {
                // Simula el paso de un dia soleado
                case '1':
                    campo.recorrerCampo(actualizarCeldaSol);
                    toastDiaSoleado()
                    break;
                // Simula el paso de un dia nublado
                case '2':
                    campo.recorrerCampo(actualizarCeldaNublado);
                    toastDiaNublado()
                    break;
                // Simula el paso de un dia de lluvia
                case '3':
                    campo.recorrerCampo(actualizarCeldaLluvia);
                    toastDiaLluvia()
                    break;
            }
            // Guarda en el array de datos recolectados el nuevo numero de dia y el nuevo estado del campo (es necesario
            // pasar el campo a string para tener una copia por valor, y no por referencia)
            datosPorDia.push(new DatosDia(++dia, JSON.stringify(campo)))
        }
    })
    // Inserta el formulario en la pantalla
    simulador.appendChild(formNode)
}

// Menu para obtener el valor promedio de una propiedad de celda (con opción de filtrar el campo a promediar)
function menuPromedio() {
    // Obtiene el menu de su template
    let formNode = getNodeFromTemplate('#menuPromedio')
    let dataInputs = formNode.querySelector('.dataInputs')
    // Obtiene todos los nodos de los inputs
    let selectInputs = formNode.getElementsByTagName('select')
    let inputs = []
    // Mete cada input en la lista de inputs
    for (let input of selectInputs) {
        inputs.push(input)
    }
    // Inicializa el Form
    let form = new Form(formNode, inputs)
    // Inserta el menu en la pantalla
    simulador.appendChild(formNode)
    // Obtiene el nodo del boton "volver"
    let backButton = formNode.querySelector('.backButton')
    // Accion del boton "volver"
    backButton.addEventListener('click', (e) => {
        e.preventDefault()
        limpiarPantalla()
        menuSimulador()
    })
    // Obtiene el nodo con el select que determina si se quiere filtrar el campo antes de promediar
    let filtroOpcional = formNode.querySelector('#filtrarPromedio')
    // Flag que determina si se quiere promediar o no
    let flagFiltro = false
    // Variable auxiliar que guarda la cantidad de filtros
    let cantFiltros
    // Accion del select del filtro opcional
    filtroOpcional.addEventListener('input', (e) => {
        let opcion = e.target.value
        // Switch para cada opcion
        switch (opcion) {
            // Si el usuario elige filtrar, añadimos al form una serie de inputs con los filtros que se pueden elegir
            case 'si':
                // Obtenemos los nodos de los inputs de los filtros opcionales
                let filtros = [
                    getNodeFromTemplate('#inputCultivoFiltro'), 
                    getNodeFromTemplate('#inputHumedadFiltro'), 
                    getNodeFromTemplate('#inputTemperaturaFiltro'), 
                    getNodeFromTemplate('#inputProgresoFiltro')
                ]
                cantFiltros = filtros.length
                // Pusheamos los nuevos inputs a la lista de inputs del form
                for (let input of filtros) {
                    form.inputs.push(input)
                    dataInputs.insertBefore(input, dataInputs.querySelector('.submitButton'))
                }
                // Volvemos a inicializar los inputs del form para que deshabilitar el submit si estan vacios
                form.inicializarInputs()
                // Cambiamos la flag para que en proximos eventos podamos saber si el usuario habia añadido filtros
                flagFiltro = true
                break
            case 'no':
                // Si anteriormente el usuario decidio filtrar el campo, reiniciamos la lista de inputs del form a sus
                // inputs originales y borramos los inputs de filtros de la pantalla
                if (flagFiltro) {
                    let i = 0
                    // Reiniciamos los inputs del form
                    let inputs = form.node.getElementsByClassName('formInput')
                    // Loop que se ejecuta 1 vez por cada input de filtro
                    while (i < cantFiltros) {
                        // Borra el input de la pantalla
                        inputs[inputs.length - 1].remove()
                        i++
                    }
                    // Resetea la flag para que el programa inserte los filtros opcionales de vuelta si el usuario decide filtrar
                    flagFiltro = false
                }
                break
        }
    })
    // Accion del boton de submit
    form.btnSubmit.addEventListener('click', () => {
        if (!form.submitDisable) {
            let campoPromediado = []
            let display = form.node.querySelector('.dataDisplay')
            // Si el usuario decidio previamente filtrar el campo, 
            if (flagFiltro) {
                // Creamos la celda "filtro" con las propiedades seleccionadas
                let celdaFiltro = {
                    cultivo: formatearString(form.node.querySelector('#nombreCultivo').value),
                    temperatura: getFiltroTemperatura(form.node.querySelector('#temperaturaFiltro').value),
                    humedad: getFiltroHumedad(form.node.querySelector('#humedadFiltro').value),
                    progreso: getFiltroProgreso(form.node.querySelector('#progresoFiltro').value)
                }
                // Asignamos como campo a promediar al campo filtrado
                campoPromediado = filtrarCampo(campo, celdaFiltro)
            }
            else {
                // Asignamos como campo a promediar a las celdas fusionadas del campo orignal
                campoPromediado = campo.fusionarArrays()
            }
            // Si no hay coincidencias con el filtro (si el array del campo filtrado esta vacio),
            // informamos con un h3 y retornamos para que no se siga ejecutando el eventListener
            if (campoPromediado.length == 0) {
                display.innerHTML = `<h3>No hay celdas coincidentes con el filtro</h3>`
                return
            }
            // Si se sigue ejecutando la funcion en este punto, mostramos en el display el valor del promedio resultante
            // Determinamos la propiedad seleccionada
            let propiedad = form.node.querySelector('#parametroPromedio').value
            // Determinamos con un switch la unidad del valor a promediar
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
            // Calculamos el promedio
            let promedio = generarPromedio(campoPromediado, propiedad)
            // Mostramos el promedio en el display con un h3
            display.innerHTML = `<h3>Promedio obtenido: <span class="destacado">${promedio}${unidad}<span></h3>`
        }
    })
}

//!! PROGRAMA PRINCIPAL

// Le da un margin-top al contenido igual a la altura del header (position: fixed, fuera del flujo del documento)
let headerHeight = parseInt(document.querySelector('header').offsetHeight)
document.body.style.marginTop = `${headerHeight + 30}px`

let simulador = document.querySelector('#simulador')

// Definiciones de variables globales
let arrayCampo = []
let anchoCampo
let cantidadCultivos
let tempInicial
let campo

// Objeto global para el formulario que se muestra por default 
let form1

// Array global en que se guardan los datos del campo por dia
let datosPorDia = []
let dia = 0

// Array global en que se guardan los charts de ApexCharts.js dibujados en pantalla
let charts = []

// Mostramos, por defecto, el primer formulario
menuForm1()
// Chequeamos la ultima pantalla visitada por el usuario en la sesión actual
checkLastScreen()