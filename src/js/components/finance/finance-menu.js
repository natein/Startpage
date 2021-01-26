// import './rss-menu.css';
import Menu from '../base-menu/baseMenu';
import create from '../../utils/create';

class FinanceMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.renderContent();
  }

  addDangerBtn() {
    const menuContent = this.parentNode.querySelector('.menu-content.Fina');

    create(
      'div',
      'danger-block',
      `<button class="danger finance">Delete block Finance</button>`,
      menuContent
    );
  }

  addDangerBtnListener() {
    const dangerBtn = this.parentNode.querySelector('.danger.finance');

    dangerBtn.addEventListener('click', () => {
      const mainMenuBtn = this.parentNode.querySelector(`[data-btn="finance"]`);
      mainMenuBtn.click();
      this.hide.bind(this)();
    });
  }

  renderContent() {
    this.addDangerBtn();
    this.addDangerBtnListener();
  }
}

export default FinanceMenu;
