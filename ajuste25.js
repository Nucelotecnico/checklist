
//listar nome de todas a variaveis do localStorage
const listarVariaveisLocalStorage = () => {
    const variaveis = Object.keys(localStorage);
    console.log("Variáveis do localStorage:", variaveis);
};





window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoajustesGDhtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    const botaoParametro2 = document.getElementById("botaoajuste25html");
    if (botaoParametro2) {
        botaoParametro2.style.backgroundColor = "#cf0808";
    }
    // -----------------manter o botão vermelho selecionado-------------------

    const tensaoPrimariaFF = localStorage.getItem("tensaoprimariaFF");
    const tensaoPrimariaFN = localStorage.getItem("tensaoprimariaFN");
    const tensaoSecundariaFFTP = localStorage.getItem("tensaoSecundariaFFTP");
    const tensaoSecundariaFNTP = localStorage.getItem("tensaoSecundariaFNTP");

    const tensaoPrimariaLinhaHtml = document.getElementById("tensao-primaria-linha-html");
    if (tensaoPrimariaLinhaHtml && tensaoPrimariaFF) {
        tensaoPrimariaLinhaHtml.textContent = tensaoPrimariaFF + " V";
    }

    const tensaoPrimariaFaseHtml = document.getElementById("tensao-primaria-fase-html");
    if (tensaoPrimariaFaseHtml && tensaoPrimariaFN) {
        tensaoPrimariaFaseHtml.textContent = tensaoPrimariaFN + " V";
    }

    const tensaoSecundariaLinhaHtml = document.getElementById("tensao-secundaria-linha-html");
    if (tensaoSecundariaLinhaHtml && tensaoSecundariaFFTP) {
        tensaoSecundariaLinhaHtml.textContent = tensaoSecundariaFFTP + " V";
    }

    const tensaoSecundariaFaseHtml = document.getElementById("tensao-secundaria-fase-html");
    if (tensaoSecundariaFaseHtml && tensaoSecundariaFNTP) {
        tensaoSecundariaFaseHtml.textContent = tensaoSecundariaFNTP + " V";
    }








    //persistir os valores ajustados no html
    const tensaoDeseqAjustada = localStorage.getItem("TensaoDeseqAjustada25");
    if (tensaoDeseqAjustada !== null && tensaoDeseqAjustada !== "") {
        document.getElementById("tensao-desequilibrio-ajustada-html").value = tensaoDeseqAjustada;
    }

    const freqDeseqAjustada = localStorage.getItem("FrequenciaDeseqAjustada25");
    if (freqDeseqAjustada !== null && freqDeseqAjustada !== "") {
        document.getElementById("frequência-desequilibrio-ajustada-html").value = freqDeseqAjustada;
    }

    const anguloDeseqAjustada = localStorage.getItem("AnguloDeseqAjustada25");
    if (anguloDeseqAjustada !== null && anguloDeseqAjustada !== "") {
        document.getElementById("angulo-desequilibrio-ajustada-html").value = anguloDeseqAjustada;
    }

    const condicaoSeccionamentoAjustada = localStorage.getItem("CondicaoSeccionamentoAjustada25");
    if (condicaoSeccionamentoAjustada !== null && condicaoSeccionamentoAjustada !== "") {
        document.getElementById("condicao-seccionamento-ajustada-html").value = condicaoSeccionamentoAjustada;
    }
    //-------------------------------------------------------------------

    // Preencher campos do html com os valores do localStorage

    const valorDesequilibrioDimensionado = localStorage.getItem("TensaoDeseqAjustada25") || "10";
    document.getElementById("tensao-desequilibrio-dimensionado-html").textContent = valorDesequilibrioDimensionado + " %";

    const freqDesequilibrioDimensionado = localStorage.getItem("FrequenciaDeseqAjustada25") || "0.3";
    document.getElementById("frequência-desequilibrio-dimensionado-html").textContent = freqDesequilibrioDimensionado + " Hz";

    const anguloDesequilibrioDimensionado = localStorage.getItem("AnguloDeseqAjustada25") || "10";
    document.getElementById("angulo-desequilibrio-dimensionado-html").textContent = anguloDesequilibrioDimensionado + " °";

    const condicaoSeccionamentoDimensionado = localStorage.getItem("CondicaoSeccionamentoAjustada25") || "LINHA-VIVA/BARRA-MORTA";
    document.getElementById("condicao-seccionamento-dimensionado-html").textContent = condicaoSeccionamentoDimensionado;















    // Preencher o campo de tensão calculando valor base pela porcentagem definida
    const tensaoPrimariaFasecalculada = document.getElementById("tensao-ajustada-primaria-linha-html");
    const tensaoPrimariaFase = tensaoPrimariaLinhaHtml ? parseFloat(tensaoPrimariaLinhaHtml.textContent) : 0;
    const tensaoPrimariaFaseCalculada = (tensaoPrimariaFase * valorDesequilibrioDimensionado / 100).toFixed(2);
    tensaoPrimariaFasecalculada.textContent = tensaoPrimariaFaseCalculada + " V";

    // Calcular e preencher para tensao-ajustada-primaria-fase-html
    const tensaoPrimariaFaseAjustada = document.getElementById("tensao-ajustada-primaria-fase-html");
    const tensaoPrimariaFaseValor = tensaoPrimariaFaseHtml ? parseFloat(tensaoPrimariaFaseHtml.textContent) : 0;
    const tensaoPrimariaFaseAjustadaValor = (tensaoPrimariaFaseValor * valorDesequilibrioDimensionado / 100).toFixed(2);
    tensaoPrimariaFaseAjustada.textContent = tensaoPrimariaFaseAjustadaValor + " V";
    
    localStorage.setItem("tensaoPrimariaFaseAjustada25", tensaoPrimariaFaseAjustadaValor);

    const tensaoSecundariaFasecalculada = document.getElementById("tensao-ajustada-secundaria-linha-html");
    const tensaoSecundariaFase = tensaoSecundariaLinhaHtml ? parseFloat(tensaoSecundariaLinhaHtml.textContent) : 0;
    const tensaoSecundariaFaseCalculada = (tensaoSecundariaFase * valorDesequilibrioDimensionado / 100).toFixed(2);
    tensaoSecundariaFasecalculada.textContent = tensaoSecundariaFaseCalculada + " V";

    

    // Calcular e preencher para tensao-ajustada-secundaria-fase-html
    const tensaoSecundariaFaseAjustada = document.getElementById("tensao-ajustada-secundaria-fase-html");
    const tensaoSecundariaFaseValor = tensaoSecundariaFaseHtml ? parseFloat(tensaoSecundariaFaseHtml.textContent) : 0;
    const tensaoSecundariaFaseAjustadaValor = (tensaoSecundariaFaseValor * valorDesequilibrioDimensionado / 100).toFixed(2);
    tensaoSecundariaFaseAjustada.textContent = tensaoSecundariaFaseAjustadaValor + " V";










}


function salvarOpcao() {

    // importar valores dos inputs e armazenar no localStorage
    const tensaoDeseqAjustada = document.getElementById("tensao-desequilibrio-ajustada-html").value;
    localStorage.setItem("TensaoDeseqAjustada25", tensaoDeseqAjustada);
    console.log("Tensão Desequilíbrio Ajustada:", tensaoDeseqAjustada);

    const freqDeseqAjustada = document.getElementById("frequência-desequilibrio-ajustada-html").value;
    localStorage.setItem("FrequenciaDeseqAjustada25", freqDeseqAjustada);
    console.log("Frequência Desequilíbrio Ajustada:", freqDeseqAjustada);

    const anguloDeseqAjustada = document.getElementById("angulo-desequilibrio-ajustada-html").value;
    localStorage.setItem("AnguloDeseqAjustada25", anguloDeseqAjustada);
    console.log("Ângulo Desequilíbrio Ajustada:", anguloDeseqAjustada);

    const condicaoSeccionamentoAjustada = document.getElementById("condicao-seccionamento-ajustada-html").value;
    localStorage.setItem("CondicaoSeccionamentoAjustada25", condicaoSeccionamentoAjustada);
    console.log("Condição Seccionamento Ajustada:", condicaoSeccionamentoAjustada);



    // Recarregar a página após salvar as opções
    location.reload();
}





// Event listener para capturar Enter em qualquer lugar da página
document.addEventListener('keydown', function (event) {
    // Verificar se a tecla pressionada é Enter (código 13 ou 'Enter')
    if (event.key === 'Enter' || event.keyCode === 13) {
        // Evitar comportamento padrão (submissão de formulário)
        event.preventDefault();

        // Chamar a função salvar
        salvarOpcao();

        console.log('✅ Salvamento ativado por Enter');
    }
});




// --------------------------------------------------------------// 
// Código para gerar a curva tempo inverso em SVG
// Esta função gera uma curva de tempo
// Função para gerar a curva tempo inverso em SVG da animação
function gerarCurvaTempoInversoSVG(dial, beta, alfa, k, ip, iMin, iMax, pontos) {
    let d = "";
    let primeiro = true;
    for (let i = 0; i <= pontos; i++) {
        let corrente = iMin + (iMax - iMin) * (i / pontos);
        let denominador = Math.pow(corrente / ip, alfa) - k;
        if (denominador <= 0) continue;
        let tempo = dial * (beta / denominador);
        if (tempo > 1000) tempo = 1000; // Limite para visualização
        let svgX = 50 + (corrente - iMin) * 500 / (iMax - iMin);
        let svgY = 350 - (tempo * 300 / 1000);
        if (primeiro) {
            d += `M${svgX},${svgY}`;
            primeiro = false;
        } else {
            d += ` L${svgX},${svgY}`;
        }
    }
    return d;
}

// Parâmetros do exemplo
const dialsvg = 90000;
const beta = 300;
const alfa = 2;
const k = 1;
const ip = 0.5;
const iMin = ip * 2.01; // Começa um pouco acima de ip
const iMax = 300;
const pontos = 1000;

const dInverso = gerarCurvaTempoInversoSVG(dialsvg, beta, alfa, k, ip, iMin, iMax, pontos);

const svg = document.querySelector("svg");
const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("class", "curva-inversa");
path.setAttribute("fill", "none");
path.setAttribute("stroke", "#ff0080");
path.setAttribute("stroke-width", "3");
path.setAttribute("stroke-dasharray", "1000");
path.setAttribute("stroke-dashoffset", "1000");
path.setAttribute("d", dInverso);
svg.appendChild(path);
// --------------------------------------------------------------
// Fim do Js do SVG
















  



