import { inversoModular, solCongruenciaLinear } from "./nerdolice/congruencias.js";
import { multiplicaLista } from "./nerdolice/matematica.js";
import { sistemaTemSolucao, sistemaCanonico, calculaN, resultadoSistema } from "./nerdolice/tcr.js";
import { representarSistema, representarM, valorVariavel, criarParenteMath, criarElementoMath, fracaoSimples, gerarCongruencia, resolucaoPassoPasso, explicacao, espacamento } from "./conversorMat.js";
import { numeralParaRomano } from "./utilitarios/utilitarios.js";

const canonizar  = document.getElementById('canonizar');
const resultados = document.getElementById('passo-a-passo');

export function resolverSistema(sistema) {
  resetaResultados();

  let mods         = sistema.map(congruencia => congruencia.m);
  const incorretos = sistemaTemSolucao(mods);

  if (incorretos.length !== 0) {
    reportaErroSistema(sistema, incorretos);
    return;
  }

  if (!sistemaCanonico(sistema)) {  
    sistema = canonizaSistema(sistema);
    mods    = sistema.map(congruencia => congruencia.m);
  }
  exibeSistema(sistema, true);

  const M = calcularM(mods);
  separarCk(sistema);
  calcularNk(sistema, M);
  calcularDk(sistema);
  resultadoFinal(sistema, M);
}

function reportaErroSistema(sistema, incorretos) {
  const secaoErro = document.createElement('section');
    const erro     = document.createElement('p');
    erro.style     = 'margin:0;'
    erro.innerText = 'O sistema:';

    secaoErro.appendChild(erro);
    secaoErro.appendChild(representarSistema(sistema));

    const explicacao = document.createElement('p');
    explicacao.style = 'margin:0;text-align:center'
    explicacao.innerHTML = `Não possui solução, visto que as congruências:<ul class="lista-nao-coprimos">${incorretos.map(congs => {
      return `<li>${congs.map(cong => `<i>(${numeralParaRomano(cong + 1)})</i>`).join(' e ')}</li>`
    }).join('')}</ul>Possuem mod's não-coprimos`

    secaoErro.appendChild(explicacao);

  resultados.appendChild(secaoErro);
}

function exibeSistema(sistema) {
  const secaoSistema = document.createElement('section');
    const tituloSistema = criarTitulo('Resolver o seguinte sistema de congruências utilizando o TCR');

    secaoSistema.appendChild(tituloSistema);
    secaoSistema.appendChild(representarSistema(sistema, true));
  resultados.appendChild(secaoSistema);
}


function canonizaSistema(sistema) {
  canonizar.classList.add('display');

  const secaoCanonizar = document.createElement('section');
    const tituloSistema = criarTitulo('Dado o seguinte sistema de congruência');
    const reprSistema = representarSistema(sistema);

    secaoCanonizar.appendChild(tituloSistema);
    secaoCanonizar.appendChild(reprSistema);

    const explicacaoCanonizar = document.createElement('span');
      explicacaoCanonizar.className = 'explicacao';
      explicacaoCanonizar.innerHTML = 'Devemos transformar todas as congruências em sua forma canonizada (<i>x</i> ≡ <i>n mod m, n</i> ∈ ℤ)<br>';

    const tituloCanonizar = criarTitulo('Canonizando as congruências');

    secaoCanonizar.appendChild(explicacaoCanonizar);
    secaoCanonizar.appendChild(tituloCanonizar);
    const matematica = criarParenteMath();
    const mtable = criarElementoMath('mtable');
    const sistemaCanonico = sistema.map(({ a, c, m }) => solCongruenciaLinear(a, c, m));

    for (let i = 0; i < sistema.length; i++) {
      mtable.appendChild(gerarCongruencia(sistema[i], i));
      mtable.appendChild(explicacao(sistemaCanonico[i].explicacao));
      mtable.appendChild(gerarCongruencia(sistemaCanonico[i], i, { adicionaPos: false }));
      mtable.appendChild(espacamento(15));
    }
    matematica.appendChild(mtable);
    secaoCanonizar.appendChild(matematica);
  canonizar.appendChild(secaoCanonizar);

  return sistemaCanonico;
}


function calcularM(mods) {
  const M = multiplicaLista(mods);
  
  const secaoM = document.createElement('section');
    const tituloM = criarTitulo('Passo 1.', 'margem-acima');
    const descM   = criarDescricao('Calcular o módulo da solução final (<i>M</i>)');

    secaoM.appendChild(tituloM);
    secaoM.appendChild(descM);
    secaoM.appendChild(representarM(mods, M));
  resultados.appendChild(secaoM);

  return M;
}

function separarCk(sistema) {
  const secaoC = document.createElement('section');
    const tituloC = criarTitulo('Passo 2.', 'margem-acima');
    const descC   = criarDescricao('Separar os <i>c</i><sub>k</sub><i>\'s</i> de cada Congruência');

    secaoC.appendChild(tituloC);
    secaoC.appendChild(descC);
    const matematica = criarParenteMath();

      const tabela     = criarElementoMath('mtable');
      sistema.forEach(({ c }, indice) => {
        tabela.appendChild(valorVariavel(c, { variavel: 'c', indice}));
      })
      matematica.appendChild(tabela);
  
    secaoC.appendChild(matematica);
  resultados.appendChild(secaoC);
}

function calcularNk(sistema, M) {
  const secaoN = document.createElement('section');
    const tituloN     = criarTitulo('Passo 3.', 'margem-acima');
    const descricaoN = criarDescricao('Calcular a razão  <sup><i>M</i></sup>&frasl;<sub><i>m</i><sub>k</sub></sub> (<i>N</i><sub>k</sub>) de cada Congruência');

    secaoN.appendChild(tituloN);
    secaoN.appendChild(descricaoN);
    const matematica = criarParenteMath();

      const tabela = criarElementoMath('mtable');
      sistema.forEach((congruencia, indice) => {
        congruencia.N = calculaN(M, congruencia.m);

        tabela.appendChild(valorVariavel(fracaoSimples('M', ['m', indice]), { variavel: 'N', indice}));
        tabela.appendChild(espacamento(2));
        tabela.appendChild(valorVariavel(fracaoSimples(M, [congruencia.m]), { indice }));
        tabela.appendChild(espacamento(2));
        tabela.appendChild(valorVariavel(congruencia.N, { indice }));
        tabela.appendChild(espacamento(5));
      })
      matematica.appendChild(tabela);
  
    secaoN.appendChild(matematica);
  resultados.appendChild(secaoN);
}

function calcularDk(sistema) {
  const secaoD = document.createElement('section');
    const tituloD = criarTitulo('Passo 4.', 'margem-acima');
    const descD   = criarDescricao('Calcular <i>d</i><sub>k</sub>, o inverso de <i>N</i><sub>k</sub> <i>mod m</i><sub>k</sub>');

    secaoD.appendChild(tituloD);
    secaoD.appendChild(descD);
    const matematica = criarParenteMath();
      const mtable = criarElementoMath('mtable');
      sistema.forEach((congruencia, idx) => {
        const d = inversoModular(congruencia.N, congruencia.m);
        congruencia.d = d;
        mtable.appendChild(gerarCongruencia({ a: 'N', c: 1, m: 'm' }, idx, { variavel: 'd' }));
        mtable.appendChild(gerarCongruencia({ a: congruencia.N, c: 1, m: congruencia.m }, idx, { variavel: 'd', adicionaPos: false }));

        if (congruencia.N > 1) mtable.appendChild(gerarCongruencia({ a: 1, c: d, m: congruencia.m }, idx, { variavel: 'd', adicionaPos: false }));
        mtable.appendChild(espacamento(5));
      });
    matematica.appendChild(mtable);
    secaoD.appendChild(matematica);
  resultados.appendChild(secaoD);
}

function resultadoFinal(sistema, M) {
  const secaoResultado = document.createElement('section');
    const resultado = criarTitulo('Passo 5.', 'margem-acima');
    const descRes   = criarDescricao('Calcular o resultado final (<i>mod M</i>)')

    secaoResultado.appendChild(resultado);
    secaoResultado.appendChild(descRes);
    const matematica = criarParenteMath();
      const sistemaNecessario = sistema.map(({ c, d, N }) => ({ c, d, N }));

      const resultadoFinal = resultadoSistema(sistema.map(({ c, d, N }) => [c, d, N]));
    
      const mtable = criarElementoMath('mtable');
      const resolucao = resolucaoPassoPasso('x', sistemaNecessario, resultadoFinal, ['+', '&middot;'], M);  

      mtable.appendChild(resolucao);

    matematica.appendChild(mtable);
    secaoResultado.appendChild(matematica);
  resultados.appendChild(secaoResultado);
}

function criarTitulo(titulo, classesExtras) {
  const tituloSpan = document.createElement('span');
    tituloSpan.className = `titulo-secao ${classesExtras}`;
    tituloSpan.innerHTML = titulo;

  return tituloSpan;
}

function criarDescricao(desc) {
  const descricao = document.createElement('span');
    descricao.className = 'descricao-secao'
    descricao.innerHTML = desc;
  
  return descricao;
}

function resetaResultados() {
  resultados.replaceChildren();
  canonizar.replaceChildren();
  canonizar.classList.remove('display');
}