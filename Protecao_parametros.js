//FUNÇÃO PARA SALVAR OS CAMPOS PREENCHIDOS NO LOCAL STORAGE E REALIZAR ALGUNS CÁLCULOS NECESSÁRIOS PARA A PROTEÇÃO

function salvarOpcao() {
    //alert("Parâmetros elétricos salvos com sucesso!");

    //inicializa duas variaveis do tipo constante, um obtem o valor da ID meu select
    //que corresponde ao valor armazenado no campo de selecao e a outra armazena o valor desse campo
    const tensao = document.getElementById("tensaoprimaria");
    const tensaoSelecionada = tensao.value;
    localStorage.setItem("tensaoSelecionada", tensaoSelecionada);

    //-----------------------------------------------------------------------------------------
    const demandaPotencia = document.getElementById("demandaConsumo");
    const demandadecontrato = demandaPotencia.value;
    //localStorage.setItem("demandaSelecionada", demandaSelecionada);
    localStorage.setItem("demandadecontrato", demandadecontrato);

    //-----------------------------------------------------------------------------------------
    const fatorPotencia = document.getElementById("fatorPotencia");
    if (!fatorPotencia || fatorPotencia.value === "" || isNaN(fatorPotencia.value) || fatorPotencia.value <= 0) {
        fatorPotencia.value = 92; // Valor padrão se o campo estiver vazio
    }
    const fatorPotenciaSelecionada = fatorPotencia.value / 100;
    localStorage.setItem("fatorPotenciaSelecionada", fatorPotenciaSelecionada);


    //-----------------------------------------------------------------------------------------
    const desequilibrio = document.getElementById("desequilibrio");
    if (!desequilibrio || desequilibrio.value === "" || isNaN(desequilibrio.value) || desequilibrio.value <= 0) {
        desequilibrio.value = 33; // Valor padrão se o campo estiver vazio
    }
    const desequilibrioSelecionada = desequilibrio.value / 100;
    localStorage.setItem("desequilibrioSelecionada", desequilibrioSelecionada);

    console.log("Desequilibrio selecionada:", desequilibrioSelecionada); // Debug: verificar valor de desequilibrioSelecionada

    //-----------------------------------------------------------------------------------------

    const potenciaGD = document.getElementById("potenciaGDhtml");
    const potenciaGDcontratada = potenciaGD.value;
    //localStorage.setItem("potenciaGDSelecionada", potenciaGDSelecionada);
    localStorage.setItem("potenciaGDcontratada", potenciaGDcontratada);
    //-----------------------------------------------------------------------------------------

    const fatorPotenciaGD = document.getElementById("fatorPotenciaGDhtml");
    if (!fatorPotenciaGD || fatorPotenciaGD.value === "" || isNaN(fatorPotenciaGD.value) || fatorPotenciaGD.value <= 0) {
        fatorPotenciaGD.value = 92; // Valor padrão se o campo estiver vazio
    }
    const fatorPotenciaGDSelecionada = fatorPotenciaGD.value / 100;
    localStorage.setItem("fatorPotenciaGDSelecionada", fatorPotenciaGDSelecionada);

    //-----------------------------------------------------------------------------------------
    const iccTrifasicaGemini = localStorage.getItem("ICCtrifasicagemini");
    const curto = document.getElementById("icctrifasica");
    let curtoSelecionada;
    if (iccTrifasicaGemini) {
        curtoSelecionada = iccTrifasicaGemini;
    } else {
        curtoSelecionada = curto.value;
    }
    localStorage.setItem("curtoSelecionada", curtoSelecionada);



    //-----------------------------------------------------------------------------------------



    //CALCULAR A I NOMINAL DA GD

    const inominalGD = (potenciaGDcontratada * 1000) / (tensaoSelecionada * Math.sqrt(3) * fatorPotenciaGDSelecionada) / 1000;
    localStorage.setItem("InominalfaseGD", inominalGD.toFixed(2));

    //-----------------------------------------------------------------------------------------
    // CALCULAR A I NOMINAL DE NEUTRO GD

    let inominalneutroGD = inominalGD * desequilibrioSelecionada;
    if (inominalneutroGD > 40) {
        inominalneutroGD = 40;
    }
    localStorage.setItem("InominalneutroGD", inominalneutroGD.toFixed(2));


    //-----------------------------------------------------------------------------------------
 


    //Armazenar informações de input do gerador no formato JSON e armazenar no local storage
    const potenciagerador = document.getElementById("potenciageradorhtml")?.value || "";
    const fatorpotenciagerador = document.getElementById("fatorpotenciageradorhtml")?.value || 80;
    const toleranciagerador = document.getElementById("toleranciageradorhtml")?.value || 5;

    const gerador = {
        potencia: potenciagerador,
        fatorpotencia: fatorpotenciagerador,
        tolerancia: toleranciagerador
    };

    localStorage.setItem("geradorJSON", JSON.stringify(gerador));




    // Recarrega a página após salvar as opções
    location.reload();

}


window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoparametrohtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }
    // --------------------------------------------------------------------------

    // Recupera a opção selecionada do localStorage e define no campo correspondente
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // importarICC();
    calculoGerador();


    const tensao = document.getElementById("tensaoprimaria");
    const tensaoSalva = localStorage.getItem("tensaoSelecionada");

    if (tensaoSalva) {
        tensao.value = tensaoSalva;
    }
    //-----------------------------------------------------------------------------------------

    const demanda = document.getElementById("demandaConsumo");
    const demandaSalva = localStorage.getItem("demandadecontrato");
    if (demandaSalva) {
        demanda.value = demandaSalva;
    }
    //-----------------------------------------------------------------------------------------
    const fatorp = document.getElementById("fatorPotencia");
    const fatorpSalva = localStorage.getItem("fatorPotenciaSelecionada");
    if (fatorpSalva) {
        fatorp.value = fatorpSalva * 100;
    }
    //-----------------------------------------------------------------------------------------
    const desequilibrio = document.getElementById("desequilibrio");
    const desequilibrioSalva = localStorage.getItem("desequilibrioSelecionada") || 33;
    if (desequilibrioSalva) {
        desequilibrio.value = desequilibrioSalva * 100;
    }
    //-----------------------------------------------------------------------------------------
    const potenciaGD = document.getElementById("potenciaGDhtml");
    const potenciaGDSalva = localStorage.getItem("potenciaGDcontratada");
    if (potenciaGDSalva) {
        potenciaGD.value = potenciaGDSalva;
    }
    //-----------------------------------------------------------------------------------------
    const fatorPotenciaGD = document.getElementById("fatorPotenciaGDhtml") || 92;
    const fatorPotenciaGDSalva = localStorage.getItem("fatorPotenciaGDSelecionada");
    if (fatorPotenciaGDSalva) {
        fatorPotenciaGD.value = fatorPotenciaGDSalva * 100;
    }
    //-----------------------------------------------------------------------------------------
    const curto = document.getElementById("icctrifasica");
    const curtoSalva = localStorage.getItem("curtoSelecionada");
    if (curtoSalva) {
        curto.value = curtoSalva;
    }


    //persistir os valores ajustados no html com as variaveis do localstorage, caso não tenha valor, o campo assume valores genericos
    const tensaoajustadahtml = document.getElementById("valorAjustadoTensaoPrimaria");
    const tensaoajustadastorage = localStorage.getItem("tensaoSelecionada");
    if (tensaoajustadastorage) {
        tensaoajustadahtml.textContent = tensaoajustadastorage + " kV";
    } else {
        tensaoajustadahtml.textContent = "13.8" + " kV";
    }

    const demandaajustadahtml = document.getElementById("valorAjustadoDemandaConsumo");
    const demandaajustadastorage = localStorage.getItem("demandadecontrato");
    if (demandaajustadastorage) {
        demandaajustadahtml.textContent = demandaajustadastorage + " kW";
    } else {
        demandaajustadahtml.textContent = "0" + " kW";
    }

    const fatorpajustadahtml = document.getElementById("valorAjustadoFatorPotencia");
    const fatorpajustadastorage = localStorage.getItem("fatorPotenciaSelecionada");
    if (fatorpajustadastorage !== "" && fatorpajustadastorage !== null && fatorpajustadastorage != 0) {
        fatorpajustadahtml.textContent = fatorpajustadastorage * 100 + " %";
    } else {
        fatorpajustadahtml.textContent = "92" + " %";
    }

    const desequilibrioajustadahtml = document.getElementById("valorAjustadoDesequilibrio");
    const desequilibrioajustadastorage = localStorage.getItem("desequilibrioSelecionada");
    if (desequilibrioajustadastorage !== "" && desequilibrioajustadastorage !== null && desequilibrioajustadastorage != 0) {
        desequilibrioajustadahtml.textContent = desequilibrioajustadastorage * 100 + " %";
    } else {
        desequilibrioajustadahtml.textContent = "33" + " %";
    }

    const potenciaGDajustadahtml = document.getElementById("valorAjustadoPotenciaGD");
    const potenciaGDajustadastorage = localStorage.getItem("potenciaGDcontratada");
    if (potenciaGDajustadastorage) {
        potenciaGDajustadahtml.textContent = potenciaGDajustadastorage + " kW";
    } else {
        potenciaGDajustadahtml.textContent = "0" + " kW";
    }

    const fatorPotenciaGDajustadahtml = document.getElementById("valorAjustadoFatorPotenciaGD");
    const fatorPotenciaGDajustadastorage = localStorage.getItem("fatorPotenciaGDSelecionada");
    if (fatorPotenciaGDajustadastorage !== "" && fatorPotenciaGDajustadastorage !== null && fatorPotenciaGDajustadastorage != 0) {
        fatorPotenciaGDajustadahtml.textContent = fatorPotenciaGDajustadastorage * 100 + " %";
    } else {
        fatorPotenciaGDajustadahtml.textContent = "92" + " %";
    }

    const curtoajustadahtml = document.getElementById("valorAjustadoICCTri");
    const curtoajustadastorage = localStorage.getItem("curtoSelecionada");
    if (curtoajustadastorage) {
        curtoajustadahtml.textContent = curtoajustadastorage + " A";
    } else {
        curtoajustadahtml.textContent = "0" + " A";
    }


    // Persisti os valores do gerador a diesel no HTML

    // Exibir valores armazenados do gerador a diesel no HTML
    const geradorSalvo = JSON.parse(localStorage.getItem("geradorJSON"));
    if (geradorSalvo) {
        if (document.getElementById("potenciageradorhtml")) {
            document.getElementById("potenciageradorhtml").value = geradorSalvo.potencia || "";
        }
        if (document.getElementById("fatorpotenciageradorhtml")) {
            document.getElementById("fatorpotenciageradorhtml").value = geradorSalvo.fatorpotencia || "";
        }
        if (document.getElementById("toleranciageradorhtml")) {
            document.getElementById("toleranciageradorhtml").value = geradorSalvo.tolerancia || "";
        }
    }

    const potenciaReversaArmazenada = parseFloat(localStorage.getItem("potenciaReversaGerador"));
    const labelPotenciaReversa = document.getElementById("potenciareversageradorhtml");
    if (labelPotenciaReversa && !isNaN(potenciaReversaArmazenada)) {
        labelPotenciaReversa.textContent = potenciaReversaArmazenada.toFixed(2) + " W";
    }

    const potenciaReversaPUArmazenada = parseFloat(localStorage.getItem("potenciadieselPU"));
    const labelPotenciaReversaPU = document.getElementById("potenciareversageradorPUhtml");
    if (labelPotenciaReversaPU && !isNaN(potenciaReversaPUArmazenada)) {
        labelPotenciaReversaPU.textContent = potenciaReversaPUArmazenada.toFixed(4) + " P.U";
    }


    const potenciaGeradorAjustadaHtml = document.getElementById("valorAjustadoPotenciaGerador");
    const potenciaGeradorAjustadaStorage = geradorSalvo.potencia || 0;
    if (potenciaGeradorAjustadaStorage && potenciaGeradorAjustadaStorage !== "0" && potenciaGeradorAjustadaStorage !== "") {
        potenciaGeradorAjustadaHtml.textContent = potenciaGeradorAjustadaStorage + " kVA";
    } else {
        potenciaGeradorAjustadaHtml.textContent = "0 kVA";
    }

    const fatorPotenciaGeradorAjustadaHtml = document.getElementById("valorAjustadoFatorPotenciaGerador");
    const fatorPotenciaGeradorAjustadaStorage = geradorSalvo.fatorpotencia || 0;
    if (fatorPotenciaGeradorAjustadaStorage && fatorPotenciaGeradorAjustadaStorage !== "0" && fatorPotenciaGeradorAjustadaStorage !== "") {
        fatorPotenciaGeradorAjustadaHtml.textContent = fatorPotenciaGeradorAjustadaStorage + " %";
    } else {
        fatorPotenciaGeradorAjustadaHtml.textContent = "80 %";
    }

    const toleranciaGeradorAjustadaHtml = document.getElementById("valorAjustadoToleranciaGerador");
    const toleranciaGeradorAjustadaStorage = geradorSalvo.tolerancia || 0;
    if (toleranciaGeradorAjustadaStorage && toleranciaGeradorAjustadaStorage !== "0" && toleranciaGeradorAjustadaStorage !== "") {
        toleranciaGeradorAjustadaHtml.textContent = toleranciaGeradorAjustadaStorage + " %";
    } else {
        toleranciaGeradorAjustadaHtml.textContent = "5 %";
    }






}


//Função para calcular a potência reversa do gerador
function calculoGerador() {
    const geradorSalvo = JSON.parse(localStorage.getItem("geradorJSON")) || {};
    const potenciagerador = parseFloat(geradorSalvo.potencia) || 0;
    const fatorpotenciagerador = geradorSalvo.fatorpotencia !== undefined && geradorSalvo.fatorpotencia !== "" 
        ? parseFloat(geradorSalvo.fatorpotencia) 
        : 80;
    // Se não houver valor no localStorage, assume valor 5
    const toleranciagerador = geradorSalvo.tolerancia !== undefined && geradorSalvo.tolerancia !== ""
        ? parseFloat(geradorSalvo.tolerancia)
        : 5;
    const tempogeradoradiesel = 15;
    const statusfuncao32diesel = potenciagerador > 0 ? "Habilitado" : "Desabilitado";
    const tcProtecaoArmazenada = parseFloat(localStorage.getItem("TCdeprotecaoSelecionada")) || 0;
    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada")) || 0;

    // Potência reversa = potência * fator de potência * tolerância
    const potenciaReversa = (potenciagerador * 1000) * (fatorpotenciagerador / 100) * (toleranciagerador / 100);

    let potenciadieselPU = 0;
    if (potenciaReversa === 0 || tensaoArmazenada === 0 || tcProtecaoArmazenada === 0) {
        potenciadieselPU = 0;
    } else {
        potenciadieselPU = potenciaReversa / (tensaoArmazenada * 1000 * tcProtecaoArmazenada * Math.sqrt(3));

    }


 
    localStorage.setItem("statusfuncao32diesel", statusfuncao32diesel);
    localStorage.setItem("potenciaReversaGerador", potenciaReversa);
    localStorage.setItem("tempogeradoradiesel", tempogeradoradiesel);
    localStorage.setItem("potenciadieselPU", potenciadieselPU);

    

    



    // Exemplo: exibir no console ou salvar no localStorage
    console.log("Potência do gerador:", potenciagerador);
    console.log("Fator de potência do gerador:", fatorpotenciagerador);
    console.log("Tolerância do gerador:", toleranciagerador);
    console.log("Tempo do gerador a diesel:", tempogeradoradiesel);
    console.log("Status função 32 diesel:", statusfuncao32diesel);
    console.log("TC Proteção armazenada:", tcProtecaoArmazenada);
    console.log("Tensão armazenada:", tensaoArmazenada);
    console.log("Potência reversa do gerador:", potenciaReversa);
    console.log("Potência reversa do gerador em pu:", potenciadieselPU);


}










function importarICC() {

    const iccTrifasicaGemini = localStorage.getItem("ICCtrifasicagemini");
    const curtoajustadahtml = document.getElementById("valorAjustadoICCTri");
    if (iccTrifasicaGemini) {
        curtoajustadahtml.textContent = iccTrifasicaGemini + " A";
        localStorage.setItem("curtoSelecionada", iccTrifasicaGemini);
    } else {
        const curtoajustadastorage = localStorage.getItem("curtoSelecionada");
        curtoajustadahtml.textContent = curtoajustadastorage ? curtoajustadastorage + " A" : "0 A";
    }

    location.reload();
}

function limparICC() {

    localStorage.removeItem("ICCtrifasicagemini");
    const curtoajustadahtml = document.getElementById("valorAjustadoICCTri");
    const curtoajustadastorage = localStorage.getItem("curtoSelecionada");
    curtoajustadahtml.textContent = curtoajustadastorage ? curtoajustadastorage + " A" : "0 A";

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
const dial = 90000;
const beta = 300;
const alfa = 2;
const k = 1;
const ip = 0.5;
const iMin = ip * 2.01; // Começa um pouco acima de ip
const iMax = 300;
const pontos = 1000;

const dInverso = gerarCurvaTempoInversoSVG(dial, beta, alfa, k, ip, iMin, iMax, pontos);

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
