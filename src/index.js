import { temSolucao } from "./nerdolice/congruencias.js";
import { resolverSistema } from "./resultados.js";
import { ehNumero } from "./utilitarios/utilitarios.js";
import { errosCongruencias } from "./constantes.js";
import { numeroCoprimoA } from "./nerdolice/matematica.js";

document.onkeydown = e => {
  if (e.ctrlKey && e.key === 'Enter') {
    if (!btnCalcular.disabled) btnCalcular.click();
    e.stopPropagation();
  }
}

const btnCalcular = document.getElementById('calcular');
const adicaoCong  = document.getElementById('adicionar-congruencias');
const opcoesCong  = document.getElementById('opcoes-adicao');
const sistemas    = document.getElementById('sistemas');

adicaoCong.onfocus = () => opcoesCong.classList.remove('escondido');
adicaoCong.onblur = () => opcoesCong.classList.add('escondido')

opcoesCong.firstElementChild.onclick = () => {
  adicionaNovaCongruencia();
  const a = sistemas.lastElementChild.querySelector('input');
  a.focus();
};

opcoesCong.lastElementChild.onclick = e => {
  if (sistemas.children.length >= 6) {
    opcoesCong.lastElementChild.title = 'Desabilitado pois estourou o limite';
    opcoesCong.lastElementChild.classList.add('desabilitado');
    e.preventDefault();
    return;
  }
  
  const mods = [];
  for (const congruencia of sistemas.children) {
    const mod = congruencia.querySelectorAll('input')[2].value;
    if (!mod) continue;

    mods.push(ehNumero(mod) ? parseInt(mod) : 0);
  }

  const modCoprimo = numeroCoprimoA(mods);
  const numeroA    = numeroCoprimoA([modCoprimo]);

  adicionaNovaCongruencia();
  const [a, c, m] = sistemas.lastElementChild.querySelectorAll('input');
  a.value = numeroA;
  a.dispatchEvent(new Event('beforeinput'));
  c.value = Math.floor(Math.random() * modCoprimo);
  c.dispatchEvent(new Event('beforeinput'));
  m.value = modCoprimo;
  m.dispatchEvent(new Event('beforeinput'));
  a.focus();
}

btnCalcular.onclick = () => {
  const sistema = [];

  for (const congruencia of sistemas.children) {
    const [a, c, m] = valoresCongruencia(congruencia);

    const erro = erroCongruencia(congruencia)
    if (erro[1] === 'perigo') {
      adicionaErro(congruencia.firstChild, erro);
      return;
    }

    if (erro[0]) continue;
    sistema.push({ a: a || 1, c, m });
  }

  if (sistema.length) {
    resolverSistema(sistema);
  } else {
    // TODO
  }
}

function atalhosTecladoCongruencia(e) {
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
      if (e.shiftKey && (noAnterior || proximoNo)) {
        rmCongruencia.click();
        e.stopPropagation();
        e.preventDefault();
      }
      break;

    case 'Delete':
      if (noAnterior || proximoNo) {
        rmCongruencia.click();
        e.stopPropagation();
        e.preventDefault();
      }
      break;

    case 'ArrowUp':
      if (noAnterior) {
        noAnterior.click();
        e.stopPropagation();
        e.preventDefault();
      }
      break;

    case 'ArrowDown':
      if (proximoNo) proximoNo.click();
      else adicionaNovaCongruencia(congruencia);

      e.stopPropagation();
      break;
  }
}

function adicionaNovaCongruencia(noAnterior) {
  const numeroCongruencia = noAnterior ? parseInt(noAnterior.id.replace('congruencia-linear-', '')) + 1 : sistemas.children.length + 1;

  const congruenciaDiv = document.createElement('div');
    congruenciaDiv.id        = `congruencia-linear-${numeroCongruencia}`;
    congruenciaDiv.className = 'congruencia';
    congruenciaDiv.onkeydown = atalhosTecladoCongruencia;
    congruenciaDiv.onclick   = focaInputMaisProximo;

    // Por algum motivo, não tem suporte para isso como uma propriedade e tem que ser feito assim, js né
    congruenciaDiv.addEventListener('focusout', validaCongruencia);

    const erroCongruencia = document.createElement('div');
      erroCongruencia.id         = `erro-congruencia-${numeroCongruencia}`;  
      erroCongruencia.className  = 'relatorio-erro';
      erroCongruencia.dataset.id = numeroCongruencia;

    const a = criaInputCongruencia('a', numeroCongruencia, 'x')

    const rmCongruencia  = document.createElement('i');
      rmCongruencia.id        = `remover-congruencia-${numeroCongruencia}`;
      rmCongruencia.className = 'fa fa-trash fa-sm lixeira';
      rmCongruencia.title     = 'Remover Congruência do Sistema';
      rmCongruencia.onclick   = () => {
        const noAnterior = congruenciaDiv.previousElementSibling;
        const proximoNo = congruenciaDiv.nextElementSibling;
        
        if (noAnterior || proximoNo) {
          if (noAnterior) {
            ajustaIndice(noAnterior, '-');
            noAnterior.click();
          } else if (proximoNo) {
            ajustaIndice(congruenciaDiv, '-');
            proximoNo.click();
          }
          sistemas.removeChild(congruenciaDiv);
        }
      }

  congruenciaDiv.appendChild(erroCongruencia);
  congruenciaDiv.appendChild(a);
  congruenciaDiv.appendChild(criaElementoSimples('i', 'x'));
  congruenciaDiv.appendChild(criaElementoSimples('span', ' ≡ '));
  congruenciaDiv.appendChild(criaInputCongruencia('c', numeroCongruencia, '('));
  congruenciaDiv.appendChild(criaElementoSimples('i', '(mod '));
  congruenciaDiv.appendChild(criaInputCongruencia('m', numeroCongruencia));
  congruenciaDiv.appendChild(criaElementoSimples('i', ')'));
  congruenciaDiv.appendChild(rmCongruencia);

  if (noAnterior) {
    sistemas.insertBefore(congruenciaDiv, noAnterior.nextElementSibling);
    ajustaIndice(congruenciaDiv, '+');
  } else {
    sistemas.appendChild(congruenciaDiv);
  }
  a.focus();
}


function ajustaIndice(congruencia, op) {
  while (congruencia.nextElementSibling !== null) {
    congruencia = congruencia.nextElementSibling;

    const numeroAjustado = parseInt(congruencia.id.replace('congruencia-linear-', '')) + (op === '+' ? 1 : -1);

    congruencia.id = `congruencia-linear-${numeroAjustado}`;
    congruencia.querySelectorAll('input').forEach(input => (input.id = `${input.id[0]}-${numeroAjustado}`));

    const relatorioErro = congruencia.getElementsByClassName('relatorio-erro')[0];
    relatorioErro.dataset.id = numeroAjustado;

    const lixeiraIcone = congruencia.getElementsByClassName('lixeira')[0];
    lixeiraIcone.id = `remover-congruencia-${numeroAjustado}`;
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


function validaCongruencia(e) {
  const congruencia = e.target.parentElement;
  const erroCong    = congruencia.firstChild;
  if (congruencia.contains(e.relatedTarget)) return;
  erroCong.replaceChildren();

  const erro = erroCongruencia(congruencia);

  if (erro.length) {
    adicionaErro(erroCong, erro);
    if (erro[1] === 'perigo') return;
  }
}


function adicionaErro(erroCong, tipoErro) {
  const iconeErro = criaIconeTriangulo(tipoErro[1], tipoErro[0]);
  erroCong.appendChild(iconeErro);

  if (tipoErro[1] === 'perigo') btnCalcular.disabled = true;
}


function erroCongruencia(congruencia) {
  const [a, c, m] = valoresCongruencia(congruencia);
  const cNaN = isNaN(c);
  const mNaN = isNaN(m);

  if (cNaN && mNaN) return [errosCongruencias.errada, 'aviso'];
  if (mNaN || m === 0) return [errosCongruencias.modulo, 'perigo'];
  if (cNaN) return [errosCongruencias.modulo, 'perigo'];

  if (!temSolucao(isNaN(a) ? 1 : a, c, m)) return [errosCongruencias.semSolucao, 'perigo'];
  if (a === 0 && c % m === 0) return [errosCongruencias.infinito, 'aviso'];

  return [];
}


function valoresCongruencia(congruencia) {
  return Array.from(congruencia.querySelectorAll('input')).map(input => parseInt(input.value));
}  


function criaIconeTriangulo(classe, hint) {
  const container = document.createElement('span');
    container.dataset.hint = hint;
    const icone = document.createElement('i');
      const classeIcone = classe === 'perigo' ? 'fa-exclamation-triangle' : 'fa-info-circle';
      icone.className = `fa ${classeIcone} ${classe}`;

    container.appendChild(icone);
  return container;
}


function focaInputMaisProximo(e) {
  let congruencia = e.target;
  const posX      = e.clientX;

  if (congruencia.parentElement !== sistemas) {
    if (congruencia.id) {
      e.preventDefault();
      return;
    }
    congruencia = congruencia.parentElement;
  }

  const inputs       = congruencia.querySelectorAll('input');
  let menorDistancia = [Number.MAX_SAFE_INTEGER, 0];
  for (let i = 0; i < inputs.length; i++) {
    const { left, right } = inputs[i].getBoundingClientRect();
    const distancia = Math.min(Math.abs(left - posX), Math.abs(right - posX));

    if (distancia < menorDistancia[0]) menorDistancia = [distancia, i];
  }

  inputs[menorDistancia[1]].focus();
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
  if ((!ehNumero(e.data) || !e.data?.trim()) && e.data !== null && e.isTrusted) {
    e.preventDefault();
    return;
  }

  const input = e.target;
  let quantNums = input.value.length;

  if (e.inputType === 'deleteContentBackward') quantNums = Math.max(quantNums - 2, 0);
  if ((quantNums + 1) === 6 && e.data) {
    e.preventDefault();
    return;
  }

  if (!quantNums || e.inputType === 'deleteWordBackward') {
    input.style.width = '21px';
  } else {
    input.style.width = (e.isTrusted ? quantNums + 1 : quantNums) * 14.5 + 'px';
  }
}

// Cria a primeira congruência por padrão
adicionaNovaCongruencia();