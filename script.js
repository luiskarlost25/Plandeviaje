// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Materialize components si es necesario (ej. selects, modals)
    // M.AutoInit(); // Descomentar si necesitas inicializar componentes de Materialize automáticamente

    // Obtener el formulario y el div de resultado
    const vacationCalcForm = document.getElementById('vacationCalc');
    const resultDiv = document.getElementById('result');

    // Escuchar el evento submit del formulario
    vacationCalcForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío por defecto del formulario

        // Obtener los valores de los inputs
        const destiny = document.getElementById('destiny').value;
        const budget = parseFloat(document.getElementById('budget').value);
        const acomodation = parseFloat(document.getElementById('acomodation').value);
        const transport = parseFloat(document.getElementById('transport').value);
        const food = parseFloat(document.getElementById('food').value);

        // Validar que los campos numéricos sean números válidos
        if (isNaN(budget) || isNaN(acomodation) || isNaN(transport) || isNaN(food)) {
            resultDiv.innerHTML = '<p class="red-text">Por favor, ingresa solo números válidos en los campos de presupuesto, alojamiento, transporte y comida.</p>';
            return;
        }

        // Calcular el total gastado
        const totalGastado = acomodation + transport + food;
        // Calcular el presupuesto restante
        const presupuestoRestante = budget - totalGastado;

        // Mostrar el resultado en el div
        let resultHTML = `
            <h5>Detalles de tu Viaje a <span class="blue-text text-darken-2">${destiny}</span>:</h5>
            <p><strong>Presupuesto Inicial:</strong> $${budget.toFixed(2)}</p>
            <p><strong>Gasto en Alojamiento:</strong> $${acomodation.toFixed(2)}</p>
            <p><strong>Gasto en Transporte:</strong> $${transport.toFixed(2)}</p>
            <p><strong>Gasto en Comida:</strong> $${food.toFixed(2)}</p>
            <p class="divider"></p>
            <p><strong>Total Gastado:</strong> $${totalGastado.toFixed(2)}</p>
        `;

        if (presupuestoRestante >= 0) {
            resultHTML += `<h5 class="green-text">¡Excelente! Te sobran $${presupuestoRestante.toFixed(2)} de tu presupuesto.</h5>`;
        } else {
            resultHTML += `<h5 class="red-text">¡Cuidado! Te has excedido por $${Math.abs(presupuestoRestante).toFixed(2)}.</h5>`;
        }
        
        resultDiv.innerHTML = resultHTML;

        // --- Lógica para Generar PDF ---
        generatePdf(destiny, budget, acomodation, transport, food, totalGastado, presupuestoRestante);
    });

    // Función para generar el PDF
    async function generatePdf(destiny, budget, acomodation, transport, food, totalGastado, presupuestoRestante) {
        // Usar la clase global window.jsPDF (por el UMD build)
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF(); // Crea un nuevo documento PDF

        // Encabezado
        doc.setFontSize(22);
        doc.text("Plan de Viaje Facilito", 105, 20, null, null, "center"); // Título centrado
        doc.setFontSize(12);
        doc.text("Resumen de Presupuesto", 105, 30, null, null, "center");
        doc.line(20, 35, 190, 35); // Línea divisoria

        // Datos del viaje
        doc.setFontSize(14);
        doc.text(`Destino: ${destiny}`, 20, 50);
        doc.text(`Presupuesto Inicial: $${budget.toFixed(2)}`, 20, 60);
        doc.text(`Alojamiento: $${acomodation.toFixed(2)}`, 20, 70);
        doc.text(`Transporte: $${transport.toFixed(2)}`, 20, 80);
        doc.text(`Comida: $${food.toFixed(2)}`, 20, 90);
        doc.line(20, 95, 190, 95); // Línea divisoria

        doc.setFontSize(16);
        doc.text(`Total Gastado: $${totalGastado.toFixed(2)}`, 20, 110);

        if (presupuestoRestante >= 0) {
            doc.setTextColor(34, 139, 34); // Verde
            doc.text(`¡Excelente! Te sobran $${presupuestoRestante.toFixed(2)}.`, 20, 120);
        } else {
            doc.setTextColor(220, 20, 60); // Rojo
            doc.text(`¡Cuidado! Te has excedido por $${Math.abs(presupuestoRestante).toFixed(2)}.`, 20, 120);
        }
        doc.setTextColor(0, 0, 0); // Resetear color a negro

        // Pie de página
        doc.setFontSize(10);
        doc.text("Generado por Viaje Facilito", 105, 280, null, null, "center");

        // Guardar el PDF
        doc.save(`Presupuesto_Viaje_a_${destiny.replace(/\s+/g, '_')}.pdf`);
    }
});
