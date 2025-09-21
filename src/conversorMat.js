import { numeralParaRomano } from "./utilitarios/utilitarios.js";

const mathNS = 'http://www.w3.org/1998/Math/MathML';


export function representarSistema(sistema, representacao) {
  const matematica = criarElementoMath('math');
  matematica.setAttribute('display', 'block');

    const tabelaMat = criarElementoMath('mtable');
    for (let i = 0; i < sistema.length; i++) {
      const repr = typeof representacao === 'object' ? representacao[i] : representacao;
      tabelaMat.appendChild(gerarCongruencia(sistema[i], i + 1, repr))
      if (repr.exp) {
        // todo: mais adequado separar isso em uma função específica
        tabelaMat.insertAdjacentHTML('beforeend', `<mtr><mtd columnspan="99"><mtext mathcolor="red" class="explanation">[${repr.exp}]</mtext></mtd></mtr>`)
      }
    }
  
  matematica.appendChild(tabelaMat);

  return matematica;
}


export function gerarCongruencia(congruencia, indice, representacao) {
  const linhaTabela = criarElementoMath('mtr');
  if (indice) linhaTabela.appendChild(posicaoCongruencia(indice));

  linhaTabela.appendChild(gerarA(congruencia.a));
  linhaTabela.appendChild(criarCelulaSimples('≡'));
  linhaTabela.appendChild(criarCelulaSimples(congruencia.c));
  linhaTabela.appendChild(gerarMod(congruencia.m));

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


export function representarM(mods, M) {
  const matematica = criarElementoMath('math');
  matematica.setAttribute('display', 'block');
  matematica.appendChild(resolucaoPassoPasso('M', mods.map(m => ({ m })), M, '*'));

  return matematica;
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


function gerarA(valorA) {
  const celula   = criarElementoMath('mtd');
    const linha = criarElementoMath('mrow');

      if (valorA && valorA !== 1) {
        const a = criarElementoMath('mn');
        a.textContent = valorA;

        const vezes = operacao('&#x2062;');

        linha.appendChild(a);
        linha.appendChild(vezes);
      }

      const x = criarElementoMath('mi');
      x.textContent = 'x';

    linha.appendChild(x);
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

      if (isNaN(indice)) {
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
    if (isNaN(indice)) {
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


function resolucaoPassoPasso(varResolver, valores, valorFinal, operacao) {
  const tabela = criarElementoMath('mtable');
    const rowInicial = criarElementoMath('mtr');
      rowInicial.appendChild(criarCelulaSimples(varResolver));
      rowInicial.appendChild(criarCelulaSimples('='));
      rowInicial.appendChild(comOperacao(valores, operacao, true));

    const rowVariaveis = criarElementoMath('mtr');
      rowVariaveis.appendChild(criarCelulaSimples());
      rowVariaveis.appendChild(criarCelulaSimples('='));
      rowVariaveis.appendChild(comOperacao(valores, operacao, false));

    const rowResolucao = criarElementoMath('mtr');
      rowResolucao.appendChild(criarCelulaSimples());
      rowResolucao.appendChild(criarCelulaSimples('='));
      rowResolucao.appendChild(criarCelulaSimples(valorFinal));

  tabela.appendChild(rowInicial);
  tabela.appendChild(rowVariaveis);
  tabela.appendChild(rowResolucao);

  return tabela;
}


function comOperacao(valores, valOperacao, usarChave) {
  const row = criarElementoMath('mtd');

  valores.forEach((val, idx) => {
    Object.entries(val).forEach(([chave, valor]) => {
      if (usarChave) {
        row.appendChild(criarCelulaSimples(chave, idx + 1).children.item(0));
      } else {
        row.appendChild(criarCelulaSimples(valor).children.item(0));
      }
      if (idx !== valores.length - 1) {
        row.appendChild(operacao(valOperacao, '&times;'));
      }
    })
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


function criarElementoMath(tag) {
  return document.createElementNS(mathNS, tag);  
}