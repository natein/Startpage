import '../css/fonts.css';
import '../css/style.css';

import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

class App {
  constructor() {
    this.header = new Header(document.body);
    this.main = new Main(document.body);
    this.footer = new Footer(document.body);
  }
}

window.onload = () => {
  window.myapp = new App();
};
