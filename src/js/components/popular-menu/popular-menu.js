import "./popular-menu.css";
// import { fullPopularLinks } from "../../data/constants";
import Menu from "../base-menu/baseMenu";
import Popular from "../popular-links/popular";

class PopMenu extends Menu {
  constructor(clickedElement, caption, privateClass) {
    super(clickedElement, caption);
    this.renderContent();
    this.privateClass = privateClass;
  }

  findActiveWebsite(title) {
    const localPopularLinks = JSON.parse(localStorage.getItem("popularLinks"));
    const activeLinks = localPopularLinks.some(
      (website) => website.title === title
    );

    let check = "";
    if (activeLinks) check = "checked";

    return check;
  }

  changeWebsiteArray(activeService, serviceClickedCheckbox) {
    const localUrlArray = JSON.parse(localStorage.getItem("popularLinks"));
    const fullLocalLinks = JSON.parse(localStorage.getItem("fullPopularLinks"));

    if (activeService) {
      const index = localUrlArray.findIndex(
        (service) => service.title === serviceClickedCheckbox
      );
      localUrlArray.splice(index, 1);
    } else {
      const necessaryService = fullLocalLinks.find(
        (service) => service.title === serviceClickedCheckbox
      );
      localUrlArray.push(necessaryService);
    }

    localStorage.setItem("popularLinks", JSON.stringify(localUrlArray));
  }

  clearMenuContent() {
    const websites = document.querySelectorAll(`.website`);
    websites.forEach((link) => link.parentElement.removeChild(link));
  }

  fillMenuContent() {
    this.clearMenuContent();
    const menuContent = document.querySelector(".menu-content.Popu");
    const fragment = document.createDocumentFragment();

    const fullLocalLinks = JSON.parse(localStorage.getItem("fullPopularLinks"));

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
    form.classList.add(".form");
    form.innerHTML = `
    <div class="name">
      <label class="name-label" for="name">Fill name</label>
      <input type="text" class="name-input" id="name">
    </div>
    <div class="url">
      <label class="url-label" for="url">Fill url</label>
      <input type="text" class="url-input" id="url">
    </div>
    <button class="submit">Submit</button>
    `;

    menuContent.appendChild(form);
  }

  createObjForSet() {
    const nameWebsite = document.querySelector(".name-input");
    const urlWebsite = document.querySelector(".url-input");

    let title = nameWebsite.value;
    let url = urlWebsite.value;

    const faviconUrl = "https://www.google.com/s2/favicons?domain=";

    const obj = {
      title: title,
      url: url,
      favicon: `${faviconUrl}${url}`,
    };
    // console.log(title);
    // console.log(url);
    // console.log(obj);
    // title = "";
    // url = "";
    return obj;
  }

  setObjData() {
    const data = this.createObjForSet();
    const fullLocalLinks = JSON.parse(localStorage.getItem("fullPopularLinks"));
    fullLocalLinks.push(data);
    localStorage.setItem("fullPopularLinks", JSON.stringify(fullLocalLinks));
  }

  addListenerToBtn() {
    const btnSub = document.querySelector(".submit");
    btnSub.addEventListener("click", () => {
      this.createObjForSet.bind(this)();
      this.setObjData.bind(this)();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
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
  }
}

export default PopMenu;
