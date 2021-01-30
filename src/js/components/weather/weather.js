import './weather.css';
import './owfont-regular.css';
import WeatherMenu from './weather-menu';

class Weather {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  getDomElements() {
    const weatherIcon = this.parentNode.querySelector('.weather-icon');
    const temperature = this.parentNode.querySelector('.temperature');
    const humidity = this.parentNode.querySelector('.humidity');
    const wind = this.parentNode.querySelector('.wind');
    const weatherDescription = this.parentNode.querySelector(
      '.weather-description'
    );
    const city = this.parentNode.querySelector('.city');

    return {
      weatherIcon,
      temperature,
      humidity,
      wind,
      weatherDescription,
      city,
    };
  }

  addListeners() {
    const { city } = this.getDomElements();
    city.addEventListener('keypress', this.setCity.bind(this));
    city.addEventListener('blur', this.setCity.bind(this));
    city.addEventListener('click', () => (city.textContent = ''));
  }

  async getWeatherData() {
    const { city } = this.getDomElements();

    if (localStorage.getItem('city') === null) {
      city.textContent = 'Minsk';
    } else {
      city.textContent = localStorage.getItem('city');
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=543c9bb3c115ee39476506208d454b41&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) city.textContent = 'Enter correct city';

    return data;
  }

  async fillWeatherBlock() {
    const data = await this.getWeatherData();
    const {
      weatherIcon,
      temperature,
      humidity,
      wind,
      weatherDescription,
    } = this.getDomElements();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    humidity.textContent = `Humidity ${data.main.humidity} %`;
    wind.textContent = `Wind speed ${data.wind.speed} m/s`;
    weatherDescription.textContent = data.weather[0].description;
  }

  setCity(e) {
    const { city } = this.getDomElements();
    const pressedEnter = e.which === 13 || e.keyCode === 13;
    const cityEntered =
      e.target.innerText !== '' && e.target.innerText !== 'Minsk';
    this.fillWeatherBlock.bind(this);
    if (e.type === 'keypress') {
      if (pressedEnter) {
        city.blur();
        if (cityEntered) {
          localStorage.setItem('city', e.target.innerText);
          city.blur();
          this.fillWeatherBlock();
        }
      }
    } else if (e.target.innerText === '') {
      city.textContent = localStorage.getItem('city') || 'Minsk';
    } else {
      localStorage.setItem('city', e.target.innerText);
      this.fillWeatherBlock();
    }
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="popular-header">
      <h3>Weather</h3>
      <div class="dot-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class='weather-content'>
      <div class="city" contenteditable="true">Minsk</div>
      <i class="weather-icon owf"></i>
      <div class="temperature"></div>
      <div class="humidity"></div>
      <div class="wind"></div>
      <div class="weather-description"></div>
    </div>
    `;
    this.fillWeatherBlock();
    this.addListeners();

    this.btnMenu = this.parentNode.querySelector('.dot-menu');
    this.rssMenu = new WeatherMenu(this.btnMenu, 'Weather');
  }
}

export default Weather;
