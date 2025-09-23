function _formaSimplificada(a, m) {
  return `${a} ≡ ${a % m}`;
}

function removerDuplicatas(lista) {
  return [...new Set(lista)];
}

export const explicacoes = {
  canon    : 'Já está na forma canônica',
  euclides : 'Pelo algoritmo de Euclides',
  inverso  : 'Pelo inverso modular',
  comum    : (a) => `Extraindo o fator em comum (${a})`,
  simples  : (m, ...as) => `Como ${removerDuplicatas(as).map(a => _formaSimplificada(a, m)).join(" e ")} (mod ${m})`
};