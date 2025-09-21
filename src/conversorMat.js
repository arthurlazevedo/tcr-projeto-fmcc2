import { numeralParaRomano } from "./utilitarios/utilitarios.js";

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
      const repr = typeof representacao === 'object' ? representacao[i] : representacao;
      tabelaMat.appendChild(gerarCongruencia(sistema[i], i + 1, repr))
      if (repr.exp) {
        // TODO: mais adequado separar isso em uma função específica
        tabelaMat.insertAdjacentHTML('beforeend', `<mtr><mtd columnspan="99"><mtext mathcolor="red" class="explanation">[${repr.exp}]</mtext></mtd></mtr>`)
      }
    }
  
  matematica.appendChild(tabelaMat);

  return matematica;
}


export function representarM(mods, M) {
  const matematica = criarParenteMath();
  matematica.appendChild(resolucaoPassoPasso('M', mods.map(m => ({ m })), M, '&middot;'));

  return matematica;
}

export function valorVariavel(valor, variavel, indice, mod) {
  const rowResolucao = criarElementoMath('mtr');
    if (variavel && indice) rowResolucao.appendChild(posicaoCongruencia(indice));
    if (!variavel && indice) rowResolucao.appendChild(criarCelulaSimples());
    rowResolucao.appendChild(criarCelulaSimples(variavel, indice));
    rowResolucao.appendChild(criarCelulaSimples(mod ? '≡' : '='));
    rowResolucao.appendChild(typeof valor === 'object' ? valor : criarCelulaSimples(valor));
    if (mod) rowResolucao.appendChild(gerarMod(mod));
  return rowResolucao;
}


export function resolucaoPassoPasso(varResolver, valores, valorFinal, operacao, mod) {
  const tabela = criarElementoMath('mtable');
    // TODO: se eu não conseguir fazer a parada de diferenciar se é uma ou várias equações, não precisa do último se o tamanho for 1
    const rowInicial   = valorVariavel(comOperacao(valores, operacao, true), varResolver, null, mod);
    const rowVariaveis = valorVariavel(comOperacao(valores, operacao, false), null, null, mod);
    const rowResolucao = valorVariavel(valorFinal, null, null, mod);
  
  tabela.appendChild(rowInicial);
  tabela.appendChild(rowVariaveis);
  tabela.appendChild(rowResolucao);
  
  if (mod) tabela.appendChild(valorVariavel(valorFinal % mod, null, null, mod))

  return tabela;
}


export function gerarCongruencia(congruencia, indice, representacao, nome, ignorar = false) {
  const linhaTabela = criarElementoMath('mtr');
  if (indice) linhaTabela.appendChild(ignorar ? criarCelulaSimples() : posicaoCongruencia(indice));

  linhaTabela.appendChild(gerarA(congruencia.a, nome, indice));
  linhaTabela.appendChild(criarCelulaSimples('≡'));
  linhaTabela.appendChild(criarCelulaSimples(congruencia.c));
  linhaTabela.appendChild(gerarMod(congruencia.m, indice));

  if (representacao) {
    linhaTabela.appendChild(criarCelulaSimples('&Rightarrow;'));
    const cong = criarCelulaSimples('≡');
    linhaTabela.appendChild(cong);
    if (typeof representacao === 'object') {
      linhaTabela.insertBefore(gerarA(representacao.a), cong);
      linhaTabela.appendChild(criarCelulaSimples(representacao.c));
      linhaTabela.appendChild(gerarMod(representacao.m));
    } else {
      linhaTabela.insertBefore(gerarA(), cong);
      linhaTabela.appendChild(criarCelulaSimples('c', indice));
      linhaTabela.appendChild(gerarMod('m', indice));
    }
  }

  return linhaTabela;
}


export function fracaoSimples(numerador, denominador) {
  denominador = [].concat(denominador);

  const fracao = criarElementoMath('mfrac');
    const num = criarCelulaSimples(numerador).children.item(0);
    const den = criarCelulaSimples(...denominador).children.item(0);
    if (denominador.length > 1) den.style = 'margin-left:5px;';
  
  fracao.appendChild(num);
  fracao.appendChild(den);

  return fracao;
}


function posicaoCongruencia(indice) {
  const posCelula = criarElementoMath('mtd');
    const posLinha = criarElementoMath('mrow');

      const abertura = criarElementoMath('mo');
      abertura.textContent = '(';
      
      posLinha.appendChild(abertura);
      posLinha.insertAdjacentHTML("beforeend", representarPalavraMi(numeralParaRomano(indice)));

      const fechamento = criarElementoMath('mo');
      fechamento.textContent = ')';

    posLinha.appendChild(fechamento);
  posCelula.appendChild(posLinha);

  return posCelula;
}


function gerarA(valorA, variavel, indice) {
  const celula   = criarElementoMath('mtd');
    const linha = criarElementoMath('mrow');

    if (valorA && valorA !== 1) {
      const a = criarCelulaSimples(valorA, indice).children.item(0);

      const vezes = operacao('&#x2062;');

      linha.appendChild(a);
      linha.appendChild(vezes);
    }

    if (variavel) {
      // TODO: achar um jeito melhor do que só ter que fazer isso sempre
      linha.appendChild(criarCelulaSimples(variavel, indice).children.item(0))
    } else {
      linha.appendChild(criarCelulaSimples('x').children.item(0));
    }

  celula.appendChild(linha);

  return celula;
}


function gerarMod(modulo, indice) {
  const modCelula = criarElementoMath('mtd');
    const modLinha = criarElementoMath('mrow');

      const inicio = criarElementoMath('mo');
      inicio.textContent = '(';
  
      const funcaoMod = criarElementoMath('mrow');
      funcaoMod.insertAdjacentHTML('beforeend', representarPalavraMi('mod'));
      funcaoMod.style = 'margin-right:3px;'

      modLinha.appendChild(inicio);
      modLinha.appendChild(funcaoMod);

      if (isNaN(indice) || !isNaN(modulo)) {
        const mod = criarElementoMath('mn');
        mod.textContent = modulo;

        modLinha.appendChild(mod);
      } else {
        modLinha.appendChild(variavelIndexada(modulo, indice));
      }

      const fim = criarElementoMath('mo');
      fim.textContent = ')';


    modLinha.appendChild(fim);
  modCelula.appendChild(modLinha);

  return modCelula;
}


function criarCelulaSimples(elemento, indice) {
  const celula = criarElementoMath('mtd');

  if (elemento) {
    if (!isNaN(elemento) || (isNaN(indice) && isNaN(elemento))) {
      const c = criarElementoMath(isNaN(elemento) ? 'mo': 'mn');
      c.innerHTML = elemento;
  
      celula.appendChild(c);
    } else {
      celula.appendChild(variavelIndexada(elemento, indice));
    }
  }

  return celula;
}


function variavelIndexada(nome, indice) {
  const linha = criarElementoMath('msub');

    const variavel      = criarElementoMath('mi');
    variavel.innerHTML  = nome;

    const indiceVar     = criarElementoMath('mn');
    indiceVar.innerHTML = indice
  
  linha.appendChild(variavel);
  linha.appendChild(indiceVar);

  return linha
}


function comOperacao(valores, valOperacao, usarChave) {
  const row = criarElementoMath('mtd');

  valores.forEach((val, idx) => {
    const entries = Object.entries(val);
    entries.forEach(([chave, valor], idxInterno) => {
      if (usarChave) {
        row.appendChild(criarCelulaSimples(chave, idx + 1).children.item(0));
      } else {
        row.appendChild(criarCelulaSimples(valor).children.item(0));
      }
      if (idxInterno !== entries.length - 1) {
        const operacaoMo = operacao(Array.isArray(valOperacao) ? valOperacao[0] : valOperacao);
        if (usarChave) operacaoMo.style = 'margin-right:2px;'
        row.appendChild(operacaoMo);
      }
    })
    if (idx !== valores.length - 1) {
      const operacaoMo = operacao(Array.isArray(valOperacao) ? valOperacao[1] : valOperacao);
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