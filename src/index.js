import { temSolucao } from "./nerdolice/congruencias.js";
import { resolverSistema } from "./resultados.js";
import { ehNumero } from "./utilitarios/utilitarios.js";

document.onkeydown = e => {
  if (e.ctrlKey && e.key === 'Enter') {
    if (!btnCalcular.disabled) btnCalcular.click();
    e.stopPropagation();
  }
}

const btnCalcular = document.getElementById('calcular');
const sistemas    = document.getElementById('sistemas');

btnCalcular.onclick = () => {
  const sistema = [];

  for (const congruencia of sistemas.children) {
    const [a, c, m] = valoresCongruencia(congruencia);

    if (temErro(congruencia)) continue;
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
      if (e.shiftKey && noAnterior) {
        rmCongruencia.click();
        e.stopPropagation();
        e.preventDefault();
      }
      break;

    case 'Delete':
      if (noAnterior) {
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
  const numeroCongruencia = sistemas.children.length + 1;

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
        if (congruenciaDiv.previousElementSibling) {
          const noAnterior = congruenciaDiv.previousElementSibling;
          sistemas.removeChild(congruenciaDiv);

          if (noAnterior) {
            ajustaIndice(noAnterior);
            noAnterior.click();
          }
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
    a.focus();
  } else {
    sistemas.appendChild(congruenciaDiv);
  }
}


function ajustaIndice(congruencia) {
  while (congruencia.nextElementSibling !== null) {
    congruencia = congruencia.nextElementSibling;

    const numeroAjustado = parseInt(congruencia.id.replace('congruencia-linear-', '')) - 1;

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
  erroCong.innerHTML = '';

  const [a, c, m] = valoresCongruencia(congruencia);

  if (isNaN(c) && isNaN(m)) {
    const iconeAviso = criaIconeTriangulo('perigo', 'Congruência mal-formada');
    erroCong.appendChild(iconeAviso);
    return;
  }
  
  if (isNaN(c)) {
    const iconeAviso = criaIconeTriangulo('perigo', 'Valor inválido para a congruência linear');
    erroCong.appendChild(iconeAviso);
    return;
  }

  if (isNaN(m) || m === 0) {
    const iconeAviso = criaIconeTriangulo('perigo', 'Módulo inválido para a congruência linear');
    erroCong.appendChild(iconeAviso);
    return;
  }

  if (!temSolucao(isNaN(a) ? 1 : a, c, m)) {
    const iconeAviso = criaIconeTriangulo('perigo', 'A congruência linear não possui solução');
    erroCong.appendChild(iconeAviso);
    return;
  }

  if (a === 0 && c % m === 0) {
    const iconeDica = criaIconeTriangulo('aviso', 'A congruência possui infinitas soluções');
    erroCong.appendChild(iconeDica);
  }
}


function temErro(congruencia) {
  const [a, c, m] = valoresCongruencia(congruencia);

  if (isNaN(c) || isNaN(m) || m === 0) return true;
  if (!temSolucao(isNaN(a) ? 1 : a, c, m)) return true;

  return false;
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
  if ((!ehNumero(e.data) || !e.data?.trim()) && e.data !== null) {
    e.preventDefault();
    return;
  }

  const input = e.target;
  let quantNums = input.value.length;

  if (e.inputType === 'deleteContentBackward') quantNums = Math.max(quantNums - 2, 0);
  if (quantNums === 7) return; // reportar que só pode até essa quant aí  

  if (!quantNums || e.inputType === 'deleteWordBackward') {
    input.style.width = '21px';
  } else if (quantNums < 4) {
    input.style.width = (quantNums + 1) * 14.5 + 'px';
  }
}

// Cria a primeira congruência por padrão
adicionaNovaCongruencia();