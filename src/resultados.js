import { inversoModular } from "./nerdolice/congruencias.js";
import { multiplicaLista } from "./nerdolice/matematica.js";
import { sistemaTemSolucao } from "./nerdolice/tcr.js";
import { representarSistema } from "./conversorMat.js";

const resultados = document.getElementById('resultados');

export function resolverSistema(sistema) {
  // apaga os resultados anteriores
  resultados.replaceChildren();
  
  const mods       = sistema.map(congruencia => congruencia.m);
  const incorretos = sistemaTemSolucao(mods);

  if (incorretos.length !== 0) {
    reportaErroSistema(incorretos.map(([i, j]) => [sistema[i], sistema[j]]));
    return incorretos;
  }

  exibeSistema(sistema);
  canonizaSistema(sistema);
  
  const M = calcularM(mods);
  separarCk(sistema);
  calcularNk(sistema);
  calcularDk(sistema);
  resultadoFinal(sistema, M);
}

function reportaErroSistema(incorretos) {
  const secaoErro = document.createElement('section');
    const erro     = document.createElement('p');
    erro.style     = 'margin:0;'
    erro.innerText = 'As seguintes congruências possuem mod\'s não-coprimos:';
      
    secaoErro.appendChild(erro);
    incorretos.forEach(congruencias => {
      const incorreto = representarSistema(congruencias);
      incorreto.style = 'margin-bottom:8px;';
      secaoErro.appendChild(incorreto);
    });

  resultados.appendChild(secaoErro);
}

function canonizaSistema(sistema) {}

// torna congruências na forma canônica
function canonizaCongruencia(a, c, m) {
  return (c * inversoModular(a, m)) % m;
}

// calcular o M (módulo da solução final)
function calcularM(mods) {
  return multiplicaLista(mods);
}

// separar c (x = c (mod m))
function separarCk(sistema) {}

// calcular razão M/m (N)
function calcularNk(sistema) {}

// calcular inverso de N mod m (d)
function calcularDk(sistema) {}

// calcular resultado final (mod M)
function resultadoFinal(sistema, M) {}