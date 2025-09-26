// Debug: mostrar todos os itens do localStorage
// console.log('Itens no localStorage:');
// for (let i = 0; i < localStorage.length; i++) {
//     var chave = localStorage.key(i);
//     console.log(`${chave}:`, localStorage.getItem(chave));
// }

//INICIALIZAR DO CARREGAMENTO DA PAGINA 
document.addEventListener('DOMContentLoaded', function () {

    exibirCorrenteMinimaSeNecessario();


    // Aguardar MathJax carregar
    if (typeof MathJax !== 'undefined') {
        MathJax.startup.promise.then(() => {
            atualizarFormula();
            atualizarFormula2();
        });
    } else {
        setTimeout(() => {
            atualizarFormula();
            atualizarFormula2();
        }, 1000);
    }

    const botaoParametro = document.getElementById("botaoestudoshtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }

    // Carregar o script do gráfico
    carregarScript('grafico5051consumo.js', function () {
        setTimeout(() => {
            verificarMathJax();
        }, 1000);
    });

    // Carregar tabela de relés
    setTimeout(() => {

        adicionarEstilosTabelaParametrizacaoReles();
        carregarTabelaReles();

    }, 1500);


    carregarVariaveisEstudo();

    //incluirimagensrele();


});



// -----------------------------------------------------------
//Função para carregar PARAMETROS ELETRICOS do localStorage e exibir na página

function carregarVariaveisEstudo() {

    const tensaoAtendimento = localStorage.getItem('tensaoSelecionada');
    if (tensaoAtendimento !== null) {
        const tensaoEl = document.getElementById('tensao-atendimento');
        if (tensaoEl) {
            tensaoEl.textContent = tensaoAtendimento + ' kV';
        }
    }

    const demandacalculada = localStorage.getItem('demandaSelecionada');
    const demandadecontrato = localStorage.getItem('demandadecontrato');
    document.querySelectorAll('.demanda-contratada-consumo').forEach(el => {
        if (demandadecontrato !== null && !isNaN(demandadecontrato)) {
            el.textContent = demandadecontrato + ' kW';
        }
    });

    const fatorPotencia = localStorage.getItem('fatorPotenciaSelecionada');
    if (fatorPotencia !== null) {
        const fatorEl = document.getElementById('fator-potencia');
        if (fatorEl) {
            fatorEl.textContent = fatorPotencia * 100 + '%';
        }
    }

    const iccPontoConexao = localStorage.getItem('curtoSelecionada');
    if (iccPontoConexao !== null) {
        const iccEl = document.getElementById('icc-ponto-conexao');
        if (iccEl) {
            iccEl.textContent = iccPontoConexao + ' A';
        }
    }

    const releProtecao = localStorage.getItem('TabelaSelecionadaHTML');
    if (releProtecao !== null) {
        const releEl = document.getElementById('rele-protecao');
        if (releEl) {
            // Remove tudo antes do primeiro "-" (incluindo o "-")
            const textoLimpo = releProtecao.replace(/^[^-]*-/, '').trim();
            releEl.textContent = textoLimpo;
        }
    }






    const geradorSalvo = JSON.parse(localStorage.getItem("geradorJSON")) || {};
    const geradorDiesel = parseFloat(geradorSalvo.potencia) || 0;

    if (geradorDiesel !== null) {
        const geradorEl = document.getElementById('gerador-diesel');
        if (geradorEl) {
            geradorEl.textContent = geradorDiesel + ' kVA';
        }
    }


    // ---------FIM DO CARREGAMENTO DAS VARIAVEIS DOS PARAMETROS ELETRICO -------------------

    //-----------------FUNÇÃO PARA CARREGA CAMPOS E CALCULOS DE CORRENTES DOS TRAFOS-------------

    for (let i = 1; i <= 10; i++) { // Suporta até trafo10JSON e s-trf10
        const trafoSalvo = JSON.parse(localStorage.getItem(`trafo${i}JSON`)) || {};
        const potenciaTrafo = parseFloat(trafoSalvo.potencia) || 0;
        const qtdeTrafo = parseFloat(trafoSalvo.qtde) || 0;
        // Corrige para s-trf01, s-trf02 ... s-trf10 (com zero à esquerda para 1-9, sem zero para 10)
        const trafoId = i < 10 ? `s-trf0${i}` : `s-trf${i}`;
        const trafoEl = document.getElementById(trafoId);
        if (trafoEl) {
            trafoEl.textContent = potenciaTrafo + ' kVA';
        }


        // if(trafoSalvo.potencia === null || trafoSalvo.potencia === undefined || isNaN(potenciaTrafo) || potenciaTrafo === 0) {
        //     const calcTrafoClass = i < 10 ? `calculotrafos-texto tr${i}` : `calculotrafos-texto tr${i}`;
        //     const calcTrafoEls = document.getElementsByClassName(calcTrafoClass);
        //     Array.from(calcTrafoEls).forEach(el => {
        //         el.style.display = 'none';
        //     });
        // }


        if (
            potenciaTrafo === 0 ||
            qtdeTrafo === 0 ||
            trafoSalvo.potencia === null ||
            trafoSalvo.potencia === undefined ||
            trafoSalvo.qtde === null ||
            trafoSalvo.qtde === undefined
        ) {
            const calcTrafoClass = i < 10 ? `calculotrafos-texto-tr0${i}` : `calculotrafos-texto-tr${i}`;
            const calcTrafoEls = document.getElementsByClassName(calcTrafoClass);
            Array.from(calcTrafoEls).forEach(el => {
                el.style.display = 'none';
            });
        }

        // Preencher campo potencia da tabela de trafos
        const potenciaId = i < 10 ? `potencia-0${i}` : `potencia-${i}`;
        const potenciaEl = document.getElementById(potenciaId);
        if (potenciaEl) {
            potenciaEl.textContent = potenciaTrafo + ' kVA';
        }

        // Preencher campo de quantidade do trafo

        // const qtdeTrafo = parseFloat(trafoSalvo.qtde) || 0;
        const qtdeId = i < 10 ? `qtde-0${i}` : `qtde-${i}`;
        const qtdeEl = document.getElementById(qtdeId);
        if (qtdeEl) {
            qtdeEl.textContent = qtdeTrafo;
        }

        // Preencher campo im-in-0x importando imin
        const imin = trafoSalvo.imin || 0;
        const imInId = i < 10 ? `im-in-0${i}` : `im-in-${i}`;
        const imInEl = document.getElementById(imInId);
        if (imInEl) {
            imInEl.textContent = imin;
        }

        // Preencher campo t-0x importando tempo
        const tempo = trafoSalvo.tempo || 0;
        const tempoId = i < 10 ? `t-0${i}` : `t-${i}`;
        const tempoEl = document.getElementById(tempoId);
        if (tempoEl) {
            tempoEl.textContent = tempo + ' s';
        }




        // Preencher campo de tensão do trafo
        const tensaoTrafo = localStorage.getItem('tensaoSelecionada');
        const denominadorId = i < 10 ? `v-trf0${i}` : `v-trf${i}`;
        const denominadorEl = document.getElementById(denominadorId);
        if (denominadorEl && tensaoTrafo !== null) {
            denominadorEl.textContent = tensaoTrafo + ' *√3  kV';
        }

        // Preencher campo de corrente do trafo
        const correnteTrafo = potenciaTrafo;
        const correntesTrafos = JSON.parse(localStorage.getItem('correntestrafosJSON')) || {};
        const trafoKey = `trafo${i}`;
        const resultadoTrfId = i < 10 ? `resultado-trf0${i}` : `resultado-trf${i}`;

        // Preencher impedância do trafo
        const impedanciaTrafo = trafoSalvo.z || 0;
        // Preencher campo den-ansi-tr0x
        const impedanciaId = i < 10 ? `den-ansi-tr0${i}` : `den-ansi-tr${i}`;
        const impedanciaEl = document.getElementById(impedanciaId);
        if (impedanciaEl) {
            impedanciaEl.textContent = impedanciaTrafo + ' %';
        }
        // Preencher campo z-0x
        const zId = i < 10 ? `z-0${i}` : `z-${i}`;
        const zEl = document.getElementById(zId);
        if (zEl) {
            zEl.textContent = impedanciaTrafo + ' %';
        }
        //----------------------------FIM DO PREENCHIMENTO DOS CAMPOS DE TRAFO--------------------------------

        //--------------------INICIO DE FUNÇÃO QUE OCULTA OS CAMPOS DE TRAFOS QUE NÃO TEM VALOR DE CORRENTE OU QTDE-------------------











        if (correntesTrafos[trafoKey] && correntesTrafos[trafoKey].intrafoindividual !== undefined) {
            const resultadoTrfEl = document.getElementById(resultadoTrfId);
            if (resultadoTrfEl) {
                resultadoTrfEl.textContent = correntesTrafos[trafoKey].intrafoindividual.toFixed(2) + ' A';
            }


            // Preencher campo de corrente do trafo neutro
            // Preencher campo de corrente do trafo neutro
            const inAnsiId = i < 10 ? `in-ansi-tr0${i}` : `in-ansi-tr${i}`;
            const inAnsiEl = document.getElementById(inAnsiId);
            if (inAnsiEl) {
                inAnsiEl.textContent = correntesTrafos[trafoKey].intrafoindividual.toFixed(2) + ' A';
            }

            // Preencher campo in-0x
            const inId = i < 10 ? `in-0${i}` : `in-${i}`;
            const inEl = document.getElementById(inId);
            if (inEl) {
                inEl.textContent = correntesTrafos[trafoKey].intrafoindividual.toFixed(2) + ' A';
            }

            // Preencher campo resultado-ansi-tr0x considerando intrafo
            const resultadoAnsiTrId = i < 10 ? `resultado-ansi-tr0${i}` : `resultado-ansi-tr${i}`;
            const resultadoAnsiTrEl = document.getElementById(resultadoAnsiTrId);
            if (resultadoAnsiTrEl) {
                resultadoAnsiTrEl.textContent = correntesTrafos[trafoKey].iansi.toFixed(2) + ' A';
            }

            // Preencher campo i-ansi-0x
            const iAnsiId = i < 10 ? `i-ansi-0${i}` : `i-ansi-${i}`;
            const iAnsiEl = document.getElementById(iAnsiId);
            if (iAnsiEl) {
                iAnsiEl.textContent = correntesTrafos[trafoKey].iansi.toFixed(2) + ' A';
            }

            // Preencher campo resultado-ansi-tr0x-neutro considerando iansi
            const resultadoAnsiTrNeutroId = i < 10 ? `resultado-ansi-tr0${i}-neutro` : `resultado-ansi-tr${i}-neutro`;
            const resultadoAnsiTrNeutroEl = document.getElementById(resultadoAnsiTrNeutroId);
            if (resultadoAnsiTrNeutroEl) {
                resultadoAnsiTrNeutroEl.textContent = correntesTrafos[trafoKey].iansi.toFixed(2) + ' A';
            }

            // Preencher campo i-nansi-0x
            const iNansiId = i < 10 ? `i-nansi-0${i}` : `i-nansi-${i}`;
            const iNansiEl = document.getElementById(iNansiId);
            if (iNansiEl && correntesTrafos[trafoKey].inansi !== undefined) {
                iNansiEl.textContent = correntesTrafos[trafoKey].inansi.toFixed(2) + ' A';
            }

            // Preencher campo resultado-neutro-tr0x considerando importação de inansi
            const resultadoNeutroTrId = i < 10 ? `resultado-neutro-tr0${i}` : `resultado-neutro-tr${i}`;
            const resultadoNeutroTrEl = document.getElementById(resultadoNeutroTrId);
            if (resultadoNeutroTrEl && correntesTrafos[trafoKey].inansi !== undefined) {
                resultadoNeutroTrEl.textContent = correntesTrafos[trafoKey].inansi.toFixed(2) + ' A';
            }

            // Preencher campo i-mag-0x
            const iMagId = i < 10 ? `i-mag-0${i}` : `i-mag-${i}`;
            const iMagEl = document.getElementById(iMagId);
            if (iMagEl && correntesTrafos[trafoKey].imagindividual !== undefined) {
                iMagEl.textContent = correntesTrafos[trafoKey].imagindividual.toFixed(2) + ' A';
            }

        }
    }


    // ----------------------INICIO CALCULO DE IMAG TOTAL DOS TRAFOS-----------------------------
    // Preencher campos de imag 
    const inMaiorTrafo = parseFloat(localStorage.getItem('maiortrafoinSelecionada'));
    const inMaiorTrafoEl = document.getElementById('in-maior-trafo');
    if (inMaiorTrafoEl && !isNaN(inMaiorTrafo)) {
        inMaiorTrafoEl.textContent = "In do maior trafo = " + "(" + inMaiorTrafo.toFixed(2);
    }

    // Preencher campo de maior fator IMIN
    const maiorTrafoImin = parseFloat(localStorage.getItem('maiortrafoiminSelecionada'));
    const maiorTrafoIminEl = document.getElementById('M-maior-trafo');
    if (maiorTrafoIminEl && !isNaN(maiorTrafoImin)) {
        maiorTrafoIminEl.textContent = ' x ' + maiorTrafoImin.toFixed(2) + ")";
    }

    // Preencher campo de maior trafo quando a quantidade do maior trafo for maior que 1
    const maiorTrafoQtde = parseFloat(localStorage.getItem('maiortrafoqtdeSelecionada'));
    const inTrafo2El = document.getElementById('in-trafo-1');
    if (inTrafo2El) {
        if (!isNaN(maiorTrafoQtde) && maiorTrafoQtde > 1) {
            const maiorTrafoIn = parseFloat(localStorage.getItem('maiortrafoinSelecionada'));
            inTrafo2El.textContent = !isNaN(maiorTrafoIn) ? `+ ( ${maiorTrafoIn.toFixed(2)} × ${maiorTrafoQtde - 1} )` : '';

            // inTrafo2El.textContent = !isNaN(maiorTrafoIn) ? maiorTrafoIn.toFixed(2) + ' A' : '';
            inTrafo2El.style.display = '';
        } else {
            inTrafo2El.style.display = 'none';
        }
    }

    // Preencher campo de corrente do trafo 2

    // Preencher in-trafo-2 até in-trafo-10 em ordem decrescente de corrente, desconsiderando o maior corrente intrafoindividual
    const correntesTrafos = JSON.parse(localStorage.getItem('correntestrafosJSON')) || {};
    // Monta array de correntes (trafo2 a trafo10) ignorando o maior corrente
    let trafosArray = [];
    for (let i = 1; i <= 10; i++) {
        const trafoKey = `trafo${i}`;
        const trafoSalvo = JSON.parse(localStorage.getItem(`${trafoKey}JSON`)) || {};
        const qtdeTrafo = parseFloat(trafoSalvo.qtde) || 0;
        if (correntesTrafos[trafoKey] && correntesTrafos[trafoKey].intrafoindividual !== undefined) {
            trafosArray.push({ i, corrente: correntesTrafos[trafoKey].intrafoindividual, qtde: qtdeTrafo });
        }
    }
    // Descobre o maior corrente entre trafo2 a trafo10
    const maiorCorrente = trafosArray.length > 0 ? Math.max(...trafosArray.map(t => t.corrente)) : null;
    // Remove o maior corrente
    trafosArray = trafosArray.filter(t => t.corrente !== maiorCorrente);
    // Ordena em ordem decrescente
    trafosArray.sort((a, b) => b.corrente - a.corrente);

    // Preenche os campos in-trafo-2 até in-trafo-10 conforme ordem decrescente (sem o maior)
    for (let idx = 0; idx < trafosArray.length; idx++) {
        const inTrafoEl = document.getElementById(`in-trafo-${idx + 2}`);
        if (inTrafoEl) {
            // Se qtde > 1, mostra x qtde, senão só corrente
            if (trafosArray[idx].qtde > 0 && trafosArray[idx].corrente > 0) {
                inTrafoEl.textContent = `+ ( ${trafosArray[idx].corrente.toFixed(2)} × ${trafosArray[idx].qtde} )`;
                // inTrafoEl.textContent = `+ ( ${trafosArray[idx].corrente.toFixed(2)} )`;
            }
            // else {

            // }
            inTrafoEl.style.display = '';
        }
    }
    // Oculta os campos restantes se não houver trafo suficiente
    for (let i = trafosArray.length + 1; i <= 10; i++) {
        const inTrafoEl = document.getElementById(`in-trafo-${i}`);
        if (inTrafoEl) {
            inTrafoEl.style.display = 'none';
        }
    }

    // Preencher campo de imag total dos trafos
    const imagTotal = parseFloat(localStorage.getItem('imagtotalSelecionada'));
    const imagTotalEls = document.querySelectorAll('.imag-total-valor');
    imagTotalEls.forEach(el => {
        if (imagTotal !== null && !isNaN(imagTotal)) {
            el.textContent = imagTotal.toFixed(2) + ' A';
        }
    });

    // ---------------FIM DE IMAG DOS TRAFOS -------------------------------------------------

    // ----------------------INICIO CALCULO DE MAGNETIZACAO REAL-----------------------------

    // Carregar corrente de curto no calculo de imag real no HTML
    const curtoSelecionada = localStorage.getItem('curtoSelecionada');
    const inrushCc3fEl = document.getElementById('inrush-cc3f');
    if (inrushCc3fEl && curtoSelecionada !== null) {
        inrushCc3fEl.textContent = curtoSelecionada + ' A';
    }

    // Carregar corrente de inrush no calculo de imag real no HTML
    const inrushInEl = document.getElementById('inrush-in');
    if (inrushInEl && imagTotal !== null && !isNaN(imagTotal)) {
        inrushInEl.textContent = imagTotal.toFixed(2) + ' A';
    }

    // Calcular 1/curtoSelecionada e preencher em divisao-icc com 2 casas decimais
    const divisaoIccEl = document.getElementById('divisao-icc');
    if (divisaoIccEl && curtoSelecionada !== null && !isNaN(curtoSelecionada) && parseFloat(curtoSelecionada) !== 0) {
        divisaoIccEl.textContent = (1 / parseFloat(curtoSelecionada)).toFixed(6);
    }

    // Calcular 1/imagTotal e preencher em divisao-inrush com 2 casas decimais
    const divisaoInrushEl = document.getElementById('divisao-inrush');
    if (divisaoInrushEl && imagTotal !== null && !isNaN(imagTotal) && imagTotal !== 0) {
        divisaoInrushEl.textContent = (1 / imagTotal).toFixed(6);
    }


    // Calcular a soma das divisões e preencher em resultado-divisao
    const resultadoDivisaoEl = document.getElementById('resultado-divisao');
    if (
        resultadoDivisaoEl &&
        divisaoIccEl &&
        divisaoInrushEl &&
        !isNaN(parseFloat(divisaoIccEl.textContent)) &&
        !isNaN(parseFloat(divisaoInrushEl.textContent))
    ) {
        const soma = parseFloat(divisaoIccEl.textContent) + parseFloat(divisaoInrushEl.textContent);
        resultadoDivisaoEl.textContent = soma.toFixed(6);
    }

    // Calcular o resultado final da magnetização real
    // Calcular o resultado final da magnetização real
    const resultadoInrushRealEl = document.getElementById('resultado-inrush-real');
    if (
        resultadoInrushRealEl &&
        divisaoIccEl &&
        divisaoInrushEl &&
        !isNaN(parseFloat(divisaoIccEl.textContent)) &&
        !isNaN(parseFloat(divisaoInrushEl.textContent))
    ) {
        const soma = parseFloat(divisaoIccEl.textContent) + parseFloat(divisaoInrushEl.textContent);
        if (soma !== 0) {
            resultadoInrushRealEl.textContent = (1 / soma).toFixed(2) + ' A';
        } else {
            resultadoInrushRealEl.textContent = '';
        }
    }

    // -----------------------FIM DE MAGNETIZACAO REAL--------------------------------

    // ---------------INICIO DIMENSIONAMENTO DE TC------------------------------------

    // Carregar corrente de curto no calculo de TC no HTML  
    const curtoSelecionadaTC = localStorage.getItem('curtoSelecionada');
    const curtoTCEl = document.getElementById('curtoTC');
    if (curtoTCEl && curtoSelecionadaTC !== null) {
        curtoTCEl.textContent = curtoSelecionadaTC + ' A';
    }

    // Calcular curtoSelecionadaTC / 50 e preencher em tc-saturacao-primario
    const tcSaturacaoPrimarioEl = document.getElementById('tc-saturacao-primario');
    if (tcSaturacaoPrimarioEl && curtoSelecionadaTC !== null && !isNaN(curtoSelecionadaTC)) {
        tcSaturacaoPrimarioEl.textContent = (parseFloat(curtoSelecionadaTC) / 50).toFixed(2);
    }

    //Preencher saturação do TC
    const correnteMagnetizacaoSaturacaoTCEl = document.getElementById('corrente-magnetizacao-saturacao-tc');
    if (correnteMagnetizacaoSaturacaoTCEl) {
        correnteMagnetizacaoSaturacaoTCEl.textContent = (imagTotal / 20).toFixed(2) + ' A';
    }

    // importar o IP fase percentual do localStorage
    const percentualIP = localStorage.getItem('PercentualIPSelecionada');
    const percentualIPEl = document.getElementById('percentual-ip');
    if (percentualIPEl && percentualIP !== null) {
        percentualIPEl.textContent = percentualIP + ' %';
    }

    // Representar o numerador do calculo de ip de partida fase 
    // Preencher campo numerador-potencia-nominal com demanda contratada
    const numeradorPotenciaNominalEls = document.querySelectorAll('.numerador-potencia-nominal');
    numeradorPotenciaNominalEls.forEach(el => {
        if (demandacalculada !== null && !isNaN(demandacalculada)) {
            el.textContent = demandacalculada;
        }
    });

    const ipPartidaNumeradorEls = document.querySelectorAll('.ip-partida-numerador');
    ipPartidaNumeradorEls.forEach(el => {
        if (demandacalculada !== null && !isNaN(demandacalculada)) {
            // Interpolação: mostra demanda + incremento percentual
            const incremento = parseFloat((percentualIP) / 100);
            el.textContent = `${demandacalculada} * ${incremento.toFixed(2)}`;

            //             const incremento = (parseFloat(demandacalculada) * parseFloat(percentualIP) / 100);
            // el.textContent = `${demandacalculada} + ${incremento.toFixed(2)}`;
            
        }
    });

    // Para ip-partida-numerador-TC
    const ipPartidaNumeradorTCEls = document.querySelectorAll('.ip-partida-numerador-TC');
    ipPartidaNumeradorTCEls.forEach(el => {
        if (demandadecontrato !== null && !isNaN(demandadecontrato)) {
            const incremento = parseFloat((percentualIP) / 100);
            el.textContent = `${demandadecontrato} * ${incremento.toFixed(2)}`;
        }
    });

    // Incluir corrente nominal de fase
    const correnteNominalFase = localStorage.getItem('Inominalfase');
    const correnteNominalFaseEls = document.querySelectorAll('.corrente-nominal-fase');
    correnteNominalFaseEls.forEach(el => {
        if (correnteNominalFase !== null && !isNaN(correnteNominalFase)) {
            el.textContent = parseFloat(correnteNominalFase).toFixed(2) + ' A';
        }
    });

    // Representar o denominador do calculo de ip de partida fase
    const ipPartidaDenominadorEls = document.querySelectorAll('.ip-partida-denominador');
    ipPartidaDenominadorEls.forEach(el => {
        if (tensaoAtendimento !== null && !isNaN(tensaoAtendimento) && fatorPotencia !== null && !isNaN(fatorPotencia)) {
            el.textContent = `${tensaoAtendimento} × √3 × ${fatorPotencia}`;
        }
    });

    // Preencher campo ip-partida-resultado considerando Ipdeconsumo
    const ipDeConsumo = localStorage.getItem('Ipdeconsumo');
    const ipPartidaResultadoEls = document.querySelectorAll('.ip-partida-resultado');
    ipPartidaResultadoEls.forEach(el => {
        if (ipDeConsumo !== null && !isNaN(ipDeConsumo)) {
            el.textContent = parseFloat(ipDeConsumo).toFixed(2) + ' A';
        }
    });

    // Preencher campo ip-partida-resultado-TC considerando IpdeconsumoTC
    const ipDeConsumoTC = demandadecontrato * ((parseFloat(percentualIP) / 100)) / (tensaoAtendimento * Math.sqrt(3) * fatorPotencia);

    // console.log('fatorPotencia:', fatorPotencia); // Debug: verificar valor de fatorPotencia
    // console.log('tensaoAtendimento:', tensaoAtendimento); // Debug: verificar valor de tensaoAtendimento
    // console.log('percentualIP:', percentualIP); // Debug: verificar valor de percentualIP
    // console.log('demandadecontrato:', demandadecontrato); // Debug: verificar valor de demandadecontrato
    // console.log('ipDeConsumoTC:', ipDeConsumoTC); // Debug: verificar valor de ipDeConsumoTC
    const ipPartidaResultadoTCEls = document.querySelectorAll('.ip-partida-resultado-TC');
    ipPartidaResultadoTCEls.forEach(el => {
        if (ipDeConsumoTC !== null && !isNaN(ipDeConsumoTC)) {
            el.textContent = parseFloat(ipDeConsumoTC).toFixed(2) + ' A';
        }
    });

    // Preencher campo tc-especificacao considerando TcEspecificacaoSelecionada
    const tcEspecificacao = localStorage.getItem('TCdeprotecaoSelecionada');
    const tcEspecificacaoEls = document.querySelectorAll('.tc-especificacao');
    tcEspecificacaoEls.forEach(el => {
        if (tcEspecificacao !== null && !isNaN(tcEspecificacao)) {
            el.textContent = "Relação de transformação do TC = " + parseFloat(tcEspecificacao) + ' : 5 A';
        }
    });

    // Preencher valor puro em tc-especificacao-valor
    const tcEspecificacaoValorEls = document.querySelectorAll('.tc-especificacao-valor');
    tcEspecificacaoValorEls.forEach(el => {
        if (tcEspecificacao !== null && !isNaN(tcEspecificacao)) {
            el.textContent = parseFloat(tcEspecificacao);
        }
    });



    // Preencher campos de TP primária e secundária
    const tpPrimariaFF = localStorage.getItem('tensaoprimariaFF');
    const tpPrimariaFN = localStorage.getItem('tensaoprimariaFN');
    const tpSecundariaFF = localStorage.getItem('tensaoSecundariaFFTP');
    const tpSecundariaFN = localStorage.getItem('tensaoSecundariaFNTP');
    const rtpLabel = localStorage.getItem('TPdeprotecaoSelecionada');
    const tpFechamento = localStorage.getItem('ligacaodabobinaSelecionada');

    // Preencher campos de TP primária e secundária usando classes
    document.querySelectorAll('.tp-fechamento').forEach(el => {
        if (tpFechamento !== null) el.textContent = tpFechamento;
    });
    document.querySelectorAll('.tp-primaria-ff').forEach(el => {
        if (tpPrimariaFF !== null) el.textContent = tpPrimariaFF + ' V';
    });
    document.querySelectorAll('.tp-primaria-fn').forEach(el => {
        if (tpPrimariaFN !== null) el.textContent = tpPrimariaFN + ' V';
    });
    document.querySelectorAll('.tp-secundaria-ff').forEach(el => {
        if (tpSecundariaFF !== null) el.textContent = tpSecundariaFF + ' V';
    });
    document.querySelectorAll('.tp-secundaria-fn').forEach(el => {
        if (tpSecundariaFN !== null) el.textContent = tpSecundariaFN + ' V';
    });
    document.querySelectorAll('.rtp-label').forEach(el => {
        if (rtpLabel !== null) el.textContent = rtpLabel + ' :1';
    });


    const ipPUSelecionada = localStorage.getItem('ipPUSelecionada');
    const correnteIpPuEls = document.querySelectorAll('.corrente-ip-pu');
    correnteIpPuEls.forEach(el => {
        if (ipPUSelecionada !== null && !isNaN(ipPUSelecionada)) {
            el.textContent = parseFloat(ipPUSelecionada).toFixed(2) + ' P.U';
        }
    });

    const curvaFaseSelecionada = localStorage.getItem('curvafaseSelecionada');
    const curvaFaseEls = document.querySelectorAll('.curva-fase');
    curvaFaseEls.forEach(el => {
        if (curvaFaseSelecionada !== null) {
            el.textContent = curvaFaseSelecionada;
        }
    });
    // -----------------FIM DIMENSIONAMENTO DE TC-------------------------------------------



    // Preencher campos fator-alfa-fase, fator-beta-fase, fator-k-fase importando de dadoscurvausariofase

    const dadosCurvaUsuarioFase = JSON.parse(localStorage.getItem('dadoscurvausariofase')) || {};
    const alfaFase = dadosCurvaUsuarioFase.alfa || 0;
    const betaFase = dadosCurvaUsuarioFase.beta || 0;
    const kFase = dadosCurvaUsuarioFase.k || 0;

    const alfaFaseEls = document.querySelectorAll('.fator-alfa-fase');
    alfaFaseEls.forEach(el => {
        el.textContent = alfaFase;
    });

    const betaFaseEls = document.querySelectorAll('.fator-beta-fase');
    betaFaseEls.forEach(el => {
        el.textContent = betaFase;
    });

    const kFaseEls = document.querySelectorAll('.fator-k-fase');
    kFaseEls.forEach(el => {
        el.textContent = kFase;
    });

    // Calcular fator m = imagTotal / correnteNominalFase e preencher em fator-m
    // Preencher todos os elementos com a classe 'fator-m'
    const fatorMEls = document.querySelectorAll('.fator-m');
    if (imagTotal !== null && correnteNominalFase !== null && !isNaN(imagTotal) && !isNaN(correnteNominalFase) && parseFloat(correnteNominalFase) !== 0) {
        const fatorM = imagTotal / parseFloat(correnteNominalFase);
        fatorMEls.forEach(el => {
            el.textContent = fatorM.toFixed(2);
        });
    }

    // Preencher campo tempo-mag-fase com valor 0.10
    const tempomagFase = 0.10;
    const tempoMagFaseEls = document.querySelectorAll('.tempo-mag-fase');
    tempoMagFaseEls.forEach(el => {
        el.textContent = tempomagFase.toFixed(2) + ' s ou ' + (tempomagFase * 1000).toFixed(0) + ' ms';

    });



    //Preencher formulas do dial 

    // Usar classes ao invés de IDs
    // const campos2 = ["beta2", "imag2", "in2", "alpha2", "k2", "t2"];
    // const valores = campos2.reduce((obj, className) => {
    //     const element = document.querySelector(`.${className}`);
    //     obj[className] = element ? element.textContent : '';
    //     return obj;
    // }, {});

    // Preencher fórmula para .formula1
    const latex1 = `DT = \\left( \\frac{\\left( \\frac{${'imag'}}{${'In'}} \\right)^{\\alpha}}{\\beta} - ${'k'} \\right) \\times ${'t'}`;
    const formulaEl1 = document.querySelector(".formula1");
    if (formulaEl1 && typeof MathJax !== 'undefined') {
        formulaEl1.innerHTML = `\\(${latex1}\\)`;
        MathJax.typesetPromise([formulaEl1]).catch(err => console.log('Erro MathJax:', err));
    }

    // Preencher fórmula para .formula2
    const latex2 = `DT = \\left( \\frac{\\left( \\frac{${imagTotal.toFixed(2)}}{${parseFloat(correnteNominalFase).toFixed(2)}} \\right)^{${alfaFase}}}{${betaFase}} - ${kFase} \\right) \\times ${parseFloat(tempomagFase).toFixed(2)}`;
    const formulaEl2 = document.querySelector(".formula2");
    if (formulaEl2 && typeof MathJax !== 'undefined') {
        formulaEl2.innerHTML = `\\(${latex2}\\)`;
        MathJax.typesetPromise([formulaEl2]).catch(err => console.log('Erro MathJax:', err));
    }


    // Preencher campo dial-fase com dialCalculadoPlantaSemMotores
    const dialCalculadoPlantaSemMotores = localStorage.getItem('dialCalculadoPlantaSemMotores');
    const dialFaseEls = document.querySelectorAll('.dial-fase-calculado');
    dialFaseEls.forEach(el => {
        if (dialCalculadoPlantaSemMotores !== null && !isNaN(dialCalculadoPlantaSemMotores)) {
            el.textContent = parseFloat(dialCalculadoPlantaSemMotores).toFixed(2);
        }
    });

    // Preencher campo dial-fase-ajustado com dialFaseAjustado
    const dialFaseAjustado = localStorage.getItem('dialfaseSelecionada');
    const dialFaseAjustadoEls = document.querySelectorAll('.dial-fase-ajustado');
    dialFaseAjustadoEls.forEach(el => {
        if (dialFaseAjustado !== null && !isNaN(dialFaseAjustado)) {
            el.textContent = parseFloat(dialFaseAjustado).toFixed(2);
        }
    });



    // Preencher campo tolerancia-imag com imagpercentualSelecionada
    const imagPercentualSelecionada = localStorage.getItem('imagpercentualSelecionada');
    const toleranciaImagEls = document.querySelectorAll('.imag-tolerancia-percentual');
    toleranciaImagEls.forEach(el => {
        if (imagPercentualSelecionada !== null && !isNaN(imagPercentualSelecionada)) {
            el.textContent = imagPercentualSelecionada + ' %';
        }
    });

    // Preencher campo tolerancia-imag com imagTotal e imagPercentualSelecionada
    const valorToleranciaImagEls = document.querySelectorAll('.valor-torlerancia-imag');
    valorToleranciaImagEls.forEach(el => {
        if (imagTotal !== null && !isNaN(imagTotal) && imagPercentualSelecionada !== null && !isNaN(imagPercentualSelecionada)) {
            const valor = parseFloat((imagPercentualSelecionada) / 100);
            el.textContent = '* ' + valor.toFixed(2);
        }
    });

    // Preencher campo tolerancia-ip com ippercentualSelecionada
    const instFaseConsumo = parseFloat(localStorage.getItem('Instfaseconsumo'));
    const instFaseResultadoEls = document.querySelectorAll('.inst-fase-resultado');
    instFaseResultadoEls.forEach(el => {
        if (!isNaN(instFaseConsumo)) {
            el.textContent = instFaseConsumo.toFixed(2) + ' A';
        }
    });

    // Preencher campo inst-valor-pu com iinstPUSelecionada
    const iinstPUSelecionada = localStorage.getItem('iinstPUSelecionada');
    const instValorPuEls = document.querySelectorAll('.inst-valor-pu');
    instValorPuEls.forEach(el => {
        if (iinstPUSelecionada !== null && !isNaN(iinstPUSelecionada)) {
            el.textContent = parseFloat(iinstPUSelecionada).toFixed(2) + ' P.U';
        }
    });

    // Preencher campo Desequelibrio-neutro com desequilibrioSelecionada
    const desequilibrioSelecionada = localStorage.getItem('desequilibrioSelecionada');
    // console.log('desequilibrioSelecionada:', desequilibrioSelecionada); // Debug: verificar valor de desequilibrioSelecionada
    const desequilibrioNeutroEls = document.querySelectorAll('.Desequelibrio-neutro');
    desequilibrioNeutroEls.forEach(el => {
        if (desequilibrioSelecionada !== null && !isNaN(desequilibrioSelecionada)) {
            el.textContent = desequilibrioSelecionada*100 + ' %';
        }
    });

    // Preencher campo in-neutro com inominalneutroconsumo
    const inominalNeutroConsumo = localStorage.getItem('Inominalneutroconsumo');
    const inNeutroEls = document.querySelectorAll('.in-neutro');
    inNeutroEls.forEach(el => {
        if (inominalNeutroConsumo !== null && !isNaN(inominalNeutroConsumo)) {
            el.textContent = parseFloat(inominalNeutroConsumo).toFixed(2) + ' A';
        }
    });

    // Preencher campo ip-neutro com IpneutroSelecionada
    const ipNeutroSelecionada = localStorage.getItem('IpdeneutroSelecionada');
    const ipNeutroEls = document.querySelectorAll('.ip-neutro');
    ipNeutroEls.forEach(el => {
        if (ipNeutroSelecionada !== null && !isNaN(ipNeutroSelecionada)) {
            el.textContent = parseFloat(ipNeutroSelecionada).toFixed(2) + ' A';
        }
    });

    // Preencher campo in-neutro-PU com ipneutroPUSelecionada
    const ipneutroPUSelecionada = localStorage.getItem('ipneutroPUSelecionada');
    const inNeutroPuEls = document.querySelectorAll('.ip-neutro-PU');
    inNeutroPuEls.forEach(el => {
        if (ipneutroPUSelecionada !== null && !isNaN(ipneutroPUSelecionada)) {
            el.textContent = parseFloat(ipneutroPUSelecionada).toFixed(2) + ' P.U';
        }
    });


    const dialNeutroSelecionada = localStorage.getItem('dialneutroSelecionada');
    const tempoNeutroIpEls = document.querySelectorAll('.tempo-neutro-ip');
    tempoNeutroIpEls.forEach(el => {
        if (dialNeutroSelecionada !== null && !isNaN(dialNeutroSelecionada)) {
            el.textContent = parseFloat(dialNeutroSelecionada).toFixed(2) + " s";
        }
    });


    // Preencher campo inst-neutro-resultado com InstneutroSelecionada
    const instNeutroSelecionada = localStorage.getItem('IinstneutroSelecionada');
    const instNeutroResultadoEls = document.querySelectorAll('.inst-neutro-resultado');
    instNeutroResultadoEls.forEach(el => {
        if (instNeutroSelecionada !== null && !isNaN(instNeutroSelecionada)) {
            el.textContent = parseFloat(instNeutroSelecionada).toFixed(2) + ' A';
        }
    });

    // console.log(instNeutroSelecionada);


    const instneutroPUSelecionada = localStorage.getItem('instneutroPUSelecionada');
    const instNeutroPuEls = document.querySelectorAll('.inst-neutro-PU');
    instNeutroPuEls.forEach(el => {
        if (instneutroPUSelecionada !== null && !isNaN(instneutroPUSelecionada)) {
            el.textContent = parseFloat(instneutroPUSelecionada).toFixed(2) + ' P.U';
        }
    });

    //----------PRRENCHIMENTO GERADOR A DIESEL----------------------------------------







    //PREENCHE POTENCIA EM KVA DO GERADOR NO HTML
    const potenciaAparenteGeradorEls = document.querySelectorAll('.potencia-aparente-gerador');
    potenciaAparenteGeradorEls.forEach(el => {
        if (geradorSalvo.potencia !== undefined && geradorSalvo.potencia !== null && !isNaN(geradorSalvo.potencia)) {
            el.textContent = geradorSalvo.potencia + ' kVA';
        }
    });

    // Preencher fator de potência do gerador
    const fatorPotenciaGeradorEls = document.querySelectorAll('.fator-potencia-gerador');
    fatorPotenciaGeradorEls.forEach(el => {
        if (geradorSalvo.fatorpotencia !== undefined && geradorSalvo.fatorpotencia !== null && !isNaN(geradorSalvo.fatorpotencia)) {
            el.textContent = (geradorSalvo.fatorpotencia * 1).toFixed(0) + ' %';
        }
    });

    // Preencher tolerância do gerador
    const toleranciaGeradorEls = document.querySelectorAll('.tolerancia-gerador');
    if (geradorSalvo.tolerancia !== undefined && geradorSalvo.tolerancia !== null && !isNaN(geradorSalvo.tolerancia)) {
        toleranciaGeradorEls.forEach(el => {
            el.textContent = geradorSalvo.tolerancia + ' %';
        });
    }



    const potenciaReversaGerador = localStorage.getItem('potenciaReversaGerador');
    const potenciaReversaGeradorEls = document.querySelectorAll('.potencia-reversa-gerador');
    potenciaReversaGeradorEls.forEach(el => {
        if (potenciaReversaGerador !== null && !isNaN(potenciaReversaGerador)) {
            el.textContent = potenciaReversaGerador + ' W';
        }
    });

    // Preencher campo potencia-reversa-geradorkw apenas com valor em kW
    const potenciaReversaGeradorKwEls = document.querySelectorAll('.potencia-reversa-geradorkw');
    potenciaReversaGeradorKwEls.forEach(el => {
        if (potenciaReversaGerador !== null && !isNaN(potenciaReversaGerador)) {
            el.textContent = (potenciaReversaGerador / 1000).toFixed(2) + ' kW';
        }
    });

    const denominadorPotReversaEls = document.querySelectorAll('.denominador-potreversa-ajuste-pu');
    denominadorPotReversaEls.forEach(el => {
        if (
            tpPrimariaFF !== null && !isNaN(tpPrimariaFF) &&
            tcEspecificacao !== null && !isNaN(tcEspecificacao)
        ) {
            el.textContent = `${tpPrimariaFF} × √3 × ${tcEspecificacao}`;
        }
    });

    const potenciadieselIPU = localStorage.getItem('potenciadieselPU');
    const pAjustePuEls = document.querySelectorAll('.potreversa-ajuste-pu');
    pAjustePuEls.forEach(el => {
        if (potenciadieselIPU !== null && !isNaN(potenciadieselIPU)) {
            el.textContent = parseFloat(potenciadieselIPU).toFixed(2) + ' P.U';
        }
    });


    // Verifica se o gerador a diesel está habilitado e exibe os campos correspondentes---------------
    const habilitaGeradorEls = document.querySelectorAll('.habilitageradoradiesel');

    if (
        geradorSalvo.potencia !== undefined && geradorSalvo.potencia !== null && !isNaN(geradorSalvo.potencia) && geradorSalvo.potencia !== "" &&
        geradorSalvo.fatorpotencia !== undefined && geradorSalvo.fatorpotencia !== null && !isNaN(geradorSalvo.fatorpotencia) && geradorSalvo.fatorpotencia !== "" &&
        geradorSalvo.tolerancia !== undefined && geradorSalvo.tolerancia !== null && !isNaN(geradorSalvo.tolerancia) && geradorSalvo.tolerancia !== ""
    ) {
        // console.log('sim');
        // Habilitar elementos relacionados ao gerador a diesel
        habilitaGeradorEls.forEach(el => {
            el.style.display = '';
            el.classList.add('tabelaparametrizacaoreles');
            el.classList.add('calculogeradordiesel');
        });
    } else {
        habilitaGeradorEls.forEach(el => {
            el.style.display = 'none';
        });
        // console.log('não');
    }
    // FIM DE PREENCHEMENTO GERADOR A DIESEL----------------------------------------








    //exibir div do class="correnteminima" somente se o valor inomimalminimaTC for Sim
    // const inomimalMinimaTC = localStorage.getItem('inomimalminimaTC');
    // const correnteMinimaEls = document.querySelectorAll('.correnteminima');

    // correnteMinimaEls.forEach(el => {
    //     el.style.display = (inomimalMinimaTC === 'Sim') ? '' : 'none';
    // });

    //LEMBRAR DE INCLUIR LOGICA PARA APARECER E REMOVER OS CALCULOS QUANDO NÃO HOUVER VALOR



















}














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

function imprimirPaginaEmPDF() {
    window.print();
}



// Adicionar estilos de impressão apenas se não existirem
if (!document.querySelector('style[media="print"]')) {
    const estiloImpressao = document.createElement("style");
    estiloImpressao.media = "print";
    estiloImpressao.textContent = `
@page {
    size: A4 portrait;
    margin: 20mm;
}
body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
button {
    display: none !important;
}
table {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
tr, td, th {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}
`;
    document.head.appendChild(estiloImpressao);
}



function atualizarFormula() {
    const campos = ["beta", "imag", "in", "alpha", "k", "dt"];
    const valores = campos.reduce((obj, id) => {
        const element = document.getElementById(id);
        obj[id] = element ? element.textContent : '';
        // console.log(`${id}:`, obj[id]); // Debug
        return obj;
    }, {});

    // console.log('Valores:', valores); // Debug
    const latex = `t = \\left( \\frac{${valores.beta}}{\\left( \\frac{${valores.imag}}{${valores.in}} \\right)^{${valores.alpha}}} - ${valores.k} \\right) \\times ${valores.dt}`;
    const formulaEl = document.getElementById("formula");

    if (formulaEl && typeof MathJax !== 'undefined') {
        formulaEl.innerHTML = `\\(${latex}\\)`;
        MathJax.typesetPromise([formulaEl]).catch(err => console.log('Erro MathJax:', err));
    } else {
        // console.log('MathJax não disponível ou elemento formula não encontrado');
    }
}

function atualizarFormula2() {

}




// Função para carregar script dinamicamente
function carregarScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error('Erro ao carregar script:', src);
    document.head.appendChild(script);
}

// Carregar o script do gráfico após o DOM estar pronto
document.addEventListener('DOMContentLoaded', function () {


    // Carregar o script do gráfico primeiro
    carregarScript('grafico5051consumo.js', function () {


        // Aguardar um pouco e então carregar as fórmulas
        setTimeout(() => {
            verificarMathJax();
        }, 1000);
    });

    // Configurar botão se existir
    const botaoParametro = document.getElementById("botaoestudoshtml");
    if (botaoParametro) {
        botaoParametro.style.backgroundColor = "#cf0808";
    }
});

function verificarMathJax() {
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {

        atualizarFormula();
        atualizarFormula2();
    } else {

        setTimeout(verificarMathJax, 500);
    }
}


// ...existing code...

// Função para carregar dados do localStorage e exibir na div tabelareles
function carregarTabelaReles() {

    const tabelaRelesDiv = document.getElementById('tabelareles');

    // Recupera os dados do localStorage
    const dadosArmazenados = localStorage.getItem('Tabelasalva');

    // console.log('Dados encontrados no localStorage:', dadosArmazenados); //Debug adicional

    if (dadosArmazenados) {
        // Define o conteúdo HTML da div com os dados recuperados
        tabelaRelesDiv.innerHTML = dadosArmazenados;
    } else {
        // console.warn('Nenhum dado encontrado no localStorage para Tabelasalva');
        tabelaRelesDiv.innerHTML = '<p>Nenhum dado encontrado.</p>';
    }


}


function adicionarEstilosTabelaParametrizacaoReles() {
    if (!document.getElementById('estilo-tabela-parametrizacao-reles')) {
        const style = document.createElement('style');
        style.id = 'estilo-tabela-parametrizacao-reles';
        style.textContent = `
.tabelaparametrizacaoreles {
    font-family: 'Times New Roman', Times, serif;
    font-size: 1.05em;
    background: #fff; /* fundo branco */
    color: #000;      /* letras pretas */
    border: 2px solid #34335c;
    border-radius: 10px;
    padding: 20px 30px;
    margin: 40px auto;
    width: 210mm;
    max-width: 100vw;
    box-shadow: 0 2px 10px rgba(52, 51, 92, 0.10);
    text-align: left;
}

.tabelaparametrizacaoreles table {
    border-collapse: collapse;
    width: 100%;
    background: #fff;
    color: #000; /* letras pretas */
}

.tabelaparametrizacaoreles th,
.tabelaparametrizacaoreles td {
    border: 1px solid #34335c;
    padding: 8px;
    text-align: left;
    font-size: 1em;
    color: #000; /* letras pretas */
}
        `;
        document.head.appendChild(style);
    }
}

// Chame a função ao carregar a página
document.addEventListener('DOMContentLoaded', adicionarEstilosTabelaParametrizacaoReles);


document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    // Exibe a imagem salva no localStorage (se existir)
    const imagemSelecionada = localStorage.getItem("imagemSelecionada");
    if (imagemSelecionada) {
        const img = document.createElement("img");
        img.src = imagemSelecionada;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        gallery.appendChild(img);
    }
});

    // Limpa a imagemSelecionada e a galeria
    // clearButton.addEventListener("click", () => {
    //     localStorage.removeItem("imagemSelecionada");
    //     gallery.innerHTML = "";
    // });



function exibirCorrenteMinimaSeNecessario() {
    // Certifique-se de que o valor está correto e sem espaços extras
    const inomimalMinimaTC = localStorage.getItem('inominalminimaTC');
    const correnteMinimaEls = document.querySelectorAll('.correnteminima');
    // Adicione um log para depuração
    // console.log('inomimalMinimaTC:', inomimalMinimaTC, 'Elementos encontrados:', correnteMinimaEls.length);
    correnteMinimaEls.forEach(el => {
        el.style.display = (inomimalMinimaTC === "Sim") ? '' : 'none';
    });
}

