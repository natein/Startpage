import './command-menu.css';
import Menu from '../base-menu/baseMenu';
import { classListBlocks } from '../../data/constants';
import create from '../../utils/create';
import OptionsMenu from '../options-menu/options-menu';

const blockNames = [
  'Finance',
  'News (RSS)',
  'Popular likns',
  'Shops',
  'Travels',
  'Google',
  'Weather',
  'To Do',
  'Calculator',
];

const getClassListBlocks = () => {
  let blockList = [];

  const localBlockList = JSON.parse(localStorage.getItem('classListBlocks'));

  if (localBlockList) {
    blockList = localBlockList;
  } else {
    localStorage.setItem('classListBlocks', JSON.stringify(classListBlocks));
  }
  return blockList;
};

class CommandMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.managerBlock = create('div', 'menu-manager');
    this.renderContent();
  }

  fillManagerBlock() {
    this.managerBlock.innerHTML = '';

    const localClassList = JSON.parse(localStorage.getItem('classListBlocks'));
    localClassList.forEach((name, index) => {
      const html = `<p>${blockNames[index]}</p>
                   <button class="submit" data-btn="${name.class}">add</button>`;
      const item = create(
        'div',
        `menu-item item-${name.class}`,
        html,
        this.managerBlock
      );

      const block = this.parentNode.querySelector(`.block.${name.class}`);

      if (!name.active) block.classList.add('hidden-block');
      if (name.active) {
        block.classList.remove('hidden-block');
        item.lastElementChild.textContent = 'hide';
        item.lastElementChild.classList.add('active-item');
      }
    });
  }

  changePosition(e) {
    const classId = e.target.dataset.btn;

    const localClassList = JSON.parse(localStorage.getItem('classListBlocks'));

    const newClassList = localClassList.map((item) => {
      if (item.class === classId && item.active)
        return { ...item, active: false };
      if (item.class === classId && !item.active)
        return { ...item, active: true };
      return item;
    });

    localStorage.setItem('classListBlocks', JSON.stringify(newClassList));

    this.fillManagerBlock();
    this.addBtnListener();
  }

  addBtnListener() {
    const buttons = this.parentNode.querySelectorAll('.menu-item .submit');
    buttons.forEach((btn) => {
      btn.onclick = this.changePosition.bind(this);
      return btn;
    });
  }

  renderContent() {
    const contentBlock = document.querySelector('.menu-content.Main');
    contentBlock.appendChild(this.managerBlock);

    getClassListBlocks();
    this.fillManagerBlock();
    this.addBtnListener();

    const otherMenuItems = create('div', 'other-items', '', contentBlock);

    const options = create('div', 'options', 'Options', otherMenuItems);
    this.optionsMenu = new OptionsMenu(options, 'Options');
  }
}

export default CommandMenu;
