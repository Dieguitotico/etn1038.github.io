"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateChart = createOrUpdateChart;
exports.showError = showError;
exports.clearError = clearError;
var currentChart = null;

function createOrUpdateChart() {
  try {
    var data = getDataFromTable();
    console.log('Datos filtrados obtenidos para la gráfica:', data);

    if (!data || data.length === 0) {
      throw new Error('No hay datos válidos para graficar');
    } // Ordenar los datos por día


    var sortedData = data.sort(function (a, b) {
      return a.dia - b.dia;
    }); // Verificar que solo estamos usando los datos filtrados

    console.log('Número de datos a graficar:', sortedData.length);
    var chartContainer = document.getElementById('chartContainer');

    if (currentChart) {
      currentChart.destroy();
    }

    var ctx = document.getElementById('dataChart').getContext('2d'); // Crear el gráfico solo con los datos filtrados

    currentChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedData.map(function (item) {
          return "D\xEDa ".concat(item.dia);
        }),
        datasets: [{
          label: 'Dato FPF',
          data: sortedData.map(function (item) {
            return item.datoFPF;
          }),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(53, 162, 235)',
          pointBorderColor: 'white',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Evolución del Dato FPF',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: 20
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: 'rgba(53, 162, 235, 0.3)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function label(context) {
                return "FPF: ".concat(context.parsed.y.toFixed(2));
              }
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Día',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            title: {
              display: true,
              text: 'Dato FPF',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            beginAtZero: true,
            ticks: {
              callback: function callback(value) {
                return value.toFixed(2);
              }
            }
          }
        }
      }
    });
    chartContainer.style.display = 'block'; // Mostrar información sobre los datos graficados

    console.log('Datos graficados:', {
      totalPuntos: sortedData.length,
      diasGraficados: sortedData.map(function (item) {
        return item.dia;
      }),
      valoresFPF: sortedData.map(function (item) {
        return item.datoFPF;
      })
    });
  } catch (error) {
    console.error('Error al crear el gráfico:', error);
    showError('Error al crear el gráfico: ' + error.message);
  }
}

function getDataFromTable() {
  // Obtener SOLO las filas visibles en la tabla (las que no están ocultas)
  var visibleRows = Array.from(document.querySelectorAll('#tableBody tr:not([style*="display: none"]):not(.hidden)')); // Verificar que estamos obteniendo solo las filas filtradas

  console.log('Número de filas visibles encontradas:', visibleRows.length); // Obtener los encabezados y sus índices

  var headers = Array.from(document.querySelectorAll('#tableHeader th')).map(function (th) {
    return {
      text: th.textContent.trim().toLowerCase(),
      index: th.cellIndex
    };
  }); // Encontrar las columnas necesarias

  var diaColumn = headers.find(function (h) {
    return h.text.includes('dia') || h.text.includes('día') || h.text === 'day';
  });
  var fpfColumn = headers.find(function (h) {
    return h.text.includes('datofpf') || h.text.includes('dato fpf') || h.text.includes('fpf');
  });

  if (!diaColumn || !fpfColumn) {
    throw new Error("Columnas no encontradas. Encabezados disponibles: ".concat(headers.map(function (h) {
      return h.text;
    }).join(', ')));
  } // Procesar solo las filas visibles


  var data = visibleRows.map(function (row, rowIndex) {
    var cells = Array.from(row.cells);

    if (cells.length <= Math.max(diaColumn.index, fpfColumn.index)) {
      console.warn("Fila ".concat(rowIndex, " no tiene suficientes columnas"));
      return null;
    }

    var diaValue = cells[diaColumn.index].textContent.trim();
    var fpfValue = cells[fpfColumn.index].textContent.trim(); // Convertir a números

    var dia = parseInt(diaValue.replace(/[^\d.-]/g, ''));
    var datoFPF = parseFloat(fpfValue.replace(/[^\d.-]/g, ''));

    if (!isNaN(dia) && !isNaN(datoFPF)) {
      return {
        dia: dia,
        datoFPF: datoFPF
      };
    } else {
      console.warn("Valores inv\xE1lidos en fila ".concat(rowIndex, ":"), {
        dia: diaValue,
        datoFPF: fpfValue
      });
      return null;
    }
  }).filter(function (item) {
    return item !== null;
  });

  if (data.length === 0) {
    throw new Error('No se encontraron datos válidos para graficar en las filas visibles');
  }

  console.log('Datos procesados de filas visibles:', data);
  return data;
}

function showError(message) {
  var errorDiv = document.getElementById('error');

  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(function () {
      errorDiv.style.display = 'none';
    }, 5000);
  }

  console.error(message);
}

function clearError() {
  var errorDiv = document.getElementById('error');

  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
}
//# sourceMappingURL=grafica.dev.js.map
