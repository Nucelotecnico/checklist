
let valor = "conversorCoordenadas"; // Valor padrão


document.getElementById('ferramentaSelector').addEventListener('change', function () {
    valor = this.value;
    console.log("Valor selecionado 1:", valor); // Adicione este log para depuração
    document.getElementById('conversorCoordenadas').style.display = valor === 'conversorCoordenadas' ? 'block' : 'none';
    document.getElementById('PesquisarRTs').style.display = valor === 'PesquisarRTs' ? 'block' : 'none';
    document.getElementById('equipamentosaterramento').style.display = valor === 'equipamentosaterramento' ? 'block' : 'none';
    document.getElementById('protecoesdegeracao').style.display = valor === 'protecoesdegeracao' ? 'block' : 'none';
    document.getElementById('Gerenciador de Textos de Reprovação').style.display = valor === 'Gerenciador de Textos de Reprovação' ? 'block' : 'none';
});



let map = L.map('map').setView([-17.5, -45.5], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker1, marker2, line;

function atualizarCampos(id) {
    const formato = document.getElementById(`formato${id}`).value;
    const container = document.getElementById(`campos${id}`);
    container.innerHTML = "";

    if (formato === "geo") {
        container.innerHTML = `
          <label>Latitude: <input type="number" id="lat${id}" step="0.00001"></label><br>
          <label>Longitude: <input type="number" id="lon${id}" step="0.00001"></label><br>
        `;
    } else {
        container.innerHTML = `
  <label>Zona:
    <select id="zona${id}">
      <option value="22">22</option>
      <option value="23" selected>23</option>
      <option value="24">24</option>
    </select>
  </label><br>
  <label>Hemisfério (S): <input type="text" id="hem${id}" value="S" readonly></label><br>
  <label>Easting: <input type="number" id="east${id}" step="0.01"></label><br>
  <label>Northing: <input type="number" id="north${id}" step="0.01"></label><br>
`;
    }
}

atualizarCampos(1);
atualizarCampos(2);

function utmParaGeo(zona, hem, easting, northing) {
    const a = 6378137.0;
    const e = 0.081819191;
    const k0 = 0.9996;
    const x = easting - 500000;
    const y = hem === 'S' ? northing - 10000000 : northing;
    const lonOrigin = ((zona - 1) * 6 - 180 + 3);

    const M = y / k0;
    const mu = M / (a * (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256));
    const e1 = (1 - Math.sqrt(1 - Math.pow(e, 2))) / (1 + Math.sqrt(1 - Math.pow(e, 2)));
    const J1 = (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32);
    const J2 = (21 * Math.pow(e1, 2) / 16 - 55 * Math.pow(e1, 4) / 32);
    const J3 = (151 * Math.pow(e1, 3) / 96);
    const J4 = (1097 * Math.pow(e1, 4) / 512);
    const fp = mu + J1 * Math.sin(2 * mu) + J2 * Math.sin(4 * mu) + J3 * Math.sin(6 * mu) + J4 * Math.sin(8 * mu);

    const C1 = Math.pow(e, 2) / (1 - Math.pow(e, 2)) * Math.pow(Math.cos(fp), 2);
    const T1 = Math.pow(Math.tan(fp), 2);
    const N1 = a / Math.sqrt(1 - Math.pow(e * Math.sin(fp), 2));
    const R1 = a * (1 - Math.pow(e, 2)) / Math.pow(1 - Math.pow(e * Math.sin(fp), 2), 1.5);
    const D = x / (N1 * k0);

    const lat = fp - (N1 * Math.tan(fp) / R1) * (Math.pow(D, 2) / 2 - (5 + 3 * T1 + 10 * C1) * Math.pow(D, 4) / 24 + (61 + 90 * T1 + 298 * C1) * Math.pow(D, 6) / 720);
    const lon = (D - (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6 + (5 - 2 * C1 + 28 * T1) * Math.pow(D, 5) / 120) / Math.cos(fp);

    return {
        lat: lat * 180 / Math.PI,
        lon: lonOrigin + lon * 180 / Math.PI
    };
}

function geoParaUTM(lat, lon) {
    const zona = Math.floor((lon + 180) / 6) + 1;
    const hemisferio = lat >= 0 ? 'N' : 'S';
    const a = 6378137.0;
    const e = 0.081819191;
    const k0 = 0.9996;
    const latRad = lat * Math.PI / 180;
    const lonRad = lon * Math.PI / 180;
    const lonOrigin = ((zona - 1) * 6 - 180 + 3) * Math.PI / 180;

    const N = a / Math.sqrt(1 - Math.pow(e * Math.sin(latRad), 2));
    const T = Math.pow(Math.tan(latRad), 2);
    const C = Math.pow(e, 2) / (1 - Math.pow(e, 2)) * Math.pow(Math.cos(latRad), 2);
    const A = Math.cos(latRad) * (lonRad - lonOrigin);

    const M = a * ((1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256) * latRad
        - (3 * Math.pow(e, 2) / 8 + 3 * Math.pow(e, 4) / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * latRad)
        + (15 * Math.pow(e, 4) / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * latRad)
        - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * latRad));

    const easting = 500000 + k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + T * T + 72 * C) * Math.pow(A, 5) / 120);
    const northing = k0 * (M + N * Math.tan(latRad) * (Math.pow(A, 2) / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24 + (61 - 58 * T + T * T + 600 * C) * Math.pow(A, 6) / 720));
    const northingFinal = lat < 0 ? northing + 10000000 : northing;

    return { zona, hemisferio, easting, northing: northingFinal };
}

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

//função para validar campos 

function validarCamposGeo(latId, lonId) {
    const latStr = document.getElementById(latId).value.trim();
    const lonStr = document.getElementById(lonId).value.trim();
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    // Regex: deve começar com "-", depois dígitos, ponto ou vírgula, e mais dígitos
    const regex = /^-\d{1,2}([.,]\d+)?$/;

    if (!regex.test(latStr)) {
        alert("Latitude deve ser negativa e no formato -xx.xxxxxx ou -xx,xxxxxx.");
        return false;
    }
    if (!regex.test(lonStr)) {
        alert("Longitude deve ser negativa e no formato -xx.xxxxxx ou -xx,xxxxxx.");
        return false;
    }
    if (isNaN(lat) || isNaN(lon)) {
        alert("Preencha latitude e longitude corretamente.");
        return false;
    }
    if (lat < -90 || lat > 0) {
        alert("Latitude deve estar entre -90 e 0.");
        return false;
    }
    if (lon < -180 || lon > 0) {
        alert("Longitude deve estar entre -180 e 0.");
        return false;
    }
    return true;
}

function validarCamposUTM(zonaId, hemId, eastId, northId) {
    const zona = parseInt(document.getElementById(zonaId).value);
    const hem = document.getElementById(hemId).value.toUpperCase();
    const east = parseFloat(document.getElementById(eastId).value);
    const north = parseFloat(document.getElementById(northId).value);
    if (![22, 23, 24].includes(zona)) {
        alert("Zona UTM deve ser 22, 23 ou 24.");
        return false;
    }
    if (hem !== 'S') {
        alert("Hemisfério deve ser 'S'.");
        return false;
    }
    if (isNaN(east) || isNaN(north)) {
        alert("Easting e Northing devem ser números.");
        return false;
    }
    if (east < 100000 || east > 900000) {
        alert("Easting deve estar entre 100.000 e 900.000 metros.");
        return false;
    }
    if (north < 0 || north > 10000000) {
        alert("Northing deve estar entre 0 e 10.000.000 metros para o hemisfério sul.");
        return false;
    }
    return true;
}

//----------




function converterEPlotar() {
    const formato1 = document.getElementById("formato1").value;
    const formato2 = document.getElementById("formato2").value;

    // Validação dos campos antes de processar
    if (formato1 === "geo") {
        if (!validarCamposGeo("lat1", "lon1")) return;
    } else {
        if (!validarCamposUTM("zona1", "hem1", "east1", "north1")) return;
    }

    // if (formato2 === "geo") {
    //     if (!validarCamposGeo("lat2", "lon2")) return;
    // } else {
    //     if (!validarCamposUTM("zona2", "hem2", "east2", "north2")) return;
    // }

    //-----------codigo novo 
    // Tenta validar a coordenada 2, mas só se algum campo estiver preenchido
    let coord2Preenchida = false;
    if (formato2 === "geo") {
        const lat2 = document.getElementById("lat2").value.trim();
        const lon2 = document.getElementById("lon2").value.trim();
        coord2Preenchida = lat2 !== "" && lon2 !== "";
        if (coord2Preenchida && !validarCamposGeo("lat2", "lon2")) return;
    } else {
        const east2 = document.getElementById("east2").value.trim();
        const north2 = document.getElementById("north2").value.trim();
        coord2Preenchida = east2 !== "" && north2 !== "";
        if (coord2Preenchida && !validarCamposUTM("zona2", "hem2", "east2", "north2")) return;
    }


    //-----------



    let p1Geo, p2Geo, p1UTM, p2UTM;

    // Coordenada 1
    if (formato1 === "geo") {
        const lat = parseFloat(document.getElementById("lat1").value);
        const lon = parseFloat(document.getElementById("lon1").value);
        if (isNaN(lat) || isNaN(lon)) return alert("Preencha a coordenada 1 corretamente.");
        p1Geo = { lat, lon };
        p1UTM = geoParaUTM(lat, lon);
    } else {
        const zona = parseInt(document.getElementById("zona1").value);
        const hem = document.getElementById("hem1").value.toUpperCase();
        const east = parseFloat(document.getElementById("east1").value);
        const north = parseFloat(document.getElementById("north1").value);
        if (isNaN(zona) || !['N', 'S'].includes(hem) || isNaN(east) || isNaN(north)) return alert("Preencha a coordenada 1 corretamente.");
        p1UTM = { zona, hemisferio: hem, easting: east, northing: north };
        p1Geo = utmParaGeo(zona, hem, east, north);
    }


    //---------codigo novo 
    // Se a coordenada 2 não foi preenchida, só mostra a 1 no mapa
    if (!coord2Preenchida) {
        document.getElementById("resultado").innerText =
            `📍 Coordenada 1 (Geográfica):\n` +
            `Latitude: ${p1Geo.lat.toFixed(5)}\n` +
            `Longitude: ${p1Geo.lon.toFixed(5)}\n` +
            `📍 Coordenada 1 (UTM):\n` +
            `Zona: ${p1UTM.zona}${p1UTM.hemisferio}\n` +
            `Easting: ${p1UTM.easting.toFixed(2)}\n` +
            `Northing: ${p1UTM.northing.toFixed(2)}\n`;

        const resultadoDiv = document.getElementById("resultado");
        resultadoDiv.classList.add("result");
        resultadoDiv.style.background = "#fff";
        resultadoDiv.style.display = "block";

        if (marker1) map.removeLayer(marker1);
        if (marker2) map.removeLayer(marker2);
        if (line) map.removeLayer(line);

        marker1 = L.marker([p1Geo.lat, p1Geo.lon]).addTo(map).bindPopup("Coordenada 1").openPopup();

        map.setView([p1Geo.lat, p1Geo.lon], 15);
        return;
    }

    //---------------





    // Coordenada 2
    if (formato2 === "geo") {
        const lat = parseFloat(document.getElementById("lat2").value);
        const lon = parseFloat(document.getElementById("lon2").value);
        if (isNaN(lat) || isNaN(lon)) return alert("Preencha a coordenada 2 corretamente.");
        p2Geo = { lat, lon };
        p2UTM = geoParaUTM(lat, lon);
    } else {
        const zona = parseInt(document.getElementById("zona2").value);
        const hem = document.getElementById("hem2").value.toUpperCase();
        const east = parseFloat(document.getElementById("east2").value);
        const north = parseFloat(document.getElementById("north2").value);
        if (isNaN(zona) || !['N', 'S'].includes(hem) || isNaN(east) || isNaN(north)) return alert("Preencha a coordenada 2 corretamente.");
        p2UTM = { zona, hemisferio: hem, easting: east, northing: north };
        p2Geo = utmParaGeo(zona, hem, east, north);
    }

    const distancia = haversine(p1Geo.lat, p1Geo.lon, p2Geo.lat, p2Geo.lon);

    document.getElementById("resultado").innerText =
        `📍 Coordenada 1 (Geográfica):\n` +
        `Latitude: ${p1Geo.lat.toFixed(5)}\n` +
        `Longitude: ${p1Geo.lon.toFixed(5)}\n` +
        `📍 Coordenada 1 (UTM):\n` +
        `Zona: ${p1UTM.zona}${p1UTM.hemisferio}\n` +
        `Easting: ${p1UTM.easting.toFixed(2)}\n` +
        `Northing: ${p1UTM.northing.toFixed(2)}\n\n` +
        `📍 Coordenada 2 (Geográfica):\n` +
        `Latitude: ${p2Geo.lat.toFixed(5)}\n` +
        `Longitude: ${p2Geo.lon.toFixed(5)}\n` +
        `📍 Coordenada 2 (UTM):\n` +
        `Zona: ${p2UTM.zona}${p2UTM.hemisferio}\n` +
        `Easting: ${p2UTM.easting.toFixed(2)}\n` +
        `Northing: ${p2UTM.northing.toFixed(2)}\n\n` +
        `📏 Distância:\n${(distancia / 1000).toFixed(3)} km (${distancia.toFixed(2)} m)`;

    const resultadoDiv = document.getElementById("resultado");
    if (resultadoDiv.innerText.trim() !== "") {
        resultadoDiv.classList.add("result");
        resultadoDiv.style.background = "#fff";
        resultadoDiv.style.display = "block";
    } else {
        resultadoDiv.classList.remove("result");
        resultadoDiv.style.background = "";
        resultadoDiv.style.display = "none";
    }

    if (marker1) map.removeLayer(marker1);
    if (marker2) map.removeLayer(marker2);
    if (line) map.removeLayer(line);

    marker1 = L.marker([p1Geo.lat, p1Geo.lon]).addTo(map).bindPopup("Coordenada 1").openPopup();
    marker2 = L.marker([p2Geo.lat, p2Geo.lon]).addTo(map).bindPopup("Coordenada 2").openPopup();
    line = L.polyline([[p1Geo.lat, p1Geo.lon], [p2Geo.lat, p2Geo.lon]], { color: 'blue' }).addTo(map);

    map.fitBounds(line.getBounds(), { padding: [50, 50] });
}








//funçao para buscar contatos no arquivo listaRTs.txt

let contatos = [];

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

// Carrega o arquivo automaticamente
fetch('listaRTs.txt')
    .then(response => response.text())
    .then(text => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);

        contatos = lines.map(line => {
            // Divide por espaços
            const partes = line.split(/\s+/);

            // Regex para identificar email e telefone
            const email = partes.find(p => /\S+@\S+\.\S+/.test(p));
            const telefone = partes.find(p => /\(\d{2}\)\d{4,5}-\d{4}/.test(p));

            // Remove email e telefone do array para sobrar só o nome
            const nome = partes.filter(p => p !== email && p !== telefone).join(' ');

            return { nome, email, telefone };
        });

        searchInput.disabled = false;
        searchBtn.disabled = false;
        resultsDiv.innerHTML = '<div>✅ Arquivo carregado. Agora pesquise pelo nome.</div>';
    })
    .catch(() => {
        resultsDiv.innerHTML = '<div>❌ Erro ao carregar o arquivo de contatos.</div>';
    });

searchBtn.addEventListener('click', function () {
    const query = searchInput.value.toLowerCase();
    resultsDiv.innerHTML = '';
    if (query.length === 0) return;

    const filtered = contatos.filter(c =>
        (c.nome && c.nome.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.telefone && c.telefone.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div>Nenhum contato encontrado.</div>';
        return;
    }

    filtered.forEach(c => {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `
                    <div style="text-align: left;"><strong>Nome:</strong> ${c.nome || '—'}</div>
                    <div style="text-align: left;"><strong>Email:</strong> ${c.email || '—'}</div>
                    <div style="text-align: left;"><strong>Telefone:</strong> ${c.telefone || '—'}</div>
                `; resultsDiv.appendChild(item);
    });

    if (filtered.length > 0) {
        // Armazena o primeiro contato encontrado no localStorage
        var contato = filtered[0];
        localStorage.setItem('contato_nome', contato.nome || '');
        localStorage.setItem('contato_email', contato.email || '');
        localStorage.setItem('contato_telefone', contato.telefone || '');
    }




});



//-------CODIGO DA BUSCA EQUIPAMENTOS DE ATERRAMENTOS INICIO---------------------

const tabelas = {
    reator: {
        "13.8": [
            { max: 500, x: 50.8, i1: 6.3, i2: 126 },
            { max: 1000, x: 25.4, i1: 12.6, i2: 251 },
            { max: 2000, x: 12.7, i1: 25.1, i2: 502 },
            { max: 3000, x: 8.5, i1: 37.7, i2: 753 },
            { max: 4000, x: 7.1, i1: 50.2, i2: 1004 },
            { max: 5000, x: 5.7, i1: 62.8, i2: 1255 }
        ],
        "22": [
            { max: 500, x: 129.1, i1: 3.9, i2: 79 },
            { max: 1000, x: 64.5, i1: 7.9, i2: 157 },
            { max: 2000, x: 33.3, i1: 15.7, i2: 315 },
            { max: 3000, x: 21.5, i1: 23.6, i2: 472 },
            { max: 4000, x: 18.2, i1: 31.5, i2: 630 },
            { max: 5000, x: 14.5, i1: 39.4, i2: 787 }
        ],
        "34.5": [
            { max: 500, x: 317.4, i1: 2.5, i2: 50 },
            { max: 1000, x: 158.7, i1: 5.0, i2: 100 },
            { max: 2000, x: 79.4, i1: 10.0, i2: 201 },
            { max: 3000, x: 52.9, i1: 15.1, i2: 301 },
            { max: 4000, x: 44.6, i1: 20.1, i2: 402 },
            { max: 5000, x: 35.7, i1: 25.1, i2: 502 }
        ]
    },
    zigzag: {
        "13.8": [
            { max: 500, x: 171.4, ifase1: 2.1, ineutro1: 6.3, ifase2: 42, ineutro2: 126 },
            { max: 1000, x: 85.7, ifase1: 4.2, ineutro1: 12.6, ifase2: 84, ineutro2: 251 },
            { max: 2000, x: 42.8, ifase1: 8.4, ineutro1: 25.1, ifase2: 167, ineutro2: 502 },
            { max: 3000, x: 28.6, ifase1: 12.6, ineutro1: 37.7, ifase2: 251, ineutro2: 753 },
            { max: 4000, x: 23.8, ifase1: 16.7, ineutro1: 50.2, ifase2: 335, ineutro2: 1004 },
            { max: 5000, x: 19.0, ifase1: 20.9, ineutro1: 62.8, ifase2: 418, ineutro2: 1255 }
        ],
        "22": [
            { max: 500, x: 435.6, ifase1: 1.3, ineutro1: 3.9, ifase2: 26, ineutro2: 79 },
            { max: 1000, x: 217.8, ifase1: 2.6, ineutro1: 7.9, ifase2: 52, ineutro2: 157 },
            { max: 2000, x: 108.9, ifase1: 5.2, ineutro1: 15.7, ifase2: 105, ineutro2: 315 },
            { max: 3000, x: 72.6, ifase1: 7.9, ineutro1: 23.6, ifase2: 157, ineutro2: 472 },
            { max: 4000, x: 60.5, ifase1: 10.5, ineutro1: 31.5, ifase2: 210, ineutro2: 630 },
            { max: 5000, x: 48.4, ifase1: 13.1, ineutro1: 39.4, ifase2: 262, ineutro2: 787 }
        ],
        "34.5": [
            { max: 500, x: 1071.2, ifase1: 0.8, ineutro1: 2.5, ifase2: 17, ineutro2: 50 },
            { max: 1000, x: 535.6, ifase1: 1.7, ineutro1: 5.0, ifase2: 33, ineutro2: 100 },
            { max: 2000, x: 267.8, ifase1: 3.3, ineutro1: 10.0, ifase2: 67, ineutro2: 201 },
            { max: 3000, x: 178.5, ifase1: 5.0, ineutro1: 15.1, ifase2: 100, ineutro2: 301 },
            { max: 4000, x: 148.8, ifase1: 6.7, ineutro1: 20.1, ifase2: 134, ineutro2: 402 },
            { max: 5000, x: 119.0, ifase1: 8.4, ineutro1: 25.1, ifase2: 167, ineutro2: 502 }
        ]
    },
    estrela: {
        "13.8": [
            { max: 500, ptrafo: 50, x: "4.5%", ifase1: 2.1, ineutro1: 6.3, ifase2: 52, ineutro2: 157 },
            { max: 1000, ptrafo: 100, x: "4.5%", ifase1: 4.2, ineutro1: 12.6, ifase2: 105, ineutro2: 314 },
            { max: 2000, ptrafo: 200, x: "4.5%", ifase1: 8.4, ineutro1: 25.1, ifase2: 209, ineutro2: 628 },
            { max: 3000, ptrafo: 300, x: "4.5%", ifase1: 12.6, ineutro1: 37.7, ifase2: 314, ineutro2: 941 },
            { max: 4000, ptrafo: 400, x: "5.0%", ifase1: 16.7, ineutro1: 50.2, ifase2: 418, ineutro2: 1255 },
            { max: 5000, ptrafo: 500, x: "5.0%", ifase1: 20.9, ineutro1: 62.8, ifase2: 523, ineutro2: 1569 }
        ],
        "22": [
            { max: 500, ptrafo: 50, x: "4.5%", ifase1: 1.3, ineutro1: 3.9, ifase2: 33, ineutro2: 98 },
            { max: 1000, ptrafo: 100, x: "4.5%", ifase1: 2.6, ineutro1: 7.9, ifase2: 66, ineutro2: 197 },
            { max: 2000, ptrafo: 200, x: "4.5%", ifase1: 5.2, ineutro1: 15.7, ifase2: 131, ineutro2: 394 },
            { max: 3000, ptrafo: 300, x: "4.5%", ifase1: 7.9, ineutro1: 23.6, ifase2: 197, ineutro2: 590 },
            { max: 4000, ptrafo: 400, x: "5.0%", ifase1: 10.5, ineutro1: 31.5, ifase2: 262, ineutro2: 787 },
            { max: 5000, ptrafo: 500, x: "5.0%", ifase1: 13.1, ineutro1: 39.4, ifase2: 328, ineutro2: 984 }

        ],
        "34.5": [
            { max: 500, ptrafo: 50, x: "4.5%", ifase1: 0.8, ineutro1: 2.5, ifase2: 21, ineutro2: 63 },
            { max: 1000, ptrafo: 100, x: "4.5%", ifase1: 1.7, ineutro1: 5.0, ifase2: 42, ineutro2: 126 },
            { max: 2000, ptrafo: 200, x: "4.5%", ifase1: 3.3, ineutro1: 10.0, ifase2: 84, ineutro2: 251 },
            { max: 3000, ptrafo: 300, x: "4.5%", ifase1: 5.0, ineutro1: 15.1, ifase2: 126, ineutro2: 377 },
            { max: 4000, ptrafo: 400, x: "5.0%", ifase1: 6.7, ineutro1: 20.1, ifase2: 167, ineutro2: 502 },
            { max: 5000, ptrafo: 500, x: "5.0%", ifase1: 8.4, ineutro1: 25.1, ifase2: 209, ineutro2: 628 }
        ]
    }
};

function calcular() {
    console.log("Cálculo iniciado");
    const tipo = document.getElementById("tipo").value;
    const tensao = document.getElementById("tensao").value;
    const potencia = parseFloat(document.getElementById("potencia").value);
    const resultado = document.getElementById("resultado2");

    if (isNaN(potencia)) {
        resultado.innerHTML = "<strong>Informe uma potência válida.</strong>";
        return;
    }

    const dados = tabelas[tipo][tensao];
    console.log("Dados da tabela:", dados);
    for (let d of dados) {
        if (potencia <= d.max) {
            if (tipo === "reator") {
                resultado.innerHTML = `
                    <strong>Reator de aterramento (${tensao} kV):</strong><br><br>
                    Xreator: ${d.x} Ω<br>
                    Ineutro (regime permanente): ${d.i1} A<br>
                    Ineutro (curta duração 10s): ${d.i2} A
                `;
                resultado.innerHTML += `<br><img src="Equipamentos_de_aterramento/Reator_de_aterramento.png" alt="Reator de aterramento" style="width:300px;height:400px;display:block;margin-top:10px;text-align:center;">`;
                resultado.innerHTML += `<br><img src="Equipamentos_de_aterramento/Reator_de_aterramento_2.png" alt="Reator de aterramento" style="width:300px;height:400px;display:block;margin-top:10px;text-align:center;">`;
            } else if (tipo === "zigzag") {
                resultado.innerHTML = `
              <strong>Transformador zig-zag (${tensao} kV):</strong><br><br>
              Xtrafo: ${d.x} Ω<br>
              Ifase (regime permanente): ${d.ifase1} A<br>
              Ineutro (regime permanente): ${d.ineutro1} A<br>
              Ifase (curta duração 10s): ${d.ifase2} A<br>
              Ineutro (curta duração 10s): ${d.ineutro2} A
            `;
                resultado.innerHTML += `<br><img src="Equipamentos_de_aterramento/Transformador_zigzag_de_aterramento.png" alt="Transformador zig-zag" style="width:300px;height:400px;display:block;margin-top:10px;text-align:center;">`;
            } else if (tipo === "estrela") {
                resultado.innerHTML = `
              <strong>Transformador estrela-aterrado (${tensao} kV):</strong><br><br>
              Potência do trafo de aterramento: ${d.ptrafo} kVA<br>
              Xtrafo: ${d.x}<br>
              Ifase (regime permanente): ${d.ifase1} A<br>
              Ineutro (regime permanente): ${d.ineutro1} A<br>
              Ifase (curta duração 2s): ${d.ifase2} A<br>
              Ineutro (curta duração 2s): ${d.ineutro2} A
            `;
                resultado.innerHTML += `<br><img src="Equipamentos_de_aterramento/Transformador_neutro_aterrado.png" alt="Transformador estrela-aterrado" style="width:300px;height:400px;display:block;margin-top:10px;text-align:center;">`;
            }
            //console.log(resultado.innerHTML);
            return;

        }
    }

    resultado.innerHTML = "<strong>Faixa de potência não encontrada na tabela.</strong>";
}

//-------FIM DA BUSCA EQUIPAMENTOS DE ATERRAMENTOS FIM---------------------


//INICIO LOGICA PARA AUTOMAÇÃO DE EXIBIÇÃO DA FERRAMENTA DE PROTEÇÕES

const paralelismoRadios = document.querySelectorAll('input[name="paralelismo"]');
const camposExtras = document.getElementById("camposExtras");

paralelismoRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        if ((radio.value === "momentaneo" || radio.value === "emergencial" || radio.value === "nenhum") && radio.checked) {
            camposExtras.classList.add("ocultar");
        } else {
            camposExtras.classList.remove("ocultar");
        }
    });
});

document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();
    const subestacao = document.querySelector('input[name="subestacao"]:checked')?.value;
    const paralelismo = document.querySelector('input[name="paralelismo"]:checked')?.value;
    const injecao = document.querySelector('input[name="injecao"]:checked')?.value;
    const inversor = document.querySelector('input[name="inversor"]:checked')?.value;
    const faixa_gd = document.querySelector('input[name="faixa_gd"]:checked')?.value;
    const parecer = document.querySelector('input[name="parecer"]:checked')?.value;

    const resultadoDiv = document.getElementById("resultado-protecoesdegeracao");
    resultadoDiv.innerHTML = "";

    //define exibição para proteção de paralelismo momentaneo na BT
    if ((subestacao === "1" || subestacao === "6" || subestacao === "5" || subestacao === "8") && paralelismo === "momentaneo") {
        // Centraliza o resultado
        const circuloDJ = document.createElement("div");
        circuloDJ.className = "circulo";
        circuloDJ.style.fontSize = "16px";
        circuloDJ.style.lineHeight = "80px";
        circuloDJ.style.display = "flex";
        circuloDJ.style.alignItems = "center";
        circuloDJ.style.justifyContent = "center";
        circuloDJ.style.textAlign = "center";
        circuloDJ.style.background = "#ffffff"; // fundo branco
        circuloDJ.style.color = "#000000"; // letra preta
        circuloDJ.style.border = "2px solid #000000"; // borda preta
        circuloDJ.textContent = "DJ BT";
        resultadoDiv.appendChild(circuloDJ);

        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const circulo32 = document.createElement("div");
        circulo32.className = "circulo";
        circulo32.style.fontSize = "16px";
        circulo32.style.lineHeight = "80px";
        circulo32.style.display = "flex";
        circulo32.style.alignItems = "center";
        circulo32.style.justifyContent = "center";
        circulo32.style.textAlign = "center";
        circulo32.style.background = "#ffffff"; // fundo branco
        circulo32.style.color = "#000000"; // letra preta
        circulo32.style.border = "2px solid #000000"; // borda preta
        circulo32.textContent = "32";
        resultadoDiv.appendChild(circulo32);


        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';

            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        if (subestacao === "1" || subestacao === "6") {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_G_MOMENT.png";
            img.alt = "Diagrama SE_N1N6_G_MOMENT";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (subestacao === "5" || subestacao === "8") {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_G_MOMENT.png";
            img.alt = "Diagrama SE_N5N8_G_MOMENT";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }





    }

    //Condição para emergencia e nenhum paralelismo na BT
    if ((subestacao === "1" || subestacao === "6" || subestacao === "5" || subestacao === "8") && (paralelismo === "emergencial" || paralelismo === "nenhum")) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "column";

        const circuloDJ = document.createElement("div");
        circuloDJ.className = "circulo";
        circuloDJ.style.fontSize = "16px";
        circuloDJ.style.lineHeight = "80px";
        circuloDJ.style.display = "flex";
        circuloDJ.style.alignItems = "center";
        circuloDJ.style.justifyContent = "center";
        circuloDJ.style.textAlign = "center";
        circuloDJ.style.background = "#ffffff"; // fundo branco
        circuloDJ.style.color = "#000000"; // letra preta
        circuloDJ.style.border = "2px solid #000000"; // borda preta
        circuloDJ.textContent = "DJ BT";
        resultadoDiv.appendChild(circuloDJ);

        if (paralelismo === "nenhum" && (subestacao === "1" || subestacao === "6")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_SEM_GERADOR.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N1N6_SEM_GERADOR";//
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (paralelismo === "emergencial" && (subestacao === "1" || subestacao === "6")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_G_EMERG.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N1N6_G_EMERG";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (paralelismo === "nenhum" && (subestacao === "5" || subestacao === "8")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_SEM_GERADOR.png";
            img.alt = "Diagrama SE_N5N8_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (paralelismo === "emergencial" && (subestacao === "5" || subestacao === "8")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_G_EMERG.png";
            img.alt = "Diagrama SE_N5N8_G_EMERG";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

    }

    //Condição para permantente ,com ou sem injeção,com inversor, ate 75 kw , apos ou antes 15/01/2024,se subestação 1,6,5,8
    if (
        (subestacao === "1" || subestacao === "6" || subestacao === "5" || subestacao === "8") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "ate_75" &&
        (parecer === "apos" || parecer === "antes")
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ BT"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        if (paralelismo === "permanente" && (subestacao === "1" || subestacao === "6")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_SEM_GERADOR.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N1N6_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (paralelismo === "permanente" && (subestacao === "5" || subestacao === "8")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_SEM_GERADOR.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N5N8_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }


    }

    //Condição para permantente
    //com ou sem injeção,
    // com inversor, 
    // de 75 kw ate 300 kw , 
    // apos 15/01/2024, 
    // subestação 1,6,5,8
    if (
        (subestacao === "1" || subestacao === "6" || subestacao === "5" || subestacao === "8") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "75_300" &&
        parecer === "apos"
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ BT", "32⬆️⬇️", "67⬆️", "51v", "27", "59", "81U", "81O", "46"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        if ((parecer === "apos" && (subestacao === "1" || subestacao === "6"))) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_G_PERM_COM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N1N6_G_PERM_COM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }


        if ((parecer === "apos" && (subestacao === "5" || subestacao === "8"))) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_G_PERM_COM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N5N8_G_PERM_COM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }


    }

    //Condição para permantente
    //com ou sem injeção,
    // com inversor, 
    // de 75 kw ate 300 kw , 
    // antes 15/01/2024, 
    // subestação 1,6,5,8
    if (
        (subestacao === "1" || subestacao === "6" || subestacao === "5" || subestacao === "8") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "75_300" &&
        parecer === "antes"
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ BT"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }


        if ((parecer === "antes" && (subestacao === "1" || subestacao === "6"))) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_SEM_GERADOR.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N1N6_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }


        if ((parecer === "antes" && (subestacao === "5" || subestacao === "8"))) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_SEM_GERADOR.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N5N8_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }
    }

    //Condição para permantente 
    //com ou sem injeção
    //sem inversor
    //ate 75
    //antes ou apos 15/01/2024 
    //subestação 1,6,5,8

    if (
        (subestacao === "1" || subestacao === "6" || subestacao === "5" || subestacao === "8") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "sem" &&
        (faixa_gd === "ate_75" || faixa_gd === "75_300") &&
        (parecer === "apos" || parecer === "antes")
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ BT", "32⬆️⬇️", "67⬆️", "51v", "27", "59", "81U", "81O", "46", "47", "25"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });


        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        if (paralelismo === "permanente" && (subestacao === "1" || subestacao === "6")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N1N6_G_PERM_SEM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N1N6_G_PERM_SEM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (paralelismo === "permanente" && (subestacao === "5" || subestacao === "8")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N5N8_G_PERM_SEM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N5N8_G_PERM_SEM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }







    }

    //define exibição para proteção de paralelismo momentaneo na MT
    if ((subestacao === "2" || subestacao === "4") && paralelismo === "momentaneo") {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "32", "50", "51", "50-N", "51-N"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });


        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));
            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';
            resultadoDiv.appendChild(funcoesContainer);
        }
        if (subestacao === "2" || subestacao === "4") {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_G_MOMENT.png";
            img.alt = "Diagrama SE_N2N4_G_MOMENT";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);

        }





    }

    //Condição para emergencia e nenhum paralelismo na MT
    if ((subestacao === "2" || subestacao === "4") && (paralelismo === "emergencial" || paralelismo === "nenhum")) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "50", "51", "50-N", "51-N"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });
        // agrupa os círculos já adicionados em um container para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';

            circulos.forEach(c => funcoesContainer.appendChild(c));

            // ajusta resultadoDiv para empilhar verticalmente (funções em cima, imagem em baixo)
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        if (paralelismo === "nenhum" && (subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_SEM_GERADOR.png";
            img.alt = "Diagrama SE_N2N4_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

        if (paralelismo === "emergencial" && (subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_G_EMERG.png";
            img.alt = "Diagrama SE_N2N4_G_EMERG";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

    }

    //Condição para permantente ,com ou sem injeção,com inversor, ate 75 kw , antes ou apos 15/01/2024,se subestação 2,4
    if (
        (subestacao === "2" || subestacao === "4") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "ate_75" &&
        (parecer === "apos" || parecer === "antes")
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "50", "51", "50-N", "51-N"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        // Exibe diagrama "SE_N2N4_SEM_GERADOR"
        if (subestacao === "2" || subestacao === "4") {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_SEM_GERADOR.png";
            img.alt = "Diagrama SE_N2N4_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }








    }


    //Condição para permantente ,com ou sem injeção,com inversor, de 75 ate 300 kw , apos 15/01/2024,se subestação 2,4
    if (
        (subestacao === "2" || subestacao === "4") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "75_300" &&
        parecer === "apos"
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "32⬆️⬇️", "67⬆️⬇️", "67-N⬆️⬇️", "51v", "27", "59", "81U", "81O", "46"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        // Exibe diagrama "SE_N5N8_G_PERM_SEM_INVERS"
        if (parecer === "apos" && (subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_G_PERM_COM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N2N4_G_PERM_COM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }



    }

    //Condição para permantente ,com ou sem injeção,com inversor, de 75 ate 300 kw , antes 15/01/2024,se subestação 2,4
    if (
        (subestacao === "2" || subestacao === "4") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "75_300" &&
        parecer === "antes"
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "50", "51", "50-N", "51-N"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });


        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        // Exibe diagrama "SE_N2N4_G_PERM_SEM_INVERS"
        if (parecer === "antes" && (subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_SEM_GERADOR.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N2N4_SEM_GERADOR";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }









    }

    //Condição para permantente ,com ou sem injeção,com inversor, de 300 ate 2500 kw , antes ou apos 15/01/2024,se subestação 2,4
    if (
        (subestacao === "2" || subestacao === "4") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "com" &&
        faixa_gd === "300_2500" &&
        (parecer === "apos" || parecer === "antes")
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "32⬆️⬇️", "67⬆️⬇️", "67-N⬆️⬇️", "51v", "27", "59", "81U", "81O", "46", "Reator"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });



        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        // Exibe diagrama "SE_N2N4_G_PERM_SEM_INVERS"
        if ((subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_G_PERM_COM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N2N4_G_PERM_COM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

    }


    //Condição para permantente ,
    // com ou sem injeção,
    // sem inversor, 
    // ate 75 ou de 75 a 300, 
    // antes ou apos 15/01/2024,
    // se subestação 2,4
    if (
        (subestacao === "2" || subestacao === "4") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "sem" &&
        (faixa_gd === "ate_75" || faixa_gd === "75_300") &&
        (parecer === "apos" || parecer === "antes")
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "32⬆️⬇️", "67⬆️⬇️", "67-N⬆️⬇️", "51v", "27", "59", "81U", "81O", "46", "47", "25"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }

        // Exibe diagrama "SE_N2N4_G_PERM_SEM_INVERS"
        if ((subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_G_PERM_SEM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N2N4_G_PERM_SEM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }







    }


    //Condição para permantente ,
    // com ou sem injeção,
    // sem inversor, 
    // de 300 a 2500, 
    // apos 15/01/2024,
    // se subestação 2,4
    if (
        (subestacao === "2" || subestacao === "4") &&
        paralelismo === "permanente" &&
        (injecao === "com" || injecao === "sem") &&
        inversor === "sem" &&
        (faixa_gd === "300_2500") &&
        (parecer === "apos" || parecer === "antes")
    ) {
        // Centraliza o resultado
        resultadoDiv.style.display = "flex";
        resultadoDiv.style.justifyContent = "center";
        resultadoDiv.style.alignItems = "center";
        resultadoDiv.style.flexDirection = "row";
        resultadoDiv.style.gap = "10px";

        const funcoes = ["DJ MT", "32⬆️⬇️", "67⬆️⬇️", "67-N⬆️⬇️", "51v", "27", "59", "81U", "81O", "46", "47", "25", "Reator"];
        funcoes.forEach(funcao => {
            const circulo = document.createElement("div");
            circulo.className = "circulo";
            circulo.style.fontSize = "16px";
            circulo.style.lineHeight = "80px";
            circulo.style.display = "inline-block";
            circulo.style.textAlign = "center";
            circulo.style.background = "#ffffff"; // fundo branco
            circulo.style.color = "#000000"; // letra preta
            circulo.style.border = "2px solid #000000"; // borda preta
            circulo.textContent = funcao;
            resultadoDiv.appendChild(circulo);
        });

        // Agrupa os círculos já adicionados para que a imagem fique abaixo
        const circulos = Array.from(resultadoDiv.querySelectorAll('.circulo'));
        if (circulos.length > 0) {
            const funcoesContainer = document.createElement('div');
            funcoesContainer.style.display = 'flex';
            funcoesContainer.style.justifyContent = 'center';
            funcoesContainer.style.alignItems = 'center';
            funcoesContainer.style.flexDirection = 'row';
            funcoesContainer.style.gap = '10px';
            circulos.forEach(c => funcoesContainer.appendChild(c));

            // limpa resultadoDiv e organiza para empilhar (funções em cima, imagem em baixo)
            resultadoDiv.innerHTML = '';
            resultadoDiv.style.display = 'flex';
            resultadoDiv.style.flexDirection = 'column';
            resultadoDiv.style.justifyContent = 'center';
            resultadoDiv.style.alignItems = 'center';
            resultadoDiv.style.gap = '10px';

            resultadoDiv.appendChild(funcoesContainer);
        }


        // Exibe diagrama "SE_N2N4_G_PERM_SEM_INVERS"
        if ((subestacao === "2" || subestacao === "4")) {
            const img = document.createElement("img");
            img.src = "Diagramas_unifilares/SE_N2N4_G_PERM_SEM_INVERS.png"; // ajuste o caminho se necessário
            img.alt = "Diagrama SE_N2N4_G_PERM_SEM_INVERS";
            img.style.borderRadius = "12px";
            img.style.border = "2px solid #000";
            img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            img.style.maxWidth = "800px";
            img.style.width = "100%";
            img.style.display = "block";
            img.style.marginTop = "10px";
            resultadoDiv.appendChild(img);
        }

    }
















});


// Esconde/mostra a opção "300_2500" de faixa_gd conforme subestação selecionada
function atualizarFaixaGD() {
    const faixaGD300_2500 = document.querySelector('input[name="faixa_gd"][value="300_2500"]');
    if (faixaGD300_2500) {
        // Garante que o elemento label é o pai correto
        const label = faixaGD300_2500.closest('label');
        if (label) {
            if (
                document.querySelector('input[name="subestacao"]:checked')?.value === "1" ||
                document.querySelector('input[name="subestacao"]:checked')?.value === "5" ||
                document.querySelector('input[name="subestacao"]:checked')?.value === "6" ||
                document.querySelector('input[name="subestacao"]:checked')?.value === "8"
            ) {
                label.style.display = "none";
            } else {
                label.style.display = "";
            }
        }
    }
}

// Executa ao carregar e ao mudar subestação
atualizarFaixaGD();
document.querySelectorAll('input[name="subestacao"]').forEach(radio => {
    radio.addEventListener("change", atualizarFaixaGD);
});
//FIM LOGICA PARA AUTOMAÇÃO DE EXIBIÇÃO DA FERRAMENTA DE PROTEÇÕES




//INICIO LOGICA PARA ITENS DE REPROVAÇÃO 



const supabaseUrl = 'https://nelzhukmxrgdoarsxcek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lbHpodWtteHJnZG9hcnN4Y2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDIxNzUsImV4cCI6MjA3MTU3ODE3NX0.KHvfJHVimKwiraEzbyZWyLnTO5P5VEvM86GlyE7y09k';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

let reprovadorEdicaoId = null;

async function reprovadorCadastrar() {
    const topico = document.getElementById('reprovador-topico').value;
    const descricao = document.getElementById('reprovador-descricao').value;

    const { error } = await supabaseClient
        .from('reprovacoes')
        .insert([{ topico, descricao }]);

    alert(error ? 'Erro ao cadastrar' : 'Cadastro realizado com sucesso');
}

async function reprovadorPesquisar() {
    const termo = document.getElementById('reprovador-pesquisa').value;

    const { data, error } = await supabaseClient
        .from('reprovacoes')
        .select('*')
        .or(`topico.ilike.%${termo}%,descricao.ilike.%${termo}%`);

    const resultados = document.getElementById('reprovador-resultados');
    resultados.innerHTML = '';

    if (error) {
        resultados.innerHTML = '<p>Erro na pesquisa.</p>';
        return;
    }

    if (data.length > 0) {
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'reprovador-item';
            itemDiv.innerHTML = `
        <div class="reprovador-item-texto">
          <div class="reprovador-item-topico">${item.topico}</div>
          <div>${item.descricao}</div>
        </div>
        <div class="reprovador-item-buttons">
          <button class="reprovador-btn" onclick="reprovadorEditar('${item.id}', \`${item.descricao.replace(/`/g, '\\`')}\`)">Editar</button>
          <button class="reprovador-btn reprovador-btn-excluir" onclick="reprovadorExcluir('${item.id}')">Excluir</button>
        </div>
      `;
            resultados.appendChild(itemDiv);
        });
    } else {
        resultados.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    }
}

function reprovadorEditar(id, textoAtual) {
    reprovadorEdicaoId = id;
    document.getElementById('reprovador-modal-texto').value = textoAtual;

    document.getElementById('reprovador-modal').style.display = 'flex';
}

function reprovadorFecharModal() {
    document.getElementById('reprovador-modal').style.display = 'none';
    reprovadorEdicaoId = null;
}

async function reprovadorSalvarEdicao() {
    const novaDescricao = document.getElementById('reprovador-modal-texto').value.trim();
    if (!novaDescricao) {
        alert('O texto não pode estar vazio.');
        return;
    }

    const { error } = await supabaseClient
        .from('reprovacoes')
        .update({ descricao: novaDescricao })
        .eq('id', reprovadorEdicaoId);

    alert(error ? 'Erro ao editar' : 'Texto editado com sucesso');
    reprovadorFecharModal();
    reprovadorPesquisar();
}

async function reprovadorExcluir(id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    const { error } = await supabaseClient
        .from('reprovacoes')
        .delete()
        .eq('id', id);

    alert(error ? 'Erro ao excluir' : 'Texto excluído com sucesso');
    reprovadorPesquisar();
}

//FIM LOGICA PARA ITENS DE REPROVAÇÃO

window.addEventListener('DOMContentLoaded', () => {
//codigo para exibir/ocultar painel de cadastro
document.getElementById('toggle-cadastro-btn').addEventListener('click', () => {
    const panel = document.getElementById('cadastro-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') {
        // foca o campo de descrição quando abrir
        document.getElementById('reprovador-descricao').focus();
    }
});
document.getElementById('fechar-cadastro-btn').addEventListener('click', () => {
    document.getElementById('cadastro-panel').style.display = 'none';
});
// Fim do codigo para exibir/ocultar painel de cadastro
});


// Permitir pesquisa ao pressionar Enter quando tiver selecionado o campo de pesquisa
const pesquisaEl = document.getElementById('reprovador-pesquisa');
if (pesquisaEl) {
    pesquisaEl.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            reprovadorPesquisar();
        }
    });
}

// Permitir submissão ao pressionar Enter em diferentes formulários
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && valor === "conversorCoordenadas") {
        converterEPlotar();
    }
});


document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && valor === "equipamentosaterramento") {
        calcular();
    }
});

