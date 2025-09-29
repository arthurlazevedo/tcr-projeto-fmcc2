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
const adicaoCong  = document.getElementById('acoes-congruencias');
const opcoesCong  = document.getElementById('menu-opcoes');
const sistemas    = document.getElementById('sistemas');

adicaoCong.onblur = () => {
  opcoesCong.classList.add('escondido');
}

adicaoCong.onclick = e => {
  if (e.target !== adicaoCong) return;

  if (opcoesCong.classList.contains('escondido')) {
    opcoesCong.classList.remove('escondido');
  } else {
    adicaoCong.blur();
  }
}

opcoesCong.firstElementChild.onclick = () => {
  adicionaNovaCongruencia();
  const a = sistemas.lastElementChild.querySelector('input');
  a.focus();
};

opcoesCong.children[1].onclick = e => {
  if (e.target.classList.contains('desabilitado')) return;

  const mods = [];

  let congruenciaSubstituir = null;
  for (const congruencia of sistemas.children) {
    const erro = erroCongruencia(congruencia);

    if (erro.length) {
      if (erro[0] === errosCongruencias.errada) congruenciaSubstituir = congruencia;
      continue;
    }

    const mod = parseInt(congruencia.querySelectorAll('input')[2].value);
    mods.push(mod);
  }

  const modCoprimo = numeroCoprimoA(mods);
  const numeroA    = numeroCoprimoA([modCoprimo]);

  const congruenciaAdicionada = adicionaNovaCongruencia(congruenciaSubstituir, true);

  const [a, c, m] = congruenciaAdicionada.querySelectorAll('input');

  a.value = numeroA;
  a.dispatchEvent(new Event('beforeinput'));

  c.value = Math.floor(Math.random() * modCoprimo);
  c.dispatchEvent(new Event('beforeinput'));

  m.value = modCoprimo;
  m.dispatchEvent(new Event('beforeinput'));

  a.focus();
}

opcoesCong.lastElementChild.onclick = () => {
  sistemas.replaceChildren();
  adicionaNovaCongruencia();
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
    sistema.push({ a: BigInt(a || 1), c: BigInt(c), m: BigInt(m) });
  }

  if (sistema.length) resolverSistema(sistema);
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
    case 'Delete':
      if (!e.shiftKey && e.key === 'Backspace') break;

      rmCongruencia.click();
      e.stopPropagation();
      e.preventDefault();
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

function adicionaNovaCongruencia(noAnterior, substituir = false) {
  const numeroCongruencia = noAnterior ?
    parseInt(noAnterior.id.replace('congruencia-linear-', '')) + (substituir ? 0 : 1) :
    sistemas.children.length + 1;

  const congruenciaDiv = document.createElement('div');
    congruenciaDiv.id        = `congruencia-linear-${numeroCongruencia}`;
    congruenciaDiv.tabIndex  = -1
    congruenciaDiv.className = 'congruencia';
    congruenciaDiv.onclick   = focaInputMaisProximo;
    congruenciaDiv.onkeydown = atalhosTecladoCongruencia;
    congruenciaDiv.addEventListener('focusout', validaCongruencia); // Por algum motivo, não tem suporte para isso como uma propriedade e tem que ser feito assim, js né

    const relatorioErro = document.createElement('div');
      relatorioErro.id         = `relatorio-erro-${numeroCongruencia}`;
      relatorioErro.className  = 'relatorio-erro';
      relatorioErro.dataset.id = numeroCongruencia;

    const a = criaInputCongruencia('a', numeroCongruencia, { proximo: 'x' })

    const rmCongruencia  = document.createElement('i');
      rmCongruencia.id        = `remover-congruencia-${numeroCongruencia}`;
      rmCongruencia.title     = 'Remover Congruência do Sistema';
      rmCongruencia.className = 'fa fa-trash fa-sm lixeira';
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
          mudaStatusAddCongValida();
          mudaStatusBtnCalcular();
        } else if (erroCongruencia(congruenciaDiv)[0] !== errosCongruencias.errada) {
          sistemas.removeChild(congruenciaDiv);
          adicionaNovaCongruencia();
          mudaStatusBtnCalcular();
        }
      }

  congruenciaDiv.appendChild(relatorioErro);
  congruenciaDiv.appendChild(a);
  congruenciaDiv.appendChild(criaElementoSimples('i', 'x'));
  congruenciaDiv.appendChild(criaElementoSimples('span', ' ≡ '));
  congruenciaDiv.appendChild(criaInputCongruencia('c', numeroCongruencia, { proximo: '(', anterior: 'x' }));
  congruenciaDiv.appendChild(criaElementoSimples('i', '(mod '));
  congruenciaDiv.appendChild(criaInputCongruencia('m', numeroCongruencia, { anterior: '(' }));
  congruenciaDiv.appendChild(criaElementoSimples('i', ')'));
  congruenciaDiv.appendChild(rmCongruencia);

  if (noAnterior) {
    if (substituir) {
      sistemas.replaceChild(congruenciaDiv, noAnterior);
    } else {
      sistemas.insertBefore(congruenciaDiv, noAnterior.nextElementSibling);
      ajustaIndice(congruenciaDiv, '+');
    }
  } else {
    sistemas.appendChild(congruenciaDiv);
  }

  mudaStatusAddCongValida();
  a.focus();
  return congruenciaDiv;
}


function ajustaIndice(congruencia, op) {
  while (congruencia.nextElementSibling !== null) {
    congruencia = congruencia.nextElementSibling;

    const numeroAjustado = parseInt(congruencia.id.replace(/\D/g, '')) + (op === '+' ? 1 : -1);

    congruencia.id = `congruencia-linear-${numeroAjustado}`;
    congruencia.querySelectorAll('input').forEach(input => (input.id = `${input.id[0]}-${numeroAjustado}`));

    const relatorioErro = congruencia.getElementsByClassName('relatorio-erro')[0];
    relatorioErro.id = `relatorio-erro-${numeroAjustado}`
    relatorioErro.dataset.id = numeroAjustado;

    const lixeiraIcone = congruencia.getElementsByClassName('lixeira')[0];
    lixeiraIcone.id = `remover-congruencia-${numeroAjustado}`;
  }
}


function mudaStatusAddCongValida() {
  const addCongValida = opcoesCong.children[1];
  const congruencias  = congruenciasValidas();

  if (congruencias.length >= 9) {
    addCongValida.title = 'Limite máximo de congruências (10) para a adição aleatória atingido';
    addCongValida.classList.add('desabilitado');
  } else {
    addCongValida.title = 'Adiciona uma congruência válida ao sistema';
    addCongValida.classList.remove('desabilitado');
  }
}


function mudaStatusBtnCalcular() {
  const congruenciasNaoErradas = congruenciasValidas(true);
  btnCalcular.disabled = congruenciasNaoErradas.length !== sistemas.children.length;
}


function criaElementoSimples(elemento, conteudo) {
  const el = document.createElement(elemento);
    el.tabIndex  = -1;
    el.innerText = conteudo;

  return el;
}


function criaInputCongruencia(nome, indice, { proximo, anterior }) {
  const input = document.createElement('input');
    input.id            = `${nome}-${indice}`;
    input.type          = 'text';
    input.placeholder   = nome;
    input.onfocus       = e => e.target.selectionStart = e.target.selectionEnd;
    input.onkeydown     = e => focaInputAoLado(e, proximo, anterior);
    input.onbeforeinput = adaptaInput;

  return input;
}


function valoresCongruencia(congruencia) {
  return Array.from(congruencia.querySelectorAll('input')).map(input => parseInt(input.value));
}


function congruenciasValidas(considerarAvisos = false) {
  const congruenciasValidas = []
  for (const congruencia of sistemas.children) {
    const erro = erroCongruencia(congruencia);

    if (!erro.length || (considerarAvisos && erro[1] === 'aviso')) {
      congruenciasValidas.push(congruencia);
    }
  }

  return congruenciasValidas;
}


function validaCongruencia(e) {
  const congruencia = e.target.parentElement;
  const erroCong    = congruencia.firstChild;

  if (congruencia.contains(e.relatedTarget) || congruencia === sistemas) return;
  erroCong.replaceChildren();

  const erro = erroCongruencia(congruencia);
  if (erro.length) adicionaErro(erroCong, erro);

  if (erro[1] === 'aviso' || !erro.length) mudaStatusBtnCalcular();
}


function adicionaErro(erroCong, tipoErro) {
  const iconeErro = criaIcone(tipoErro[1], tipoErro[0]);
  erroCong.appendChild(iconeErro);

  if (tipoErro[1] === 'perigo') btnCalcular.disabled = true;
}


function erroCongruencia(congruencia) {
  const [a, c, m] = valoresCongruencia(congruencia);
  const cNaN = isNaN(c);
  const mNaN = isNaN(m);

  if (cNaN && mNaN) return [errosCongruencias.errada, 'aviso'];
  if (mNaN || m === 0) return [errosCongruencias.modulo, 'perigo'];
  if (cNaN) return [errosCongruencias.cInvalido, 'perigo'];

  if (!temSolucao(isNaN(a) ? 1 : a, c, m)) return [errosCongruencias.semSolucao, 'perigo'];
  if ((a % m === 0 && c % m === 0) || m === 1) return [errosCongruencias.infinito, 'aviso'];

  return [];
}


function criaIcone(classe, hint) {
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

  while (congruencia.parentElement !== sistemas) {
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


function focaInputAoLado(e, teclaProximo, teclaAnterior) {
  const inputAtual = e.target;
  const tecla      = e.key.toUpperCase();

  const ehTeclaProximo  = tecla === teclaProximo?.toUpperCase() || e.ctrlKey && inputAtual.selectionStart === inputAtual.value.length && e.key === 'ArrowRight';
  const ehTeclaAnterior = tecla === teclaAnterior?.toUpperCase() || e.ctrlKey && inputAtual.selectionStart === 0 && e.key === 'ArrowLeft';

  if (ehTeclaProximo || ehTeclaAnterior) {
    const inputs = inputAtual.parentElement.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === e.target) {
        const desvio = ehTeclaAnterior ? -1 : 1;
        if (inputs[i + desvio]) inputs[i + desvio].focus();
        break;
      }
    }
  }
}

function adaptaInput(e) {
  if ((!ehNumero(e.data) || !e.data?.trim()) && e.data !== null && e.data !== '-' && e.isTrusted) {
    e.preventDefault();
    return;
  }

  if (e.data === '-' && e.target.selectionStart !== 0) {
    e.preventDefault();
    return;
  }

  const input   = e.target;
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