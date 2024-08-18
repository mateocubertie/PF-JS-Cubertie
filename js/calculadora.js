// Inserta en el display del resultado una fila por cada dato pasado
function displayAddDataRow(display, dataArray) {
    let displayGrid = display.querySelector('.displayGrid')
    dataArray.forEach((d) => {
        let textoMostrado = document.createElement('h3')
        textoMostrado.classList.add('displayGridItem')
        textoMostrado.textContent = `${d}`
        displayGrid.appendChild(textoMostrado)
    })
}

// Funcion principal que genera el presupuesto segun los datos del campo
function generarPresupuesto(datosCampo) {
    // Cuenta los productos que se requieren al por mayor
    let cantidadPorMayor = 0;
    // Muestra el texto por defecto
    let defaultText = display.querySelector('h3')
    if (displayFlag || defaultText) {
        display.innerHTML = ""
        display.classList.remove('displayDefaultContent')
        display.classList.add('displayShowData')
    }
    // Texto a mostrar si falla el fetch a la base de datos de productos
    if (requestFail) {
        let errorAlert = document.createElement('h3')
        errorAlert.innerHTML = "Error al cargar la base de datos de productos <br> (Utilice Live Server para ejecutar de forma local)"
        errorAlert.style.justifySelf = 'center'
        errorAlert.style.textAlign = 'center'
        display.appendChild(errorAlert)
        toastErrorCargaProductos()
        return
    }
    // Mostramos los resultados en pantalla
    let displayTitle = document.createElement('h3')
    displayTitle.textContent = "Usted requiere para su campo de:"
    display.appendChild(displayTitle)
    let displayGrid = document.createElement('div')
    displayGrid.className = 'displayGrid'
    display.appendChild(displayGrid)
    let datosMostrados = ['Producto', 'Cantidad', 'Precio total']
    datosMostrados.forEach((dato) => {
        let titulo = document.createElement('h3')
        titulo.textContent = dato
        titulo.classList.add('displayGridTitle')
        displayGrid.appendChild(titulo)
    })
    // Variable en la que vamos acumulando los precios de cada producto
    let precioTotal = 0
    // Loop que calcula el precio de cada producto segun la cantidad requerida y lo muestra en pantalla
    productos.forEach((producto) => {
        let cantidadRequerida = Math.ceil(datosCampo[`${producto.medidaAsociada}`] * producto.cantidadPorMedida)
        let totalProducto
        // Chequeamos si la cantidad requerida se considera compra mayorista de ese producto
        if (cantidadRequerida >= producto.cantidadMayorista) {
            totalProducto = Math.floor(cantidadRequerida * producto.precioMayorista)
            // Incrementamos la cantidad de productos comprados por mayor
            cantidadPorMayor++
        }
        else {
            totalProducto = Math.floor(cantidadRequerida * producto.precioMinorista)
        }
        let datos = [producto.nombre, cantidadRequerida, totalProducto]
        displayAddDataRow(display, datos)
        precioTotal += totalProducto
    })
    // Chequeamos si todos los productos se requieren en cantidad mayorista
    if (cantidadPorMayor == productos.length) {
        // Mostramos en pantalla el descuento aplicado por compra mayorista
        let alertaDescuento = document.createElement('h4')
        alertaDescuento.textContent = `----- (${descuentoCompraCompleta}% de descuento aplicado si compra todas las lineas al por mayor) -----`
        display.appendChild(alertaDescuento)
    }
    // Mostramos el presupuesto total
    let divTotal = document.createElement('div')
    divTotal.classList.add('displayResultado')
    divTotal.innerHTML = `<h3>Total:</h3>`
    let tituloPrecio = document.createElement('h3')
    tituloPrecio.classList.add('destacado')
    tituloPrecio.textContent = `USD $${precioTotal}`
    divTotal.appendChild(tituloPrecio)
    display.appendChild(divTotal)
    // Seteamos una flag para indicar que ya se mostro en pantalla un resultado
    displayFlag = true
    toastPresupuestoGenerado()
}

//! Programa principal

// Flag que indica que se esta mostrando un resultado anterior en pantalla
let displayFlag = false
// Flag que indica un error al consultar la base de datos de productos
let requestFail = false

// Fetch que consulta la base de datos de productos (perdona profe no tuve tiempo 
// para implementar nada muy elaborado sobre APIs y promesas)
fetch('./db/productos.json')
.then((response) => response.json())
.then((datos) => {productos = datos})
.catch(() => {requestFail = true})

