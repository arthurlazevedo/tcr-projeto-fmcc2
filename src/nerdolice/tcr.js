import { coprimos, multiplicaLista } from './matematica.js';
import { canonico } from './congruencias.js';

export function sistemaTemSolucao(mods) {
  const incorretos = [];
  for (let i = 0; i < mods.length; i++) {
    for (let j = i + 1; j < mods.length; j++) {
      if (!coprimos(mods[i], mods[j])) incorretos.push([i, j]);
    }
  }
  return incorretos;
}

export function sistemaCanonico(sistema) {
  return sistema.every(canonico);
}

export function calculaN(M, m) {
  return M/m;
}

export function resultadoSistema(cdn) {
  return cdn.reduce((somatorio, atual) => {
    return somatorio + multiplicaLista(atual);
  }, 0);
}
