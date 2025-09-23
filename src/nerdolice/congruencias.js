import { totienteEuler, minimoDivComum, coprimos } from './matematica.js';
import { explicacoes } from '../constantes.js';

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


export function solCongruenciaLinear(a, c, m) {
  if (!temSolucao(a, c, m)) return -1;

  if (a === 1) {
    if (c < m) return { a, c, m, explicacao: explicacoes.canon };

    return { a, c: c % m, m, explicacao: explicacoes.simples(m, c) };
  }

  const mdc = minimoDivComum(a, m);
  if (a % m === c % m) {
    if (mdc !== 1) return { a: 1, c: 1, m: Math.floor(m / mdc), explicacao: explicacoes.euclides };
		if (a === c)   return { a: 1, c: 1, m, explicacao: explicacoes.comum(a) };

		const resto = a % m;
		return { a: resto || 1, c: resto, m, explicacao: explicacoes.simples(m, a, c), talvezNaoResolvido: resto === 1 || !resto };

  }

  if (coprimos(a, m)) {
    const inverso = inversoModular(a, m);
    return { a: 1, c: (c * inverso) % m, m, explicacao: explicacoes.inverso };
  }

  a = Math.floor(a / mdc);
  c = Math.floor(c / mdc);
  m = Math.floor(m / mdc);

  for (let i = 2; i < m; i++) {
    if ((a * i) % m === c) {
      return { a: 1, c: i, m, explicacao: explicacoes.euclides };
    }
  }
}
