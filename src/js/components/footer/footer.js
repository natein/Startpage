import './footer.css';
import * as Constants from '../../data/constants';

class Footer {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const links = Constants.DEVELOPERS.map((elem) => `<a class="github-user" href=${elem.link}>${elem.user}</a>`);
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <img class="rsschool-logo" src="./img/rs_school.svg" alt="">
        <div class="github">
          <img class="github-logo" src="./icons/github.svg" alt="">
          ${links.join('<span>, </span>')}
        </div>
        <a href="${Constants.COURSE_LINK}">${Constants.COURSE_NAME}</a>`;
    this.parentNode.appendChild(footer);
  }
}

export default Footer;
