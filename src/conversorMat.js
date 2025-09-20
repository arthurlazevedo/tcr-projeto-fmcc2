const mathNS          = 'http://www.w3.org/1998/Math/MathML';

function criarElementoMath(tag) {
  return document.createElementNS(mathNS, tag);  
}

export function gerarCongruencia(congruencia, indice, representacao) {
  const linhaTabela = criarElementoMath('mtr');

  if (indice) {
    const posCelula = criarElementoMath('mtd');
      const posLinha = criarElementoMath('mrow');

        const abertura     = criarElementoMath('mo');
        abertura.textContent = '(';
        
        posLinha.appendChild(abertura);
        Array.from(numeralParaRomano(indice)).forEach(romano => {
          const numeral     = criarElementoMath('mi');
          numeral.textContent = romano;

          posLinha.appendChild(numeral);
        })

        const fechamento     = criarElementoMath('mo');
        fechamento.textContent = ')';

      posLinha.appendChild(fechamento);
    posCelula.appendChild(posLinha);

    linhaTabela.appendChild(posCelula);
  }  
  
  
    const aCelula   = criarElementoMath('mtd');
      const aLinha = criarElementoMath('mrow');

        if (congruencia.a && congruencia.a !== 1) {
          const a       = criarElementoMath('mn');
          a.textContent = congruencia.a;

          const vezes     = criarElementoMath('mo');
          vezes.innerHTML = '&#x2062;';

          aLinha.appendChild(a);
          aLinha.appendChild(vezes);
        }

        const x       = criarElementoMath('mi');
        x.textContent = 'x';

      aLinha.appendChild(x);
    aCelula.appendChild(aLinha);

    const eqCelula  = criarElementoMath('mtd');
      const simbolo       = criarElementoMath('mo');
      simbolo.textContent = '≡';
    eqCelula.appendChild(simbolo);

    const cCelula   = criarElementoMath('mtd');
      const c       = criarElementoMath('mn');
      c.textContent = congruencia.c;
    cCelula.appendChild(c);

    const modCelula = criarElementoMath('mtd');
      const modLinha = criarElementoMath('mrow');

        const inicio       = criarElementoMath('mo');
        inicio.textContent = '(';

        
        const funcaoMod       = criarElementoMath('mrow');
        Array.from('mod').forEach(letra => {
          const letraSimbolo       = criarElementoMath('mi');
          letraSimbolo.textContent = letra;

          funcaoMod.appendChild(letraSimbolo);
        })
        funcaoMod.style       = 'margin-right:3px;'

        const mod       = criarElementoMath('mn');
        mod.textContent = congruencia.m;

        const fim       = criarElementoMath('mo');
        fim.textContent = ')';

      modLinha.appendChild(inicio);
      modLinha.appendChild(funcaoMod);
      modLinha.appendChild(mod);
      modLinha.appendChild(fim);
    modCelula.appendChild(modLinha);

  linhaTabela.appendChild(aCelula);
  linhaTabela.appendChild(eqCelula);
  linhaTabela.appendChild(cCelula);
  linhaTabela.appendChild(modCelula);

  if (representacao) {/* todo */}
  return linhaTabela;
}

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


function numeralParaRomano(numero) {
  const algarismos = [['I', 'V'], ['X', 'L'], ['C', 'D'], 'M'];
  const numeral    = numero.toString();

  let algarismo = '';
  let ignorarProximo = false;

  for (let i = numeral.length; i > 0; i--) {
    const idx = numeral.length - i;

    if (ignorarProximo) {
      ignorarProximo = false;
      continue;
    }

    const num = parseInt(numeral[i - 1]);
    switch (num) {
      case 1:
      case 2:
      case 3:
        algarismo = repete(algarismos[idx][0], num) + algarismo;
        break;
      case 4:
        algarismo = algarismos[idx][0] + algarismos[idx][1] + algarismo;
        break;
      case 5:
        algarismo = algarismos[idx][0] + algarismo;
        break;
      case 6:
      case 7:
      case 8:
        algarismo = algarismos[idx][1] + repete(algarismos[idx][0], num - 5) + algarismo;
        break;
      case 9:
        algarismo = algarismos[idx][0] + algarismos[idx + 1][0] + algarismo;
        break;
      case 0:
        algarismo = algarismos[idx + 1][0] + algarismo;
        ignorarProximo = true;
        break;
    }
  }

  return algarismo;
}

function repete(string, quant) {
  return Array.from({ length: quant }).map(_ => string).join('');
}