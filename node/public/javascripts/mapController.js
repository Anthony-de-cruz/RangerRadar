let markers = {};
let idNum = 0;
//mock JavaScript enum
const Types = Object.freeze({
    ERW: 0,
    POACHING: 1,
    MINING: 2,
    LOGGING: 3,
});

const mapMode = Object.freeze({
    REPORT: 0,
    POI: 1,
});

const villageCentreCoords = [12.577758601317383, 106.93490646676959];

// Sets up the main map.
let map = L.map('map', {
    center: villageCentreCoords,
    maxZoom: 20,
    zoom: 13,
    minZoom: 10,
});
L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 10,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

let southWest = L.latLng(12.07, 106),
    northEast = L.latLng(13.7, 108),
    bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);

// Places a popup on the village centre
function showVillage() {
    let popup = L.popup();
    popup
        .setLatLng(villageCentreCoords)
        .setContent(
            `
                <div style="text-align: center;">
                    <i class="fa-solid fa-vihara" style="font-size: 24px;"></i><br>
                    Pu Nagol Community Meeting Hall
                </div>
            `,
        )
        .openOn(map);

    map.setView(villageCentreCoords, map.getZoom());
}

const showVillageButton = document.getElementById("showVillageButton");
showVillageButton.addEventListener("click", showVillage);

// Initialize mode
let mode = mapMode.REPORT;

function onMapClick(e) {
    const latlng = e.latlng;
    if (!latlng.lat || !latlng.lng || latlng.lat >= 13.7 || latlng.lat < 12.07 || latlng.lng >= 108 || latlng.lng < 106) {
        const popup = L.popup();
        popup
            .setLatLng(villageCentreCoords)
            .setContent(`Please choose valid coordinates`)
            .openOn(map);
    } else {
        let popup = L.popup();
        if (mode === mapMode.REPORT) {
            popup
                .setLatLng(latlng)
                .setContent(
                    `
                        <form action='/map-form' method='POST'>
                            <input type='hidden' name='lat' value='${latlng.lat}' readonly>
                            <input type='hidden' name='long' value='${latlng.lng}' readonly>
                            <input type='radio' id='ERW' name='popupType' value='erw' checked></input> 
                            <label for='ERW'><i class="fa-solid fa-bomb fa-fw fa-5x"></i></label>
                            <br>
                            <input type='radio' id='poaching' name='popupType' value='poaching'></input>
                            <label for='poaching'><i class="fa-solid fa-crosshairs fa-fw fa-5x"></i></label>
                            <br> 
                            <input type='radio' id='mining' name='popupType' value='mining'></input> 
                            <label for='mining'><i class="fa-solid fa-helmet-safety fa-fw fa-5x"></i></label>
                            <br>
                            <input type='radio' id='logging' name='popupType' value='logging'></input>
                            <label for='logging'><i class="fa-solid fa-tree fa-fw fa-5x"></i></label>
                            <br>
                            <br>
                            <select name='severity' id='severityMenu'>
                                <option value='*'>*</option>
                                <option value='**'>**</option>
                                <option value='***'>***</option>                               
                            </select>
                            <br>
                            <br>
                            <button id='mapFormSubmitButton' type='submit'><i class="fa-solid fa-check"></i> Create </button>
                        </form> 
                    `,
                )
                .openOn(map);
        } else{
            popup
                .setLatLng(latlng)
                .setContent(
                    `
                        <form action='/poi-form' method='POST'>
                            <input type='hidden' name='lat' value='${latlng.lat}' readonly>
                            <input type='hidden' name='long' value='${latlng.lng}' readonly>
                            <label for='poiType'>Name:</label>
                            <input type='text' id='poiName' name='poiName' required></input>
                            <br>
                            <button id='poiFormSubmitButton' type='submit'><i class="fa-solid fa-check"></i> Create </button>
                        </form> 
                    `,
                )
                .openOn(map);
        }
    }
}
map.on('click', onMapClick);

// Function to format the date and time
function formatDateTime(isoString) {
    let date = new Date(isoString);
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    let hours = ('0' + date.getHours()).slice(-2);
    let minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Adds reports to the map.
function addReportsToMap() {
    for (let i = 0; i < reportsData.length; i++) {
        let type;
        if (reportsData[i].report_type === "erw") {
            type = Types.ERW;
        } else if (reportsData[i].report_type === "poaching") {
            type = Types.POACHING;
        } else if (reportsData[i].report_type === "mining") {
            type = Types.MINING;
        } else {
            type = Types.LOGGING;
        }
        let typeIcon;
        switch (type) {
            case Types.ERW:
                typeIcon = `<i class="fa-solid fa-bomb fa-fw fa-5x"></i>`;
                break;
            case Types.POACHING:
                typeIcon = `<i class="fa-solid fa-crosshairs fa-fw fa-5x"></i>`;
                break;
            case Types.MINING:
                typeIcon = `<i class="fa-solid fa-helmet-safety fa-fw fa-5x"></i>`;
                break;
            default:
                typeIcon = `<i class="fa-solid fa-tree fa-fw fa-5x"></i>`;
        }
        let marker = L.marker([
            reportsData[i].latitude,
            reportsData[i].longitude,
        ]);
        // If they are logged in, give them the resolve button
        let severity;
        if (reportsData[i].severity === "low"){
            severity = "*"
        }
        else if (reportsData[i].severity === "moderate"){
            severity = "**";
        }
        else{
            severity = "***";
        }
        if (isLoggedIn) {
            marker
                .addTo(map)
                .bindPopup(
                    `
                        <form action='/resolve-form' method='POST' class='popup-content'>
                            <p>Lat: ${reportsData[i].latitude.toFixed(5)}</p>
                            <p>Long: ${reportsData[i].longitude.toFixed(5)}</p>
                            <p>${typeIcon}</p>
                            <p style='font-size:20px'>${severity}</p>
                            <p>${formatDateTime(reportsData[i].time_of_report)}</p>
                            <input type='hidden' name='id' value='${reportsData[i].id}' readonly>
                            <button type='submit'><i class='fa-solid fa-check'></i> Resolve </button>
                        </form>
                    `,
                )
                .openPopup();
        }
        else {
            marker
            .addTo(map)
            .bindPopup(
                `
                    <form action='/resolve-form' method='POST' class='popup-content'>
                        <p>Lat: ${reportsData[i].latitude.toFixed(5)}</p>
                        <p>Long: ${reportsData[i].longitude.toFixed(5)}</p>
                        <p>${typeIcon}</p>
                        <p style='font-size:20px'>${severity}</p>
                        <p>${formatDateTime(reportsData[i].time_of_report)}</p>
                        <input type='hidden' name='id' value='${reportsData[i].id}' readonly>
                    </form>
                `,
            )
            .openPopup();
        }
        // Marker needs to be added before colour can be adjusted
        switch (type) {
            case Types.ERW:
                marker._icon.classList.add("red");
                break;
            case Types.MINING:
                marker._icon.classList.add("purple");
                break;
            case Types.LOGGING:
                marker._icon.classList.add("yellow");
                break;
        }
    }
}

function addPoisToMap(){
    for (let i = 0; i < poiData.length; i++) {
        let marker = L.marker([
            poiData[i].latitude,
            poiData[i].longitude,
        ]);
        if (isLoggedIn) {
            marker
                .addTo(map)
                .bindPopup(
                    `
                        <form action='/remove-poi' method='POST' class='popup-content'>
                            <p>${poiData[i].name}</p>
                            <p>Lat: ${poiData[i].latitude.toFixed(5)}</p>
                            <p>Long: ${poiData[i].longitude.toFixed(5)}</p>
                            <input type='hidden' name='poiName' value='${poiData[i].name}' readonly>
                            <button type='submit'><i class='fa-solid fa-check'></i> Remove </button>
                        </form>
                    `,
                )
                .openPopup();
        }
        else {
            marker
                .addTo(map)
                .bindPopup(
                    `
                        <form class='popup-content'>
                            <p>${poiData[i].name}</p>
                            <p>Lat: ${poiData[i].latitude.toFixed(5)}</p>
                            <p>Long: ${poiData[i].longitude.toFixed(5)}</p>
                        </form>
                    `,
                )
                .openPopup();
        }
        marker._icon.classList.add("light-blue");
    }
}

// Function to close all popups
function closeAllPopups() {
map.eachLayer(function (layer) {
    if (layer instanceof L.Popup) {
        map.closePopup(layer);
    }
});
}

document.addEventListener("DOMContentLoaded", () => {
addReportsToMap();
addPoisToMap();
const modeSwitchButton = document.getElementById('modeSwitchButton');
if (modeSwitchButton) {
    modeSwitchButton.addEventListener('click', () => {
        // Close all open popups when switching modes
        closeAllPopups();
        if (mode === mapMode.REPORT){
            mode = mapMode.POI;
            modeSwitchButton.innerHTML = `<i class="fa-solid fa-mountain-sun"></i> Points of Interest`;
        }
        else{
            mode = mapMode.REPORT;
            modeSwitchButton.innerHTML = `<i class="fa-solid fa-location-dot"></i> Report`;
        }
    });
}
});
