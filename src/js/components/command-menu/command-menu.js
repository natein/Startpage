import './command-menu.css';
import Menu from '../base-menu/baseMenu';
import { classListBlocks } from '../../data/constants';
import create from '../../utils/create';

const blockNames = [
  'Finance',
  'News (RSS)',
  'Popular likns',
  'Shops',
  'Travels',
  'Google',
  'Weather',
  'To Do',
];

const getClassListBlocks = () => {
  let blockList = [];

  const localBlockList = JSON.parse(localStorage.getItem('classListBlocks'));

  if (localBlockList) {
    blockList = localBlockList;
  } else {
    localStorage.setItem('classListBlocks', JSON.stringify(classListBlocks));
  }
  // console.log(blockList);
  return blockList;
};
// getClassListBlocks();

class CommandMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.contentBlock = document.querySelector('.menu-content.Main');
    this.renderContent();
  }

  fillContentBlock() {
    const classListBlocks = JSON.parse(localStorage.getItem('classListBlocks'));
    blockNames.forEach((name, index) => {
      const html = `<p>${name}</p>
                   <button class="btn-${classListBlocks[index].class} submit">add</button>
                   `
      const item = create('div', `menu-item item-${classListBlocks[index].class}`, html, this.contentBlock);

      const block = this.parentNode.querySelector(`.block.${classListBlocks[index].class}`);
      if (!classListBlocks[index].active) block.classList.add('hidden-block');
      if (classListBlocks[index].active) {
        item.lastElementChild.textContent = 'hide';
        item.lastElementChild.classList.add('active-item');
      };
    });
  }

  addItem() {
    const classListBlocks = JSON.parse(localStorage.getItem('classListBlocks'));
    classListBlocks.forEach((elem) => {
      const block = this.parentNode.querySelector(`.block.${elem.class}`);
      console.log(block);
    });
  }

  renderContent() {
    getClassListBlocks();
    console.log(this.contentBlock);
    this.fillContentBlock();
  }
}

export default CommandMenu;

