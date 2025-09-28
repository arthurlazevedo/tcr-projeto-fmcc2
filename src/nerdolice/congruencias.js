import { maximoDivComum, coprimos, restoPositivo } from './matematica.js';
import { explicacoes } from '../constantes.js';

export function temSolucao(a, b, mod) {
  // necessário fazer assim para funcionar com bigint e inteiros normais
  return b % maximoDivComum(a, mod) == 0;
}


export function inversoModular(a, mod) {
  // não tem inverso, retorna um "erro"
  if (!coprimos(a, mod)) return -1n;

  const aNormalizado = restoPositivo(a, mod);
  for (let i = 0n; i < mod; i++) {
    if (aNormalizado * i % mod === 1n) return i;
  }
}


export function canonico(congruencia) {
  return congruencia.a === 1n;
}


export function solCongruenciaLinear(a, c, m) {
  if (!temSolucao(a, c, m)) return null;

  if (m < 0n) return { a, c, m: -m, explicacao: explicacoes.negativo, passadaExtra: true };

  if (a === 1n ) {
    if (c < m && c >= 0n) return { a, c, m, explicacao: explicacoes.canon };

    return { a, c: restoPositivo(c, m), m, explicacao: explicacoes.simples(m, c) };
  }

  const mdc = maximoDivComum(a, m);
  if (a % m === c % m) {
    if (mdc != 1) return { a: 1n, c: 1n, m: m / mdc, explicacao: explicacoes.euclides };
		if (a === c)  return { a: 1n, c: 1n, m, explicacao: explicacoes.comum(a) };

		const resto = a % m;
		return { a: resto || 1n, c: resto, m, explicacao: explicacoes.simples(m, a, c), passadaExtra: resto > 1 };
  }

  if (coprimos(a, m)) {
    const inverso = inversoModular(a, m);
    const novoC   = (c * inverso) % m
    return { a: 1n, c: novoC, m, explicacao: explicacoes.inverso, passadaExtra: novoC < 0n };
  }

  a = a / mdc;
  c = c / mdc;
  m = m / mdc;

  for (let i = 1n; i <= m; i++) {
    if ((a * i) % m === c % m) {
      return { a: 1n, c: i, m, explicacao: explicacoes.euclides };
    }
  }
}
