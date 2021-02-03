import './header.css';
import * as Constants from '../../data/constants';
import create from '../../utils/create';
import Pages from '../pages/pages';
import {Auth} from '../auth/auth';
import * as RemoteAuth from '../../services/auth';

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
    const isLogged = RemoteAuth.isLogged();
    const btnLoginCaption = (isLogged) ? `<p>Logout</p>` : `<p>Login</p>`;
    this.btnLogin = create('button', 'login-btn', btnLoginCaption);   
    this.btnMenu = create('button', 'menu-btn', `<img src="./icons/menu-gold.svg" alt="">`);
    this.header = create('header', 'header', [img, this.pages.getMenu(), this.btnLogin, this.btnMenu], this.parentNode);    
    const handler = (isLogged) ? this.logout.bind(this) : this.showLoginForm.bind(this);
    this.btnLogin.addEventListener('click', handler);
    this.showMenu();
  }
  
  showMenu() {
    setTimeout(() => {
      this.sideMenu = new CommandMenu(this.btnMenu, 'Main Menu');
    }, 0);
  }
  
  showLoginForm() {
    this.auth = new Auth(true);
  }
  
  deleteLoginForm() {
    this.auth = null;
    console.log('delete');
  }
  
  logout() {
//    localStorage.removeItem(Constants.userItemLocalStorage);
    this.btnLogin.removeEventListener('click', this.logout.bind(this));
    this.btnLogin.addEventListener('click', this.showLoginForm.bind(this));
    this.btnLogin.innerText = 'Login';
  }

  setLogged() {
    this.btnLogin.addEventListener('click', this.logout.bind(this));
    this.btnLogin.removeEventListener('click', this.showLoginForm.bind(this));
    this.btnLogin.innerText = 'Logout';
  }
}

export default Header;
