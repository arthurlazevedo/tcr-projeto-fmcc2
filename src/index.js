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
const sistemas    = document.getElementById('sistemas');

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
      addCongruenciaBtn.innerText = '➕';
      addCongruenciaBtn.style     = 'margin-right:2px;';
      addCongruenciaBtn.onclick   = () => adicionaNovaCongruencia(congruenciaDiv);

    const rmCongruenciaBtn  = document.createElement('button');
      rmCongruenciaBtn.id        = `remover-congruencia-${numeroCongruencia}`;
      rmCongruenciaBtn.title     = 'Remover Congruência do Sistema';
      rmCongruenciaBtn.innerText = '🗑️';
      rmCongruenciaBtn.onclick   = () => sistemas.removeChild(congruenciaDiv);

    const congruenciaInput = document.createElement('input');
      congruenciaInput.id        = `valor-congruencia-${numeroCongruencia}`;
      congruenciaInput.type      = 'text';
      congruenciaInput.style     = 'margin-right:2px;';
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









// imitador de "caret": https://codepen.io/ArtemGordinsky/pen/DgyQKy | https://stackoverflow.com/questions/61088821/draw-virtual-fake-carret-in-html-javascript-css
// usar insertBefore para mover o "caret", referência: https://developer.mozilla.org/pt-BR/docs/Web/API/Node/insertBefore

// const botaoCalcular = document.getElementById('calcular');
// const inputInverso  = document.getElementById('inverso');
// const resultado     = document.getElementById('resultado-inverso');

// inputInverso.onbeforeinput = e => {
//   const valor = e.target.dataset.value;

//   switch (e.inputType) {
//     case 'deleteContentBackward':
//       inputInverso.dataset.value = valor.slice(0, valor.length - 2 || 0);
//       break;
//     case 'insertParagraph':
//       // botaoAdicionar.click();
//       break;
//     case 'insertText':
//       inputInverso.dataset.value += e.data;
//       inputInverso.innerHTML = '<math><semantics><mrow><mrow>  <msup><mi>x</mi><mn>2</mn></msup>  <mo>+</mo>  <mrow>    <mn>4</mn><mo>&InvisibleTimes;</mo><mi>x</mi>  </mrow>  <mo>+</mo>  <mn>4</mn></mrow><mo>=</mo><mn>0</mn></mrow></semantics></math>'
//       break;
//     default:
//       console.log(e.inputType);
//   }
// }

// inputInverso.oninput = () => {
//   const html = inputInverso.innerHTML;
//   console.log(inputInverso.innerHTML);
//   inputInverso.textContent = '';
//   inputInverso.innerHTML = html;
// }


// botaoCalcular.onclick = () => {
//   const valor = inputInverso.textContent;
//   console.log(valor);
//   const { numero, mod } = separaValores(valor);
//   const inverso = inversoModular(numero, mod);
//   if (inverso !== -1) {
//     resultado.innerText = `O inverso de ${numero} (mod ${mod}) é ${inversoModular(numero, mod)}`;
//   } else {
//     resultado.innerText = 'O inverso não existe arrombado, eles não são coprimos';
//   }
// }