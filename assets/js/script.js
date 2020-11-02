let input = document.getElementById("searchInput");
let searchBtn = document.getElementById("search-button");
let name = document.getElementById("searchName");
let currentImg = document.getElementById("currentImg");
let temp = document.getElementById("temperature");
let humidity = document.getElementById("humidity");4
let wind = document.getElementById("wind-speed");
let thisUV = document.getElementById("UV-index");
let history = document.getElementById("history");
let search_history = JSON.parse(localStorage.getItem("search")) || [];

    

let key = "f71c5d8f9f83e487a019ac54b5a9aaa3";

function init(search_input) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + search_input + "&appid=" + key;
    fetch(queryURL)
    .then(function(response){
    response.json().then(function (data)
    {
        let currentDate = new Date(data.dt * 1000);
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        name.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = data.weather[0].icon;
        currentImg.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        currentImg.setAttribute("alt",data.weather[0].description);
        temp.innerHTML = "Temperature: " + k2f(data.main.temp) + " &#176F";
        humidity.innerHTML = "Humidity: " + data.main.humidity + "%";
        wind.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";
        getUV(data);
    })
})
}
function getUV(data){
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let queryUV = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&cnt=1";
    fetch(queryUV)
    .then(function(response){
        response.json().then(function(data) {
            let uvNum = document.createElement("span");
            uvNum.setAttribute("class","badge badge-danger");
            uvNum.innerHTML = data[0].value;
            thisUV.innerHTML = "UV Index: ";
            thisUV.append(uvNum);
            
        });
})  
getforecast(data)      
} 
    
    
function getforecast(data) {
    let search_id = data.id;
    let queryforecast = "https://api.openweathermap.org/data/2.5/forecast?id=" + search_id + "&appid=" + key;
    
    fetch(queryforecast)
    .then(function(response){
    response.json().then(function(data) {
        console.log(data)
        let forecastEls = document.querySelectorAll(".forecast");
        for (i=0; i<forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            let forecastIndex = i*8 + 4;
            let forecastDate = new Date(data.list[forecastIndex].dt*1000);
            console.log(forecastDate)
            let forecastDay = forecastDate.getDate();
            let forecastMonth = forecastDate.getMonth() + 1;
            let forecastYear = forecastDate.getFullYear();
            let forecastDateEl = document.createElement("p");
            forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEls[i].append(forecastDateEl);
            let forecastWeatherEl = document.createElement("img");
            forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeatherEl.setAttribute("alt",data.list[forecastIndex].weather[0].description);
            forecastEls[i].append(forecastWeatherEl);
            let forecastTempEl = document.createElement("p");
            forecastTempEl.innerHTML = "Temp: " + k2f(data.list[forecastIndex].main.temp) + " &#176F";
            forecastEls[i].append(forecastTempEl);
            let forecastHumidityEl = document.createElement("p");
            forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastHumidityEl);
            }
        })
    })
    
}
    
searchBtn.addEventListener("click",function() {
    let search_input = input.value;
    init(search_input);
    search_history.push(search_input);
    localStorage.setItem("search",JSON.stringify(search_history));
    input.value = ''
    render();
})


function k2f(K) {
    return Math.floor((K - 273.15) *1.8 +32);
}

function render() {
    history.innerHTML = "";
    for (let i=0; i<search_history.length; i++) {
        let item = document.createElement("button");
        item.setAttribute("type","button");
        item.setAttribute("class", "form-control btn-secondary");
        item.setAttribute("value", search_history[i]);
        item.innerHTML = search_history[i]
        item.addEventListener("click",function() {
            init(item.value);
        })
        history.append(item);
    }
}

render();
if (search_history.length > 0) {
    init(search_history[search_history.length - 1]);
}




