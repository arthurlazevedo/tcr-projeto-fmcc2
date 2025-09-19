import { multiplicaLista } from './nerdolice/matematica.js';
import { inversoModular } from './congruencias.js'
import { calculaN, resultadoSistema } from './tcr.js';

const botaoCalcular = document.getElementById('calcular');
const inputInverso  = document.getElementById('inverso');
const resultado     = document.getElementById('resultado-inverso');


inputInverso.onkeydown = e => {
  // fazer isso dentro de um form né, bem melhor
  if (e.key === 'Enter') {
    botaoCalcular.click();
  }
}


botaoCalcular.onclick = () => {
  const valor = inputInverso.value;
  const { numero, mod } = separaValores(valor);
  const inverso = inversoModular(numero, mod);
  if (inverso !== -1) {
    resultado.innerText = `O inverso de ${numero} (mod ${mod}) é ${inversoModular(numero, mod)}`;
  } else {
    resultado.innerText = 'O inverso não existe arrombado, eles não são coprimos';
  }
}

const botaoTcr     = document.getElementById('calcular-tcr');
const inputTcr     = document.getElementById('tcr');
const resultadoTcr = document.getElementById('resultado-tcr');



inputTcr.onkeydown = e => {
  // fazer isso dentro de um form né, bem melhor
  if (e.key === 'Enter') {
    botaoTcr.click();
  }
}


botaoTcr.onclick = () => {
  const valores = separaValoresTcr(inputTcr.value);

  const M = multiplicaLista(valores.map(a => a.mod));
  valores.forEach(a => {
    const n = calculaN(M, a.mod);
    a.c = a.numero;
    a.d = inversoModular(n, a.mod);
    a.n = n;
  });

  resultadoTcr.innerText = `Solução: ${resultadoSistema(valores.map(a => [a.c, a.d, a.n])) % M} (mod ${M})`
}

function separaValores(valor) {
  let [val, mod] = valor.split(' % ');
  const numero = parseInt(val);
  mod = parseInt(mod);
  
  return { numero, mod };
}

function separaValoresTcr(valor) {
  return valor.split(', ').map(tal => separaValores(tal.replace('x = ', '')))
}