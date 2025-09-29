## Solucionador Teorema Chinês do Resto

Site criado para o projeto final da disciplina de **Fundamentos de Matemática para a Ciência da Computação 2**.

Uma simples aplicação Web escrita em *Vanilla JS* para fazer o cálculo do Teorema Chinês do Resto (**TCR**), apresentando um passo a passo da solução, quando há uma, ou explicando o problema com o sistema (ou a congruência em si) quando não possível solucioná-la por esse método.

Foi utilizado [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML) para formatar os cálculos matemáticos de maneira automática, além de CSS para estilização do site e JavaScript para manipulação direta da DOM.

## O Teorema Chinês do Resto

O Teorema Chinês do Resto é uma ferramenta matemática utilizada para solucionar, de maneira eficiente, um sistema de congruências lineares, caso seguidas as seguintes restrições:
- É necessário que as congruências estejam na forma canônica, ou seja, siga a forma: *x* ≡ *c*<sub>i</sub> (*mod m*<sub>i</sub>)
- É necessário que todos os módulos do sistema sejam coprimos par a par, ou seja, ∀m<sub>i</sub>, m<sub>j</sub>; MDC(m<sub>i</sub>, m<sub>j</sub>) = 1.

Seguidas as condições listadas, podemos calcular a solução do sistema de n congruências seguindo os passos:
1. Cálculo do M, mod da solução final, sendo M = m<sub>1</sub> · m<sub>2</sub> · … · m<sub>n</sub>

2. Identificação do c<sub>i</sub> de cada congruência
3. Cálculo do N<sub>i</sub> de cada congruência, sendo N<sub>i</sub> = <sup>M</sup>/<sub>m<sub>i</sub></sub>
4. Cálculo do d<sub>i</sub> de cada congruência, sendo d<sub>i</sub> ≡ N<sub>i</sub><sup>-1</sup> (*mod m*<sub>i</sub>)
5. Cálculo do da solução final, sabendo que: x ≡ c<sub>1</sub> · N<sub>1</sub> · d<sub>1</sub> + ... + c<sub>n</sub> · N<sub>n</sub> · d<sub>n</sub> (*mod M*)

Dessa forma, nosso site explica detalhadamente a solução para cada etapa do TCR, fazendo um pré-processamento adicional antes disso para transformar as soluções em sua forma canônica, caso necessário.

## Membros do Grupo
- Anderson Breno
- Arthur Ledra
- Carlos Arthur
- Joeliton Elias

## Acesso ao site

Foi feito deploy do site via GitHubPages, logo, ele pode ser acessado via esse [link](https://arthurlazevedo.github.io/tcr-projeto-fmcc2/)

## Rodar localmente

Caso deseje rodar o projeto localmente, pode ser feito de maneira fácil iniciando um servidor em *python*

Para tal, navegue até o diretório onde o repositório está localizado e rode:

```shell
$ python3 -m http.server
```

Ou, caso esteja no windows:

```shell
$ python -m http.server
```

Depois, digite `localhost:8000` no seu navegador