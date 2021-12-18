
var image;
var yx = L.latLng;

function xy(x, y) {
    if (L.Util.isArray(x)) { // When doing xy([x, y]);
        return yx(x[1], x[0]);
    }
    return yx(y, x); // When doing xy(x, y);
}

var map = L.map('map', {
    crs: L.CRS.Simple,
});
var bounds = [xy(-25, -26.5), xy( 800, 600)];

//save image file as base64file
let fileReaderResult = "" 
function previewFile() {
  const preview = document.querySelector('#imagePrev');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    // convert image file to base64 string
    preview.src = reader.result
    fileReaderResult=reader.result
    console.log(fileReaderResult)
    RemoveExistingMap(image)
    image = L.imageOverlay(fileReaderResult, bounds).addTo(map);
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    console.log(reader)
  } 
}


function RemoveExistingMap(image) {
    if (image != null) {
        image.remove();
        image = null;
    }
}

/*
//crate image element
const reader = new FileReader();
let elem = document.createElement("img");
elem.setAttribute("src", fileReaderResult);
elem.setAttribute("alt", "Flower");
document.getElementById("placehere").appendChild(elem);

image= L.imageOverlay(fileReaderResult, bounds).addTo(map);

*/

image = L.imageOverlay("Pleasant-Valley.png", bounds).addTo(map);

var sol      = xy(175.2, 145.0);
var mizar    = xy(41.6, 130.1);
var kruegerZ = xy(13.4, 56.5);
var deneb    = xy(218.7, 8.3);


var mMizar = L.marker(mizar).addTo(map).bindPopup('Mizar');
var mKruegerZ = L.marker(kruegerZ).addTo(map).bindPopup('Krueger-Z');
var mDeneb = L.marker(deneb).addTo(map).bindPopup('Deneb');

var travel = L.polyline([sol, deneb]).addTo(map);




var polygon = L.polygon([
    [132.5, 288],
    [400, 210],
    [132.5, 270]
]).addTo(map);


map.on('click', onMapClick);
map.setView(xy(120, 70), 1);


//Collectible object Declarations
//LeafIcon Class
let LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [20, 50], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-10, -40], // point from which the popup should open relative to the iconAnchor
        draggable: 'true'
    }
});

//Marker Objects
let backpackMarker = new LeafIcon({
    iconUrl: 'backpack.png'
});

let medicineMarker = new LeafIcon({
    iconUrl: 'medicine.png'
});
let keyMarker = new LeafIcon({
    iconUrl: 'key.png'
});
let socketMarker = new LeafIcon({
    iconUrl: 'socket.png'
});

//item functions to bind
// Using a function pointer:
let itemSelection=null
let itemSelectionPopUp = "N/A"
document.getElementById("backpackButton").onclick = ()=>{   
    console.log("BackPack Button Pressed")
    itemSelection=backpackMarker
    itemSelectionPopUp="Backpack Location"

};
document.getElementById("medicineButton").onclick = ()=>{
    console.log("Medicine Button Pressed")
    itemSelection=medicineMarker
    itemSelectionPopUp="Medicine Location"
};

//onMapClick function order is important
//show with popup, show Location coordinates when clicked on map
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

//marker Arrays to store
let markerArray = new Array();
//add markers
let marker; 
let counter =1

//marker adder on map when clicked
function onMapClick(e) {
    if(itemSelection==null){
        console.log("Please Select an item.")
    }else{
        marker = new L.Marker(e.latlng, {
            icon:itemSelection,
            draggable:'true'
        }).bindPopup(itemSelectionPopUp);
        //push marker to array
        markerArray.push(marker)
        map.addLayer(marker);
        counter++
        /*
        if(counter==3){ 
            markerArray.forEach(element => {
                map.removeLayer(element)
                
            });
            console.log(markerArray)
            counter=1
        }
        */
    }
        
};

//





/*

*/
