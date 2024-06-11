function simplexFase1(coeficientes, restricciones, objetivo) {
  // Paso 1: Agregar variables artificiales
  const numVariables = coeficientes[0].length;
  const numRestricciones = restricciones.length;
  const numArtificiales = numRestricciones;
  const tabla = [];

  for (let i = 0; i < numRestricciones; i++) {
    for (let j = 0; j < numRestricciones; j++) {
      if (i === j) {
        restricciones[i].push(1); // Variable artificial
      } else {
        restricciones[i].push(0);
      }
    }
  }

  // Paso 2: Formar la tabla simplex inicial
  for (let i = 0; i < numRestricciones; i++) {
    tabla.push(restricciones[i].concat(objetivo[i]));
  }

  const filaObjetivo = Array(numVariables + numArtificiales).fill(0);
  filaObjetivo.push(-1); // Coeficiente de la función objetivo para las variables artificiales
  tabla.push(filaObjetivo);

  // Paso 3: Realizar las iteraciones del método simplex
  while (true) {
    const pivotColumna = buscarPivotColumna(tabla);
    if (pivotColumna === -1) {
      break; // Se ha alcanzado la solución óptima
    }

    const pivotFila = buscarPivotFila(tabla, pivotColumna);
    if (pivotFila === -1) {
      return null; // El problema es infactible
    }

    actualizarTabla(tabla, pivotFila, pivotColumna);
  }

  return tabla;
}

function buscarPivotColumna(tabla) {
  const numColumnas = tabla[0].length;
  let pivotColumna = -1;
  let minCoeficiente = 0;

  for (let j = 0; j < numColumnas - 1; j++) {
    if (tabla[tabla.length - 1][j] < minCoeficiente) {
      minCoeficiente = tabla[tabla.length - 1][j];
      pivotColumna = j;
    }
  }

  return pivotColumna;
}

function buscarPivotFila(tabla, pivotColumna) {
  const numFilas = tabla.length;
  let pivotFila = -1;
  let minRazon = Infinity;

  for (let i = 0; i < numFilas - 1; i++) {
    if (tabla[i][pivotColumna] > 0) {
      const razon = tabla[i][tabla[i].length - 1] / tabla[i][pivotColumna];
      if (razon < minRazon) {
        minRazon = razon;
        pivotFila = i;
      }
    }
  }

  return pivotFila;
}

function actualizarTabla(tabla, pivotFila, pivotColumna) {
  const numFilas = tabla.length;
  const numColumnas = tabla[0].length;
  const pivotElemento = tabla[pivotFila][pivotColumna];

  // Dividir la fila del pivote por el elemento del pivote
  for (let j = 0; j < numColumnas; j++) {
    tabla[pivotFila][j] /= pivotElemento;
  }

  // Actualizar otras filas
  for (let i = 0; i < numFilas; i++) {
    if (i !== pivotFila) {
      const factor = tabla[i][pivotColumna];
      for (let j = 0; j < numColumnas; j++) {
        tabla[i][j] -= tabla[pivotFila][j] * factor;
      }
    }
  }
}

// Ejemplo de uso
const coeficientes = [
  [1, 2],
  [3, 1],
];
const restricciones = [
  [1, 2, 1],
  [3, 1, 0],
];
const objetivo = [8, 6];
const tablaFinal = simplexFase1(coeficientes, restricciones, objetivo);
console.log("Tabla final de la Fase 1:");
console.table(tablaFinal);
