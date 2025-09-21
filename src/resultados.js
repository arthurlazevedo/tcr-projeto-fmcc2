import { inversoModular, solCongruenciaLinear } from "./nerdolice/congruencias.js";
import { multiplicaLista } from "./nerdolice/matematica.js";
import { sistemaTemSolucao, sistemaCanonico, calculaN, resultadoSistema } from "./nerdolice/tcr.js";
import { representarSistema, representarM, valorVariavel, criarParenteMath, criarElementoMath, fracaoSimples, gerarCongruencia, resolucaoPassoPasso } from "./conversorMat.js";

const resultados = document.getElementById('resultados');

export function resolverSistema(sistema) {
  // apaga os resultados anteriores
  resultados.replaceChildren();
  
  let mods         = sistema.map(congruencia => congruencia.m);
  const incorretos = sistemaTemSolucao(mods);

  if (incorretos.length !== 0) {
    reportaErroSistema(incorretos.map(([i, j]) => [sistema[i], sistema[j]]));
    return incorretos;
  }

  const ehCanonico = sistemaCanonico(sistema); 
  exibeSistema(sistema, ehCanonico);
  // TODO: exibir sistema de novo
  if (!ehCanonico) {
    sistema = canonizaSistema(sistema);
    mods = sistema.map(congruencia => congruencia.m);
  }
  
  // TODO: considerar se for só uma congruência também, não precisaria de tudo isso
  const M = calcularM(mods);
  separarCk(sistema);
  calcularNk(sistema, M);
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

function exibeSistema(sistema, canonico) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerText = 'Resolver o seguinte sistema de congruências:';

    secaoTal.appendChild(tal);
    secaoTal.appendChild(representarSistema(sistema, canonico));
  resultados.appendChild(secaoTal);
}


function canonizaSistema(sistema) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerText = 'Primeiro, será necessário transformar todas as equações em sua forma canônica:';

    secaoTal.appendChild(tal);
    const sistemaCanonico = sistema.map(({ a, c, m }) => solCongruenciaLinear(a, c, m));
    secaoTal.appendChild(representarSistema(sistema, sistemaCanonico));
  resultados.appendChild(secaoTal);

  return sistemaCanonico;
}


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
function separarCk(sistema) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerHTML = '2) Separar os <i>c</i><sub>k</sub><i>\'s</i> de cada Congruência:';

    secaoTal.appendChild(tal);
    const matematica = criarParenteMath();

      const tabela     = criarElementoMath('mtable');
      sistema.forEach(({ c }, idx) => {
        tabela.appendChild(valorVariavel(c, 'c', idx + 1));
      })
      matematica.appendChild(tabela);
    
    secaoTal.appendChild(matematica);
  resultados.appendChild(secaoTal);
}

// calcular razão M/m (N)
function calcularNk(sistema, M) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerHTML = '3) Calcular a razão  <sup><i>M</i></sup>&frasl;<sub><i>m</i><sub>k</sub></sub>  (<i>N</i><sub>k</sub>) de cada Congruência:';

    secaoTal.appendChild(tal);
    const matematica = criarParenteMath();

      const tabela     = criarElementoMath('mtable');
      sistema.forEach((congruencia, idx) => {
        congruencia.N = calculaN(M, congruencia.m);

        tabela.appendChild(valorVariavel(fracaoSimples('M', ['m', idx + 1]), 'N', idx + 1));
        tabela.appendChild(valorVariavel(fracaoSimples(M, congruencia.m), null, idx + 1));
        tabela.appendChild(valorVariavel(congruencia.N, null, idx + 1));
      })
      matematica.appendChild(tabela);
    
    secaoTal.appendChild(matematica);
  resultados.appendChild(secaoTal);
}

// calcular inverso de N mod m (d)
function calcularDk(sistema) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerHTML = '4) Calcular <i>d</i><sub>k</sub>, o inverso de <i>N</i><sub>k</sub> <i>mod</i> <i>m</i><sub>k</sub>';

    secaoTal.appendChild(tal);
    const matematica = criarParenteMath();
      const mtable = criarElementoMath('mtable');
      sistema.forEach((congruencia, idx) => {
        const d = inversoModular(congruencia.N, congruencia.m);
        congruencia.d = d;
        mtable.appendChild(gerarCongruencia({ a: 'N', c: 1, m: 'm' }, idx + 1, null, 'd'));
        mtable.appendChild(gerarCongruencia({ a: congruencia.N, c: 1, m: congruencia.m }, idx + 1, null, 'd', true));
        if (congruencia.N > 1) {
          mtable.appendChild(gerarCongruencia({ a: 1, c: d, m: congruencia.m }, idx + 1, null, 'd', true));
        }
      })
    matematica.appendChild(mtable);
    secaoTal.appendChild(matematica);
  resultados.appendChild(secaoTal);
}

// calcular resultado final (mod M)
function resultadoFinal(sistema, M) {
  const secaoTal = document.createElement('section');
    const tal     = document.createElement('p');
    tal.style     = 'margin:0;'
    tal.innerHTML = '5) Calcular <i>S</i>, o resultado final (<i>mod</i> <i>M</i>)';

    secaoTal.appendChild(tal);
    const matematica = criarParenteMath();
    const sistemaNecessario = sistema.map(({ c, d, N }) => ({ c, d, N }));

    const resultadoFinal = resultadoSistema(sistema.map(({ c, d, N }) => [c, d, N]));
    
    const mtable = criarElementoMath('mtable');
    const resolucao = resolucaoPassoPasso('S', sistemaNecessario, resultadoFinal, ['&middot;', '+'], M);  
    mtable.appendChild(resolucao);
    matematica.appendChild(mtable);
    secaoTal.appendChild(matematica);
  resultados.appendChild(secaoTal);
}