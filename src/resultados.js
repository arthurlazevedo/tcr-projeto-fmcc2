import { representarSistema, valorVariavel, criarParenteMath, fracaoSimples, gerarCongruencia, resolucaoPassoPasso, explicacao, espacamento } from "./conversorMat.js";
import { sistemaTemSolucao, sistemaCanonico, calculaN, resultadoSistema } from "./nerdolice/tcr.js";
import { inversoModular, solCongruenciaLinear } from "./nerdolice/congruencias.js";
import { multiplicaLista } from "./nerdolice/matematica.js";
import { numeralParaRomano } from "./utilitarios/utilitarios.js";
import { vezesPonto } from "./constantes.js";

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
    sistema = canonizarSistema(sistema);
    mods    = sistema.map(congruencia => congruencia.m);
  }
  exibirSistema(sistema, true);

  const M = calcularM(mods);
  separarCk(sistema);
  calcularNk(sistema, M);
  calcularDk(sistema);
  resultadoFinal(sistema, M);
}

function reportaErroSistema(sistema, incorretos) {
  const secaoErro = document.createElement('section');
    const erro = criarTitulo('Dado o seguinte o sistema de congruências');

    secaoErro.appendChild(erro);
    secaoErro.appendChild(representarSistema(sistema));

    const explicacao = document.createElement('span');
    explicacao.className = 'explicacao'
    explicacao.innerHTML = `Não é possível resolvê-lo via <i>TCR</i>, visto que as congruências:<table class="lista-nao-coprimos"><tbody>${incorretos.map(congs => {
      return `<tr>${congs.map(cong => `<td><i>(${numeralParaRomano(cong + 1)})</i></td>`).join('<td>e</td>')}</tr>`
    }).join('')}</tbody></table>Possuem mod's não-coprimos`

    secaoErro.appendChild(explicacao);

  resultados.appendChild(secaoErro);
}

function exibirSistema(sistema) {
  const secaoSistema = document.createElement('section');
    const tituloSistema = criarTitulo('Resolver o seguinte sistema de congruências utilizando o <i>TCR</i>');

    secaoSistema.appendChild(tituloSistema);
    secaoSistema.appendChild(representarSistema(sistema, true));
  resultados.appendChild(secaoSistema);
}


function canonizarSistema(sistema) {
  const sistemaCanonico = sistema.map(({ a, c, m }) => solCongruenciaLinear(a, c, m));
  canonizar.classList.add('display');

  const tituloSistema = criarTitulo('Dado o seguinte sistema de congruências');
  const reprSistema = representarSistema(sistema);

  canonizar.appendChild(tituloSistema);
  canonizar.appendChild(reprSistema);

  const explicacaoCanonizar = document.createElement('span');
    explicacaoCanonizar.className = 'explicacao';
    explicacaoCanonizar.innerHTML = 'Devemos transformar todas as congruências em sua forma canonizada (<i>x</i> ≡ <i>n mod m, n</i> ∈ ℤ)<br>';

  const tituloCanonizar = criarTitulo('Canonizando as congruências');

  canonizar.appendChild(explicacaoCanonizar);
  canonizar.appendChild(tituloCanonizar);

  const [matematica, tabelaMat] = criarParenteMath();

  for (let i = 0; i < sistema.length; i++) {
    tabelaMat.appendChild(gerarCongruencia(sistema[i], i));
    tabelaMat.appendChild(explicacao(sistemaCanonico[i].explicacao));
    tabelaMat.appendChild(gerarCongruencia(sistemaCanonico[i], i, { adicionaPos: false }));
    
    while (sistemaCanonico[i].passadaExtra) {
      const { a, c, m } = sistemaCanonico[i];
      sistemaCanonico[i] = solCongruenciaLinear(a, c, m);
      
      tabelaMat.appendChild(explicacao(sistemaCanonico[i].explicacao));
      tabelaMat.appendChild(gerarCongruencia(sistemaCanonico[i], i, { adicionaPos: false }));
    }
    if (i !== sistema.length - 1) tabelaMat.appendChild(espacamento(20));
  }

  canonizar.appendChild(matematica);

  return sistemaCanonico;
}


function calcularM(mods) {
  const M = multiplicaLista(mods);

  const secaoM = document.createElement('section');
    const tituloM = criarTitulo('Passo 1.', 'margem-acima');
    const descM   = criarDescricao('Calcular o módulo da solução final (<i>M</i>)');

    secaoM.appendChild(tituloM);
    secaoM.appendChild(descM);

    secaoM.appendChild(resolucaoPassoPasso('M', mods.map(m => ({ m })), M, [vezesPonto]));
  resultados.appendChild(secaoM);

  return M;
}


function separarCk(sistema) {
  const secaoC = document.createElement('section');
    const tituloC = criarTitulo('Passo 2.', 'margem-acima');
    const descC   = criarDescricao('Separar os <i>c</i><sub>k</sub><i>\'s</i> de cada Congruência');

    secaoC.appendChild(tituloC);
    secaoC.appendChild(descC);

    const [matematica, tabelaMat] = criarParenteMath();
    sistema.forEach(({ c }, indice) => {
      tabelaMat.appendChild(valorVariavel(c, { variavel: 'c', indice}));
    });

    secaoC.appendChild(matematica);

  resultados.appendChild(secaoC);
}


function calcularNk(sistema, M) {
  const secaoN = document.createElement('section');
    const tituloN    = criarTitulo('Passo 3.', 'margem-acima');
    const descricaoN = criarDescricao('Calcular a razão  <sup><i>M</i></sup>&frasl;<sub><i>m</i><sub>k</sub></sub> (<i>N</i><sub>k</sub>) de cada Congruência');

    secaoN.appendChild(tituloN);
    secaoN.appendChild(descricaoN);

    const [matematica, tabelaMat] = criarParenteMath();

    sistema.forEach((congruencia, indice) => {
      congruencia.N = calculaN(M, congruencia.m);

      tabelaMat.appendChild(valorVariavel(fracaoSimples('M', ['m', indice]), { variavel: 'N', indice}));
      tabelaMat.appendChild(espacamento(5));
      tabelaMat.appendChild(valorVariavel(fracaoSimples(M, [congruencia.m]), { indice }));
      tabelaMat.appendChild(espacamento(5));
      tabelaMat.appendChild(valorVariavel(congruencia.N, { indice }));
      tabelaMat.appendChild(espacamento(20));
    })

    secaoN.appendChild(matematica);
  resultados.appendChild(secaoN);
}


function calcularDk(sistema) {
  const secaoD = document.createElement('section');
    const tituloD = criarTitulo('Passo 4.', 'margem-acima');
    const descD   = criarDescricao('Calcular <i>d</i><sub>k</sub>, o inverso de <i>N</i><sub>k</sub> (<i>mod m</i><sub>k</sub>)');

    secaoD.appendChild(tituloD);
    secaoD.appendChild(descD);

    const [matematica, tabelaMat] = criarParenteMath();
    sistema.forEach((congruencia, idx) => {
      congruencia.d = inversoModular(congruencia.N, congruencia.m);

      tabelaMat.appendChild(gerarCongruencia({ a: 'N', c: 1, m: 'm' }, idx, { variavel: 'd' }));
      tabelaMat.appendChild(gerarCongruencia({ a: congruencia.N, c: 1, m: congruencia.m }, idx, { variavel: 'd', adicionaPos: false }));

      if (congruencia.N > 1) tabelaMat.appendChild(gerarCongruencia({ a: 1, c: congruencia.d, m: congruencia.m }, idx, { variavel: 'd', adicionaPos: false }));
      if (idx !== sistema.length -1) tabelaMat.appendChild(espacamento(20));
    });

    secaoD.appendChild(matematica);
  resultados.appendChild(secaoD);
}


function resultadoFinal(sistema, M) {
  const resultadoFinal = resultadoSistema(sistema.map(({ c, d, N }) => [c, d, N]));
  const sistemaNecessario = sistema.map(({ c, d, N }) => ({ c, d, N }));

  const secaoResultado = document.createElement('section');
    const resultado = criarTitulo('Passo 5.', 'margem-acima');
    const descRes   = criarDescricao('Calcular o resultado final (<i>mod M</i>)')

    secaoResultado.appendChild(resultado);
    secaoResultado.appendChild(descRes);

    const [matematica, tabelaMat] = criarParenteMath();
    const resolucao = resolucaoPassoPasso('x', sistemaNecessario, resultadoFinal, ['+', vezesPonto], M);
    tabelaMat.appendChild(resolucao);

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