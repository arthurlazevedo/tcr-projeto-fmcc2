import { ehNuloUndef, ehNumero, numeralParaRomano } from "./utilitarios/utilitarios.js";

const mathNS = 'http://www.w3.org/1998/Math/MathML';


export function criarElementoMath(tag) {
  return document.createElementNS(mathNS, tag);
}


export function criarParenteMath() {
  const matematica = criarElementoMath('math');
  matematica.setAttribute('display', 'block');

  return matematica;
}


export function representarSistema(sistema, representacao) {
  const matematica = criarParenteMath();

    const tabelaMat = criarElementoMath('mtable');
    for (let i = 0; i < sistema.length; i++) {
      tabelaMat.appendChild(gerarCongruencia(sistema[i], i, { representacao }));
      tabelaMat.appendChild(espacamento(2));
    }

  matematica.appendChild(tabelaMat);

  return matematica;
}


export function representarM(mods, M) {
  const matematica = criarParenteMath();
  matematica.appendChild(resolucaoPassoPasso('M', mods.map(m => ({ m })), M, ['&middot;']));

  return matematica;
}

export function valorVariavel(valor, { variavel, indice, mod } = {}) {
  const rowResolucao = criarElementoMath('mtr');

    if (variavel && !ehNuloUndef(indice)) rowResolucao.appendChild(posicaoCongruencia(indice));
    if (!variavel && !ehNuloUndef(indice)) rowResolucao.appendChild(criarCelulaSimples());

    rowResolucao.appendChild(criarCelulaSimples(variavel, { indice }));
    rowResolucao.appendChild(criarCelulaSimples(mod ? '≡' : '='));
    rowResolucao.appendChild(typeof valor === 'object' ? valor : criarCelulaSimples(valor));

    if (mod) rowResolucao.appendChild(gerarMod(mod));
  return rowResolucao;
}


export function resolucaoPassoPasso(varResolver, valores, valorFinal, operacao, mod) {
  const tabela = criarElementoMath('mtable');

  // TODO: se eu não conseguir fazer a parada de diferenciar se é uma ou várias equações, não precisa do último se o tamanho for 1
  tabela.appendChild(valorVariavel(comOperacao(valores, operacao, true), { variavel: varResolver, mod }));
  tabela.appendChild(valorVariavel(comOperacao(valores, operacao, false), { mod }));
  tabela.appendChild(valorVariavel(valorFinal, { mod }));

  if (mod) tabela.appendChild(valorVariavel(valorFinal % mod, { mod }));

  return tabela;
}


export function gerarCongruencia(congruencia, indice, { representacao, variavel, adicionaPos = true } = {}) {
  const linhaTabela = criarElementoMath('mtr');
  if (!ehNuloUndef(indice)) linhaTabela.appendChild(adicionaPos ? posicaoCongruencia(indice): criarCelulaSimples());

  linhaTabela.appendChild(gerarA(congruencia.a, variavel, indice));
  linhaTabela.appendChild(criarCelulaSimples('≡'));
  linhaTabela.appendChild(criarCelulaSimples(congruencia.c));
  linhaTabela.appendChild(gerarMod(congruencia.m, indice));

  if (representacao) {
    linhaTabela.appendChild(criarCelulaSimples('&Rightarrow;'));
    linhaTabela.appendChild(gerarA());
    linhaTabela.appendChild(criarCelulaSimples('≡'));
    linhaTabela.appendChild(criarCelulaSimples('c', { indice }));
    linhaTabela.appendChild(gerarMod('m', indice));
  }

  return linhaTabela;
}


export function fracaoSimples(numerador, denominador) {
  const [valor, indice] = denominador;
  const fracao = criarElementoMath('mfrac');

    const num = criarCelulaSimples(numerador, { comoCelula: false });
    const den = criarCelulaSimples(valor, { indice, comoCelula: false });

    if (denominador[1]) den.style = 'margin-left:5px;';

  fracao.appendChild(num);
  fracao.appendChild(den);

  return fracao;
}


export function espacamento(tamanho) {
  const espaco = criarElementoMath('mspace');
  espaco.setAttribute('height', `${tamanho}px`);

  return espaco;
}


export function explicacao(explicacao) {
  const mtr = criarElementoMath('mtr');

    const mtd = criarElementoMath('mtd');
    mtd.setAttribute('columnspan', '99');

      const exp = criarElementoMath('mtext');
      exp.setAttribute('mathcolor', 'red');
      exp.setAttribute('class', 'explanation');
      exp.setAttribute('display', 'inline-block');
      exp.innerHTML = `[${explicacao}]`;

    mtd.appendChild(exp);
  mtr.appendChild(mtd);

  return mtr;
}


function posicaoCongruencia(indice) {
  const posCelula = criarElementoMath('mtd');
    const posLinha = criarElementoMath('mrow');

    posLinha.appendChild(operacao('('));
    posLinha.insertAdjacentHTML("beforeend", representarPalavraMi(numeralParaRomano(indice + 1)));
    posLinha.appendChild(operacao(')'));

  posCelula.appendChild(posLinha);

  return posCelula;
}


function gerarA(valorA, variavel, indice) {
  const celula   = criarElementoMath('mtd');
    const linha = criarElementoMath('mrow');

    if (valorA && valorA !== 1) {
      const a = criarCelulaSimples(valorA, { indice, comoCelula: false });
      const vezes = operacao('&#x2062;');

      linha.appendChild(a);
      linha.appendChild(vezes);
    }

    if (variavel) {
      linha.appendChild(criarCelulaSimples(variavel, { indice, comoCelula: false }))
    } else {
      linha.appendChild(criarCelulaSimples('x', { comoCelula: false }));
    }

  celula.appendChild(linha);

  return celula;
}


function gerarMod(modulo, indice) {
  const modCelula = criarElementoMath('mtd');
    const modLinha = criarElementoMath('mrow');

      modLinha.appendChild(operacao('('));
  
      const funcaoMod = criarElementoMath('mrow');
      funcaoMod.insertAdjacentHTML('beforeend', representarPalavraMi('mod'));
      funcaoMod.style = 'margin-right:5px;'

      modLinha.appendChild(funcaoMod);
      modLinha.appendChild(criarCelulaSimples(modulo, { indice, comoCelula: false }));
      modLinha.appendChild(operacao(')'));

  modCelula.appendChild(modLinha);

  return modCelula;
}


function criarCelulaSimples(elemento, { indice, comoCelula = true } = {}) {
  const celula = criarElementoMath('mtd');

  if (!ehNuloUndef(elemento)) {
    if (ehNumero(elemento) || ehNuloUndef(indice)) {
      const c = criarElementoMath(ehNumero(elemento) ? 'mn' : 'mi');
      c.innerHTML = elemento;

      if (!comoCelula) return c;
      celula.appendChild(c);
    } else {
      const c = variavelIndexada(elemento, indice);

      if (!comoCelula) return c;
      celula.appendChild(c);
    }
  }

  return celula;
}


function variavelIndexada(nome, indice) {
  const linha = criarElementoMath('msub');

  linha.appendChild(criarCelulaSimples(nome, { comoCelula: false }));
  linha.appendChild(criarCelulaSimples(indice + 1, { comoCelula: false }));

  return linha
}


function comOperacao(valores, valOperacao, usarChave) {
  const row = criarElementoMath('mtd');

  valores.forEach((val, indice) => {
    const entries = Object.entries(val);
    entries.forEach(([chave, valor], idxInterno) => {
      if (usarChave) {
        row.appendChild(criarCelulaSimples(chave, { indice, comoCelula: false }));
      } else {
        row.appendChild(criarCelulaSimples(valor, { comoCelula: false }));
      }
      if (idxInterno !== entries.length - 1) {
        const operacaoMo = operacao(valOperacao[1]);
        if (usarChave) operacaoMo.style = 'margin-right:2px;'
        row.appendChild(operacaoMo);
      }
    })
    if (indice !== valores.length - 1) {
      const operacaoMo = operacao(valOperacao[0]);
      if (usarChave) operacaoMo.style = 'margin-right:2px;'
      row.appendChild(operacaoMo);
    }
  });

  return row;
}


function operacao(operacao) {
  const op = criarElementoMath('mo');
  op.innerHTML = operacao;

  return op;
}


function representarPalavraMi(palavra) {
  return Array.from(palavra).map(palavra => `<mi>${palavra}</mi>`).join('');
}