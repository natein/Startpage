// import "./popular-menu.css";
import Menu from "../base-menu/baseMenu";
import Popular, { fullPopularLinks } from "../popular-links/popular";
// import  { fullPopularLinks } from "../rss-news/rss";

const findActiveWebsite = (title) => {
  const localPopularLinks = JSON.parse(localStorage.getItem("popularLinks"));
  const activeLinks = localPopularLinks.some(
    (website) => website.title === title
  );

  let check = "";
  if (activeLinks) check = "checked";

  return check;
};

const fillMenuContent = () => {
  const menuContent = document.querySelector(".menu-content.Popu");
  const fragment = document.createDocumentFragment();

  fullPopularLinks.forEach((website) => {
    const check = findActiveWebsite(website.title);

    const web = document.createElement("div");
    web.classList.add("website");

    web.innerHTML = `
    <input class="input" type="checkbox" data-website="${website.title}" id="${website.title}" name="${website.title}" ${check}>
    <label class="label" for="${website.title}">
      <img class="website-logo ${website.title}" src="${website.favicon}" alt="logo">
      <span>${website.title}</span>
    </label>
    `;
    fragment.appendChild(web);
  });
  menuContent.appendChild(fragment);
};

const changeUrlArray = (activeService, serviceClickedCheckbox) => {
  const localUrlArray = JSON.parse(localStorage.getItem("popularLinks"));

  if (activeService) {
    const index = localUrlArray.findIndex(
      (service) => service.title === serviceClickedCheckbox
    );
    localUrlArray.splice(index, 1);
  } else {
    const necessaryService = fullPopularLinks.find(
      (service) => service.title === serviceClickedCheckbox
    );
    localUrlArray.push(necessaryService);
  }

  localStorage.setItem("popularLinks", JSON.stringify(localUrlArray));
};

const changeLinks = (e) => {
  const websiteClickedCheckbox = e.target.dataset.website;
  const activeWebsite = findActiveWebsite(websiteClickedCheckbox);

  changeUrlArray(activeWebsite, websiteClickedCheckbox);

  Popular.prototype.fillContentBlock();
};

class PopMenu extends Menu {
  constructor(clickedElement, caption) {
    super(clickedElement, caption);
    this.renderContent();
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(".input");
    labels.forEach((label) => label.addEventListener("click", changeLinks));
  }

  renderContent() {
    fillMenuContent();
    this.addListenerToLabel();
  }
}

export default PopMenu;
