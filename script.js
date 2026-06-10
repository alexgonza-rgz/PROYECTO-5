/*
    Proyecto 5: Simulador de facturas
    Herramienta utilizada como ayuda: ChatGPT

    Este archivo contiene la lógica principal del proyecto:
    - Leer datos del formulario.
    - Calcular IVA, descuento automático y total final.
    - Crear filas dinámicas en la tabla usando innerHTML.
    - Exportar todas las facturas a un archivo CSV compatible con Excel.
*/

// Array donde se guardan todas las facturas generadas.
let facturas = [];

// Captura de elementos HTML necesarios para trabajar con eventos.
const formulario = document.getElementById("formFactura");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const mensaje = document.getElementById("mensaje");
const btnExportar = document.getElementById("btnExportar");

// Evento principal: se ejecuta al enviar el formulario.
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    agregarFactura();
});

// Evento del botón para exportar los datos a CSV compatible con Excel.
btnExportar.addEventListener("click", function() {
    exportarCSV();
});

// Función que calcula el IVA a partir del importe base y el porcentaje indicado.
function calcularIVA(importe, iva) {
    return importe * iva / 100;
}

// Función que aplica un descuento automático del 10% si el importe supera 1000 €.
function calcularDescuento(importe) {
    if (importe > 1000) {
        return importe * 0.10;
    } else {
        return 0;
    }
}

// Función principal que lee el formulario, realiza los cálculos y guarda la factura.
function agregarFactura() {
    const cliente = document.getElementById("cliente").value.trim();
    const importe = Number(document.getElementById("importe").value);
    const iva = Number(document.getElementById("iva").value);

    // Validación básica para evitar datos incorrectos.
    if (cliente === "" || importe < 0 || iva < 0) {
        mensaje.textContent = "Error: revisa los datos introducidos.";
        return;
    }

    const cantidadIVA = calcularIVA(importe, iva);
    const descuento = calcularDescuento(importe);
    const total = importe + cantidadIVA - descuento;

    // Objeto factura con todos los datos calculados.
    const factura = {
        cliente: cliente,
        importe: importe,
        iva: iva,
        cantidadIVA: cantidadIVA,
        descuento: descuento,
        total: total
    };

    facturas.push(factura);
    actualizarTabla();

    if (descuento > 0) {
        mensaje.textContent = "Factura añadida con descuento automático aplicado.";
    } else {
        mensaje.textContent = "Factura añadida sin descuento.";
    }

    formulario.reset();
    document.getElementById("iva").value = 21;
}

// Función que actualiza la tabla usando innerHTML, sin recargar la página.
function actualizarTabla() {
    let filas = "";

    for (let i = 0; i < facturas.length; i++) {
        const factura = facturas[i];
        const claseFila = factura.descuento > 0 ? "fila-descuento" : "";

        filas += `
            <tr class="${claseFila}">
                <td>${factura.cliente}</td>
                <td>${factura.importe.toFixed(2)}</td>
                <td>${factura.iva.toFixed(2)}</td>
                <td>${factura.cantidadIVA.toFixed(2)}</td>
                <td>${factura.descuento.toFixed(2)}</td>
                <td>${factura.total.toFixed(2)}</td>
            </tr>
        `;
    }

    cuerpoTabla.innerHTML = filas;
}

// Función que genera y descarga automáticamente un archivo CSV compatible con Excel.
function exportarCSV() {
    if (facturas.length === 0) {
        mensaje.textContent = "No hay facturas para exportar.";
        return;
    }

    /*
        Excel en España suele separar las columnas con punto y coma (;).
        Por eso usamos ; en lugar de coma.
        Además, se añade "\uFEFF" al principio para que Excel reconozca
        bien los acentos, la ñ y el símbolo €.
    */
    let csv = "Cliente;Base (€);IVA (%);IVA (€);Descuento (€);Total (€)\n";

    for (let i = 0; i < facturas.length; i++) {
        const factura = facturas[i];

        // Cada factura se convierte en una línea del archivo.
        csv += `${factura.cliente};${factura.importe.toFixed(2)};${factura.iva.toFixed(2)};${factura.cantidadIVA.toFixed(2)};${factura.descuento.toFixed(2)};${factura.total.toFixed(2)}\n`;
    }

    // Se crea un archivo temporal para descargarlo desde el navegador.
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const enlace = document.createElement("a");
    const url = URL.createObjectURL(blob);

    enlace.href = url;
    enlace.download = "facturas_excel.csv";
    enlace.click();

    URL.revokeObjectURL(url);
    mensaje.textContent = "Archivo CSV compatible con Excel exportado correctamente.";
}
