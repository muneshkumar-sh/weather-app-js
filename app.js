

// select elements
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temp");
const condition = document.getElementById("weather-condition");
const minMax = document.getElementById("min-max");
const forecastContainer = document.getElementById("forecast");
const dots = document.querySelectorAll(".dots span");

// get weather function
async function getWeather(city) {

    const apiKey = "7ab0830dacb034575c6a9c8ac09edde2";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if(response.status !== 200){
        alert(data.message);
        return;
    }

    // Correct city path
    cityName.innerText = data.city.name;

    // Current weather is first item in list
    const current = data.list[0];

    temperature.innerText = Math.round(current.main.temp) + "°";

    condition.innerText = current.weather[0].main;

    minMax.innerText =
        Math.round(current.main.temp_max) + "° / " +
        Math.round(current.main.temp_min) + "°";


    forecastContainer.innerHTML = "";

    const addedDays = new Set();

    for(let item of data.list){

        const date = new Date(item.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        // Skip duplicate days
        if(addedDays.has(dayName)) 
            continue;

        addedDays.add(dayName);

        let displayDay;

        if(addedDays.size === 1){
            displayDay = "Today";
        }else if (addedDays.size === 2){
            displayDay = "Tomorrow";
        }else {
            displayDay = dayName;
        }

        const tempMin =Math.round(item.main.temp_min);
        const tempMax= Math.round(item.main.temp_max);

        const row = document.createElement("div");
        row.classList.add("row");

        row.innerHTML = `
            <span>${displayDay}</span>
            <span>${tempMax}° / ${tempMin}°</span>`;

        forecastContainer.appendChild(row);

        // Stop after 5 days
        if (addedDays.size === 5) break;

    }

}

setInterval(() => {
    const input = document.getElementById("search-input").value || "Karachi";
    getWeather(input);
}, 1800000);


function searchCity() {
    const input = document.getElementById("search-input").value;
    getWeather(input);
}

dots.forEach(dot => {
    dot.addEventListener("click", function() {
        dots.forEach(d => d.classList.remove("active"));
        this.classList.add("active");
    });
});

