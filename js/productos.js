const descuentoMayorista = 10

class Producto {
    constructor(nombre, precioMinorista, cantidadMayorista, medidaAsociada, cantidadPorMedida) {
        this.nombre = nombre
        this.precioMinorista = precioMinorista
        this.cantidadMayorista = cantidadMayorista
        this.medidaAsociada = medidaAsociada
        this.cantidadPorMedida = cantidadPorMedida
        this.precioMayorista = precioMinorista * (100 - descuentoMayorista) / 100
    }
}



// Porcentaje de descuento aplicado al presupuesto total por comprar todas las lineas de productos al por mayor
const descuentoCompraCompleta = 20;
let productos = [ 
    new Producto(
        'Sensor de humedad y temperatura de suelo SoilScan L3',
        120,
        18,
        'hectarea',
        9
    ),
    new Producto(
        'Pulverizador selectivo con IA SmartWeeds',
        130,
        12,
        'metrosPulverizadora',
        0.2
    ),
    new Producto(
        'Equipo de seguimiento de cultivo AgrObserve',
        200,
        10,
        'hectarea',
        4
    )
]