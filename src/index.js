import { resolverSistema } from "./resultados.js";

const padraoCongruencia = /(\d*)x\s*=\s*(\d+)\s*(?:%\s*(\d+)|\(mod\s*(\d+)\))/;

document.onkeydown = e => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.stopPropagation();
    if (!btnCalcular.disabled) {
      btnCalcular.click();
    }
  }
}

const btnCalcular = document.getElementById('calcular');
const sistemas    = document.getElementById('menu');

btnCalcular.onclick = () => {
  const congruencias = [];

  for (const congruencia of sistemas.children) {
    if (congruencia.localName === 'button') break;
    const valor = congruencia.children.item(0).value;

    if (!valor.match(padraoCongruencia)) {
      // resultado.innerText = 'Algo de errado não está certo em uma dessas congruências aí prc';
      return;
    }
    
    const [, a, c, posm1, posm2] = padraoCongruencia.exec(valor);
    const m = posm1 || posm2;

    // validar se a é 0, se for meter a pata no arrombado
    congruencias.push({ a: a || 1, c, m });
  }
  
  // TODO: checar se tem solução ou não
  const incorretos = resolverSistema(congruencias);
  if (incorretos) {
    // TODO
  }
}

function adicionaNovaCongruencia(noAnterior) {
  const numeroCongruencia = sistemas.children.length;

  const congruenciaDiv      = document.createElement('div');
    congruenciaDiv.id    = `congruencia-linear-${numeroCongruencia}`;
    congruenciaDiv.style = 'margin-bottom:5px;';
    // congruenciaDiv.classList.add('...');

    const addCongruenciaBtn = document.createElement('button');
      addCongruenciaBtn.id        = `adicionar-congruencia-${numeroCongruencia}`;
      addCongruenciaBtn.title     = 'Adicionar Congruência ao Sistema';
      addCongruenciaBtn.innerHTML = '<i class="fa fa-plus"></i>';
      addCongruenciaBtn.className = 'out out-info ml-2';
      addCongruenciaBtn.onclick   = () => adicionaNovaCongruencia(congruenciaDiv);

    const rmCongruenciaBtn  = document.createElement('button');
      rmCongruenciaBtn.id        = `remover-congruencia-${numeroCongruencia}`;
      rmCongruenciaBtn.title     = 'Remover Congruência do Sistema';
      rmCongruenciaBtn.innerHTML = '<i class="fa fa-trash"></i>';
      rmCongruenciaBtn.className = 'out out-warning ml-2';
      rmCongruenciaBtn.onclick   = () => sistemas.removeChild(congruenciaDiv);

    const congruenciaInput = document.createElement('input');
      congruenciaInput.id        = `valor-congruencia-${numeroCongruencia}`;
      congruenciaInput.type      = 'text';
      congruenciaInput.onkeydown = e => {if (!e.ctrlKey && e.key === 'Enter') addCongruenciaBtn.click()};

    congruenciaDiv.appendChild(congruenciaInput);
    congruenciaDiv.appendChild(addCongruenciaBtn);
    congruenciaDiv.appendChild(rmCongruenciaBtn);

  if (noAnterior) {
    sistemas.insertBefore(congruenciaDiv, noAnterior.nextSibling);
    congruenciaInput.focus();
  } else {
    sistemas.insertBefore(congruenciaDiv, btnCalcular);
  }
}

// Cria a primeira congruência por padrão
adicionaNovaCongruencia();