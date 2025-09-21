import { canonizaCongruencia } from "./nerdolice/congruencias.js";
import { multiplicaLista } from "./nerdolice/matematica.js";
import { sistemaTemSolucao, sistemaCanonico } from "./nerdolice/tcr.js";
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
  if (!sistemaCanonico(sistema)) sistema = canonizaSistema(sistema);
  
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

function exibeSistema(sistema) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerText = 'Resolver o seguinte sistema de congruências:';

    secaoTal.appendChild(tal);
    secaoTal.appendChild(representarSistema(sistema));
  resultados.appendChild(secaoTal);
}

function canonizaSistema(sistema) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerText = 'Primeiro, será necessário transformar todas as equações em sua forma canônica:';

    secaoTal.appendChild(tal);
    const sistemaCanonico = sistema.map(({ a, c, m }) => ({ a: 1, c: canonizaCongruencia(a, c, m), m }));
    secaoTal.appendChild(representarSistema(sistemaCanonico, true));
  resultados.appendChild(secaoTal);

  return sistemaCanonico;
}

// torna congruências na forma canônica


// calcular o M (módulo da solução final)
function calcularM(mods) {
  const M = multiplicaLista(mods);
  
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerText = '1) Calcular o módulo da solução final (M):';

    secaoTal.appendChild(tal);
    secaoTal.appendChild(representarM(mods, M));
  resultados.appendChild(secaoTal);

  return M;
}

// separar c (x = c (mod m))
function separarCk(sistema) {}

// calcular razão M/m (N)
function calcularNk(sistema) {}

// calcular inverso de N mod m (d)
function calcularDk(sistema) {}

// calcular resultado final (mod M)
function resultadoFinal(sistema, M) {}