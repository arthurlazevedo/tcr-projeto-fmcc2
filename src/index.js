import { resolverSistema } from "./resultados.js";
import { ehNumero } from "./utilitarios/utilitarios.js";

document.onkeydown = e => {
  if (e.ctrlKey && e.key === 'Enter') {
    if (!btnCalcular.disabled) btnCalcular.click();
    e.stopPropagation();
  }
}

const btnCalcular = document.getElementById('calcular');
const sistemas    = document.getElementById('menu');

btnCalcular.onclick = () => {
  const congruencias = [];

  for (const congruencia of sistemas.children) {
    const [a, c, m] = Array.from(congruencia.querySelectorAll('input')).map(input => input.value);

    if (!c || !m) break;

    // TODO: validar se a é 0, se for meter a pata no arrombado
    congruencias.push({ a: a || 1, c, m });
  }
  
  // TODO: checar se tem solução ou não
  const incorretos = resolverSistema(congruencias);
  if (incorretos) {
    // TODO
  }
}

function atalhosTecladoCongruencia(e) {
  // TODO: confirmar se não vai ter problemas assim
  const congruencia   = e.target.parentElement;
  const proximoNo     = congruencia.nextElementSibling;
  const noAnterior    = congruencia.previousElementSibling;
  const rmCongruencia = congruencia.querySelector('.lixeira');

  switch (e.key) {
    case 'Enter':
      if (!e.ctrlKey) {
        adicionaNovaCongruencia(congruencia);
        e.stopPropagation();
      }
      break;
    case 'Backspace':
      if (e.shiftKey && noAnterior) {
        rmCongruencia.click();
        noAnterior.focus();
        e.stopPropagation();
      }
      break;
    case 'Delete':
      if (noAnterior) {
        rmCongruencia.click();
        noAnterior.focus();
        e.stopPropagation();
      }
      break;
    case 'ArrowUp':
      if (noAnterior) {
        noAnterior.focus();
        e.stopPropagation();
      }
      break;
    case 'ArrowDown':
      // TODO: ter uma parte mais interna para os sistemas
      if (proximoNo.className === 'congruencia') {
          proximoNo.focus();
      } else {
        adicionaNovaCongruencia(congruencia);
      }
      e.stopPropagation();
      break;
  }
}

function adicionaNovaCongruencia(noAnterior) {
  const numeroCongruencia = sistemas.children.length;

  const congruenciaDiv = document.createElement('div');
    congruenciaDiv.id        = `congruencia-linear-${numeroCongruencia}`;
    congruenciaDiv.tabIndex  = -1;
    congruenciaDiv.className = 'congruencia';
    congruenciaDiv.onkeydown = atalhosTecladoCongruencia;
    congruenciaDiv.onfocus   = e => (console.log(e), a.focus());

    const erroCongruencia = document.createElement('div');
      erroCongruencia.id         = `erro-congruencia-${numeroCongruencia}`;  
      erroCongruencia.className  = 'relatorio-erro';
      erroCongruencia.dataset.id = numeroCongruencia;
    
    const a   = criaInputCongruencia('a', numeroCongruencia, 'x');
    const x   = criaElementoSimples('i', 'x');
    const eq  = criaElementoSimples('span', ' ≡ ');
    const c   = criaInputCongruencia('c', numeroCongruencia, '(');
    const mod = criaElementoSimples('i', '(mod ');
    const m   = criaInputCongruencia('m', numeroCongruencia);
    const fim = criaElementoSimples('i', ')');

    const rmCongruencia  = document.createElement('i');
      rmCongruencia.id        = `remover-congruencia-${numeroCongruencia}`;
      rmCongruencia.className = 'fa fa-trash fa-sm lixeira';
      rmCongruencia.title     = 'Remover Congruência do Sistema';
      rmCongruencia.onclick   = () => sistemas.removeChild(congruenciaDiv);

    congruenciaDiv.appendChild(erroCongruencia);
    congruenciaDiv.appendChild(a);
    congruenciaDiv.appendChild(x);
    congruenciaDiv.appendChild(eq);
    congruenciaDiv.appendChild(c);
    congruenciaDiv.appendChild(mod);
    congruenciaDiv.appendChild(m);
    congruenciaDiv.appendChild(fim);
    congruenciaDiv.appendChild(rmCongruencia);

  if (noAnterior) {
    sistemas.insertBefore(congruenciaDiv, noAnterior.nextElementSibling);
    a.focus();
  } else {
    sistemas.insertBefore(congruenciaDiv, btnCalcular);
  }
}


function criaElementoSimples(elemento, conteudo) {
  const el = document.createElement(elemento);
    el.innerText = conteudo;

  return el;
}


function criaInputCongruencia(nome, indice, teclaProximo) {
  const input = document.createElement('input');
    input.id            = `${nome}-${indice}`;
    input.type          = 'text';
    input.onkeydown     = e => focaProximoInput(e, teclaProximo);
    input.placeholder   = nome;
    input.onbeforeinput = adaptaInput;

  return input;
}


function focaProximoInput(e, teclaProximo) {
  if (e.key.toUpperCase() === teclaProximo?.toUpperCase()) {
    const inputs = e.target.parentElement.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === e.target) {
        inputs[i + 1].focus();
      }
    }
  }
}

function adaptaInput(e) {
  if (!ehNumero(e.data)) {
    e.preventDefault();
    return;
  }

  const input = e.target;
  let quantNums = input.value.length;

  if (e.inputType === 'deleteContentBackward') quantNums = Math.max(quantNums - 2, 0);

  if (!quantNums || e.inputType === 'deleteWordBackward') {
    input.style.width = '21px';
  } else if (quantNums < 5) {
    input.style.width = (quantNums + 1) * 13 + 'px';
  }
}

// Cria a primeira congruência por padrão
adicionaNovaCongruencia();