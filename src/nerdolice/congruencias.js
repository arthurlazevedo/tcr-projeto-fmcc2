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


export function canonico(congruencia) {
	return congruencia.a === 1;
}


export function solCongruenciaLinear(a, b, mod) {
	const mdc = minimoDivComum(a, mod);

	// normaliza
	a = a % mod;
	b = b % mod;

	if (a === b) {
		if (mdc > 1) {
			return { a: 1, c: 1, m: Math.floor(mod/mdc), exp: 'Pelo Alg. de Euclides para Congruências' };
		}
		// todo: isso aqui tá errado
		return { a: 1, c: 1, m: mod, exp: 'Pelo Inverso Modular' };
	}

	// não tem solução, retorna um código de erro
	if (!temSolucao(a, b, mod)) return -1;
	if (coprimos(a, mod)) {
		const inverso = inversoModular(a, mod);
		return { a: 1, c: (b * inverso) % mod, m: mod, exp: 'Pelo Inverso Modular' };
	}

	a   = Math.floor(a / mdc);
	b   = Math.floor(b / mdc);
	mod = Math.floor(mod / mdc);
	for (let i = 2; i < mod; i++) {
		if ((a * i) % mod === b) {
			return { a: 1, c: i, m: mod, exp: 'Pelo Alg. de Euclides para Congruências' };
		}
	}
}
