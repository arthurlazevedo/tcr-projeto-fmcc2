function _formaSimplificada(a, m) {
  return `${a} ≡ ${a % m}`;
}

function removerDuplicatas(lista) {
  return [...new Set(lista)];
}

export const explicacoes = {
  euclides : 'Pelo algoritmo de Euclides',
  simples  : (m, ...as) => `Como ${removerDuplicatas(as).map(a => _formaSimplificada(a, m)).join(" e ")} (mod ${m})`,
  inverso  : 'Pelo inverso modular',
  comum    : (a) => `Extraindo o fator em comum (${a})`,
  canon    : 'Já está na forma canônica',
};

export const errosCongruencias = {
  semSolucao : 'A congruência linear não possui solução',
  cInvalido  : 'Valor inválido para a congruência linear',
  infinito   : 'Possui infinitas soluções, logo será desconsiderada',
  errada     : 'Congruência mal-formada, logo será desconsiderada',
  modulo     : 'Módulo inválido para a congruência linear',
}