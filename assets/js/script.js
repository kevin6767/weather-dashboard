function initPage() {
    const input = document.getElementById("searchInput");
    const searchBtn = document.getElementById("search-button");
    const name = document.getElementById("searchName");
    const currentImg = document.getElementById("currentImg");
    const temp = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");4
    const wind = document.getElementById("wind-speed");
    const currentUV = document.getElementById("UV-index");
    const history = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);
    

    const key = "f71c5d8f9f83e487a019ac54b5a9aaa3";

function getWeather(cityName) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key;
    fetch(queryURL)
    .then(function(response){
    response.json().then(function (data)
    {

        console.log(data)
        const currentDate = new Date(data.dt * 1000);
        console.log(currentDate);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        name.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = data.weather[0].icon;
        currentImg.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        currentImg.setAttribute("alt",data.weather[0].description);
        temp.innerHTML = "Temperature: " + k2f(data.main.temp) + " &#176F";
        humidity.innerHTML = "Humidity: " + data.main.humidity + "%";
        wind.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";

    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&cnt=1";
    fetch(UVQueryURL)
    .then(function(response){
        response.json().then(function(data) {
                let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge badge-danger");
            UVIndex.innerHTML = data[0].value;
            currentUV.innerHTML = "UV Index: ";
            currentUV.append(UVIndex);
        });
})  
            

    let cityID = data.id;
    let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + key;
    fetch(forecastQueryURL)
    .then(function(response){
    response.json().then(function(data) {
        
    
        const forecastEls = document.querySelectorAll(".forecast");
        for (i=0; i<forecastEls.length; i++) {
            forecastEls[i].innerHTML = "";
            const forecastIndex = i*8 + 4;
            const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
            const forecastDay = forecastDate.getDate();
            const forecastMonth = forecastDate.getMonth() + 1;
            const forecastYear = forecastDate.getFullYear();
            const forecastDateEl = document.createElement("p");
            forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastEls[i].append(forecastDateEl);
            const forecastWeatherEl = document.createElement("img");
            forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
            forecastWeatherEl.setAttribute("alt",data.list[forecastIndex].weather[0].description);
            forecastEls[i].append(forecastWeatherEl);
            const forecastTempEl = document.createElement("p");
            forecastTempEl.innerHTML = "Temp: " + k2f(data.list[forecastIndex].main.temp) + " &#176F";
            forecastEls[i].append(forecastTempEl);
            const forecastHumidityEl = document.createElement("p");
            forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastHumidityEl);
            }
        })
    })
    }); 
}) 
}

    searchBtn.addEventListener("click",function() {
        const searchTerm = input.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })


    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function renderSearchHistory() {
        history.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyItem = document.createElement("button");
            historyItem.setAttribute("type","button");
            historyItem.setAttribute("class", "form-control btn-secondary");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.innerHTML = searchHistory[i]
            historyItem.addEventListener("click",function() {
                getWeather(historyItem.value);
            })
            history.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }



}
initPage();