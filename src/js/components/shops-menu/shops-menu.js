import './shops-menu.css';
import { fullShopsLinks, faviconUrl } from '../../data/constants';
import Menu from '../base-menu/baseMenu';
import Shops from '../shops/shops';
import { getOptionItems } from '../options-menu/options-menu';

const getImage = (website) => {
  const optionFavicon = getOptionItems()[0];
  let img;
  if (optionFavicon.checked) {
    img = `<img class="website-logo ${website.title}" src="${website.favicon}" alt="logo">`;
  } else {
    img = '';
  }
  return img;
};

const getFullLinks = () => {
  let fullLinks = [];
  const localShopsLinks = JSON.parse(localStorage.getItem('fullShopsLinks'));

  if (localShopsLinks) {
    fullLinks = localShopsLinks;
  } else {
    fullLinks = fullShopsLinks;
    localStorage.setItem('fullShopsLinks', JSON.stringify(fullShopsLinks));
  }
  return fullLinks;
};

const getShopsLinks = () => {
  let shopsLinks = [];

  const localShopsLinks = JSON.parse(localStorage.getItem('shopsLinks'));

  if (localShopsLinks) {
    shopsLinks = localShopsLinks;
  } else {
    shopsLinks = fullShopsLinks.slice(0, 6);
    localStorage.setItem('shopsLinks', JSON.stringify(shopsLinks));
  }
  return shopsLinks;
};

class ShopsMenu extends Menu {
  constructor(clickedElement, caption, privateClass) {
    super(clickedElement, caption);
    this.renderContent();
    this.privateClass = privateClass;
  }

  findActiveWebsite(title) {
    const localShopsLinks = getShopsLinks();
    const activeLinks = localShopsLinks.some(
      (website) => website.title === title
    );

    let check = '';
    if (activeLinks) check = 'checked';

    return check;
  }

  changeWebsiteArray(activeService, serviceClickedCheckbox) {
    const localShopsLinks = getShopsLinks();
    const fullLocalLinks = getFullLinks();

    if (activeService) {
      const index = localShopsLinks.findIndex(
        (service) => service.title === serviceClickedCheckbox
      );
      localShopsLinks.splice(index, 1);
    } else {
      const necessaryService = fullLocalLinks.find(
        (service) => service.title === serviceClickedCheckbox
      );
      localShopsLinks.push(necessaryService);
    }

    localStorage.setItem('shopsLinks', JSON.stringify(localShopsLinks));
  }

  clearMenuContent() {
    const websites = document.querySelectorAll(`.website.shops`);
    websites.forEach((link) => link.parentElement.removeChild(link));

    const nameWebsite = document.querySelector('.name-input.shops');
    const urlWebsite = document.querySelector('.url-input.shops');

    if (nameWebsite) nameWebsite.value = '';
    if (urlWebsite) urlWebsite.value = '';
  }

  fillMenuContent() {
    this.clearMenuContent();

    const menuContent = document.querySelector('.menu-content.Shop');
    const fragment = document.createDocumentFragment();
    const fullLocalLinks = getFullLinks();

    fullLocalLinks.forEach((website) => {
      const check = this.findActiveWebsite(website.title);
      const web = document.createElement('div');
      web.classList.add('website', 'shops');

      web.innerHTML = `
      <input class="input-shops" type="checkbox" data-website="${website.title}" id="${website.title}" name="${website.title}" ${check}>
      <label class="label" for="${website.title}">
        ${getImage(website)}
        <span>${website.title}</span>
      </label>
      `;
      fragment.appendChild(web);
    });
    menuContent.prepend(fragment);
  }

  createForm() {
    const menuContent = document.querySelector('.menu-content.Shop');

    const form = document.createElement('div');
    form.classList.add('form');
    form.innerHTML = `
    <div class="name">
      <label class="name-label" for="name-shops">Add your private links</label>
      <input type="text" class="name-input shops" id="name-shops" placeholder="Enter source name">
      <input type="url" class="url-input shops" id="url" placeholder="Enter url">
    </div>
    <div class="url">
    </div>
    <div class="btn-block">
      <button class="delete shops">Delete private links</button>
      <button class="submit shops">Submit</button>
    </div>
    <div class="danger-block">
      <button class="danger shops">Delete block Shops</button>
    </div>
    `;

    menuContent.appendChild(form);
  }

  createObjForSet() {
    const nameWebsite = document.querySelector('.name-input.shops');
    const urlWebsite = document.querySelector('.url-input.shops');
    const title = nameWebsite.value;
    const url = urlWebsite.value;
    // const faviconUrl = "https://www.google.com/s2/favicons?domain=";

    let obj;

    if (title && url) {
      obj = {
        title,
        url,
        favicon: `${faviconUrl}${url}`,
      };
    }
    return obj;
  }

  setObjData() {
    const data = this.createObjForSet();
    if (data) {
      const fullLocalLinks = JSON.parse(localStorage.getItem('fullShopsLinks'));
      fullLocalLinks.push(data);
      localStorage.setItem('fullShopsLinks', JSON.stringify(fullLocalLinks));
    }
  }

  cleanLocalLinks() {
    localStorage.removeItem('fullShopsLinks');
    localStorage.removeItem('shopsLinks');
    Shops.prototype.fillContentBlock(this.privateClass, 'shopsLinks');
  }

  changeLinks(e) {
    const websiteClickedCheckbox = e.target.dataset.website;
    const activeWebsite = this.findActiveWebsite(websiteClickedCheckbox);

    this.changeWebsiteArray(activeWebsite, websiteClickedCheckbox);
    Shops.prototype.fillContentBlock(this.privateClass, 'shopsLinks');
  }

  addListenerToBtn() {
    const btnSub = document.querySelector(`.submit.shops`);
    btnSub.addEventListener('click', () => {
      this.createObjForSet.bind(this)();
      this.setObjData.bind(this)();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  addListenerToDelBtn() {
    const btnDel = document.querySelector(`.delete.shops`);
    btnDel.addEventListener('click', () => {
      this.cleanLocalLinks();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(`.input-shops`);
    labels.forEach((label) =>
      label.addEventListener('click', this.changeLinks.bind(this))
    );
  }

  addDangerBtnListener() {
    const dangerBtn = this.parentNode.querySelector('.danger.shops');

    dangerBtn.addEventListener('click', () => {
      const mainMenuBtn = this.parentNode.querySelector('[data-btn="shops"]');
      const btnDel = document.querySelector('.delete.shops');

      mainMenuBtn.click();
      btnDel.click();

      this.hide.bind(this)();
    });
  }

  renderContent() {
    this.fillMenuContent();
    this.createForm();
    this.addListenerToLabel();
    this.addListenerToBtn();
    this.addListenerToDelBtn();
    this.addDangerBtnListener();
  }
}

export default ShopsMenu;
