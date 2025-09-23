export function numeralParaRomano(numero) {
  // consegue representar até 8999.
  const algarismos = [['i', 'v'], ['x', 'l'], ['c', 'd'], ['m', 'v̅']];
  const numeral    = numero.toString();
  let ignorarProximo = false;
  let algarismo      = [];

  for (let i = numeral.length; i > 0; i--) {
    const idx = numeral.length - i;

    if (ignorarProximo) {
      ignorarProximo = false;
      continue;
    }

    const num = parseInt(numeral[i - 1]);
    const mod = num % 5;

    if (mod < 4) {
      algarismo.unshift(repete(algarismos[idx][0], mod));
      if (num > 5) algarismo.unshift(algarismos[idx][1]);
    } else if (mod === 4) {
      algarismo.unshift(algarismos[idx][0], algarismos[num >= 5 ? idx + 1: idx][num > 5 ? 0 : 1]);
    } else {
      algarismo.unshift(algarismos[num ? idx : idx + 1][0]);
      if (!num) ignorarProximo = true;
    }
  }

  return algarismo.join('');
}


function repete(string, quant) {
  return Array.from({ length: quant }).map(_ => string).join('');
}


export function ehNumero(param) {
  return !isNaN(param);
}


export function ehNuloUndef(param) {
  return param == null;
}