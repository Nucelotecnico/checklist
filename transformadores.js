let kva1formatada = 0;
let qtde1formatada = 0;
let imin1formatada = 0;
let intrafo1formatada = 0;
let imagtr1formatada = 0;

let kva2formatada = 0;
let qtde2formatada = 0;
let imin2formatada = 0;
let intrafo2formatada = 0;
let imagtr2formatada = 0;


let imagtotalformatada = 0;
let imagtotalneutroformatada = 0;
//------------------------------------------------------------------
function salvarOpcao() {

    //Armazenar todas as potencias em KVA em variaveis formato JSON e no localstorage
    for (let i = 1; i <= 10; i++) {
        const impedancia = parseFloat(document.getElementById(`impedanciahtml${i}`)?.value) || 0;
        let tempo = document.getElementById(`tempotrhtml${i}`)?.value || "";

        if (impedancia > 0 && impedancia <= 4 && tempo > 2) {
            alert(`Rever preenchimento de tempo para o Trafo ${i}. Para impedância até 4%, o tempo máximo permitido é 2s.`);
            
        } else if (impedancia <= 5 && tempo > 3) {
            alert(`Rever preenchimento de tempo para o Trafo ${i}. Para impedância até 5%, o tempo máximo permitido é 3s.`);

        } else if (impedancia <= 6 && tempo > 4) {
            alert(`Rever preenchimento de tempo para o Trafo ${i}. Para impedância até 6%, o tempo máximo permitido é 4s.`);
        } else if (impedancia <= 7 && tempo > 5) {
            alert(`Rever preenchimento de tempo para o Trafo ${i}. Para impedância até 7%, o tempo máximo permitido é 5s.`);
        }

        const trafo = {
            potencia: document.getElementById(`potenciahtml${i}`)?.value || "",
            qtde: document.getElementById(`qtdehtml${i}`)?.value || "",
            z: document.getElementById(`impedanciahtml${i}`)?.value || "",
            imin: document.getElementById(`fatoriminhtml${i}`)?.value || "",
            tempo: tempo
        };
        localStorage.setItem(`trafo${i}JSON`, JSON.stringify(trafo));
    }


 




    // Armazenar informações de input do motor no formato JSON e armazenar no local storage
    const potenciaOperanteMotor = document.getElementById("potenciaoperantemotorhtml")?.value || 0;
    const correntePartidaMotor = document.getElementById("correntepartidamotorhtml")?.value || 0;
    const tempoPartidaMotor = document.getElementById("tempopartidamotorhtml")?.value || 0;

    const motor = {
        potenciaoperante: potenciaOperanteMotor,
        correntepartida: correntePartidaMotor,
        tempopartida: tempoPartidaMotor
    };

    localStorage.setItem("motorJSON", JSON.stringify(motor));



    //---------------migrar o calculo para função separada
    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada")) || 0;
    const fatordePotencia = parseFloat(localStorage.getItem("fatorPotenciaSelecionada")) || 0;
    const correntemotor = parseFloat(correntePartidaMotor);



    const correnteoperantemotor = potenciaOperanteMotor / (tensaoArmazenada * Math.sqrt(3) * fatordePotencia);
 
    let maiorValor = correntemotor + correnteoperantemotor;



    localStorage.setItem("maiorCorrenteoperante", maiorValor);
    //------fim da migração





    location.reload();//recarrega a página sempre que o botão é clicado

}
//---------------------------------------------------------------------------------

//Carregar nos campos do HTML todos os valores calculados e armazenados no local storage
window.onload = function () {
    calculaimagreal();
    calcularEArmazenarIntrafoEImag();
    calculos();
    // calculoGerador();

    const botaoParametro = document.getElementById("botaotrafohtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }
  


    //Manter exibindo as grandezas de input dos trafos no HTML
    for (let i = 1; i <= 10; i++) {
        const trafoSalvo = JSON.parse(localStorage.getItem(`trafo${i}JSON`));
        if (trafoSalvo) {
            if (document.getElementById(`potenciahtml${i}`)) {
                document.getElementById(`potenciahtml${i}`).value = trafoSalvo.potencia || "";
            }
            if (document.getElementById(`qtdehtml${i}`)) {
                document.getElementById(`qtdehtml${i}`).value = trafoSalvo.qtde || "";
            }
            if (document.getElementById(`impedanciahtml${i}`)) {
                document.getElementById(`impedanciahtml${i}`).value = trafoSalvo.z || "";
            }
            if (document.getElementById(`fatoriminhtml${i}`)) {
                document.getElementById(`fatoriminhtml${i}`).value = trafoSalvo.imin || "";
            }
            if (document.getElementById(`tempotrhtml${i}`)) {
                document.getElementById(`tempotrhtml${i}`).value = trafoSalvo.tempo || "";
            }
        }
    }

    //Manter exibindo as correntes calculadas no HTML
    const correntestrafos = JSON.parse(localStorage.getItem("correntestrafosJSON")) || {};

    for (let i = 1; i <= 10; i++) {
        // Exibe In (corrente nominal)
        if (document.getElementById(`intrhtml${i}`) && correntestrafos[`trafo${i}`]) {
            document.getElementById(`intrhtml${i}`).textContent = correntestrafos[`trafo${i}`].intrafo
                ? correntestrafos[`trafo${i}`].intrafoindividual.toFixed(2) + " A"
                : "";
        }
        // Exibe Imag (corrente de magnetização)
        if (document.getElementById(`imagtrhtml${i}`) && correntestrafos[`trafo${i}`]) {
            document.getElementById(`imagtrhtml${i}`).textContent = correntestrafos[`trafo${i}`].imag
                ? correntestrafos[`trafo${i}`].imagindividual.toFixed(2) + " A"
                : "";
        }
        // Exibe IANSI (corrente ANSI)
        if (document.getElementById(`iansihtml${i}`) && correntestrafos[`trafo${i}`]) {
            document.getElementById(`iansihtml${i}`).textContent = correntestrafos[`trafo${i}`].iansi
                ? correntestrafos[`trafo${i}`].iansi.toFixed(2) + " A"
                : "";
        }
        // Exibe INANSI (corrente ANSI neutro)
        if (document.getElementById(`inansihtml${i}`) && correntestrafos[`trafo${i}`]) {
            document.getElementById(`inansihtml${i}`).textContent = correntestrafos[`trafo${i}`].inansi
                ? correntestrafos[`trafo${i}`].inansi.toFixed(2) + " A"
                : "";
        }
    }

    //carregar imag total no HTML
    const label91 = document.getElementById("imagtotal");
    const imagtotalArmazenado = parseFloat(localStorage.getItem("imagtotalSelecionada"));
    if (imagtotalArmazenado) { label91.textContent = imagtotalArmazenado.toFixed(2) + " A"; }



    //carregar imag total do neutro no HTML
    const label92 = document.getElementById("imagtotalneutro");
    const imagtotalneutroArmazenado = parseFloat(localStorage.getItem("imagtotalneutroSelecionada"));
    if (imagtotalneutroArmazenado) { label92.textContent = imagtotalneutroArmazenado.toFixed(2) + " A"; }




    //carregar imag real de fase no HTML
    const labelImagRealFase = document.getElementById("imagrealfase");
    const imagRealFaseArmazenado = parseFloat(localStorage.getItem("inmagrealSelecionada"));
    if (imagRealFaseArmazenado) { labelImagRealFase.textContent = imagRealFaseArmazenado.toFixed(2) + " A"; }

    //carregar inmagreal do neutro no HTML
    const labelInmagrealNeutro = document.getElementById("imagrealneutro");
    const inmagrealneutroArmazenado = parseFloat(localStorage.getItem("inmagrealneutroSelecionada"));
    if (inmagrealneutroArmazenado) { labelInmagrealNeutro.textContent = inmagrealneutroArmazenado.toFixed(2) + " A"; }



    
    //----------------------------------------------------------------------------------------------
    
    // Exibir valores armazenados do motor no HTML
    const motorSalvo = JSON.parse(localStorage.getItem("motorJSON"));
    if (motorSalvo) {
        if (document.getElementById("potenciaoperantemotorhtml")) {
            document.getElementById("potenciaoperantemotorhtml").value = motorSalvo.potenciaoperante || "";
        }
        if (document.getElementById("correntepartidamotorhtml")) {
            document.getElementById("correntepartidamotorhtml").value = motorSalvo.correntepartida || "";
        }
        if (document.getElementById("tempopartidamotorhtml")) {
            document.getElementById("tempopartidamotorhtml").value = motorSalvo.tempopartida || "";
        }
    }

    // const correnteoperantelabel = document.getElementById("correntetotalpartidamotorhtml");
    // const correnteoperantearmazenada = parseFloat(localStorage.getItem("maiorCorrenteoperante"));
    // if (correnteoperantearmazenada && correnteoperantelabel) {
    //     correnteoperantelabel.textContent = correnteoperantearmazenada.toFixed(2) + " A";
    // }

    //console.log("corrente que esta no lstorage",correnteoperantearmazenada);

    
}


function calcularEArmazenarIntrafoEImag() {
    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada"));





    let correntestrafosJSON = {};

    for (let i = 1; i <= 10; i++) {
        const trafoSalvo = JSON.parse(localStorage.getItem(`trafo${i}JSON`));
        const potencia = trafoSalvo ? parseFloat(trafoSalvo.potencia) : 0;
        const qtde = trafoSalvo ? parseInt(trafoSalvo.qtde) : 0;
        const imin = trafoSalvo ? parseFloat(trafoSalvo.imin) : 0;
        const tempo = trafoSalvo ? parseFloat(trafoSalvo.tempo) : 0;
        const intrafoindividual = potencia / (tensaoArmazenada * Math.sqrt(3));
        const intrafo = ((qtde * potencia) / (tensaoArmazenada * Math.sqrt(3)));
        const imag = intrafo * imin;
        const imagindividual = intrafoindividual * imin;

        const impedancia = parseFloat(trafoSalvo.z) || 0;
        const iansitrafo = (100/impedancia)*intrafoindividual;
        const inansi = iansitrafo * 0.58; 


        correntestrafosJSON[`trafo${i}`] = {
            intrafo: isNaN(intrafo) ? 0 : intrafo,
            imag: isNaN(imag) ? 0 : imag,
            intrafoindividual: isNaN(intrafoindividual) ? 0 : intrafoindividual,
            imagindividual: isNaN(imagindividual) ? 0 : imagindividual,
            tempo: isNaN(tempo) ? 0 : tempo,
            iansi: isNaN(iansitrafo) ? 0 : iansitrafo,
            inansi: isNaN(inansi) ? 0 : inansi
        };

        // console.log("Todos os trafos:", correntestrafosJSON);
    }
    localStorage.setItem("correntestrafosJSON", JSON.stringify(correntestrafosJSON));

    //FAZ A EXIBIÇÃO DO VALOR DE CORRENTE TOTAL DA CARGA OPERANTE NA TELA HTML
    
    const somaCorrentePartidaOperante = parseFloat(localStorage.getItem("maiorCorrenteoperante")) || 0;
    const campoCorrenteTotal = document.getElementById("correntetotalpartidamotorhtml");
    if (campoCorrenteTotal) {
        campoCorrenteTotal.textContent = somaCorrentePartidaOperante.toFixed(2) + " A";
    }
    
}


function calculos() {
    const tensaoArmazenada = parseFloat(localStorage.getItem("tensaoSelecionada"));
    const desequilibrioSelecionada = parseFloat(localStorage.getItem("desequilibrioSelecionada"));

    let maiorImag = 0;
    let indexMaiorImag = -1;
    let maiorImagIn = 0;
    let maiorImagQtde = 1;

    let somaInTotal = 0;

    // Arrays para armazenar os valores de In, Imag e quantidade de cada trafo
    const inArray = [];
    const imagArray = [];
    const qtdeArray = [];

    // Calcula In, Imag e soma total ponderada pela quantidade
    for (let i = 1; i <= 10; i++) {
        const trafoSalvo = JSON.parse(localStorage.getItem(`trafo${i}JSON`));
        if (trafoSalvo) {
            const potencia = parseFloat(trafoSalvo.potencia) || 0;
            const imin = parseFloat(trafoSalvo.imin) || 0;
            const qtde = parseInt(trafoSalvo.qtde) || 0;
            const intrafo = potencia / (tensaoArmazenada * Math.sqrt(3));
            const imag = intrafo * imin;



            inArray[i] = intrafo;
            imagArray[i] = imag;
            qtdeArray[i] = qtde;



            // Descobre o trafo com maior Imag
            if (imag > maiorImag) {
                maiorImag = imag;
                indexMaiorImag = i;
                maiorImagIn = intrafo;
                maiorImagQtde = qtde;
                maiorimin = imin;
            }
        } else {
            inArray[i] = 0;
            imagArray[i] = 0;
            qtdeArray[i] = 0;
        }
    }

    // Soma as In dos trafos:
    for (let i = 1; i <= 10; i++) {
        if (i === indexMaiorImag) {
            // Para o trafo de maior Imag, soma (qtde - 1) * In
            somaInTotal += (qtdeArray[i] - 1) * inArray[i];
        } else {
            // Para os demais, soma qtde * In
            somaInTotal += qtdeArray[i] * inArray[i];
        }
    }

    // Soma a potência total de todos os trafos:
    let somaPotenciaTotal = 0;
    for (let i = 1; i <= 10; i++) {
        somaPotenciaTotal += qtdeArray[i] * (JSON.parse(localStorage.getItem(`trafo${i}JSON`))?.potencia || 0);
    }
    localStorage.setItem("potenciatotaltrafos", somaPotenciaTotal);

    // imagtotalformatada = maior Imag + soma das In dos demais trafos (considerando quantidade)
    imagtotalformatada = maiorImag + somaInTotal;

    // imagtotalneutroformatada = imagtotalformatada * (desequilibrioSelecionada/100)
    imagtotalneutroformatada = imagtotalformatada * (desequilibrioSelecionada);

    // Salva no localStorage
    localStorage.setItem("imagtotalSelecionada", imagtotalformatada);
    localStorage.setItem("imagtotalneutroSelecionada", imagtotalneutroformatada);
    localStorage.setItem("maiortrafoimagSelecionada", maiorImag);
    localStorage.setItem("maiortrafoindexSelecionada", indexMaiorImag);
    localStorage.setItem("maiortrafoinSelecionada", maiorImagIn);
    localStorage.setItem("maiortrafoqtdeSelecionada", maiorImagQtde);
    localStorage.setItem("maiortrafoiminSelecionada", maiorimin);

    console.log("Maior Imag:", maiorImag);
    console.log("Índice do maior Imag:", indexMaiorImag);
    console.log("In do maior Imag:", maiorImagIn);
    console.log("Qtde do maior Imag:", maiorImagQtde);
    console.log("Imin do maior Imag:", maiorimin);
}


// Função para calcular a corrente de magnetização real e do neutro

function calculaimagreal() {

    const ICCselecionada = parseFloat(localStorage.getItem("curtoSelecionada")) || 0;
    const instselecionada = parseFloat(localStorage.getItem("imagtotalSelecionada")) || 0;
    const desequilibrioneutro = parseFloat(localStorage.getItem("desequilibrioSelecionada"));

    const denominador = (1 / ICCselecionada) + (1 / instselecionada);

    const inmagreal = 1 / denominador;

    const inmagrelaneutro = inmagreal * desequilibrioneutro;

    localStorage.setItem("inmagrealSelecionada", inmagreal);
    localStorage.setItem("inmagrealneutroSelecionada", inmagrelaneutro);

    // console.log("imag real:",inmagreal)
    // console.log("imag real neutro:",inmagrelaneutro)


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







// --------------------------------------------------------------// Código para gerar a curva tempo inverso em SVG
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