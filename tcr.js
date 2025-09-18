import { coprimos, multiplicaLista } from './matematica'; 

export function sistemaTemSolucao(...mods) {
	for (let i = 0; i < mods.length; i++) {
		for (let j = i + 1; j < mods.length; j++) {
			if (!coprimos(mods[i], mods[j])) return false;
		}
	}
	return true;
}




export function calculaN(M, m) {
	return M/m;
}


// achar um nome melhor do q cdn né pelo amor
export function resultadoSistema(cdn) {
	// a lista estará no formato: (c, d, n)
	return cdn.reduce((somatorio, atual) => {
		mult = multiplicaLista(atual);

		return somatorio + atual;
	}, 0);
}
