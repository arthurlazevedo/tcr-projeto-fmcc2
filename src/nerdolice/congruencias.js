import { totienteEuler, minimoDivComum, coprimos } from './matematica.js';

export function temSolucao(a, b, mod) {
	return b % minimoDivComum(a, mod) === 0;
}


export function inversoModular(a, mod) {
	// não tem inverso, retorna um "erro"
	if (!coprimos(a, mod)) return -1;
	const expoente = totienteEuler(mod) - 1;

	return (a**expoente) % mod;
}


export function solCongruenciaLinear(a, b, mod) {
	// normaliza
	a = a % mod;
	b = b % mod;

	if (a === b) return 1;

	// não tem solução, retorna um código de erro
	if (!temSolucao(a, b, mod)) return -1;
	if (coprimos(a, mod)) {
		const inverso = inversoModular(a, mod);
		return (b * inverso) % mod
	}
	for (let i = 2; i < mod; i++) {
		if ((a * i) % mod === b) {
			return i;
		}
	}
}
