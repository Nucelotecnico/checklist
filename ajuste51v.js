









window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoajustesGDhtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    const botaoParametro2 = document.getElementById("botaoajuste51vhtml");
    if (botaoParametro2) {
        botaoParametro2.style.backgroundColor = "#cf0808";
    }
    // -----------------manter o botão vermelho selecionado-------------------



    const ligacaoSecundariaTP = localStorage.getItem("ligacaodabobinaSelecionada");
    const labelLigacaoSecundariaTP = document.getElementById("ligacao-secundaria-tp-html");
    if (labelLigacaoSecundariaTP && ligacaoSecundariaTP) {
        labelLigacaoSecundariaTP.textContent = ligacaoSecundariaTP;
    }





    const ipFaseGD = parseFloat(localStorage.getItem("IpfaseGD")) || 0;
    const ipDeConsumo = parseFloat(localStorage.getItem("Ipdeconsumo")) || 0;
    const maiorIp = Math.max(ipFaseGD, ipDeConsumo);
    const ipHtml = document.getElementById("ip-html");
    if (ipHtml) {
        ipHtml.textContent = maiorIp.toFixed(2) + " A";
    }
    const curvaHtml = document.getElementById("curva-html");
    if (curvaHtml) {
        if (maiorIp === ipFaseGD) {
            curvaHtml.textContent = localStorage.getItem("curvafaseSelecionadaGD") || "";
        } else if (maiorIp === ipDeConsumo) {
            curvaHtml.textContent = localStorage.getItem("curvafaseSelecionada") || "";
        }
    }

    const dialHtml = document.getElementById("dial-html");
    if (dialHtml) {
        if (maiorIp === ipFaseGD) {
            dialHtml.textContent = localStorage.getItem("dialfaseSelecionadaGD") || "";
        } else if (maiorIp === ipDeConsumo) {
            dialHtml.textContent = localStorage.getItem("dialfaseSelecionada") || "";
        }
    }


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



    // Sensibilidade Superior de Tensão Ajustada
    const sensibilidadeSuperiorTensaoAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-%-html");
    const valorSensibilidadeSuperiorTensao = localStorage.getItem("sensibilidadeSuperiorTensao") || "90";
    if (sensibilidadeSuperiorTensaoAjustadaHtml && valorSensibilidadeSuperiorTensao !== null && valorSensibilidadeSuperiorTensao !== "") {
        sensibilidadeSuperiorTensaoAjustadaHtml.textContent = valorSensibilidadeSuperiorTensao + " %";
    }

    // Sensibilidade Inferior de Tensão Ajustada
    const sensibilidadeInferiorTensaoAjustadaHtml = document.getElementById("sensibilidade-inferior-tensao-%-html");
    const valorSensibilidadeInferiorTensao = localStorage.getItem("sensibilidadeInferiorTensao") || "81";
    if (sensibilidadeInferiorTensaoAjustadaHtml && valorSensibilidadeInferiorTensao !== null && valorSensibilidadeInferiorTensao !== "") {
        sensibilidadeInferiorTensaoAjustadaHtml.textContent = valorSensibilidadeInferiorTensao + " %";
    }

    // Sensibilidade Superior de Corrente Ajustada
    const sensibilidadeSuperiorCorrenteAjustadaHtml = document.getElementById("sensibilidade-superior-corrente-%-html");
    const valorSensibilidadeSuperiorCorrente = localStorage.getItem("sensibilidadeSuperiorCorrente") || "100";
    if (sensibilidadeSuperiorCorrenteAjustadaHtml && valorSensibilidadeSuperiorCorrente !== null && valorSensibilidadeSuperiorCorrente !== "") {
        sensibilidadeSuperiorCorrenteAjustadaHtml.textContent = valorSensibilidadeSuperiorCorrente + " %";
    }

    // Sensibilidade Inferior de Corrente Ajustada
    const sensibilidadeInferiorCorrenteAjustadaHtml = document.getElementById("sensibilidade-inferior-corrente-%-html");
    const valorSensibilidadeInferiorCorrente = localStorage.getItem("sensibilidadeInferiorCorrente") || "25";
    if (sensibilidadeInferiorCorrenteAjustadaHtml && valorSensibilidadeInferiorCorrente !== null && valorSensibilidadeInferiorCorrente !== "") {
        sensibilidadeInferiorCorrenteAjustadaHtml.textContent = valorSensibilidadeInferiorCorrente + " %";
    }

    //-----------------------FIM do ajuste percentual dos inputs------------------













    //------------------persistir os valores de ajuste percentual no html dos inputs

    // Sensibilidade Superior de Tensão
    const sensibilidadeSuperiorTensao = localStorage.getItem("sensibilidadeSuperiorTensao");
    const sensibilidadeSuperiorTensaoHtml = document.getElementById("sensibilidade-superior-tensao-html");
    if (sensibilidadeSuperiorTensaoHtml && sensibilidadeSuperiorTensao !== null) {
        sensibilidadeSuperiorTensaoHtml.value = sensibilidadeSuperiorTensao;
    }

    // Sensibilidade Inferior de Tensão
    const sensibilidadeInferiorTensao = localStorage.getItem("sensibilidadeInferiorTensao");
    const sensibilidadeInferiorTensaoHtml = document.getElementById("sensibilidade-inferior-tensao-html");
    if (sensibilidadeInferiorTensaoHtml && sensibilidadeInferiorTensao !== null) {
        sensibilidadeInferiorTensaoHtml.value = sensibilidadeInferiorTensao;
    }

    // Sensibilidade Superior de Corrente
    const sensibilidadeSuperiorCorrente = localStorage.getItem("sensibilidadeSuperiorCorrente");
    const sensibilidadeSuperiorCorrenteHtml = document.getElementById("sensibilidade-superior-corrente-html");
    if (sensibilidadeSuperiorCorrenteHtml && sensibilidadeSuperiorCorrente !== null) {
        sensibilidadeSuperiorCorrenteHtml.value = sensibilidadeSuperiorCorrente;
    }

    // Sensibilidade Inferior de Corrente
    const sensibilidadeInferiorCorrente = localStorage.getItem("sensibilidadeInferiorCorrente");
    const sensibilidadeInferiorCorrenteHtml = document.getElementById("sensibilidade-inferior-corrente-html");
    if (sensibilidadeInferiorCorrenteHtml && sensibilidadeInferiorCorrente !== null) {
        sensibilidadeInferiorCorrenteHtml.value = sensibilidadeInferiorCorrente;
    }


    calcularSensibilidades();


}


function salvarOpcao() {

    // Sensibilidade Superior de Tensão
    const sensibilidadeSuperiorTensao = document.getElementById("sensibilidade-superior-tensao-html");
    if (sensibilidadeSuperiorTensao) {
        localStorage.setItem("sensibilidadeSuperiorTensao", sensibilidadeSuperiorTensao.value);
    }

    // Sensibilidade Inferior de Tensão
    const sensibilidadeInferiorTensao = document.getElementById("sensibilidade-inferior-tensao-html");
    if (sensibilidadeInferiorTensao) {
        localStorage.setItem("sensibilidadeInferiorTensao", sensibilidadeInferiorTensao.value);
    }

    // Sensibilidade Superior de Corrente
    const sensibilidadeSuperiorCorrente = document.getElementById("sensibilidade-superior-corrente-html");
    if (sensibilidadeSuperiorCorrente) {
        localStorage.setItem("sensibilidadeSuperiorCorrente", sensibilidadeSuperiorCorrente.value);
    }

    // Sensibilidade Inferior de Corrente
    const sensibilidadeInferiorCorrente = document.getElementById("sensibilidade-inferior-corrente-html");
    if (sensibilidadeInferiorCorrente) {
        localStorage.setItem("sensibilidadeInferiorCorrente", sensibilidadeInferiorCorrente.value);
    }


    location.reload();

}



function calcularSensibilidades() {


    const ipFaseGD = parseFloat(localStorage.getItem("IpfaseGD")) || 0;
    const ipDeConsumo = parseFloat(localStorage.getItem("Ipdeconsumo")) || 0;
    const maiorIp = Math.max(ipFaseGD, ipDeConsumo);

    const sensibilidadeSuperiorCorrente = localStorage.getItem("sensibilidadeSuperiorCorrente") || 100;
    const sensibilidadeInferiorCorrente = localStorage.getItem("sensibilidadeInferiorCorrente") || 25;
    const sensibilidadeSuperiorTensao = localStorage.getItem("sensibilidadeSuperiorTensao") || 90;
    const sensibilidadeInferiorTensao = localStorage.getItem("sensibilidadeInferiorTensao") || 81;
    const tensaoPrimariaFF = localStorage.getItem("tensaoprimariaFF");
    const tensaoPrimariaFN = localStorage.getItem("tensaoprimariaFN");
    const tensaoSecundariaFFTP = localStorage.getItem("tensaoSecundariaFFTP");
    const tensaoSecundariaFNTP = localStorage.getItem("tensaoSecundariaFNTP");

    //---Calcular os valores ajustados de corrente
    const Ipsuperiorajustada = maiorIp * ((parseFloat(sensibilidadeSuperiorCorrente)) / 100);

    const sensibilidadeSuperiorCorrenteAjustadaHtml = document.getElementById("sensibilidade-superior-corrente-ajustada-html");
    if (sensibilidadeSuperiorCorrenteAjustadaHtml) {
        sensibilidadeSuperiorCorrenteAjustadaHtml.textContent = Ipsuperiorajustada.toFixed(2) + " A";
    }


    const Ipinferiorajustada = maiorIp * ((parseFloat(sensibilidadeInferiorCorrente) || 0) / 100);

    const sensibilidadeInferiorCorrenteAjustadaHtml = document.getElementById("sensibilidade-inferior-corrente-ajustada-html");
    if (sensibilidadeInferiorCorrenteAjustadaHtml) {
        sensibilidadeInferiorCorrenteAjustadaHtml.textContent = Ipinferiorajustada.toFixed(2) + " A";
    }
    //---Fim do cálculo dos valores ajustados de corrente

    //---inicio do cálculo dos valores ajustados de tensão

    const tensaoPrimariaFaseAjustada = tensaoPrimariaFN * ((parseFloat(sensibilidadeSuperiorTensao) || 0) / 100);
    const tensaoPrimariaFaseAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-primaria-fase-ajustada-html");
    if (tensaoPrimariaFaseAjustadaHtml) {
        tensaoPrimariaFaseAjustadaHtml.textContent = tensaoPrimariaFaseAjustada.toFixed(2) + " V";
    }
    const tensaoPrimariaLinhaAjustada = tensaoPrimariaFF * ((parseFloat(sensibilidadeSuperiorTensao) || 0) / 100);
    const tensaoPrimariaLinhaAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-primaria-linha-ajustada-html");
    if (tensaoPrimariaLinhaAjustadaHtml) {
        tensaoPrimariaLinhaAjustadaHtml.textContent = tensaoPrimariaLinhaAjustada.toFixed(2) + " V";
    }
    const tensaoSecundariaFaseAjustada = tensaoSecundariaFNTP * ((parseFloat(sensibilidadeSuperiorTensao) || 0) / 100);
    const tensaoSecundariaFaseAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-secundaria-fase-ajustada-html");
    if (tensaoSecundariaFaseAjustadaHtml) {
        tensaoSecundariaFaseAjustadaHtml.textContent = tensaoSecundariaFaseAjustada.toFixed(2) + " V";
    }
    const tensaoSecundariaLinhaAjustada = tensaoSecundariaFFTP * ((parseFloat(sensibilidadeSuperiorTensao) || 0) / 100);
    const tensaoSecundariaLinhaAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-secundaria-linha-ajustada-html");
    if (tensaoSecundariaLinhaAjustadaHtml) {
        tensaoSecundariaLinhaAjustadaHtml.textContent = tensaoSecundariaLinhaAjustada.toFixed(2) + " V";
    }

    // exportar para o localstorage os valores ajustados de tensão
    localStorage.setItem("tensaoPrimariaFaseAjustada51v", tensaoPrimariaFaseAjustada.toFixed(2));
    localStorage.setItem("tensaoPrimariaLinhaAjustada51v", tensaoPrimariaLinhaAjustada.toFixed(2));
    localStorage.setItem("tensaoSecundariaFaseAjustada51v", tensaoSecundariaFaseAjustada.toFixed(2));
    localStorage.setItem("tensaoSecundariaLinhaAjustada51v", tensaoSecundariaLinhaAjustada.toFixed(2));



    //exibir no console os valores ajustados de tensão
    console.log("Tensão Primária Fase Ajustada: " + tensaoPrimariaFaseAjustada.toFixed(2) + " V");
    console.log("Tensão Primária Linha Ajustada: " + tensaoPrimariaLinhaAjustada.toFixed(2) + " V");
    console.log("Tensão Secundária Fase Ajustada: " + tensaoSecundariaFaseAjustada.toFixed(2) + " V");
    console.log("Tensão Secundária Linha Ajustada: " + tensaoSecundariaLinhaAjustada.toFixed(2) + " V");


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
