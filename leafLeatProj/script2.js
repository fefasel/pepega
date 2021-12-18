

var map = L.map('map', {
    crs: L.CRS.Simple,
});
var bounds = [[-25, -26.5], [ 600, 800]];
let image = L.imageOverlay("Pleasant-Valley.png", bounds).addTo(map);


/*
//crate image element
const reader = new FileReader();
let elem = document.createElement("img");
elem.setAttribute("src", fileReaderResult);
elem.setAttribute("alt", "Flower");
document.getElementById("placehere").appendChild(elem);

image= L.imageOverlay(fileReaderResult, bounds).addTo(map);

*/


//example bounds
var sol      = [175.2, 145.0];
var mizar    = [41.6, 130.1];
var kruegerZ = [13.4, 56.5];
var deneb    = [218.7, 8.3];

var mMizar = L.marker(mizar).addTo(map).bindPopup('Mizar');
var mKruegerZ = L.marker(kruegerZ).addTo(map).bindPopup('Krueger-Z');
var mDeneb = L.marker(deneb).addTo(map).bindPopup('Deneb');

var travel = L.polyline([sol, deneb]).addTo(map);
//polygon
var polygon = L.polygon([
    [132.5, 288],
    [400, 210],
    [132.5, 270]
]).addTo(map);

//bind map onMapClick Function 
map.on('click', onMapClick);
//set the zoom level and coordination of map
map.setView([300,400], 0);


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

//item functions to bind the item buttons
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
document.getElementById("keyButton").onclick = ()=>{
    console.log("Key Button Pressed")
    itemSelection=keyMarker
    itemSelectionPopUp="Key Location"
};
document.getElementById("socketButton").onclick = ()=>{
    console.log("Socket Button Pressed")
    itemSelection=socketMarker
    itemSelectionPopUp="Socket Location"
};
//onMapClick function order is important
//show with popup, show Location coordinates when clicked on map



//POPUPS
//marker Arrays to store
let markerArray = new Array();
//add markers
let marker; 
//marker adder on map when clicked
var popup = L.popup();
function onMapClick(e) {
    if(itemSelection==null){//if there is no selected item show coordinate popup
        //
        popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    }else{
        marker = new L.Marker(e.latlng, {
            icon:itemSelection,
            draggable:'true'
        }).bindPopup(itemSelectionPopUp);
        //push marker to array
        markerArray.push(marker)
        map.addLayer(marker);
 
        /*
        how to remove marker
        counter++
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

//save image file as base64file
let fileReaderResult = ""//base64 string variable for image to store in database
//upload file function
function previewFile() {
  const preview = document.querySelector('#imagePrev');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  //when image loads, convert image to base64 string type
  reader.addEventListener("load", function () {
    // convert image file to base64 string
    preview.src = reader.result
    fileReaderResult=reader.result
    console.log("fileReaderResult: ",fileReaderResult)
    RemoveExistingMap(image)
    image = L.imageOverlay(fileReaderResult, bounds).addTo(map);
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    console.log("reader: ",reader)
  } 
}


//remove previous image from map
function RemoveExistingMap(image) {
    if (image != null) {
        image.remove();
        image = null;
    }
}






/*

*/
