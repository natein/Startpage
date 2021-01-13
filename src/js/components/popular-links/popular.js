import PopMenu from "../popular-menu/popular-menu";
import "./popular.css";
import { fullPopularLinks } from "../../data/constants";

class Popular {
  constructor(obj) {
    this.parentNode = obj.parentNode;
    this.privateClass = obj.privateClass;
    this.caption = obj.caption;
    this.arrayDataName = obj.arrayDataName;
    this.render();
  }

  getPopularLinks(arrayDataName) {
    let popularLinks = [];

    const localPopularLinks = JSON.parse(localStorage.getItem(arrayDataName));

    if (localPopularLinks) {
      popularLinks = localPopularLinks;
    } else {
      popularLinks = fullPopularLinks.slice(0, 4);
      localStorage.setItem(arrayDataName, JSON.stringify(popularLinks));
    }
    return popularLinks;
  }

  clearLinks(myClass) {
    const links = document.querySelectorAll(`.websites.${myClass}`);
    links.forEach((link) => link.parentElement.removeChild(link));
  }

  fillContentBlock(
    myClass = this.privateClass,
    arrayDataName = this.arrayDataName
  ) {
    this.clearLinks(myClass);
    const localPopularLinks = this.getPopularLinks(arrayDataName || this.arrayDataName);
    const content = document.querySelector(`.${myClass}.popular-content`);
    localPopularLinks.forEach((web) => {
      const website = document.createElement("div");
      website.classList.add("websites", `${myClass}`);

      website.innerHTML = `        
        <a class="website-link" title="${web.title}" href="${web.url}" target="_blank">
          <img class="website-img" src="${web.favicon}" alt="website">  
          <span>${web.title}</span>
        </a>
      `;
      content.appendChild(website);
    });
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="${this.privateClass} popular-header">
      <h3>${this.caption}</h3>
      <div class="dot-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class="${this.privateClass} popular-content"> </div>
    `;
    this.fillContentBlock();
    this.btnMenu = this.parentNode.querySelector(".dot-menu");
    this.popMenu = new PopMenu(
      this.btnMenu,
      `${this.caption} manager`,
      this.privateClass
    );
  }
}

export default Popular;
