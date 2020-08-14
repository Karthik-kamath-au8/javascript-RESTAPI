import axios from "axios";

var vechConatiner = find(".container_vehicles");
var loader = find(".loader");
var indiSection = find("#individual");

var corsErrorRemovalURL = "https://corsanywhere.herokuapp.com/";
var baseURL = "https://swapi.dev/api/";
var vehicle_url = "https://swapi.dev/api/vehicles/";
var vechile_filmURL="https://swapi.dev/api/vehicles/"

function find(selector) {
  return document.querySelector(selector);
}
function findAll(selector) {
  return document.querySelectorAll(selector);
}

function renderHTML(api_response) {
  //console.log(api_response);
  var vehicleHTML = "";
  for (var vehicle of api_response.results) {
    vehicleHTML += `<div class="container_vehicle container_vehicle-1" data-url=${vehicle.url}>
        <p class="container_vehicle-name"><span>Name:</span>${vehicle.name}</p>
        <p class="container_vehicle-model"><span>Model:</span>${vehicle.model}</p>
        <p class="container_vehicle-manufacturer"><span>Manufacturer:</span>${vehicle.manufacturer}</p>
    </div>`;
    //vechConatiner.insertAdjacentHTML("beforeend", vehicleHTML);
  }
  vechConatiner.innerHTML = vehicleHTML;

  var previous = document.querySelector(".Previous");
  previous.addEventListener("click", function () {
    if (api_response.previous != null) {
      var url = api_response.previous;
      fetchSwVehicles(url).then(function (response) {
        loader.style.display = "none";
        renderHTML(response);
      });
    } else {
      alert("Idiot This is first page");
    }
  });
  var next = document.querySelector(".Next");
  next.addEventListener("click", function () {
    if (api_response.next != null) {
      var url = api_response.next;
      fetchSwVehicles(url).then(function (response) {
        loader.style.display = "none";
        renderHTML(response);
      });
    } else {
      alert("This was the last page");
    }
  });
}

function fetchSwVehicles(url) {
  loader.style.display = "block";
  var newPromise = axios
    .get(`${url}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (err) {
      console.log(err);
    });
  return newPromise;
}

function renderIndiHTML(vec) {
 
  var vecHTML = ` <div class="vehicles_container">
  <p class="container_vehicle-name"><span>Name:</span>${vec.name}</p>
        <p class="container_vehicle-model"><span>Model:</span>${vec.model}</p>
        <p class="container_vehicle-manufacturer"><span>Manufacturer:</span>${vec.manufacturer}</p>
        <p class="container_vehicle-passengers"><span>Passengers:</span>${vec.passengers}</p>
        <p class="container_vehicle-crew"><span>Crew:</span>${vec.crew}</p>
        <p class="container_vehicle-films"><span>flims:</span>${vec.films}</p>
        
        <div class="vehicle_detail-data">
        <div class="vechiles_container"></div>
        <button class="vehicle_conatiner-fav" style="color: rgb(235,47,6);background:transparent;">
        <i class="fa fa-heart">
        </i> Add to Fav</button></div>
        </div>
  
        `;
  indiSection.insertAdjacentHTML("afterbegin", vecHTML);
  var fav_button = document.querySelector(".vehicle_conatiner-fav");

  fav_button.addEventListener("click", function () {
    var fav_html = document.querySelector(".vehicle_likes");
    fav_html.removeAttribute("style");
    fav_html.setAttribute('style="display: block"');
  });
}

document.addEventListener("DOMContent", function (event) {
  console.log(vehicle_url);
  fetchSwVehicles(vehicle_url).then(function (response) {
    renderHTML(response);
  });
});

function fetchSwSingleVec(vehicleName) {
  indiSection.innerHTML = `<div class="loader" style="display:none">Loading...</div>`;

  return fetch(`${vehicleName}`).then(function (
    response
  ) {
    return response.json();
  });
}

function checkValidHash() {
  if (
    window.location.hash !== "home" &&
    window.location.hash !== "#individual"
  ) {
    window.location.hash = "#home";
  }
}

function renderPage(hashValue) {
  find(hashValue).style.display = "block";
  if (hashValue === "#home") {
    fetchSwVehicles(vehicle_url).then(function (vehicles) {
      loader.style.display = "none";
      renderHTML(vehicles);
    });
  }
}

function init() {
  checkValidHash();
  renderPage(window.location.hash);
}

window.addEventListener("hashchange", function (event) {
  checkValidHash();
  find("#home").style.display = "none";
  find("#individual").style.display = "none";
  renderPage(window.location.hash);
});

vechConatiner.addEventListener("click", function () {
  var isCardClicked = event.target.matches(
    ".container_vehicle, .container_vehicle *"
  );

  if (isCardClicked) {
    var containerCard = event.target.closest(".container_vehicle");
    var url = containerCard.getAttribute("data-url");

    window.location.hash = "#individual";
    fetchSwSingleVec(url).then(function (vehicle) {
      renderIndiHTML(vehicle);
    });
  }
});

init();
