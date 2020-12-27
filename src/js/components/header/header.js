import './header.scss';
import * as Constants from '../../data/constants';

class Header {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const header = document.createElement('header');
    header.innerHTML = `<h1>${Constants.APP_NAME}</h1>`;
    this.parentNode.appendChild(header);
  }
}

export default Header;
