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


export function solCongruenciaLinear(a, c, mod) {
	const mdc = minimoDivComum(a, mod);

	// normaliza
	a = a % mod;
	c = c % mod;

	if (a === 1) {
		// TODO: talvez não esteja, isso tem que ser checado antes
		return { a, c, m: mod, exp: 'Já está na forma canônica' }
	}

	if (a === c) {
		if (mdc > 1) {
			return { a: 1, c: 1, m: Math.floor(mod / mdc), exp: 'Pelo Algo de Euclides para Congruências' };
		}
		return { a: 1, c: 1, m: mod, exp: `Extraindo o fator em comum (${a})` };
	}

	// não tem solução, retorna um código de erro
	if (!temSolucao(a, c, mod)) return -1;
	if (coprimos(a, mod)) {
		const inverso = inversoModular(a, mod);
		return { a: 1, c: (c * inverso) % mod, m: mod, exp: 'Pelo Inverso Modular' };
	}

	a   = Math.floor(a / mdc);
	c   = Math.floor(c / mdc);
	mod = Math.floor(mod / mdc);
	for (let i = 2; i < mod; i++) {
		if ((a * i) % mod === c) {
			return { a: 1, c: i, m: mod, exp: 'Pelo Alg. de Euclides para Congruências' };
		}
	}
}
