import './header.css';
import * as Constants from '../../data/constants';
import create from '../../utils/create';
import Pages from '../pages/pages';
import CommandMenu from '../command-menu/command-menu';

class Header {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const img = document.createElement('img');
    img.src = "./img/sp.jpg";
    this.pages = new Pages();
    this.btnMenu = create('button', 'menu-btn', `<img src="./icons/menu-gold.svg" alt="">`);
    this.header = create('header', 'header', [img, this.pages.getMenu(), this.btnMenu], this.parentNode);
    this.showMenu();
  }
  
  showMenu() {
    this.sideMenu = new CommandMenu(this.btnMenu, 'Main Menu');
  }  
}

export default Header;
