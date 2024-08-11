function displayAddDataRow(display, dataArray) {
    let displayGrid = display.querySelector('.displayGrid')
    dataArray.forEach((d) => {
        let textoMostrado = document.createElement('h3')
        textoMostrado.classList.add('displayGridItem')
        textoMostrado.textContent = `${d}`
        displayGrid.appendChild(textoMostrado)
    })
}

let displayFlag = false

function generarPresupuesto(datosCampo) {
    // Cuenta los productos que se requieren al por mayor
    let cantidadPorMayor = 0;

    let defaultText = display.querySelector('h3')
    if (displayFlag || defaultText) {
        display.innerHTML = ""
        display.classList.remove('displayDefaultContent')
        display.classList.add('displayShowData')
    }

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

    let precioTotal = 0

    productos.forEach((producto) => {
        let cantidadRequerida = Math.ceil(datosCampo[`${producto.medidaAsociada}`] * producto.cantidadPorMedida)
        let totalProducto
        if (cantidadRequerida >= producto.cantidadMayorista) {
            totalProducto = Math.floor(cantidadRequerida * producto.precioMayorista)
            cantidadPorMayor++
        }
        else {
            totalProducto = Math.floor(cantidadRequerida * producto.precioMinorista)
        }
        let datos = [producto.nombre, cantidadRequerida, totalProducto]
        displayAddDataRow(display, datos)
        precioTotal += totalProducto
    })
    if (cantidadPorMayor == productos.length) {
        let alertaDescuento = document.createElement('h4')
        alertaDescuento.textContent = `----- (${descuentoCompraCompleta}% de descuento aplicado si compra todas las lineas al por mayor) -----`
        display.appendChild(alertaDescuento)
    }
    let divTotal = document.createElement('div')
    divTotal.classList.add('displayResultado')
    divTotal.innerHTML = `<h3>Total:</h3>`


    let tituloPrecio = document.createElement('h3')
    tituloPrecio.classList.add('destacado')
    tituloPrecio.textContent = `USD $${precioTotal}`
    divTotal.appendChild(tituloPrecio)

    display.appendChild(divTotal)
    displayFlag = true
}