// import PopMenu from "../popular-menu/popular-menu";
import './weather.css';
import './owfont-regular.css';

// const weatherIcon = document.querySelector('.weather-icon');
// const temperature = document.querySelector('.temperature');
// const humidity = document.querySelector('.humidity');
// const wind = document.querySelector('.wind');
// const weatherDescription = document.querySelector('.weather-description');
// const city = document.querySelector('.city');

async function getWeather(e) {
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const humidity = document.querySelector('.humidity');
  const wind = document.querySelector('.wind');
  const weatherDescription = document.querySelector('.weather-description');
  const city = document.querySelector('.city');
  try {
    if (localStorage.getItem('city') === null) {
      city.textContent = 'Минск';
    } else {
      city.textContent = localStorage.getItem('city');
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ru&appid=543c9bb3c115ee39476506208d454b41&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    humidity.textContent = `Влажность воздуха ${data.main.humidity} %`;
    wind.textContent = `Скорость ветра ${data.wind.speed} м/с`;
    weatherDescription.textContent = data.weather[0].description;

    return data;
  } catch (error) {
    city.textContent = 'Введите правильно город';
  }
}
// getWeather()
// .then(res => console.log(res))
// .catch(err => console.log(err));

function setCity(e) {
  const city = document.querySelector('.city');
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      city.blur();
      if (e.target.innerText != '' && e.target.innerText != 'Минск') {
        localStorage.setItem('city', e.target.innerText);
        city.blur();
        getWeather();
      }
    }
  } else {
    if (e.target.innerText == '') {
      city.textContent = localStorage.getItem('city') || 'Минск';
    } else {
      localStorage.setItem('city', e.target.innerText);
      getWeather();
    }
  }
}

// // document.addEventListener('DOMContentLoaded', getWeather);
// city.addEventListener('keypress', setCity);
// city.addEventListener('blur', setCity);
// city.addEventListener('click', () => city.textContent = '');

class Weather {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  addListeners() {
    const city = document.querySelector('.city');
    // document.addEventListener('DOMContentLoaded', getWeather);
    console.log(city);
    city.addEventListener('keypress', setCity);
    city.addEventListener('blur', setCity);
    city.addEventListener('click', () => (city.textContent = ''));
  };

  render() {
    this.parentNode.innerHTML = `
    <h3>Weather</h3>
    <div class='weather-content'>
      <div class="city" contenteditable="true">Минск</div>
      <i class="weather-icon owf"></i>
      <div class="temperature"></div>
      <div class="humidity"></div>
      <div class="wind"></div>
      <div class="weather-description"></div>
    </div>
    `;
    getWeather();
    this.addListeners();
  }
}

export default Weather;
