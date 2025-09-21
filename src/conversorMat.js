import { numeralParaRomano } from "./utilitarios/utilitarios.js";

const mathNS = 'http://www.w3.org/1998/Math/MathML';


export function representarSistema(sistema, representacao) {
  const matematica = criarElementoMath('math');
  matematica.setAttribute('display', 'block');

    const tabelaMat = criarElementoMath('mtable');
    for (let i = 0; i < sistema.length; i++) {
      tabelaMat.appendChild(gerarCongruencia(sistema[i], i + 1, representacao))
    }
  
  matematica.appendChild(tabelaMat);

  return matematica;
}


export function gerarCongruencia(congruencia, indice, representacao) {
  const linhaTabela = criarElementoMath('mtr');

    if (indice) linhaTabela.appendChild(posicaoCongruencia(indice));
    const aCelula   = gerarA(congruencia.a);
    const eqCelula  = criarCelulaSimples('≡');
    const cCelula   = criarCelulaSimples(congruencia.c);
    const modCelula = gerarMod(congruencia.m);

  linhaTabela.appendChild(aCelula);
  linhaTabela.appendChild(eqCelula);
  linhaTabela.appendChild(cCelula);
  linhaTabela.appendChild(modCelula);

  if (representacao) {/* todo */}
  return linhaTabela;
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

        const vezes = criarElementoMath('mo');
        vezes.innerHTML = '&#x2062;';

        linha.appendChild(a);
        linha.appendChild(vezes);
      }

      const x = criarElementoMath('mi');
      x.textContent = 'x';

    linha.appendChild(x);
  celula.appendChild(linha);

  return celula;
}


function criarCelulaSimples(elemento) {
  const celula = criarElementoMath('mtd');

    const c = criarElementoMath(isNaN(elemento) ? 'mo': 'mn');
    c.textContent = elemento;

  celula.appendChild(c);
  return celula;
}


function gerarMod(modulo) {
  const modCelula = criarElementoMath('mtd');
    const modLinha = criarElementoMath('mrow');

      const inicio = criarElementoMath('mo');
      inicio.textContent = '(';
  
      const funcaoMod = criarElementoMath('mrow');
      funcaoMod.insertAdjacentHTML('beforeend', representarPalavraMi('mod'));
      funcaoMod.style = 'margin-right:3px;'

      const mod = criarElementoMath('mn');
      mod.textContent = modulo;

      const fim = criarElementoMath('mo');
      fim.textContent = ')';

    modLinha.appendChild(inicio);
    modLinha.appendChild(funcaoMod);
    modLinha.appendChild(mod);
    modLinha.appendChild(fim);
  modCelula.appendChild(modLinha);

  return modCelula;
}


function representarPalavraMi(palavra) {
  return Array.from(palavra).map(palavra => `<mi>${palavra}</mi>`).join('');
}


function criarElementoMath(tag) {
  return document.createElementNS(mathNS, tag);  
}