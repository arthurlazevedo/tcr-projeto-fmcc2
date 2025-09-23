export function minimoDivComum(a, b) {
  const mdc = (a, b) => {
    if (b === 0) return a;
    return mdc(b, a % b);
  }

  if (a > b) return mdc(a, b);
  return mdc(b, a);
}


export function ehPrimo(numero) {
  if (numero === 2) return true;
  if (numero % 2 === 0) return false;

  const topo = Math.round(Math.sqrt(numero));
  for (let i = 1; i < topo; i += 2) {
    if (numero % i === 0) return false;
  }

  return true;
}


export function totienteEuler(numero) {
  if (ehPrimo(numero)) return numero - 1;

  let totiente = 0;
  for (let i = 1; i < numero; i++) {
    if (coprimos(numero, i)) totiente += 1;
  }

  return totiente;
}


export function coprimos(a, b) {
  return minimoDivComum(a, b) == 1;
}


export function multiplicaLista(nums) {
  return nums.reduce((anterior, atual) => anterior * atual, 1);
}
