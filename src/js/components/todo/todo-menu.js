// import './rss-menu.css';
import Menu from '../base-menu/baseMenu';
import create from '../../utils/create';

class TodoMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.renderContent();
  }

  addDangerBtn() {
    const menuContent = this.parentNode.querySelector('.menu-content.ToDo');

    create(
      'div',
      'danger-block',
      `<button class="danger todo">Delete block To Do</button>`,
      menuContent
    );
  }

  addDangerBtnListener() {
    const dangerBtn = this.parentNode.querySelector('.danger.todo');

    dangerBtn.addEventListener('click', () => {
      const mainMenuBtn = this.parentNode.querySelector(`[data-btn="todo"]`);
      mainMenuBtn.click();
      this.hide.bind(this)();
      localStorage.removeItem('todo');
    });
  }

  renderContent() {
    this.addDangerBtn();
    this.addDangerBtnListener();
  }
}

export default TodoMenu;
