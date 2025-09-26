









window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoajustesGDhtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    const botaoParametro2 = document.getElementById("botaoajuste59html");
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


    //------------------persistir os valores de ajuste no html
    const ajusteManual81O = localStorage.getItem("ajustemanual81Oprimeiroestagio");
    if (ajusteManual81O !== null) {
        const ajustePusobretensaoHtml = document.getElementById("ajuste-pu-sobretensao-html");
        if (ajustePusobretensaoHtml) {
            ajustePusobretensaoHtml.value = ajusteManual81O;
        }
    }

    const ajusteTemposobretensaoHtml = document.getElementById("ajuste-tempo-sobretensao-html");
    if (ajusteTemposobretensaoHtml) {
        ajusteTemposobretensaoHtml.value = localStorage.getItem("ajustemanual81Otempo") || "";
    }

    // Para o segundo estágio
    const ajusteManual81O2 = localStorage.getItem("ajustemanual81Osegundoestagio");
    if (ajusteManual81O2 !== null) {
        const ajustePusobretensaoHtml2 = document.getElementById("ajuste-pu-sobretensao-html-2");
        if (ajustePusobretensaoHtml2) {
            ajustePusobretensaoHtml2.value = ajusteManual81O2;
        }
    }

    const ajusteTemposobretensaoHtml2 = document.getElementById("ajuste-tempo-sobretensao-html-2");
    if (ajusteTemposobretensaoHtml2) {
        ajusteTemposobretensaoHtml2.value = localStorage.getItem("ajustemanual81Otempo2") || "";
    }


    //----carregar campos em P.U caso houver valor digitado

    // Primeiro estágio
    const ajustePusobretensao = localStorage.getItem("ajustemanual81Oprimeiroestagio");
    const elementosPu = document.getElementsByClassName("ajuste-pu-sobretensao-automatica");
    if (ajustePusobretensao !== null && ajustePusobretensao !== "") {
        for (let i = 0; i < elementosPu.length; i++) {
            elementosPu[i].textContent = ajustePusobretensao + " P.U"; // Valor ajustado
        }
    } else {
        for (let i = 0; i < elementosPu.length; i++) {
            elementosPu[i].textContent = "1.10" + " P.U"; // Valor padrão se não houver ajuste
        }
    }

    const ajusteTemposobretensao = localStorage.getItem("ajustemanual81Otempo");
    const elementosTempo = document.getElementsByClassName("ajuste-tempo-sobretensao-automatica");
    if (ajusteTemposobretensao !== null && ajusteTemposobretensao !== "") {
        for (let i = 0; i < elementosTempo.length; i++) {
            elementosTempo[i].textContent = ajusteTemposobretensao + " s";
        }
    } else {
        for (let i = 0; i < elementosTempo.length; i++) {
            elementosTempo[i].textContent = "3" + " s";
        }
    }


    const tempoEstagioHtml = document.getElementById("sensibilidade-superior-tempo-estagios-ajustada-html");
    if (tempoEstagioHtml) {
        tempoEstagioHtml.textContent = (ajusteTemposobretensao !== null && ajusteTemposobretensao !== "" ? ajusteTemposobretensao : "3") + " s";
    }

    // Segundo estágio
    const ajustePusobretensao2 = localStorage.getItem("ajustemanual81Osegundoestagio");
    const elementosPu2 = document.getElementsByClassName("ajuste-pu-sobretensao-automatica-2");
    if (ajustePusobretensao2 !== null && ajustePusobretensao2 !== "") {
        for (let i = 0; i < elementosPu2.length; i++) {
            elementosPu2[i].textContent = ajustePusobretensao2 + " P.U";
        }
    } else {
        for (let i = 0; i < elementosPu2.length; i++) {
            elementosPu2[i].textContent = "1.18" + " P.U";
        }
    }

    const ajusteTemposobretensao2 = localStorage.getItem("ajustemanual81Otempo2");
    const elementosTempo2 = document.getElementsByClassName("ajuste-tempo-sobretensao-automatica-2");
    if (ajusteTemposobretensao2 !== null && ajusteTemposobretensao2 !== "") {
        for (let i = 0; i < elementosTempo2.length; i++) {
            elementosTempo2[i].textContent = ajusteTemposobretensao2 + " s";
        }
    } else {
        for (let i = 0; i < elementosTempo2.length; i++) {
            elementosTempo2[i].textContent = "0.5" + " s";
        }
    }

    const tempoEstagioHtml2 = document.getElementById("sensibilidade-superior-tempo-estagios-ajustada-html-2");
    if (tempoEstagioHtml2) {
        tempoEstagioHtml2.textContent = (ajusteTemposobretensao2 !== null && ajusteTemposobretensao2 !== "" ? ajusteTemposobretensao2 : "0.5") + " s";
    }

    calcularSensibilidades();

}



function salvarOpcao() {

    // Salvar o valor do primeiro estágio
    const valor = document.getElementById("ajuste-pu-sobretensao-html")?.value || "";
    localStorage.setItem("ajustemanual81Oprimeiroestagio", valor);

    const tempo = document.getElementById("ajuste-tempo-sobretensao-html")?.value || "";
    localStorage.setItem("ajustemanual81Otempo", tempo);

    // Salvar o valor do segundo estágio
    const valor2 = document.getElementById("ajuste-pu-sobretensao-html-2")?.value || "";
    localStorage.setItem("ajustemanual81Osegundoestagio", valor2);

    const tempo2 = document.getElementById("ajuste-tempo-sobretensao-html-2")?.value || "";
    localStorage.setItem("ajustemanual81Otempo2", tempo2);



    location.reload();

}



function calcularSensibilidades() {




    const ajustePUSobretensaoautomatica = document.querySelector(".ajuste-pu-sobretensao-automatica")?.textContent || "1.10";
    const ajustePUSobretensaoautomatica2 = document.querySelector(".ajuste-pu-sobretensao-automatica-2")?.textContent || "1.18";
    const tensaoPrimariaFF = localStorage.getItem("tensaoprimariaFF");
    const tensaoPrimariaFN = localStorage.getItem("tensaoprimariaFN");
    const tensaoSecundariaFFTP = localStorage.getItem("tensaoSecundariaFFTP");
    const tensaoSecundariaFNTP = localStorage.getItem("tensaoSecundariaFNTP");



    //---inicio do cálculo dos valores ajustados de tensão para o primeiro estágio
    const tensaoPrimariaLinhaAjustada = tensaoPrimariaFF * ((parseFloat(ajustePUSobretensaoautomatica) || 0));
    const tensaoPrimariaLinhaAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-primaria-linha-ajustada-html");
    if (tensaoPrimariaLinhaAjustadaHtml) {
        tensaoPrimariaLinhaAjustadaHtml.textContent = tensaoPrimariaLinhaAjustada.toFixed(2) + " V";
    }
    
    const tensaoPrimariaFaseAjustada = tensaoPrimariaFN * ((parseFloat(ajustePUSobretensaoautomatica) || 0));
    const tensaoPrimariaFaseAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-primaria-fase-ajustada-html");
    if (tensaoPrimariaFaseAjustadaHtml) {
        tensaoPrimariaFaseAjustadaHtml.textContent = tensaoPrimariaFaseAjustada.toFixed(2) + " V";
    }

    localStorage.setItem("tensaoPrimariaFaseAjustada59-1", tensaoPrimariaFaseAjustada);

    const tensaoSecundariaFaseAjustada = tensaoSecundariaFNTP * ((parseFloat(ajustePUSobretensaoautomatica) || 0));
    const tensaoSecundariaFaseAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-secundaria-fase-ajustada-html");
    if (tensaoSecundariaFaseAjustadaHtml) {
        tensaoSecundariaFaseAjustadaHtml.textContent = tensaoSecundariaFaseAjustada.toFixed(2) + " V";
    }

    const tensaoSecundariaLinhaAjustada = tensaoSecundariaFFTP * ((parseFloat(ajustePUSobretensaoautomatica) || 0));
    const tensaoSecundariaLinhaAjustadaHtml = document.getElementById("sensibilidade-superior-tensao-secundaria-linha-ajustada-html");
    if (tensaoSecundariaLinhaAjustadaHtml) {
        tensaoSecundariaLinhaAjustadaHtml.textContent = tensaoSecundariaLinhaAjustada.toFixed(2) + " V";
    }

    //---cálculo dos valores ajustados de tensão para o segundo estágio
    const tensaoPrimariaLinhaAjustada2 = tensaoPrimariaFF * ((parseFloat(ajustePUSobretensaoautomatica2) || 0));
    const tensaoPrimariaLinhaAjustadaHtml2 = document.getElementById("sensibilidade-superior-tensao-primaria-linha-ajustada-html-2");
    if (tensaoPrimariaLinhaAjustadaHtml2) {
        tensaoPrimariaLinhaAjustadaHtml2.textContent = tensaoPrimariaLinhaAjustada2.toFixed(2) + " V";
    }

    const tensaoPrimariaFaseAjustada2 = tensaoPrimariaFN * ((parseFloat(ajustePUSobretensaoautomatica2) || 0));
    const tensaoPrimariaFaseAjustadaHtml2 = document.getElementById("sensibilidade-superior-tensao-primaria-fase-ajustada-html-2");
    if (tensaoPrimariaFaseAjustadaHtml2) {
        tensaoPrimariaFaseAjustadaHtml2.textContent = tensaoPrimariaFaseAjustada2.toFixed(2) + " V";
    }

    localStorage.setItem("tensaoPrimariaFaseAjustada59-2", tensaoPrimariaFaseAjustada2);

    const tensaoSecundariaFaseAjustada2 = tensaoSecundariaFNTP * ((parseFloat(ajustePUSobretensaoautomatica2) || 0));
    const tensaoSecundariaFaseAjustadaHtml2 = document.getElementById("sensibilidade-superior-tensao-secundaria-fase-ajustada-html-2");
    if (tensaoSecundariaFaseAjustadaHtml2) {
        tensaoSecundariaFaseAjustadaHtml2.textContent = tensaoSecundariaFaseAjustada2.toFixed(2) + " V";
    }

    const tensaoSecundariaLinhaAjustada2 = tensaoSecundariaFFTP * ((parseFloat(ajustePUSobretensaoautomatica2) || 0));
    const tensaoSecundariaLinhaAjustadaHtml2 = document.getElementById("sensibilidade-superior-tensao-secundaria-linha-ajustada-html-2");
    if (tensaoSecundariaLinhaAjustadaHtml2) {
        tensaoSecundariaLinhaAjustadaHtml2.textContent = tensaoSecundariaLinhaAjustada2.toFixed(2) + " V";
    }











}







// Event listener para capturar Enter em qualquer lugar da página
document.addEventListener('keydown', function(event) {
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










