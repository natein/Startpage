// import './rss-menu.css';
import Menu from '../base-menu/baseMenu';
import create from '../../utils/create';

class WeatherMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.renderContent();
  }

  addDangerBtn() {
    const menuContent = this.parentNode.querySelector('.menu-content.Weat');

    create(
      'div',
      'danger-block',
      `<button class="danger weather">Delete block Weather</button>`,
      menuContent
    );
  }

  addDangerBtnListener() {
    const dangerBtn = this.parentNode.querySelector('.danger.weather');

    dangerBtn.addEventListener('click', () => {
      const mainMenuBtn = this.parentNode.querySelector(`[data-btn="weather"]`);
      mainMenuBtn.click();
      this.hide.bind(this)();
      localStorage.removeItem('city');
    });
  }

  renderContent() {
    this.addDangerBtn();
    this.addDangerBtnListener();
  }
}

export default WeatherMenu;
