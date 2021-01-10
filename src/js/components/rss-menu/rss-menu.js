import "./rss-menu.css";
import Menu from "../base-menu/baseMenu";
import { fullUrlArray } from "../rss-news/rss";

const findActiveBookmark = (service) => {
  const localUrlArray = JSON.parse(localStorage.getItem("urlArray"));
  const activeBookmark = localUrlArray.some(
    (bookmark) => bookmark.service === service
  );

  let check = "";
  if (activeBookmark) check = "checked";

  return check;
};

class RssMenu extends Menu {
  constructor(clickedElement, caption, fullUrlArray) {
    super(clickedElement, caption);
    this.fullUrlArray = fullUrlArray;
    this.renderContent();
  }

  fillMenuContent() {
    const menuContent = document.querySelector(".menu-content");
    const fragment = document.createDocumentFragment();

    this.fullUrlArray.forEach((service) => {
      const check = findActiveBookmark(service.service);

      const bookmark = document.createElement("div");
      bookmark.classList.add("bookmark");

      bookmark.innerHTML = `
      <input class="input" type="checkbox" data-service="${service.service}" id="${service.service}" name="${service.service}" ${check}>
      <label class="label" for="${service.service}">
        <span>${service.service}</span>
        <img class="bookmark-logo ${service.service}" src="${service.logo}" alt="logo">
      </label>
      `;
      fragment.appendChild(bookmark);
    });
    menuContent.appendChild(fragment);
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(".input");

    labels.forEach((label) => (label.onclick = this.listener));

    console.log(labels);
  }

  listener(e) {
    const clickedCheckbox = e.target.dataset.service;
    const activeService = document.querySelector(`img.logo.${clickedCheckbox}`);

    const localUrlArray = JSON.parse(localStorage.getItem("urlArray"));

    console.log(e.target.dataset.service);
    console.log(activeService);

    if (activeService) {
      const index = localUrlArray.findIndex(
        (service) => service.service === clickedCheckbox
      );
      localUrlArray.splice(index, 1);
    } else {
      const necessaryService = fullUrlArray.find(
        (service) => service.service === clickedCheckbox
      );
      localUrlArray.push(necessaryService);
    }

    localStorage.setItem("urlArray", JSON.stringify(localUrlArray));

    console.log(localUrlArray);
  }

  renderContent() {
    this.fillMenuContent();
    this.addListenerToLabel();
  }
}

export default RssMenu;
