
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


//Gravar todas as variaveis escrita no armazenamento do local storage

async function salvarOpcao() {

    const IPpercentual = document.getElementById("IPpercentualhtml");
    let IPpercentualSelecionada = parseFloat(IPpercentual.value);
    if (IPpercentualSelecionada < 100) {
        await validarPercentualMinimo(IPpercentualSelecionada, "");
        IPpercentualSelecionada = 105;
        IPpercentual.value = 105; // Atualiza o campo no HTML
                // alert("O valor percentual de IP não pode ser menor que 100 %.");
        
    }

    const curvafase = document.getElementById("tipodecurvahtml");
    const curvafaseSelecionada = curvafase.value;

    const dialfase = document.getElementById("dialfasehtml");
    const dialfasereal = dialfase.value;
    const imagfase = document.getElementById("imagpercentual");
    let imagpercentualSelecionada = parseFloat(imagfase.value);
    if (imagpercentualSelecionada < 100) {
        await validarPercentualMinimo(imagpercentualSelecionada, "");
        imagpercentualSelecionada = 105;
        imagfase.value = 105; // Atualiza o campo no HTML
        
    }

    const imagsimulada = document.getElementById("imagsimuladahtml");
    const imagsimuladaSelecionada = imagsimulada.value;



    const idefdefase = document.getElementById("idef-fase-html");
    const idefdefaseSelecionada = idefdefase.value;

    const tdefdefase = document.getElementById("tdef-fase-html");
    const tdefdefaseSelecionada = tdefdefase.value;





    const IPpercentualneutro = document.getElementById("IPpercentualneutrohtml");
    let IPpercentualneutroSelecionada = parseFloat(IPpercentualneutro.value);
    if (IPpercentualneutroSelecionada < 100) {
        await validarPercentualMinimo(IPpercentualneutroSelecionada, "");
        IPpercentualneutroSelecionada = 105;
        IPpercentualneutro.value = 105; // Atualiza o campo no HTML
    }

    const curvaneutro = document.getElementById("tipodecurvaneutrohtml");
    const curvaneutroSelecionada = curvaneutro.value;

    const dialneutro = document.getElementById("dialcurvaneutrohtml");
    const dialneutroreal = dialneutro.value;
    const imagneutropercentual = document.getElementById("Imagneutropercentual");
    let imagneutropercentualSelecionada = parseFloat(imagneutropercentual.value);
    if (imagneutropercentualSelecionada < 100) {
        await validarPercentualMinimo(imagneutropercentualSelecionada, "");
        imagneutropercentualSelecionada = 105;
        imagneutropercentual.value = 105; // Atualiza o campo no HTML
    }

    const idefdeneutro = document.getElementById("idef-neutro-html");
    const idefdeneutroSelecionada = idefdeneutro.value;

    const tdefdeneutro = document.getElementById("tdef-neutro-html");
    const tdefdeneutroSelecionada = tdefdeneutro.value;


    //armazenamento dos valores de fase no local storage
    localStorage.setItem("PercentualIPSelecionada", IPpercentualSelecionada);
    localStorage.setItem("curvafaseSelecionada", curvafaseSelecionada);
    localStorage.setItem("dialfasereal", dialfasereal);
    localStorage.setItem("imagpercentualSelecionada", imagpercentualSelecionada);
    localStorage.setItem("imagsimuladaSelecionada", imagsimuladaSelecionada);
    localStorage.setItem("ideffaseSelecionada", idefdefaseSelecionada);
    localStorage.setItem("tdeffaseSelecionada", tdefdefaseSelecionada);


    //armazenamento dos valores de neutro no local storage
    localStorage.setItem("PercentualIPneutroSelecionada", IPpercentualneutroSelecionada);
    localStorage.setItem("curvaneutroSelecionada", curvaneutroSelecionada);
    localStorage.setItem("dialneutroreal", dialneutroreal);
    localStorage.setItem("imagneutropercentualSelecionada", imagneutropercentualSelecionada);
    localStorage.setItem("idefneutroSelecionada", idefdeneutroSelecionada);
    localStorage.setItem("tdefneutroSelecionada", tdefdeneutroSelecionada);


    location.reload();//recarrega a página sempre que o botão é clicado






}



window.onload = function () {
    // -----------------manter o botão vermelho selecionado-------------------
    const botaoParametro = document.getElementById("botaoajustesGDhtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    const botaoParametro2 = document.getElementById("botaojuste67conshtml");
    if (botaoParametro2) {
        botaoParametro2.style.backgroundColor = "#cf0808";
    }
    // -----------------manter o botão vermelho selecionado-------------------

    calculadialideal();
    

    

    



    //Resgata todos os valores do html para as variaveis internas do js e salva nos campos HTML
    const Inominalhtml = document.getElementById("Inominalhtml");
    const IPpercentualhtml = document.getElementById("IPpercentualhtml");
    const IPrealhtml = document.getElementById("IPrealhtml");
    const tipodecurvahtml = document.getElementById("tipodecurvahtml");
     // Padrão 1000 se não houver valor
    const dialfasehtml = document.getElementById("dialfasehtml");
    const imagfase = document.getElementById("imagfase");
    const imagpercentual = document.getElementById("imagpercentual");
    const imagreal = document.getElementById("imagreal");
    const imagrealcalculada = document.getElementById("imagrealcalculadahtml");

    const imagsimuladahtml = document.getElementById("imagsimuladahtml");
    const ideffasehtml = document.getElementById("idef-fase-html");
    const tdeffasehtml = document.getElementById("tdef-fase-html");





    const inominalneutrohtml = document.getElementById("Inominalneutrohtml");
    const IPpercentualneutrohtml = document.getElementById("IPpercentualneutrohtml");
    const IPrealneutrohtml = document.getElementById("IPrealneutrohtml");
    const tipodecurvaneutrohtml = document.getElementById("tipodecurvaneutrohtml");
    const dialcurvaneutrohtml = document.getElementById("dialcurvaneutrohtml") ;
    const dialidealneutro = document.getElementById("dialidealneutro");
    const dialrealneutro = document.getElementById("dialrealneutro");


    const Imagneutro = document.getElementById("Imagneutro");
    const Imagneutropercentual = document.getElementById("Imagneutropercentual") || 105;
    const Iinstneutrohtml = document.getElementById("Iinstneutrohtml");
    const idefneutrohtml = document.getElementById("idef-neutro-html");
    const tdefneutrohtml = document.getElementById("tdef-neutro-html");



    //Resgata todos os valores de fase do local storage para as variaveis internas do js e salva nos campos HTML
    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada"));
    const potenciaArmazenada = parseFloat(localStorage.getItem("demandaSelecionada"));
    const fatorpArmazenada = parseFloat(localStorage.getItem("fatorPotenciaSelecionada"));
    const Ippercentual = parseFloat(localStorage.getItem("PercentualIPSelecionada")) || 105;
    const curvafaseArmazenada = localStorage.getItem("curvafaseSelecionada");
    const dialfasereal = localStorage.getItem("dialfasereal");
    const dialfaseArmazenada = localStorage.getItem("dialfaseSelecionada");
    const imagArmazenada = parseFloat(localStorage.getItem("imagtotalSelecionada"));
    const imagpercentualArmazenada = parseFloat(localStorage.getItem("imagpercentualSelecionada")) || 105;
    const imagsimuladaArmazenada = parseFloat(localStorage.getItem("imagsimuladaSelecionada"));
    const imagrealcalculadaArmazenada = parseFloat(localStorage.getItem("inmagrealSelecionada"));
    const ideffaseArmazenada = parseFloat(localStorage.getItem("ideffaseSelecionada"));
    const tdeffaseArmazenada = parseFloat(localStorage.getItem("tdeffaseSelecionada"));
    const imagresultanteArmazenada = parseFloat(localStorage.getItem("Imagresultante"));
    const TCdeprotecaoSelecionada = parseFloat(localStorage.getItem("TCdeprotecaoSelecionada"));


    const curtoArmazenada = parseFloat(localStorage.getItem("curtoSelecionada"));
    const desequilibrio = parseFloat(localStorage.getItem("desequilibrioSelecionada")) || 0.33;


    //Resgata todos os valores de neutro do local storage para as variaveis internas do js e salva nos campos HTML

    const ipneutropercentualArmazenada = parseFloat(localStorage.getItem("PercentualIPneutroSelecionada")) || 105;
    const curvaneutroArmazenada = localStorage.getItem("curvaneutroSelecionada");
    const dialneutroArmazenada = localStorage.getItem("dialneutroSelecionada");
    const dialneutroreal = parseFloat(localStorage.getItem("dialneutroreal"));
    const imagneutroArmazenada = parseFloat(localStorage.getItem("imagneutropercentualSelecionada")) || 105;
    const idefneutroArmazenada = parseFloat(localStorage.getItem("idefneutroSelecionada"));
    const tdefneutroArmazenada = parseFloat(localStorage.getItem("tdefneutroSelecionada"));








    // -------------------------------------------------------------------------------
    // Calculo da  corrente IP de fase somando a tolerancia a corrente nominal



    //codigo novo
    var correnteprimaria = parseFloat(localStorage.getItem("Inominalfase"));
    console.log("correnteprimaria: ", correnteprimaria);
//fim do codigo novo


   
    var correnteIP = correnteprimaria * (1 * Ippercentual / 100);
    correnteFormatada = correnteIP;


    localStorage.setItem("Ipdeconsumo", correnteFormatada);



    // Calculo da  corrente instantanea de fase somando a tolerancia a corrente de magnetização nominal

    // Calcula Imaginstantanea usando imagsimuladaArmazenada se houver, senão usa imagArmazenada
    var imagBase = (!isNaN(imagsimuladaArmazenada) && imagsimuladaArmazenada !== null) ? imagsimuladaArmazenada : imagArmazenada;
    var Imaginstantanea = imagBase * (1 * imagpercentualArmazenada / 100);
    imagtotalformatada = Imaginstantanea;
    localStorage.setItem("Instfaseconsumo", imagtotalformatada);
    localStorage.setItem("Imagresultante", imagBase);

    //Calculo da  corrente nominal de neutro
    inominalneutro = (correnteprimaria * (desequilibrio));



    // Calculo da corrente IP de neutro somando a tolerancia a corrente nominal
    ipneutro = inominalneutro * (1 * ipneutropercentualArmazenada / 100);

    if (ipneutro > 40) {
        ipneutro = 40;
    }

    if (ipneutro === 40) {
        inominalneutro = ipneutro / (1 * ipneutropercentualArmazenada / 100);
    }




    // Armazenando o valor de ipneutro no local storage
    localStorage.setItem("IpdeneutroSelecionada", ipneutro);
    localStorage.setItem("Inominalneutroconsumo", inominalneutro);

    //  Calculo da  corrente de magnetização de neutro 
    imagneutro = imagBase * (desequilibrio);

    console.log("imagneutro: " + imagneutro);
    // Calculo da  corrente instantanea de neutro somando a tolerancia a corrente de magnetização nominal
    Iinstneutro = imagneutro * (1 * imagneutroArmazenada / 100);
    console.log("inst neutro: " + Iinstneutro);
    // Armazenando o valor de Iinstneutro no local storage
    localStorage.setItem("IinstneutroSelecionada", Iinstneutro);

    //---------------------------------------------------------------------------------------
    //CACLULOS PARA VALORES DAS CORRENTE EM P.U
    //importar valor do local storage do TC de proteção selecionado
    const TCselecionado = parseFloat(localStorage.getItem("TCdeprotecaoSelecionada"));

    //Divide valores encontrados por valor primário do TC selecionado
    const ipPU = correnteIP / TCselecionado;
    const iinstPU = Imaginstantanea / TCselecionado;
    const ipneutroPU = ipneutro / TCselecionado;
    const instneutroPU = Iinstneutro / TCselecionado;

    //Armazena os valores de P.U no local storage
    localStorage.setItem("ipPUSelecionada", ipPU);
    localStorage.setItem("iinstPUSelecionada", iinstPU);
    localStorage.setItem("ipneutroPUSelecionada", ipneutroPU);
    localStorage.setItem("instneutroPUSelecionada", instneutroPU);





//alimenta todos os campos da tela com os valores do local storage diretamente no HTML

Inominalhtml.textContent = correnteprimaria.toFixed(2) + " A";

// Validar antes de definir valores nos campos
IPpercentualhtml.value = (!isNaN(Ippercentual) && Ippercentual !== null) ? Ippercentual : 0;

IPrealhtml.textContent = correnteFormatada.toFixed(2) + " A";
tipodecurvahtml.value = curvafaseArmazenada || '';

// Validar dialfaseArmazenada
dialfasehtml.value = (!isNaN(parseFloat(dialfasereal)) && dialfasereal !== null) ? dialfasereal : '';

// Atualizar o campo dialrealfase com dialfaseArmazenada
const dialrealfase = document.getElementById("dialrealfase");
if (dialrealfase && dialfaseArmazenada !== null && dialfaseArmazenada !== undefined) {
    dialrealfase.textContent = dialfaseArmazenada;
}




imagfase.textContent = (!isNaN(imagresultanteArmazenada) && imagresultanteArmazenada !== null) ? imagresultanteArmazenada.toFixed(2) + " A" : "0.00 A";

// Validar imagpercentualArmazenada
imagpercentual.value = (!isNaN(imagpercentualArmazenada) && imagpercentualArmazenada !== null) ? imagpercentualArmazenada : 0;

imagreal.textContent = imagtotalformatada.toFixed(2) + " A";
imagrealcalculada.textContent = (!isNaN(imagrealcalculadaArmazenada) && imagrealcalculadaArmazenada !== null) ? imagrealcalculadaArmazenada.toFixed(2) + " A" : "0.00 A";

// Validar imagsimuladaArmazenada
imagsimuladahtml.value = (!isNaN(imagsimuladaArmazenada) && imagsimuladaArmazenada !== null) ? imagsimuladaArmazenada : '';

// Validar ideffaseArmazenada e tdeffaseArmazenada
ideffasehtml.value = (!isNaN(ideffaseArmazenada) && ideffaseArmazenada !== null) ? ideffaseArmazenada : '';
tdeffasehtml.value = (!isNaN(tdeffaseArmazenada) && tdeffaseArmazenada !== null) ? tdeffaseArmazenada : '';

inominalneutrohtml.textContent = inominalneutro.toFixed(2) + " A";

// Validar ipneutropercentualArmazenada
IPpercentualneutrohtml.value = (!isNaN(ipneutropercentualArmazenada) && ipneutropercentualArmazenada !== null) ? ipneutropercentualArmazenada : 0;

IPrealneutrohtml.textContent = ipneutro.toFixed(2) + " A";
tipodecurvaneutrohtml.value = curvaneutroArmazenada || '';

// Validar dialneutroArmazenada
dialcurvaneutrohtml.value = (!isNaN(parseFloat(dialneutroreal)) && dialneutroreal !== null) ? dialneutroreal : '';


dialidealneutro.textContent = dialneutroArmazenada ? dialneutroArmazenada + " s" : '';

dialrealneutro.textContent = dialneutroArmazenada ? dialneutroArmazenada + " s" : '';




Imagneutro.textContent = imagneutro.toFixed(2) + " A";

// Validar imagneutroArmazenada
Imagneutropercentual.value = (!isNaN(imagneutroArmazenada) && imagneutroArmazenada !== null) ? imagneutroArmazenada : 0;

Iinstneutrohtml.textContent = Iinstneutro.toFixed(2) + " A";

// Validar idefneutroArmazenada e tdefneutroArmazenada
idefneutrohtml.value = (!isNaN(idefneutroArmazenada) && idefneutroArmazenada !== null) ? idefneutroArmazenada : '';
tdefneutrohtml.value = (!isNaN(tdefneutroArmazenada) && tdefneutroArmazenada !== null) ? tdefneutroArmazenada : '';

// ...existing code...



    // Atualização dos valores de P.U na tela
    const ipPUhtml = document.getElementById("IpPUhtml");
    ipPUhtml.textContent = ipPU.toFixed(2) + " P.U";

    const iinstPUhtml = document.getElementById("iinstPUhtml");
    iinstPUhtml.textContent = iinstPU.toFixed(2) + " P.U";

    const ipneutroPUhtml = document.getElementById("ipneutroPUhtml");
    ipneutroPUhtml.textContent = ipneutroPU.toFixed(2) + " P.U";

    const iinstneutroPUhtml = document.getElementById("iinstneutroPUhtml");
    iinstneutroPUhtml.textContent = instneutroPU.toFixed(2) + " P.U";

    //----------------------------------------------atualização de valores na tela da tabela
    const pencentualIP = document.getElementById("IPpercentualhtml");
    const percentualIPSalva = localStorage.getItem("PercentualIPSelecionada");

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
    let Iinst1 = imagtotalformatada;
    let ip1 = correnteFormatada;
    let x1 = [imagtotalformatada];
    let y1 = [0.01];
    let ideffase = ideffaseArmazenada;
    let tdeffase = tdeffaseArmazenada;


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
    let Iinst2 = Iinstneutro;
    let ip2 = ipneutro;
    let x2 = [Iinst2];
    let y2 = [0.01];
    let idefneutro = idefneutroArmazenada;
    let tdefneutro = tdefneutroArmazenada;




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
    const correntesTrafos = JSON.parse(localStorage.getItem("correntestrafosJSON"));







    // ------

    // Configuração do gráfico logarítmico

    let ctx = document.getElementById('grafico').getContext('2d');


    let grafico = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Curva 50/51 fase ',
                    data: x1.map((val, index) => ({ x: val, y: y1[index] })),
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: 'Curva 50N/51N Neutro',
                    data: x2.map((val, index) => ({ x: val, y: y2[index] })),
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: 'I nominal fase',
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
                    label: 'I nominal neutro',
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
                    label: 'I Ip fase',
                    data: [{ x: ip1, y: 0.01 }],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I Ip neutro',
                    data: [{ x: ip2, y: 0.01 }],
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I iinst fase',
                    data: [{ x: imagtotalformatada, y: 0.01 }],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I inst neutro',
                    data: [{ x: Iinstneutro, y: 0.01 }],
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'triangle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I mag fase',
                    data: [{ x: imagBase, y: tempomagfase }],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'circle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'I mag neutro',
                    data: [{ x: imagneutro, y: tempomagfase }],
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'circle',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'Partida motor+carga operante',
                    data: [{
                        x: parseFloat(localStorage.getItem("somaCorrentePartidaOperante")),
                        y: (() => {
                            const motorData = JSON.parse(localStorage.getItem("motorJSON")) || {};
                            return parseFloat(motorData.tempopartida) || null;
                        })()
                    }],
                    backgroundColor: 'green',
                    borderColor: 'green',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'rect',
                    showLine: false // só o ponto, sem linha
                },
                {
                    label: 'ICC Trifásica',
                    data: [{ x: curtoArmazenada, y: 0.01 }],
                    backgroundColor: 'black',
                    borderColor: 'black',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointStyle: 'star',
                    showLine: false // só o ponto, sem linha
                },
                // Linha pontilhada vertical de curtoArmazenada até y=1000
                {
                    label: 'Curto Circuito',
                    data: [
                        { x: curtoArmazenada, y: 0.01 },
                        { x: curtoArmazenada, y: 1000 }
                    ],
                    borderColor: 'black',
                    borderWidth: 2,
                    borderDash: [10, 5],
                    pointRadius: 0,
                    fill: false,
                    showLine: true
                },
                // I ANSI pontos
                {
                    label: 'I ANSI 1',
                    data: [
                        { x: correntesTrafos.trafo1.iansi, y: correntesTrafos.trafo1.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 2',
                    data: [
                        { x: correntesTrafos.trafo2.iansi, y: correntesTrafos.trafo2.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 3',
                    data: [
                        { x: correntesTrafos.trafo3.iansi, y: correntesTrafos.trafo3.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'green',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 4',
                    data: [
                        { x: correntesTrafos.trafo4.iansi, y: correntesTrafos.trafo4.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'purple',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 5',
                    data: [
                        { x: correntesTrafos.trafo5.iansi, y: correntesTrafos.trafo5.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'brown',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 6',
                    data: [
                        { x: correntesTrafos.trafo6.iansi, y: correntesTrafos.trafo6.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'pink',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 7',
                    data: [
                        { x: correntesTrafos.trafo7.iansi, y: correntesTrafos.trafo7.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'cyan',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 8',
                    data: [
                        { x: correntesTrafos.trafo8.iansi, y: correntesTrafos.trafo8.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'magenta',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 9',
                    data: [
                        { x: correntesTrafos.trafo9.iansi, y: correntesTrafos.trafo9.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'gray',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                {
                    label: 'I ANSI 10',
                    data: [
                        { x: correntesTrafos.trafo10.iansi, y: correntesTrafos.trafo10.tempo }
                    ],
                    backgroundColor: 'orange',
                    borderColor: 'black',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'triangle',
                    showLine: false
                },
                // I NANSI pontos
                {
                    label: 'I NANSI 1',
                    data: [
                        { x: correntesTrafos.trafo1.inansi, y: correntesTrafos.trafo1.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 2',
                    data: [
                        { x: correntesTrafos.trafo2.inansi, y: correntesTrafos.trafo2.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 3',
                    data: [
                        { x: correntesTrafos.trafo3.inansi, y: correntesTrafos.trafo3.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'green',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 4',
                    data: [
                        { x: correntesTrafos.trafo4.inansi, y: correntesTrafos.trafo4.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'purple',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 5',
                    data: [
                        { x: correntesTrafos.trafo5.inansi, y: correntesTrafos.trafo5.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'brown',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 6',
                    data: [
                        { x: correntesTrafos.trafo6.inansi, y: correntesTrafos.trafo6.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'pink',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 7',
                    data: [
                        { x: correntesTrafos.trafo7.inansi, y: correntesTrafos.trafo7.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'cyan',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 8',
                    data: [
                        { x: correntesTrafos.trafo8.inansi, y: correntesTrafos.trafo8.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'magenta',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 9',
                    data: [
                        { x: correntesTrafos.trafo9.inansi, y: correntesTrafos.trafo9.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'gray',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
                },
                {
                    label: 'I NANSI 10',
                    data: [
                        { x: correntesTrafos.trafo10.inansi, y: correntesTrafos.trafo10.tempo }
                    ],
                    backgroundColor: 'yellow',
                    borderColor: 'black',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointStyle: 'rectRot',
                    showLine: false
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
                    max: Math.max(
                        curtoArmazenada || 0,
                        parseFloat(localStorage.getItem("Instfaseconsumo")) || 0
                    ) + 1000,
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

    // Salva a imagem do gráfico no localStorage
    setTimeout(() => {
        try {
            const graficoCanvas = document.getElementById('grafico');
            const graficoImg = graficoCanvas.toDataURL('image/png');
            localStorage.setItem('graficoImagem', graficoImg);
        } catch (e) {
            console.error('Erro ao salvar imagem do gráfico:', e);
        }
    }, 500);

    //Mantem exibindo o dial ideal no HTML 
    const dialIdealTag = document.getElementById("dialideal");
  


    calculadialideal();

    if (!isNaN(dial_calculado) && !isNaN(dial_calculado_planta)) {
        let maiorDial = Math.max(dial_calculado, dial_calculado_planta);
        if (dialIdealTag) {
            dialIdealTag.textContent = maiorDial.toFixed(2);
        }
    }


    verificarAlertaPotMinima();
};


//função para comparar o melhor dial entre planta com motor e sem motor 
function calculadialideal() {

    const dialneutrocalculado = 1.0.toFixed(2); // Valor fixo de 1.0 s para o dial ideal neutro
    const dialneutroreal = parseFloat(localStorage.getItem("dialneutroreal"));
    const dialReal = parseFloat(localStorage.getItem("dialfasereal"));
    // Carregar do localStorage usando JSON.parse
    const motorData = JSON.parse(localStorage.getItem("motorJSON")) || {};
    const cargaOperante = motorData.potenciaoperante;
    const correntePartida = motorData.correntepartida;
    const tempoMotor = motorData.tempopartida;


    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada"));
    const fatorpArmazenada = parseFloat(localStorage.getItem("fatorPotenciaSelecionada"));

    let correnteOperante = 0;
    if (!isNaN(cargaOperante) && !isNaN(tensaoArmazenada) && !isNaN(fatorpArmazenada)) {
        correnteOperante = cargaOperante / (tensaoArmazenada * Math.sqrt(3) * fatorpArmazenada);



        // console.log("Corrente operante calculada:", correnteOperante);
        // Se quiser salvar no localStorage:
        localStorage.setItem("correnteOperanteCalculada", correnteOperante.toFixed(2));
    }

    // Recupera a corrente de partida do motor do localStorage
    let correntePartidaMotor = 0;
    if (motorData.correntepartida && !isNaN(parseFloat(motorData.correntepartida))) {
        correntePartidaMotor = parseFloat(motorData.correntepartida);
    }

    // Soma corrente de partida do motor com corrente operante
    let somaCorrente = 0;
    if (!isNaN(correntePartidaMotor) && !isNaN(correnteOperante)) {
        somaCorrente = correntePartidaMotor + correnteOperante;
        // console.log("Soma corrente de partida do motor + corrente operante:", somaCorrente);
        localStorage.setItem("somaCorrentePartidaOperante", somaCorrente.toFixed(2));
    }


    const dadosCurvaUsuarioFase = JSON.parse(localStorage.getItem("dadoscurvausariofase"));
    // console.log("Conteúdo de dadoscurvausariofase:", dadosCurvaUsuarioFase);

    if (dadosCurvaUsuarioFase && somaCorrente && tempoMotor) {
        const { beta, alfa, k } = dadosCurvaUsuarioFase;
        // z = tempoMotor, Iinst = somaCorrente, ip = correnteOperante
        let correnteIpDeConsumo = parseFloat(localStorage.getItem("Ipdeconsumo"));
        dial_calculado = tempoMotor / (beta / (Math.pow(somaCorrente / correnteIpDeConsumo, alfa) - k));    // Salva o dial calculado no localStorage ou exibe no console
        // console.log("Dial calculado:", dial_calculado);
        localStorage.setItem("dialCalculado", dial_calculado.toFixed(2));
    } else {
        dial_calculado = 0;
        localStorage.setItem("dialCalculado", dial_calculado.toFixed(2));

    }

    //Cálculo do dial considerando apenas a planta sem motores (usando Instfaseconsumo)
    if (dadosCurvaUsuarioFase) {
        const { beta, alfa, k } = dadosCurvaUsuarioFase;
        let correnteIpDeConsumo = parseFloat(localStorage.getItem("Ipdeconsumo"));
        let Instfaseconsumo = parseFloat(localStorage.getItem("Instfaseconsumo"));
        if (!isNaN(Instfaseconsumo) && !isNaN(correnteIpDeConsumo)) {
            dial_calculado_planta = tempomagfase / (beta / (Math.pow(Instfaseconsumo / correnteIpDeConsumo, alfa) - k));
            // console.log("Dial calculado (planta sem motores, usando Instfaseconsumo):", dial_calculado_planta);
            localStorage.setItem("dialCalculadoPlantaSemMotores", dial_calculado_planta.toFixed(2));
        }
    }


    // setar o dialfaseSelecionada no localStorage considerando primeiro a existencia de valor de dial real, se não houver valor considera o maior valor entre dial_calculado e dial_calculado_planta
    if (!isNaN(dialReal)) {
        localStorage.setItem("dialfaseSelecionada", dialReal);
    } else {
        const dialMaior = Math.max(dial_calculado.toFixed(2), dial_calculado_planta.toFixed(2));
        localStorage.setItem("dialfaseSelecionada", dialMaior);
    }   


    // // Setar valor 1.0 s para dialidealneutro no HTML
    // const dialIdealNeutroTag = document.getElementById("dialidealneutro");
    // if (dialIdealNeutroTag) {
    //     dialIdealNeutroTag.textContent = "1.00" + " s";
    // }


    // setar o dialneutroSelecionada no localStorage considerando primeiro a existencia de valor de dial real, se não houver valor considera o valor calculado
    if (!isNaN(dialneutroreal)) {
        localStorage.setItem("dialneutroSelecionada", dialneutroreal);
    } else {
        
        localStorage.setItem("dialneutroSelecionada", dialneutrocalculado);
    }


}


// Função para ativar as legendas do gráfico
function ativarLegendas() {

    const statuslegenda = (legenda === 'none') ? 'bottom' : 'none';

    localStorage.setItem('statuslegenda', statuslegenda);

    location.reload();
}


// Função para gerar alerta dos 10% do primario do TC de proteção

function verificarAlertaPotMinima() {
    const status = localStorage.getItem("inominalminimaTC");
    const alertaDiv = document.querySelector(".alertapotminima");
    if (status) {
        if (status === "Sim") {
            alertaDiv.style.display = "";
            // Adiciona classe para piscar lentamente
            alertaDiv.classList.add("piscando-lento");
        } else {
            alertaDiv.style.display = "none";
            alertaDiv.classList.remove("piscando-lento");
        }
    }
}


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