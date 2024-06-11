let markers = {};
let idNum = 0;
const Types = Object.freeze({
    ERW: 0,
    POACHING: 1,
    MINING: 2,
    LOGGING: 3
});
const villageCentreCoords = [12.577758601317383, 106.93490646676959];

function showVillage() {
    let popup = L.popup();
    popup
        .setLatLng(villageCentreCoords)
        .setContent(`Village centre`)
        .openOn(map);
}

const showVillageButton = document.getElementById("showVillageButton");
showVillageButton.addEventListener("click", showVillage);

function addMarker(type, lat, lng) {
    let typeIcon;
    if (type === Types.ERW) {
        typeIcon = `<i class="fa-solid fa-bomb fa-fw fa-5x"></i>`;
    }
    else if (type === Types.POACHING) {
        typeIcon = `<i class="fa-solid fa-crosshairs fa-fw fa-5x"></i>`;
    }
    else if (type === Types.MINING) {
        typeIcon = `<i class="fa-solid fa-helmet-safety fa-fw fa-5x"></i>`;
    }
    else {
        typeIcon = `<i class="fa-solid fa-tree fa-fw fa-5x"></i>`;
    }
    let marker = L.marker([lat, lng]);
    marker
        .addTo(map)
        .bindPopup(`
    <p>Lat: ${lat}</p>
    <p>Lng: ${lng}</p>
    <p>${typeIcon}</p>
    <p>Time: ${new Date().toLocaleString()}</p>
    <button id='removeMarkerButton-${idNum}'>Remove</button>
    `)
        .openPopup();
    //marker needs to be added before colour can be adjusted, otherwise this causes an undefined error
    if (type === Types.ERW) {
        marker._icon.classList.add("red");
    }
    else if (type === Types.MINING) {
        marker._icon.classList.add("purple");
    }
    else if (type === Types.LOGGING) {
        marker._icon.classList.add("yellow");
    }
    let markerID = `marker-${idNum}`;
    markers[markerID] = marker;
    let currentIdNum = idNum;
    let removeMarkerButton = document.getElementById(`removeMarkerButton-${currentIdNum}`);
    removeMarkerButton.addEventListener("click", () => {
        console.log(marker);
        map.removeLayer(marker);
    });
    marker.on('click', () => {
        console.log(`Hello there ${markerID}`);
        console.log()
        let removeMarkerButton = document.getElementById(`removeMarkerButton-${currentIdNum}`);
        removeMarkerButton.addEventListener("click", () => {
            console.log(marker);
            map.removeLayer(marker);
        });
    });
    idNum = idNum + 1;
    console.log(idNum);
}

let submitDetailsButton = document.getElementById("submitDetailsButton");
submitDetailsButton.addEventListener("click", () => {
    event.preventDefault();
    const lat = document.getElementById("latBox").value;
    const lng = document.getElementById("lngBox").value;
    if (!lat || !lng || lat >= 13 || lat < 12 || lng >= 108 || lng < 106) {
        const popup = L.popup();
        popup
            .setLatLng(villageCentreCoords)
            .setContent(`Please choose valid coordinates`)
            .openOn(map);
    }
    else {
        let type;
        if (document.getElementById("formERW").checked) {
            type = Types.ERW;
        }
        else if (document.getElementById("formPoaching").checked) {
            type = Types.POACHING;
        }
        else if (document.getElementById("formMining").checked) {
            type = Types.MINING;
        }
        else {
            type = Types.LOGGING;
        }
        addMarker(type, lat, lng);
    }
});

let map = L.map('map').setView(villageCentreCoords, 13);
L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
})
    .addTo(map);

function onMapClick(e) {
    const latlng = e.latlng
    if (!latlng.lat || !latlng.lng || latlng.lat >= 13 || latlng.lat < 12 || latlng.lng >= 108 || latlng.lng < 106) {
        const popup = L.popup();
        popup
            .setLatLng(villageCentreCoords)
            .setContent(`Please choose valid coordinates`)
            .openOn(map);
    }
    else {
        let popup = L.popup();
        popup
            .setLatLng(latlng)
            .setContent(`
    <p>Lat: ${latlng.lat}</p>
    <p>Lng: ${latlng.lng}</p>
    <input type='radio' id='ERW' name='type1'></input> 
    <label for='ERW'><i class="fa-solid fa-bomb fa-fw fa-5x"></i></label>
    <br>
    <input type='radio' id='poaching' name='type1'></input>
    <label for='poaching'><i class="fa-solid fa-crosshairs fa-fw fa-5x"></i></label>
    <br> 
    <input type='radio' id='mining' name='type1'></input> 
    <label for='mining'><i class="fa-solid fa-helmet-safety fa-fw fa-5x"></i></label>
    <br>
    <input type='radio' id='logging' name='type1'></input>
    <label for='logging'><i class="fa-solid fa-tree fa-fw fa-5x"></i></label>
    <br>
    <button id='registerSubmissionButton'><i class="fa-solid fa-check"></i></button> 
    `)
            .openOn(map);


        let registerSubmissionButton = document.getElementById("registerSubmissionButton");
        registerSubmissionButton.addEventListener("click", () => {
            event.preventDefault(); //stops page from reloading when submitting a form
            let type;
            if (document.getElementById("ERW").checked) {
                type = Types.ERW;
            }
            else if (document.getElementById("poaching").checked) {
                type = Types.POACHING;
            }
            else if (document.getElementById("mining").checked) {
                type = Types.MINING;
            }
            else {
                type = Types.LOGGING;
            }
            addMarker(type, latlng.lat, latlng.lng);
        })
    }
}
map.on('click', onMapClick);