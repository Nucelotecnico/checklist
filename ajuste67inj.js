






 let correnteFormatada = 0;
let Ippercentual = 0;
let Imagpercentual = 0;
let curvafase = 0
let dial = 0;
let alfa1 = 0;
let beta1 = 0;
let k1 = 0;
var tempomagfase = 0.1;

 let inominalneutro = 0;
let ipeutropercentual = 0;
let imagpercentualneutro = 0;
let curvaneutro = 0;
let dial2 = 0;
let alfa2 = 0;
let beta2 = 0;
let k2 = 0;


let ipneutro = 0;
let imagneutro = 0;
let Iinstneutro = 0;

var dial_calculado_planta = 0;
var dial_calculado = 0;

// Importa statuslegenda do localStorage ou usa valor padrão
var legenda = localStorage.getItem('statuslegenda') || 'none'; // Variável para controlar a exibição da legenda


//Gravar todas as variaveis escrita nos inputs do local storage

async function salvarOpcao() {

    const anguloFase = document.getElementById("angulofasehtml");
    const anguloFaseSelecionadoGD = anguloFase.value;
    localStorage.setItem("anguloFaseSelecionadoGD", anguloFaseSelecionadoGD);

    //Captura dos valores de fase dos campos preenchiveis do HTML 
    const IPpercentual = document.getElementById("IPpercentualhtml");
    let IPpercentualSelecionadaGD = parseFloat(IPpercentual.value);
    if (IPpercentualSelecionadaGD < 100) {
        await validarPercentualMinimo(IPpercentualSelecionadaGD, "");
        IPpercentualSelecionadaGD = 105;
        IPpercentual.value = 105; // Atualiza o campo no HTML
    }

    localStorage.setItem("PercentualIPSelecionadaGD", IPpercentualSelecionadaGD);

    const curvafasehtml = document.getElementById("tipodecurvahtml");
    const curvafaseSelecionadaGD = curvafasehtml.value;

    localStorage.setItem("curvafaseSelecionadaGD", curvafaseSelecionadaGD);


    const dialfase = document.getElementById("dialfasehtml");
    const dialfaseSelecionadaGD = dialfase.value;

    localStorage.setItem("dialfaseSelecionadaGD", dialfaseSelecionadaGD);

    //Captura dos valores de neutro dos campos preenchiveis do HTML 

    const anguloNeutro = document.getElementById("anguloneutrohtml");
    const anguloNeutroSelecionadoGD = anguloNeutro.value;
    localStorage.setItem("anguloNeutroSelecionadoGD", anguloNeutroSelecionadoGD);

    const IPpercentualneutro = document.getElementById("IPpercentualneutrohtml");
    let IPpercentualneutroSelecionadaGD = parseFloat(IPpercentualneutro.value);
    if (IPpercentualneutroSelecionadaGD < 100) {
        await validarPercentualMinimo(IPpercentualneutroSelecionadaGD, "");
        IPpercentualneutroSelecionadaGD = 105;
        IPpercentualneutro.value = 105; // Atualiza o campo no HTML
    }

    localStorage.setItem("PercentualIPneutroSelecionadaGD", IPpercentualneutroSelecionadaGD);

    const curvaneutro = document.getElementById("tipodecurvaneutrohtml");
    const curvaneutroSelecionadaGD = curvaneutro.value;

    localStorage.setItem("curvaneutroSelecionadaGD", curvaneutroSelecionadaGD);


    const dialneutro = document.getElementById("dialneutrohtml");
    let dialneutroSelecionadaGD = dialneutro.value;
    if (!dialneutroSelecionadaGD || isNaN(parseFloat(dialneutroSelecionadaGD))) {
        dialneutroSelecionadaGD = 5;
        dialneutro.value = 5;
    }
    // Validação: dialneutro deve estar entre 5 e 9
    if (parseFloat(dialneutroSelecionadaGD) < 5 || parseFloat(dialneutroSelecionadaGD) > 9) {
        await validarPercentualMinimo(
            0,
            "O valor do dial neutro deve estar entre 5 e 9."
        );
        dialneutroSelecionadaGD = 5;
        dialneutro.value = 5;
    }

    localStorage.setItem("dialneutroSelecionadaGD", dialneutroSelecionadaGD);

    //-----------------------------------------------------------------------------------------
    location.reload();//recarrega a página sempre que o botão é clicado
}

window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoajustesGDhtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    const botaoParametro2 = document.getElementById("botaoajustes67injhtml");
    if (botaoParametro2) {
        botaoParametro2.style.backgroundColor = "#cf0808";
    }
    // -----------------manter o botão vermelho selecionado-------------------

    //Resgata todos os valores do html para as variaveis internas do js e salva nos campos HTML
    const anguloFase = document.getElementById("angulofasehtml");
    // Recupera o valor do ângulo de fase do localStorage e atualiza o campo HTML
    let anguloFaseArmazenada = parseFloat(localStorage.getItem("anguloFaseSelecionadoGD"));
    if (anguloFaseArmazenada !== null && anguloFaseArmazenada !== undefined && anguloFaseArmazenada !== "" && !isNaN(anguloFaseArmazenada)) {
        // let anguloFaseFloat = parseFloat(anguloFaseArmazenada);
        anguloFase.value = anguloFaseArmazenada;
    } else {
        anguloFase.value = ""; // Valor padrão se não houver no localStorage
    }


    const AMTpadraofase = document.getElementById("AMTpadraofasehtml");
    if (anguloFaseArmazenada !== null && anguloFaseArmazenada !== undefined && anguloFaseArmazenada !== "" && !isNaN(anguloFaseArmazenada)) {
        AMTpadraofase.textContent = anguloFaseArmazenada + "°"; // Exibe o valor com o símbolo de grau
    } else {
        AMTpadraofase.textContent = "45°"; // Valor padrão se não houver no localStorage
    }


    const IPpercentualhtml = document.getElementById("IPpercentualhtml");
    const Ippercentual = parseFloat(localStorage.getItem("PercentualIPSelecionadaGD")) || 0;
    if (Ippercentual !== null && Ippercentual !== undefined && Ippercentual !== "" && !isNaN(Ippercentual)) {
        IPpercentualhtml.value = Ippercentual;
    } else {
        IPpercentualhtml.value = "105"; // Valor padrão se não houver no localStorage
    }


    const tipodecurvahtml = document.getElementById("tipodecurvahtml");
    const curvafaseArmazenada = localStorage.getItem("curvafaseSelecionadaGD");
    if (curvafaseArmazenada !== null && curvafaseArmazenada !== undefined && curvafaseArmazenada !== "") {
        tipodecurvahtml.value = curvafaseArmazenada;
    } else {
        tipodecurvahtml.value = ""; // Valor padrão se não houver no localStorage
    }

    const dialfasehtml = document.getElementById("dialfasehtml");
    const dialfaseArmazenada = parseFloat(localStorage.getItem("dialfaseSelecionadaGD")) || 0.1;
    if (dialfaseArmazenada !== null && dialfaseArmazenada !== undefined && dialfaseArmazenada !== "") {
        dialfasehtml.value = dialfaseArmazenada;
    } else {
        dialfasehtml.value = 0.1; // Valor padrão se não houver no localStorage
    }



    //--------------------- importar inputs do localstorage para o neutro



    const anguloNeutro = document.getElementById("anguloneutrohtml");
    let anguloNeutroArmazenada = parseFloat(localStorage.getItem("anguloNeutroSelecionadoGD"));
    if (anguloNeutroArmazenada !== null && anguloNeutroArmazenada !== undefined && anguloNeutroArmazenada !== "" && !isNaN(anguloNeutroArmazenada)) {
        anguloNeutro.value = anguloNeutroArmazenada;
    } else {
        anguloNeutro.value = ""; // Valor padrão se não houver no localStorage
    }


    const AMTpadraoneutro = document.getElementById("AMTpadraoneutrohtml");
    if (anguloNeutroArmazenada !== null && anguloNeutroArmazenada !== undefined && anguloNeutroArmazenada !== "" && !isNaN(anguloNeutroArmazenada)) {
        AMTpadraoneutro.textContent = anguloNeutroArmazenada + "°"; // Exibe o valor com o símbolo de grau
    } else {
        AMTpadraoneutro.textContent = "-110°"; // Valor padrão se não houver no localStorage
    }



    const IPpercentualneutrohtml = document.getElementById("IPpercentualneutrohtml");
    const ipneutropercentualArmazenada = parseFloat(localStorage.getItem("PercentualIPneutroSelecionadaGD")) || 0;
    if (ipneutropercentualArmazenada !== null && ipneutropercentualArmazenada !== undefined && ipneutropercentualArmazenada !== "" && !isNaN(ipneutropercentualArmazenada)) {
        IPpercentualneutrohtml.value = ipneutropercentualArmazenada;
    } else {
        IPpercentualneutrohtml.value = "105"; // Valor padrão se não houver no localStorage
    }


    const tipodecurvaneutrohtml = document.getElementById("tipodecurvaneutrohtml");
    const curvaneutroArmazenada = localStorage.getItem("curvaneutroSelecionadaGD");
    if (curvaneutroArmazenada !== null && curvaneutroArmazenada !== undefined && curvaneutroArmazenada !== "") {
        tipodecurvaneutrohtml.value = curvaneutroArmazenada;
    } else {
        tipodecurvaneutrohtml.value = ""; // Valor padrão se não houver no localStorage
    }


    const dialneutrohtml = document.getElementById("dialneutrohtml");
    const dialneutroArmazenada = localStorage.getItem("dialneutroSelecionadaGD") || 5;
    if (dialneutroArmazenada !== null && dialneutroArmazenada !== undefined && dialneutroArmazenada !== "") {
        dialneutrohtml.value = dialneutroArmazenada;
    } else {
        dialneutrohtml.value = 5; // Valor padrão se não houver no localStorage
    }


    //calculos correntes de fase
    //Resgata todos os valores de fase do local storage para as variaveis internas do js e salva nos campos HTML
    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada")) || 0;
    const potenciaArmazenada = parseFloat(localStorage.getItem("demandaSelecionadaGD")) || 0;
    const fatorpArmazenada = parseFloat(localStorage.getItem("fatorPotenciaSelecionadaGD")) || 0;
    // const curvafaseArmazenada = localStorage.getItem("curvafaseSelecionadaGD");
    // const dialfaseArmazenada = localStorage.getItem("dialfaseSelecionadaGD") || 0;
    const TCdeprotecaoSelecionada = parseFloat(localStorage.getItem("TCdeprotecaoSelecionada")) || 0;
    const curtoArmazenada = parseFloat(localStorage.getItem("curtoSelecionada")) || 0;
    const desequilibrio = parseFloat(localStorage.getItem("desequilibrioSelecionada")) || 0;


    let correnteprimaria = parseFloat(localStorage.getItem("InominalfaseGD")) || 0;
    console.log("correnteprimaria: ", correnteprimaria);

    // Se correnteprimaria for zero, indefinido ou não for número, define como 10% do TC de proteção
    let correnteprimariaValida = correnteprimaria;
    if (!correnteprimariaValida || isNaN(correnteprimariaValida) || correnteprimariaValida === 0) {
        correnteprimariaValida = TCdeprotecaoSelecionada * 0.1;
    }
    // Se correnteprimaria for menor que 10% do TC de proteção, ajusta para 10% do TC
    if (correnteprimariaValida < TCdeprotecaoSelecionada * 0.1) {
        correnteprimariaValida = TCdeprotecaoSelecionada * 0.1;
    }
    correnteprimaria = correnteprimariaValida;

    var correnteIP = correnteprimaria * (1 * Ippercentual / 100);
    correnteFormatada = correnteIP;

    localStorage.setItem("IpfaseGD", correnteFormatada);

    const Inominalhtml = document.getElementById("Inominalhtml");
    Inominalhtml.textContent = correnteprimaria.toFixed(2) + " A";

    const IPrealhtml = document.getElementById("IPrealhtml");
    IPrealhtml.textContent = correnteFormatada.toFixed(2) + " A";

    // tipodecurvahtml.value = curvafaseArmazenada;

    // dialfasehtml.value = dialfaseArmazenada;
    


    //calculos correntes de neutro
    // const ipneutropercentualArmazenada = parseFloat(localStorage.getItem("PercentualIPneutroSelecionadaGD")) || 0;
    // const curvaneutroArmazenada = localStorage.getItem("curvaneutroSelecionadaGD");
    // const dialneutroArmazenada = localStorage.getItem("dialneutroSelecionadaGD") || 0;


    //Calculo da  corrente nominal de neutro
    inominalneutro = (correnteprimaria * (desequilibrio));
    // Calculo da corrente IP de neutro somando a tolerancia a corrente nominal
    ipneutro = inominalneutro * (1 * ipneutropercentualArmazenada / 100);
    // Armazenando o valor de ipneutro no local storage
    localStorage.setItem("IpdeneutroSelecionadaGD", ipneutro);
    localStorage.setItem("InominalneutroGD", inominalneutro);



    
    const inominalneutrohtml = document.getElementById("Inominalneutrohtml");

    const IPrealneutrohtml = document.getElementById("IPrealneutrohtml");







    //Resgata todos os valores de neutro do local storage para as variaveis internas do js e salva nos campos HTML
    // const anguloNeutroArmazenada = parseFloat(localStorage.getItem("anguloNeutroSelecionadoGD")) || 0;



    // -------------------------------------------------------------------------------
    // Calculo da  corrente IP de fase somando a tolerancia a corrente nominal




    //codigo novo

    //fim do codigo novo


    //-----------FIM DO CALCULO DO MINIMO DE CORRENTE DE CONSUMO PARA O TC DE PROTEÇÃO-----------------------------









    //---------------------------------------------------------------------------------------
    //CACLULOS PARA VALORES DAS CORRENTE EM P.U
    //importar valor do local storage do TC de proteção selecionado
    const TCselecionado = parseFloat(localStorage.getItem("TCdeprotecaoSelecionada")) || 0;

    //Divide valores encontrados por valor primário do TC selecionado
    const ipPU = correnteIP / TCselecionado;
    // const iinstPU = Imaginstantanea / TCselecionado;
    const ipneutroPU = ipneutro / TCselecionado;
    // const instneutroPU = Iinstneutro / TCselecionado;

    //Armazena os valores de P.U no local storage
    localStorage.setItem("ipPUSelecionadaGD", ipPU);
    // localStorage.setItem("iinstPUSelecionadaGD", iinstPU);
    localStorage.setItem("ipneutroPUSelecionadaGD", ipneutroPU);
    // localStorage.setItem("instneutroPUSelecionadaGD", instneutroPU);



    //alimenta todos os campos da tela com os valores do local storage diretamente no HTML





    // IPpercentualhtml.value = Ippercentual;





    // anguloNeutro.value = anguloNeutroArmazenada.toFixed(2);
    inominalneutrohtml.textContent = inominalneutro.toFixed(2) + " A";
    IPpercentualneutrohtml.value = ipneutropercentualArmazenada;
    IPrealneutrohtml.textContent = ipneutro.toFixed(2) + " A";
    tipodecurvaneutrohtml.value = curvaneutroArmazenada;
    dialneutrohtml.value = dialneutroArmazenada;


    //alimenta todos os campos da tela com os valores do local storage diretamente no HTML

    Inominalhtml.textContent = correnteprimaria.toFixed(2) + " A";

    // Validar antes de definir valores nos campos
    IPpercentualhtml.value = (!isNaN(Ippercentual) && Ippercentual !== null) ? Ippercentual : 0;

    console.log("IPpercentual: ", Ippercentual);

    IPrealhtml.textContent = correnteFormatada.toFixed(2) + " A";
    tipodecurvahtml.value = curvafaseArmazenada || '';

    // Validar dialfaseArmazenada
    dialfasehtml.value = (!isNaN(parseFloat(dialfaseArmazenada)) && dialfaseArmazenada !== null) ? dialfaseArmazenada : '';



    inominalneutrohtml.textContent = inominalneutro.toFixed(2) + " A";

    // Validar ipneutropercentualArmazenada
    IPpercentualneutrohtml.value = (!isNaN(ipneutropercentualArmazenada) && ipneutropercentualArmazenada !== null) ? ipneutropercentualArmazenada : 0;

    IPrealneutrohtml.textContent = ipneutro.toFixed(2) + " A";
    tipodecurvaneutrohtml.value = curvaneutroArmazenada || '';

    // Validar dialneutroArmazenada
    dialneutrohtml.value = (!isNaN(parseFloat(dialneutroArmazenada)) && dialneutroArmazenada !== null) ? dialneutroArmazenada : '';





    // Atualização dos valores de P.U na tela
    const ipPUhtml = document.getElementById("IpPUhtml");
    ipPUhtml.textContent = ipPU.toFixed(2) + " P.U";



    const ipneutroPUhtml = document.getElementById("ipneutroPUhtml");
    ipneutroPUhtml.textContent = ipneutroPU.toFixed(2) + " P.U";



    //----------------------------------------------atualização de valores na tela da tabela
    const pencentualIP = document.getElementById("IPpercentualhtml");
    const percentualIPSalva = localStorage.getItem("PercentualIPSelecionadaGD") || 0;

    if (percentualIPSalva) {
        pencentualIP.value = percentualIPSalva;
    }
    //--------------------------------------------------------------------------------------




    //    console.log(correnteFormatada);
    // Definição do tipo de curva de fase 

    curvafase = curvafaseArmazenada;

    switch (curvafase) {

        case "IEC-N.I":
            alfa1 = 0.02;
            beta1 = 0.14;
            k1 = 1;
            break;

        case "IEC-V.I":
            alfa1 = 1;
            beta1 = 13.5;
            k1 = 1;
            break;

        case "IEC-E.I":
            alfa1 = 2;
            beta1 = 80;
            k1 = 1;
            break;

        case "LONG":
            alfa1 = 1;
            beta1 = 80;
            k1 = 1;
            break;

        case "Definite-Time":
            alfa1 = 0;
            beta1 = 1;
            k1 = 0;
            break;


        default:
            alfa1 = 0;
            beta1 = 0;
            k1 = 0;
            break;


    }

    const dadosCurvaUsuarioFase = {
        tipoCurva: curvafaseArmazenada,
        dial: dialfaseArmazenada,
        alfa: alfa1,
        beta: beta1,
        k: k1
    };
    localStorage.setItem("dadoscurvausariofase", JSON.stringify(dadosCurvaUsuarioFase));

    curvaneutro = curvaneutroArmazenada;

    switch (curvaneutro) {

        case "IEC-N.I":
            alfa2 = 0.02;
            beta2 = 0.14;
            k2 = 1;
            break;

        case "IEC-V.I":
            alfa2 = 1;
            beta2 = 13.5;
            k2 = 1;
            break;

        case "IEC-E.I":
            alfa2 = 2;
            beta2 = 80;
            k2 = 1;
            break;

        case "LONG":
            alfa2 = 1;
            beta2 = 80;
            k2 = 1;
            break;

        case "Definite-Time":
            alfa2 = 0;
            beta2 = 1;
            k2 = 0;
            break;

        default:
            alfa2 = 0;
            beta2 = 0;
            k2 = 0;
            break;
    }


    //------------------------------------------------------------------
    // Reprodução das variaveis no gráfico de coordenação
    // Definição das variáveis comuns
    let dial1 = dialfaseArmazenada;

    let ip1 = correnteFormatada;
    let  iccGD = ip1 * (Math.sqrt((dial1 * beta1 + k1) / 0.01));
   //let  iccGD = 10000;
    let Iinst1 = iccGD;
    let x1 = [iccGD];
    let y1 = [0.01];
    let ideffase = 10000;
    let tdeffase = 10000;

    console.log("ip1: ", ip1);
    console.log("dial1: ", dial1);
    console.log("beta1: ", beta1);
    console.log("k1: ", k1);

    console.log("ICC GD: ", iccGD);


    let passo1 = (Iinst1 - ip1) / 1000;

    for (let i = 0; Iinst1 >= ip1; i++) {
        const idefValido = !isNaN(ideffase) && ideffase !== null && ideffase !== undefined;
        const tdefValido = !isNaN(tdeffase) && tdeffase !== null && tdeffase !== undefined;

        let z1 = dial1 * (beta1 / (Math.pow(Iinst1 / ip1, alfa1) - k1));
        let tempo = z1;

        // Se idef e tdef são válidos, e estamos na região <= ideffase, pega o menor entre z1 e tdeffase
        if (idefValido && tdefValido && Iinst1 >= ideffase) {
            tempo = Math.min(tempo, tdeffase);
        }

        x1.push(Iinst1);
        y1.push(tempo);




        Iinst1 -= passo1;
        if (Iinst1 <= (ip1 - 0.9)) {
            // Garante o último ponto em ip1
            x1.push(ip1);
            let z1final = dial1 * (beta1 / (Math.pow(ip1 / ip1, alfa1) - k1));
            let tempofinal = Math.min(z1final, 1000);
            if (idefValido && tdefValido && ip1 <= ideffase) {
                tempofinal = Math.min(tempofinal, tdeffase);
            }
            y1.push(tempofinal);
            break;
        }
    }
    if (y1[y1.length - 1] !== 1000) {
        x1.push(ip1);
        y1.push(1000);
    }



    // Segunda curva
    // Definição das variáveis comuns
    let dial2 = dialneutroArmazenada;
    let Iinst2 = 20000;
    let ip2 = ipneutro;
    let x2 = [20000];
    let y2 = [0.01];
    let idefneutro = 20000;
    let tdefneutro = 1000;




    let passo2 = (Iinst2 - ip2) / 1000;
    // Se dial2 não tiver valor, considera 1000
    if (!dial2 || isNaN(dial2)) {
        dial2 = 1000;
    }

    for (let i = 0; Iinst2 >= ip2; i++) {
        const idefValidoNeutro = !isNaN(idefneutro) && idefneutro !== null && idefneutro !== undefined;
        const tdefValidoNeutro = !isNaN(tdefneutro) && tdefneutro !== null && tdefneutro !== undefined;

        let z2 = dial2 * (beta2 / (Math.pow(Iinst2 / ip2, alfa2) - k2));
        let tempo2 = z2;

        // Se idef e tdef são válidos, e estamos na região <= idefneutro, pega o menor entre z2 e tdefneutro
        if (idefValidoNeutro && tdefValidoNeutro && Iinst2 >= idefneutro) {
            tempo2 = Math.min(tempo2, tdefneutro);
        }

        x2.push(Iinst2);
        y2.push(tempo2);

        Iinst2 -= passo2;
        if (Iinst2 <= (ip2)) {
            // Garante o último ponto em ip2
            x2.push(ip2);
            let z2final = dial2 * (beta2 / (Math.pow(ip2 / ip2, alfa2) - k2));
            let tempofinal2 = Math.min(z2final, 1000);
            if (idefValidoNeutro && tdefValidoNeutro && ip2 <= idefneutro) {
                tempofinal2 = Math.min(tempofinal2, tdefneutro);
            }
            y2.push(tempofinal2);
            break;
        }
    }
    if (y2[y2.length - 1] !== 1000) {
        x2.push(ip2);
        y2.push(1000);
    }

    // Armazena os pontos x e y de fase e neutro no localStorage separadamente em formato JSON
    localStorage.setItem("pontosCurvaFaseX", JSON.stringify(x1));
    localStorage.setItem("pontosCurvaFaseY", JSON.stringify(y1));
    localStorage.setItem("pontosCurvaNeutroX", JSON.stringify(x2));
    localStorage.setItem("pontosCurvaNeutroY", JSON.stringify(y2));




    // Exibe no console todas as informações de correntestrafosJSON, se houver
    const correntesTrafos = JSON.parse(localStorage.getItem("correntestrafosJSON")) || 0;







    // ------

    // Configuração do gráfico logarítmico

    let ctx = document.getElementById('grafico').getContext('2d');


    let grafico = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Curva 67 fase injeção ',
                    data: x1.map((val, index) => ({ x: val, y: y1[index] })),
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: 'Curva 67N neutro injeção',
                    data: x2.map((val, index) => ({ x: val, y: y2[index] })),
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: 'I nominal fase' + (isNaN(correnteprimaria) ? '' : ' (' + correnteprimaria.toFixed(2) + ' A)'),

                    data: [{ x: correnteprimaria, y: 0.01 }],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I nominal fase',

                    data: [
                        { x: correnteprimaria, y: 0.01 },
                        { x: correnteprimaria, y: 1000 }
                    ],
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    fill: false,
                    showLine: true
                },
                {
                    label: 'I nominal neutro' + (isNaN(inominalneutro) ? '' : ' (' + inominalneutro.toFixed(2) + ' A)'),
                    data: [{ x: inominalneutro, y: 0.01 }],
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I nominal neutro',
                    data: [
                        { x: inominalneutro, y: 0.01 },
                        { x: inominalneutro, y: 1000 }
                    ],
                    borderColor: 'blue',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    fill: false,
                    showLine: true
                },
                {
                    label: 'I Ip fase' + (isNaN(ip1) ? '' : ' (' + ip1.toFixed(2) + ' A)'),
                    data: [{ x: ip1, y: 0.01 }],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I Ip neutro' + (isNaN(ip2) ? '' : ' (' + ip2.toFixed(2) + ' A)'),
                    data: [{ x: ip2, y: 0.01 }],
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },



            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: legenda // <-- Define se aparece legenda(top,bottom,left,right ou none)
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Corrente (A)' },
                    min: 1,
                    max: iccGD + 1000,
                    grid: {
                        display: true,
                        // Ativa linhas principais
                        color: 'rgba(0,0,0,0.1)',
                        // Ativa linhas secundárias (menores)
                        drawTicks: true,
                        borderDash: [2, 2],
                        // Configura as linhas secundárias
                        minor: {
                            display: true,
                            color: 'rgba(0,0,0,0.05)', // cor mais clara para secundárias
                            borderDash: [1, 1]
                        }
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Tempo (s)' },
                    min: 0.01,
                    max: 1000,

                    grid: {
                        display: true,
                        // Ativa linhas principais
                        color: 'rgba(0,0,0,0.1)',
                        // Ativa linhas secundárias (menores)
                        drawTicks: true,
                        borderDash: [2, 2],
                        // Configura as linhas secundárias
                        minor: {
                            display: true,
                            color: 'rgba(0,0,0,0.05)', // cor mais clara para secundárias
                            borderDash: [1, 1]
                        }
                    }
                }
            }
        }
    });




    // verificarAlertaPotMinima();
};


//função para comparar o melhor dial entre planta com motor e sem motor 



// Função para ativar as legendas do gráfico
function ativarLegendas() {

    const statuslegenda = (legenda === 'none') ? 'bottom' : 'none';

    localStorage.setItem('statuslegenda', statuslegenda);

    location.reload();
}


// Função para gerar alerta dos 10% do primario do TC de proteção

// function verificarAlertaPotMinima() {
//     const status = localStorage.getItem("inominalminimaTC");
//     const alertaDiv = document.querySelector(".alertapotminima");
//     if (status) {
//         if (status === "Sim") {
//             alertaDiv.style.display = "";
//             // Adiciona classe para piscar lentamente
//             alertaDiv.classList.add("piscando-lento");
//         } else {
//             alertaDiv.style.display = "none";
//             alertaDiv.classList.remove("piscando-lento");
//         }
//     }
// }

// Adicione este CSS ao seu arquivo ou dentro de uma <style> no HTML:
/*
.piscando-lento {
    animation: piscarLento 1.5s infinite;
}
@keyframes piscarLento {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}
*/

// Chame a função ao carregar a página




// Função para validar o percentual mínimo de 100% e exibir um alerta estilizado
function validarPercentualMinimo(valor, mensagem) {
    if (valor < 100) {
        // Cria o alerta estilizado
        const alerta = document.createElement("div");
        alerta.textContent = mensagem || "O valor percentual não pode ser menor que 100%.";
        alerta.style.position = "fixed";
        alerta.style.top = "20px";
        alerta.style.right = "-400px";
        alerta.style.background = "linear-gradient(to left, #b6fcb6 80%, #fff 100%)";
        alerta.style.color = "#222";
        alerta.style.padding = "16px 32px";
        alerta.style.borderRadius = "8px";
        alerta.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        alerta.style.fontWeight = "bold";
        alerta.style.fontSize = "1.1em";
        alerta.style.zIndex = "9999";
        alerta.style.transition = "right 0.5s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.5s";

        document.body.appendChild(alerta);

        setTimeout(() => {
            alerta.style.right = "20px";
        }, 50);

        // Retorna uma Promise que resolve após o alerta sumir
        return new Promise(resolve => {
            setTimeout(() => {
                alerta.style.right = "-400px";
                alerta.style.opacity = "0";
                setTimeout(() => {
                    alerta.remove();
                    resolve();
                }, 500);
            }, 2000);
        });
    }
    // Se não precisar alertar, retorna Promise resolvida imediatamente
    return Promise.resolve();
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
