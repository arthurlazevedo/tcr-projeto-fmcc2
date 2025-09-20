import { coprimos, multiplicaLista } from './matematica.js';

export function sistemaTemSolucao(mods) {
	const incorretos = [];
	for (let i = 0; i < mods.length; i++) {
		for (let j = i + 1; j < mods.length; j++) {
			if (!coprimos(mods[i], mods[j])) incorretos.push([i, j]);
		}
	}
	return incorretos;
}

export function calculaN(M, m) {
	return M/m;
}

// achar um nome melhor do q cdn né pelo amor
export function resultadoSistema(cdn) {
	// a lista estará no formato: (c, d, n)
	return cdn.reduce((somatorio, atual) => {
		const mult = multiplicaLista(atual);

		return somatorio + mult;
	}, 0);
}
