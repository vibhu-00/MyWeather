const apiKey = "6771adcc0ca240159fb121159251008";



const citySearch=(city)=>{
  const myCity=document.getElementById("myCity")
  console.log(city);
  myCity.innerHTML=city;
  const displayCity=document.getElementById("displayCity")
  displayCity.innerHTML=city;
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
fetch(url)
  .then(res => {
    if (!res.ok) throw new Error("City not found")
    
    return res.json();
  })
  .then(data => {
    console.log(data);
    temp_c      .innerHTML =`${data.current.temp_c}`
    feelslike_c .innerHTML =`${data.current.feelslike_c}°C`
    heatindex_c .innerHTML =`${data.current.heatindex_c}°C`
    feelslike_f .innerHTML =`${data.current.feelslike_f}°F`
    heatindex_f .innerHTML =`${data.current.heatindex_f}°F`
    humidity    .innerHTML =`${data.current.humidity   }`
    dewpoint_c .innerHTML = `${data.current.dewpoint_c }°`
    precip_in  .innerHTML = `${data.current.precip_in  }%`
    vis_km     .innerHTML = `${data.current.vis_km     }km`
    last_updated.innerHTML =`${data.current.last_updated}`
    wind_kph    .innerHTML =`${data. current.wind_kph   }`
    wind_degree .innerHTML =`${data.current.wind_degree  }°`  
    windchill_c .innerHTML =`${data.current.windchill_c}°C`
    gust_kph    .innerHTML =`${data.current.gust_kph   } km/h`
    pressure_in .innerHTML =`${data.current.pressure_in} inHg`
    mycountry.innerHTML=`${data.location.country}`
    myregion.innerHTML=`${data.location.region}`
    localtime.innerHTML=`${data.location.localtime}`
   // console.log(`Temperature in ${data.location.name}: ${data.current.temp_c}°C`);
  //console.log(`Condition: ${data.current.condition.text}`);
  })
  .catch(err => 
      console.error(err));}
let submitBtn = document.getElementById("submit");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  citySearch(searchinput.value);
  
});

citySearch("Ranchi");




//const clock=document.querySelector('#clock');
//
//setInterval(function () { 
//  let date =new Date();
//  //console.log(date.toLocaleTimeString())
//clock.innerHTML=(date.toLocaleTimeString());},1000);

let forecastChartInstance = null; // store the chart globally

const cityData = (citydata) => {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(citydata)}&days=1&aqi=no&alerts=no`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      console.log(data);
      text.innerHTML=`${data.current.condition.text}`
      const sunriseTime = data.forecast.forecastday[0].astro.sunrise;
      console.log(sunriseTime); 
      sundisplay.innerHTML=sunriseTime
      const sunsetTime = data.forecast.forecastday[0].astro.sunset;
      console.log(sunsetTime); 
      downdisplay.innerHTML=sunsetTime


      // Extract hourly data
      const hours = data.forecast.forecastday[0].hour.map(h => h.time.split(" ")[1]);
      const temps = data.forecast.forecastday[0].hour.map(h => h.temp_c);
      const humidity = data.forecast.forecastday[0].hour.map(h => h.humidity);
      const rainfall = data.forecast.forecastday[0].hour.map(h => h.precip_mm);

      renderChart(hours, temps, humidity, rainfall, citydata);
    })
    .catch(err => {
      console.error("Error:", err.message);
      alert(err.message);
    });
};

submitBtn = document.getElementById("submit");
const searchinput = document.getElementById("searchinput"); // make sure you have this

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cityData(searchinput.value);
});

cityData("Ranchi"); // load default city when page opens

function renderChart(labels, temps, humidity, rainfall, cityName) {
  const ctx = document.getElementById("forecastChart").getContext("2d");

  // Destroy previous chart if it exists
  if (forecastChartInstance) {
    forecastChartInstance.destroy();
  }

  forecastChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Temperature (°C)`,
          data: temps,
          borderColor: "rgba(233, 19, 66, 1)",
          backgroundColor: "rgba(8, 8, 8, 0.2)",
          yAxisID: 'y',
          tension: 0.3
        },
        {
          label: `Humidity (%)`,
          data: humidity,
          borderColor: "rgba(0, 149, 249, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          yAxisID: 'y1',
          tension: 0.3
        },
        {
          label: `Rainfall (mm)`,
          data: rainfall,
          borderColor: "rgba(0, 172, 172, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          yAxisID: 'y1',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: `Hourly Weather Data for ${cityName}`
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Humidity (%) / Rainfall (mm)'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

document.querySelectorAll("th.text-start").forEach(th => {
  const city = th.textContent.trim();
  const safeCity = city.replace(/\s+/g, "_"); // replace spaces for ID

  fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.current) {
        const c = data.current;

        document.getElementById(`dewpoint_c-${safeCity}`).textContent = c.dewpoint_c ?? "-";
        document.getElementById(`feelslike_c-${safeCity}`).textContent = c.feelslike_c ?? "-";
        document.getElementById(`gust_kph-${safeCity}`).textContent = c.gust_kph ?? "-";
        document.getElementById(`heatindex_c-${safeCity}`).textContent = c.heatindex_c ?? "-";
        document.getElementById(`humidity-${safeCity}`).textContent = c.humidity ?? "-";
        document.getElementById(`last_update-${safeCity}`).textContent = data.current.last_updated ?? "-";
        document.getElementById(`pressure_in-${safeCity}`).textContent = c.pressure_in ?? "-";
        document.getElementById(`temp_c-${safeCity}`).textContent = c.temp_c ?? "-";
        document.getElementById(`wind_kph-${safeCity}`).textContent = c.wind_kph ?? "-";
        document.getElementById(`windchill_c-${safeCity}`).textContent = c.windchill_c ?? "-";
      }
    })
    .catch(err => {
      console.error(`Error fetching weather for ${city}`, err);
    });
});