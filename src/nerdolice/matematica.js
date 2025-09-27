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


export function coprimos(a, b) {
  return minimoDivComum(a, b) == 1;
}


export function multiplicaLista(nums) {
  return nums.reduce((anterior, atual) => anterior * atual, 1);
}


export function numeroCoprimoA(listaNums) {
  const maior = listaNums.length ? Math.max(...listaNums) : 101;

  let coprimo = Math.floor(Math.random() * maior);
  while (!listaNums.every(num => coprimos(num, coprimo)) || coprimo === 0) {
    coprimo = Math.floor(Math.random() * maior);
  }

  return coprimo;
}