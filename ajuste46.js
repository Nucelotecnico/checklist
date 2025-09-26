










window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoajustesGDhtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    const botaoParametro2 = document.getElementById("botaoajuste46html");
    if (botaoParametro2) {
        botaoParametro2.style.backgroundColor = "#cf0808";
    }
    // -----------------manter o botão vermelho selecionado-------------------



    //persistir os valores ajustados no html

    const ipAjustada = localStorage.getItem("Ipajustada46");
    if (ipAjustada !== null) {
        document.getElementById("ip-46-ajustada-html").value = ipAjustada;
    }
    const curvaAjustada = localStorage.getItem("Curvaajustada46");
    if (curvaAjustada !== null) {
        document.getElementById("curva-46-ajustada-html").value = curvaAjustada;
    }
    const dialAjustado = localStorage.getItem("Dialajustado46");
    if (dialAjustado !== null) {
        document.getElementById("dial-46-ajustada-html").value = dialAjustado;
    }
    const idefAjustada = localStorage.getItem("Idefajustada46");
    if (idefAjustada !== null) {
        document.getElementById("idef-46-ajustada-html").value = idefAjustada;
    }
    const tempoDefinido = localStorage.getItem("Tempodefinido46");
    if (tempoDefinido !== null) {
        document.getElementById("tempodefinido-ajustada-html").value = tempoDefinido;
    }

    //-------------------------------------------------------------------

    // Preencher campos do html com os valores do localStorage 

    const tcSelecionado = localStorage.getItem("TCdeprotecaoSelecionada") || "";


    const ipFaseGD = parseFloat(localStorage.getItem("IpfaseGD")) || 0;
    const ipDeConsumo = parseFloat(localStorage.getItem("Ipdeconsumo")) || 0;
    const maiorIp = Math.max(ipFaseGD, ipDeConsumo);




    let ip46real; // Variável independente para armazenar o valor definido

    const ipHtml = document.getElementById("ip-46-real-html");
    const ipAjustada46 = localStorage.getItem("Ipajustada46");
    if (ipHtml) {
        if (ipAjustada46 && !isNaN(parseFloat(ipAjustada46))) {
            ip46real = parseFloat(ipAjustada46); // Ajuste para P.U
            ipHtml.textContent = (ip46real).toFixed(2) + " A";
        } else {
            ip46real = maiorIp;
            ipHtml.textContent = (ip46real * 0.20).toFixed(2) + " A";
        }
    }



    const curvaHtml = document.getElementById("curva-46-real-html");
    const curvaAjustada46 = localStorage.getItem("Curvaajustada46");
    if (curvaHtml) {
        if (curvaAjustada46 && curvaAjustada46.trim() !== "") {
            curvaHtml.textContent = curvaAjustada46;
        } else if (maiorIp === ipFaseGD) {
            curvaHtml.textContent = localStorage.getItem("curvafaseSelecionadaGD") || "";
        } else if (maiorIp === ipDeConsumo) {
            curvaHtml.textContent = localStorage.getItem("curvafaseSelecionada") || "";
        }
    }

    const dialHtml = document.getElementById("dial-46-real-html");
    const dialAjustado46 = localStorage.getItem("Dialajustado46");
    if (dialHtml) {
        if (dialAjustado46 && dialAjustado46.trim() !== "") {
            dialHtml.textContent = dialAjustado46;
        } else if (maiorIp === ipFaseGD) {
            dialHtml.textContent = localStorage.getItem("dialfaseSelecionadaGD") || "";
        } else if (maiorIp === ipDeConsumo) {
            dialHtml.textContent = localStorage.getItem("dialfaseSelecionada") || "";
        }
    }


    const idefHtml = document.getElementById("idef-46-real-html");
    const idefAjustada46 = localStorage.getItem("Idefajustada46");
    let idef46real; // Variável independente para armazenar o valor definido

    if (idefHtml) {
        if (idefAjustada46 && !isNaN(parseFloat(idefAjustada46))) {
            idef46real = parseFloat(idefAjustada46);
            idefHtml.textContent = idef46real.toFixed(2) + " A";
        } else {
            idef46real = maiorIp * 0.20;
            idefHtml.textContent = idef46real.toFixed(2) + " A";
        }
    }


    const tempoDefinidoHtml = document.getElementById("tempodefinido-real-html");
    const tempoDefinido46 = localStorage.getItem("Tempodefinido46");
    if (tempoDefinidoHtml) {
        if (tempoDefinido46 && tempoDefinido46.trim() !== "") {
            tempoDefinidoHtml.textContent = tempoDefinido46 + " s";
        } else {
            tempoDefinidoHtml.textContent = "3 s";
        }
    }



    const ipPuHtml = document.getElementById("ip-46-pu-html");
    if (ipPuHtml && tcSelecionado) {
        let ipPu;
        if (ipAjustada46 && !isNaN(parseFloat(ipAjustada46))) {
            // Se houver valor ajustado, usa ele
            ipPu = parseFloat(ipAjustada46) / parseFloat(tcSelecionado);
            ipPuHtml.textContent = ipPu.toFixed(2) + " P.U";
        } else {
            // Caso contrário, usa o maiorIp * 0.20
            ipPu = (maiorIp * 0.20) / parseFloat(tcSelecionado);
            ipPuHtml.textContent = ipPu.toFixed(2) + " P.U";
        }
    }

    const idefPuHtml = document.getElementById("idef-46-pu-html");
    if (idefPuHtml && tcSelecionado) {
        const idefPu = idef46real / parseFloat(tcSelecionado);
        idefPuHtml.textContent = idefPu.toFixed(2) + " P.U";
    }



    //exportar ip46real e idef46real para o localStorage
    
    localStorage.setItem("Idef46real", idef46real);


}


function salvarOpcao() {

    // Salvar os valores ajustados no localStorage
    const ipAjustada = document.getElementById("ip-46-ajustada-html").value;
    const curvaAjustada = document.getElementById("curva-46-ajustada-html").value;
    const dialAjustado = document.getElementById("dial-46-ajustada-html").value;
    const idefAjustada = document.getElementById("idef-46-ajustada-html").value;
    const tempoDefinido = document.getElementById("tempodefinido-ajustada-html").value;

    localStorage.setItem("Ipajustada46", ipAjustada);
    localStorage.setItem("Curvaajustada46", curvaAjustada);
    localStorage.setItem("Dialajustado46", dialAjustado);
    localStorage.setItem("Idefajustada46", idefAjustada);
    localStorage.setItem("Tempodefinido46", tempoDefinido);



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
