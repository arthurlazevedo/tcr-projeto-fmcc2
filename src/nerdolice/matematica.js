export function restoPositivo(num1, num2) {
  return ((num1 % num2) + num2) % num2;
}

export function maximoDivComum(a, b) {
  const mdc = (a, b) => {
    // necessário fazer assim para funcionar com bigint e inteiros normais
    if (b == 0) return a;
    return mdc(b, restoPositivo(a, b));
  }

  if (a < b) return mdc(a, b);
  return mdc(b, a);
}


export function coprimos(a, b) {
  // necessário fazer assim para funcionar com bigint e inteiros normais
  return maximoDivComum(a, b) == 1;
}


export function multiplicaLista(nums) {
  return nums.reduce((anterior, atual) => anterior * atual, 1n);
}


export function numeroCoprimoA(listaNums) {
  const primoGrande = Math.max(...listaNums, 1069);

  let coprimo = Math.floor(Math.random() * primoGrande);
  while (!listaNums.every(num => coprimos(num, coprimo)) || coprimo === 0) {
    coprimo = Math.floor(Math.random() * primoGrande);
  }

  return coprimo;
}