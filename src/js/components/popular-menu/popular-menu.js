import "./popular-menu.css";
import { fullPopularLinks } from "../../data/constants";
import Menu from "../base-menu/baseMenu";
import Popular from "../popular-links/popular";

const getFullLinks = () => {
  let fullLinks = [];
  const localPopularLinks = JSON.parse(
    localStorage.getItem("fullPopularLinks")
  );

  if (localPopularLinks) {
    fullLinks = localPopularLinks;
  } else {
    fullLinks = fullPopularLinks;
    localStorage.setItem("fullPopularLinks", JSON.stringify(fullPopularLinks));
  }
  return fullLinks;
};

const getPopularLinks = () => {
  let popularLinks = [];

  const localPopularLinks = JSON.parse(localStorage.getItem("popularLinks"));

  if (localPopularLinks) {
    popularLinks = localPopularLinks;
  } else {
    popularLinks = fullPopularLinks.slice(0, 6);
    localStorage.setItem("popularLinks", JSON.stringify(popularLinks));
  }
  return popularLinks;
};

class PopMenu extends Menu {
  constructor(clickedElement, caption, privateClass) {
    super(clickedElement, caption);
    this.renderContent();
    this.privateClass = privateClass;
  }

  findActiveWebsite(title) {
    const localPopularLinks = getPopularLinks();
    const activeLinks = localPopularLinks.some(
      (website) => website.title === title
    );

    let check = "";
    if (activeLinks) check = "checked";

    return check;
  }

  changeWebsiteArray(activeService, serviceClickedCheckbox) {
    const localPopularLinks = getPopularLinks();
    const fullLocalLinks = getFullLinks();

    if (activeService) {
      const index = localPopularLinks.findIndex(
        (service) => service.title === serviceClickedCheckbox
      );
      localPopularLinks.splice(index, 1);
    } else {
      const necessaryService = fullLocalLinks.find(
        (service) => service.title === serviceClickedCheckbox
      );
      localPopularLinks.push(necessaryService);
    }

    localStorage.setItem("popularLinks", JSON.stringify(localPopularLinks));
  }

  clearMenuContent() {
    const websites = document.querySelectorAll(`.website`);
    websites.forEach((link) => link.parentElement.removeChild(link));

    const nameWebsite = document.querySelector(".name-input");
    const urlWebsite = document.querySelector(".url-input");

    if (nameWebsite) nameWebsite.value = "";
    if (urlWebsite) urlWebsite.value = "";
  }

  fillMenuContent() {
    this.clearMenuContent();

    const menuContent = document.querySelector(".menu-content.Popu");
    const fragment = document.createDocumentFragment();
    const fullLocalLinks = getFullLinks();

    fullLocalLinks.forEach((website) => {
      const check = this.findActiveWebsite(website.title);
      const web = document.createElement("div");
      web.classList.add("website");

      web.innerHTML = `
      <input class="input ${this.privateClass}" type="checkbox" data-website="${website.title}" id="${website.title}" name="${website.title}" ${check}>
      <label class="label" for="${website.title}">
        <img class="website-logo ${website.title}" src="${website.favicon}" alt="logo">
        <span>${website.title}</span>
      </label>
      `;
      fragment.appendChild(web);
    });
    menuContent.prepend(fragment);
  }

  createForm() {
    const menuContent = document.querySelector(".menu-content.Popu");

    const form = document.createElement("div");
    form.classList.add("form");
    form.innerHTML = `
    <div class="name">
      <label class="name-label" for="name">Add your private links</label>
      <input type="text" class="name-input" id="name" placeholder="Enter source name">
      <input type="url" class="url-input" id="url" placeholder="Enter url">
    </div>
    <div class="url">
    </div>
    <div class="btn-block">
      <button class="delete ${this.privateClass}">Delete private links</button>
      <button class="submit ${this.privateClass}">Submit</button>
    </div>
    `;

    menuContent.appendChild(form);
  }

  createObjForSet() {
    const nameWebsite = document.querySelector(".name-input");
    const urlWebsite = document.querySelector(".url-input");
    const title = nameWebsite.value;
    const url = urlWebsite.value;
    const faviconUrl = "https://www.google.com/s2/favicons?domain=";

    let obj;

    if (title && url) {
      obj = {
        title: title,
        url: url,
        favicon: `${faviconUrl}${url}`,
      };
    }
    return obj;
  }

  setObjData() {
    const data = this.createObjForSet();
    if (data) {
      const fullLocalLinks = JSON.parse(
        localStorage.getItem("fullPopularLinks")
      );
      fullLocalLinks.push(data);
      localStorage.setItem("fullPopularLinks", JSON.stringify(fullLocalLinks));
    }
  }

  addListenerToBtn() {
    const btnSub = document.querySelector(`.submit.${this.privateClass}`);
    btnSub.addEventListener("click", () => {
      this.createObjForSet.bind(this)();
      this.setObjData.bind(this)();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  cleanLocalLinks() {
    localStorage.removeItem("fullPopularLinks");
    localStorage.removeItem("popularLinks");
    Popular.prototype.fillContentBlock(this.privateClass, "popularLinks");
  }

  addListenerToDelBtn() {
    const btnDel = document.querySelector(`.delete.${this.privateClass}`);
    btnDel.addEventListener("click", () => {
      this.cleanLocalLinks();
      this.fillMenuContent.bind(this)();
    });
  }

  changeLinks(e) {
    const websiteClickedCheckbox = e.target.dataset.website;
    const activeWebsite = this.findActiveWebsite(websiteClickedCheckbox);

    this.changeWebsiteArray(activeWebsite, websiteClickedCheckbox);

    Popular.prototype.fillContentBlock(this.privateClass, "popularLinks");
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(
      `.input.${this.privateClass}`
    );
    labels.forEach((label) =>
      label.addEventListener("click", this.changeLinks.bind(this))
    );
  }

  renderContent() {
    this.fillMenuContent();
    this.createForm();
    this.addListenerToLabel();
    this.addListenerToBtn();
    this.addListenerToDelBtn();
  }
}

export default PopMenu;
