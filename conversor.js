


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
          <label>Zona: <input type="number" id="zona${id}" step="1"></label><br>
          <label>Hemisfério (N/S): <input type="text" id="hem${id}" maxlength="1"></label><br>
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

function converterEPlotar() {
    const formato1 = document.getElementById("formato1").value;
    const formato2 = document.getElementById("formato2").value;

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



document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        converterEPlotar();
    }
});