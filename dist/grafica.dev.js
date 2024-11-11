"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateChart = createOrUpdateChart;
exports.showError = showError;
exports.clearError = clearError;
// Configuración global y variables
var currentChart = null; // Función para obtener datos de la tabla

function getChartDataFromTable() {
  try {
    var headers = Array.from(document.querySelectorAll('#tableHeader th')).map(function (th) {
      return th.textContent.trim().toLowerCase();
    });
    console.log('Headers encontrados:', headers); // Buscar índices de columnas necesarias

    var diaIndex = headers.findIndex(function (h) {
      return ['dia', 'día', 'day', 'fecha'].includes(h);
    });
    var datoFPFIndex = headers.findIndex(function (h) {
      return h.includes('fpf') || h.includes('datofpf') || h === 'dato';
    });

    if (diaIndex === -1 || datoFPFIndex === -1) {
      throw new Error("Columnas requeridas no encontradas. Columnas disponibles: ".concat(headers.join(', ')));
    } // Obtener y procesar datos de las filas


    var rows = Array.from(document.querySelectorAll('#tableBody tr'));
    var data = rows.map(function (row, index) {
      var cells = Array.from(row.querySelectorAll('td'));
      var diaValue = cells[diaIndex].textContent.trim();
      var fpfValue = cells[datoFPFIndex].textContent.trim();
      var dia = parseInt(diaValue);
      var datoFPF = parseFloat(fpfValue);

      if (isNaN(dia) || isNaN(datoFPF)) {
        console.warn("Valores inv\xE1lidos en fila ".concat(index, ":"), {
          dia: diaValue,
          fpf: fpfValue
        });
        return null;
      }

      return {
        dia: dia,
        datoFPF: datoFPF
      };
    }).filter(function (item) {
      return item !== null;
    });

    if (data.length === 0) {
      throw new Error('No se pudieron procesar los datos de la tabla');
    } // Ordenar datos por día


    data.sort(function (a, b) {
      return a.dia - b.dia;
    });
    return {
      labels: data.map(function (item) {
        return "D\xEDa ".concat(item.dia);
      }),
      datasets: [{
        label: 'Dato FPF',
        data: data.map(function (item) {
          return item.datoFPF;
        }),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    };
  } catch (error) {
    console.error('Error al obtener datos para la gráfica:', error);
    throw error;
  }
} // Función para crear o actualizar la gráfica


function createOrUpdateChart() {
  try {
    var chartContainer = document.getElementById('chartContainer');
    var ctx = document.getElementById('dataChart').getContext('2d'); // Destruir gráfica existente si hay una

    if (currentChart) {
      currentChart.destroy();
    }

    var chartData = getChartDataFromTable(); // Crear nueva gráfica

    currentChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Evolución del Dato FPF por Día',
            font: {
              size: 16
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function label(context) {
                return "FPF: ".concat(context.parsed.y.toFixed(2));
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Dato FPF',
              font: {
                size: 14
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Día',
              font: {
                size: 14
              }
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });
    chartContainer.style.display = 'block';
  } catch (error) {
    console.error('Error al crear la gráfica:', error);
    showError('Error al crear la gráfica: ' + error.message);
  }
} // Función para mostrar errores


function showError(message) {
  var errorElement = document.getElementById('error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  console.error('Error:', message);
} // Función para limpiar errores


function clearError() {
  var errorElement = document.getElementById('error');
  errorElement.style.display = 'none';
  errorElement.textContent = '';
} // Exportar funciones
//# sourceMappingURL=grafica.dev.js.map
