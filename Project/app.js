import axios from "axios";



var worldCardContainer=find(".container_flags");
var loader = find(".loader");
var indiSection=find("#individual")

const baseURL = 'https://restcountries.eu/rest/v2/';




function find(selector){
    return document.querySelector(selector);
}
function findAll(selector){
    return document.querySelectorAll(selector);

}
function renderHTML(worldFlags){
    for(var flag of worldFlags){
    var flagHTML = `<div class="container_flag container_flag--1">
    <img class ="container_flag-image" 
    src=${flag.image}>
    <p class="container_flag-name"><span>Name:</span>${flag.name}</p>
    <p class="container_flag-capital"><span>Capital:</span>${flag.capital}</p>
    <p class="container_flag-borders"><span>Borders:</span>${flag.borders}</p>
    </div> `
 worldCardContainer.insertAdjacentHTML("beforeend",flagHTML)
 
}
}
function fetchWorldAtlas(){    
    loader.style.display="block";
    var flags=localStorage.getItem("flags")
    if(flags){
        return Promise.resolve(JSON.parse(flags))
    }
    var worldPromise = axios
    .get(`${baseURL}all`).then(function(response){
        var constructedData=[];
        var worldFlags=response.data
        for(var flag of worldFlags ){
            var flagObj={
                name:flag.name,
                capital:flag.capital,
                image:flag.flag,
                borders:flag.borders
            };
            constructedData.push(flagObj)
           
        }
        localStorage.setItem("flags",JSON.stringify(constructedData))
        return constructedData

    }).catch(function (error){
        console.log(error);
    })
return worldPromise;
}
function renderIndiHTML(flag){
    for(var flag of flag){
    var indiHTML=`
    <div class="flag_flag-details">
    <img class ="container_flag-image" 
    src=${flag.flag}>
    <p class="container_flag-name"><span>Name:</span>${flag.name}</p>
    <p class="container_flag-capital"><span>Capital:</span>${flag.capital}</p>
    <p class="container_flag-borders"><span>Borders:</span>${flag.borders}</p>
    </div>`
    indiSection.insertAdjacentHTML('afterbegin',indiHTML)
    
    
}}

function fetchWorldSIngleFlag(flagName){
    indiSection.innerHTML=`<div class="loader" style="display:none">Loading...</div>`
    return fetch(`${baseURL}name/${flagName}`).then(function(response){
        return response.json();
    })
    
    //indiSection.querySelector("#individual").textContent = flagName;
}

function checkValidHash(){
    if(
        window.location.hash !== "home" && 
        window.location.hash !=="#individual"){
        window.location.hash="#home";
        }

}
function renderPage(hashValue){
    find(hashValue).style.display="block";
    if(hashValue==="#home"){
        fetchWorldAtlas().then(function(flags){
            loader.style.display="none";
            renderHTML(flags);

    })
}} 

function init(){
   checkValidHash();
   renderPage(window.location.hash);
        
}

window.addEventListener("hashchange",function(event){
    checkValidHash();
    find("#home").style.display="none";
    find("#individual").style.display="none";
    renderPage(window.location.hash);

});

worldCardContainer.addEventListener("click",function(){
    var isCardClicked= event.target.matches(
        ".container_flag, .container_flag *"
        )
        
        if (isCardClicked){
            var containerCard = event.target.closest(".container_flag");
            var flagName= containerCard.querySelector(".container_flag-name")
            .textContent.replace("Name:","");
            window.location.hash="#individual";
            fetchWorldSIngleFlag(flagName).then(function(flag){
                renderIndiHTML(flag)
            })
        }
})
init();

