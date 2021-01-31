// import PopMenu from "../popular-menu/popular-menu";
import { fullShopsLinks } from "../../data/constants";
import ShopsMenu from "../shops-menu/shops-menu";
import "./shops.css";
import { getOptionItems } from "../options-menu/options-menu";

const getImage = (url) => {
  const optionFavicon = getOptionItems()[0];
  let img;
  if (optionFavicon.checked) {
    img = `<img class="website-img" src="${url}" alt = "website" >`
  } else {
    img = '';
  }
  return img;
}

const getTargetBlank = () => {
  let targetBlank;
  const optionTarget = getOptionItems()[1];
  if (optionTarget.checked) {
    targetBlank = '_blank'
  } else {
    targetBlank = ''
  }
  return targetBlank;
}
class Shops {
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
      popularLinks = fullShopsLinks.slice(0, 6);
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
    const localPopularLinks = this.getPopularLinks(
      arrayDataName || this.arrayDataName
    );
    const content = document.querySelector(`.${myClass}.popular-content`);
    localPopularLinks.forEach((web) => {
      const website = document.createElement("div");
      website.classList.add("websites", `${myClass}`);

      website.innerHTML = `        
        <a class="website-link" title="${web.title}" href="${web.url}" target="${getTargetBlank()}">
          ${getImage(web.favicon)}  
          <span class="website-title">${web.title}</span>
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
    this.popMenu = new ShopsMenu(
      this.btnMenu,
      `${this.caption} manager`,
      this.privateClass
    );
  }
}

export default Shops;
