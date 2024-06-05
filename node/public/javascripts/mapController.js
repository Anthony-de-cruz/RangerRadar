let markers = {};
let idNum = 0;
//mock JavaScript enum
const Types = Object.freeze({
    ERW: 0,
    POACHING: 1,
    MINING: 2,
    LOGGING: 3
});
const villageCentreCoords = [12.577758601317383, 106.93490646676959];

//Sets up the main map. 
//13 is the zoom level, and subdomains provide different ways 
//to access the map data should one of them go down
let map = L.map('map').setView(villageCentreCoords, 13);
L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
})
    .addTo(map);

//Places a popup on the village centre so that users
//can easily navigate back to it.
//Shouldn't be much of a problem once proper map
//restrictions are implemented
function showVillage() {
    let popup = L.popup();
    popup
        .setLatLng(villageCentreCoords)
        .setContent(`Village centre`)
        .openOn(map);
}

const showVillageButton = document.getElementById("showVillageButton");
showVillageButton.addEventListener("click", showVillage);

//Adds a marker to the map. 
//Used by both the manual form and the popup form on
//the map.
//May need to expand this later to take in values such as
//severity.
function addMarker(type, lat, lng) {
    let typeIcon;
    switch(type){
        case Types.ERW:
            //Adjustments to the Font Awesome icons can be made here, such as
            //changing the 5x at the end to 2x to shrink it down.
            //Other adjustments can be found on Font Awesome
            typeIcon = `<i class="fa-solid fa-bomb fa-fw fa-5x"></i>`;
            break;
        case Types.POACHING:
            typeIcon = `<i class="fa-solid fa-crosshairs fa-fw fa-5x"></i>`;
            break;
        case Types.MINING:
            //The symbol for mining is currently a hard hat, as Font Awesome have
            //very helpfully locked the pickaxe symbol behind their paid tier
            typeIcon = `<i class="fa-solid fa-helmet-safety fa-fw fa-5x"></i>`;
            break;
        default:
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
    //Marker needs to be added before colour can be adjusted,
    //otherwise this causes an undefined error.
    //This means it can't be changed in the previous switch 
    //where types are checked.
    //Poaching uses the default blue marker colour, so it's
    //not here.
    //These colours hopefully avoid most problems with colourblindness
    switch(type){
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
    let markerID = `marker-${idNum}`;
    //The created marker is added to a list of markers.
    //Currently, nothing is being done with this
    markers[markerID] = marker;
    let currentIdNum = idNum;
    //The process for removing a marker is done twice.
    //The remove process is set up normally first, in case the 
    //user removes a marker while the popup is still up for the first time.
    //The click event then sets up the remove process for the second time.
    //This is done so that the remove button works when the popup is opened again
    //after being closed.
    //If only the first remove setup was done, the event would become invalid
    //after the popup was closed, and the remove button wouldn't do anything.
    let removeMarkerButton = document.getElementById(`removeMarkerButton-${currentIdNum}`);
    removeMarkerButton.addEventListener("click", () => {
        map.removeLayer(marker);
    });
    marker.on('click', () => {
        let removeMarkerButton = document.getElementById(`removeMarkerButton-${currentIdNum}`);
        removeMarkerButton.addEventListener("click", () => {
            map.removeLayer(marker);
        });
    });
    idNum++;
}

let manualFormSubmitButton = document.getElementById("manualFormSubmitButton");
//handles the response for when the user inputs the coords manually in the top form
manualFormSubmitButton.addEventListener("click", (e) => {
    //stops the page from reloading when submitting a form
    // e.preventDefault();
    const lat = document.getElementById("latBox").value;
    const lng = document.getElementById("lngBox").value;
    //Coordinate restrictions for the markers.
    //The !lat and !lng check to see if they're null values
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
                <form>
                    <p>Lat: ${latlng.lat}</p>
                    <p>Lng: ${latlng.lng}</p>
                    <input type='radio' id='ERW' name='popupType'></input> 
                    <label for='ERW'><i class="fa-solid fa-bomb fa-fw fa-5x"></i></label>
                    <br>
                    <input type='radio' id='poaching' name='popupType'></input>
                    <label for='poaching'><i class="fa-solid fa-crosshairs fa-fw fa-5x"></i></label>
                    <br> 
                    <input type='radio' id='mining' name='popupType'></input> 
                    <label for='mining'><i class="fa-solid fa-helmet-safety fa-fw fa-5x"></i></label>
                    <br>
                    <input type='radio' id='logging' name='popupType'></input>
                    <label for='logging'><i class="fa-solid fa-tree fa-fw fa-5x"></i></label>
                    <br>
                    <button id='mapFormSubmitButton' type='submit'><i class="fa-solid fa-check"></i></button>
                </form> 
            `)
            .openOn(map);

        //handles the response for when the user uses the map form
        let mapFormSubmitButton = document.getElementById("mapFormSubmitButton");
        mapFormSubmitButton.addEventListener("click", (e) => {
            e.preventDefault();
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