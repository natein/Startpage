// import "./google-menu.css";
import { fullGoogleLinks, faviconUrl } from '../../data/constants';
import Menu from '../base-menu/baseMenu';
import Google from '../google/google';
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
  const localGoogleLinks = JSON.parse(localStorage.getItem('fullGoogleLinks'));

  if (localGoogleLinks) {
    fullLinks = localGoogleLinks;
  } else {
    fullLinks = fullGoogleLinks;
    localStorage.setItem('fullGoogleLinks', JSON.stringify(fullGoogleLinks));
  }
  return fullLinks;
};

const getGoogleLinks = () => {
  let googleLinks = [];

  const localGoogleLinks = JSON.parse(localStorage.getItem('googleLinks'));

  if (localGoogleLinks) {
    googleLinks = localGoogleLinks;
  } else {
    googleLinks = fullGoogleLinks.slice(0, 7);
    localStorage.setItem('googleLinks', JSON.stringify(googleLinks));
  }
  return googleLinks;
};

class GoogleMenu extends Menu {
  constructor(clickedElement, caption, privateClass) {
    super(clickedElement, caption);
    this.renderContent();
    this.privateClass = privateClass;
  }

  findActiveWebsite(title) {
    const localGoogleLinks = getGoogleLinks();
    const activeLinks = localGoogleLinks.some(
      (website) => website.title === title
    );

    let check = '';
    if (activeLinks) check = 'checked';

    return check;
  }

  changeWebsiteArray(activeService, serviceClickedCheckbox) {
    const localGoogleLinks = getGoogleLinks();
    const fullLocalLinks = getFullLinks();

    if (activeService) {
      const index = localGoogleLinks.findIndex(
        (service) => service.title === serviceClickedCheckbox
      );
      localGoogleLinks.splice(index, 1);
    } else {
      const necessaryService = fullLocalLinks.find(
        (service) => service.title === serviceClickedCheckbox
      );
      localGoogleLinks.push(necessaryService);
    }

    localStorage.setItem('googleLinks', JSON.stringify(localGoogleLinks));
  }

  clearMenuContent() {
    const websites = document.querySelectorAll(`.website.google`);
    websites.forEach((link) => link.parentElement.removeChild(link));

    const nameWebsite = document.querySelector('.name-input.google');
    const urlWebsite = document.querySelector('.url-input.google');

    if (nameWebsite) nameWebsite.value = '';
    if (urlWebsite) urlWebsite.value = '';
  }

  fillMenuContent() {
    this.clearMenuContent();

    const menuContent = document.querySelector('.menu-content.Goog');
    const fragment = document.createDocumentFragment();
    const fullLocalLinks = getFullLinks();

    fullLocalLinks.forEach((website) => {
      const check = this.findActiveWebsite(website.title);
      const web = document.createElement('div');
      web.classList.add('website', 'google');

      web.innerHTML = `
      <input class="input-google" type="checkbox" data-google="${website.title}" id="${website.title}" name="${website.title}" ${check}>
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
    const menuContent = document.querySelector('.menu-content.Goog');
    const form = document.createElement('div');
    form.classList.add('form');
    form.innerHTML = `
    <div class="name">
      <label class="name-label" for="name-google">Add your private links</label>
      <input type="text" class="name-input google" id="name-google" placeholder="Enter source name">
      <input type="url" class="url-input google" id="url" placeholder="Enter url">
    </div>
    <div class="url">
    </div>
    <div class="btn-block">
      <button class="delete google">Delete private links</button>
      <button class="submit google">Submit</button>
    </div>
    <div class="danger-block">
      <button class="danger google">Delete block Google</button>
    </div>
    `;

    menuContent.appendChild(form);
  }

  createObjForSet() {
    const nameWebsite = document.querySelector('.name-input.google');
    const urlWebsite = document.querySelector('.url-input.google');
    const title = nameWebsite.value;
    const url = urlWebsite.value;

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
      const fullLocalLinks = JSON.parse(
        localStorage.getItem('fullGoogleLinks')
      );
      fullLocalLinks.push(data);
      localStorage.setItem('fullGoogleLinks', JSON.stringify(fullLocalLinks));
    }
  }

  cleanLocalLinks() {
    localStorage.removeItem('fullGoogleLinks');
    localStorage.removeItem('googleLinks');
    Google.prototype.fillContentBlock(this.privateClass, 'googleLinks');
  }

  changeLinks(e) {
    const websiteClickedCheckbox = e.target.dataset.google;
    const activeWebsite = this.findActiveWebsite(websiteClickedCheckbox);
    this.changeWebsiteArray(activeWebsite, websiteClickedCheckbox);

    Google.prototype.fillContentBlock(this.privateClass, 'googleLinks');
  }

  addListenerToBtn() {
    const btnSub = document.querySelector(`.submit.google`);
    btnSub.addEventListener('click', () => {
      this.createObjForSet.bind(this)();
      this.setObjData.bind(this)();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  addListenerToDelBtn() {
    const btnDel = document.querySelector(`.delete.google`);
    btnDel.addEventListener('click', () => {
      this.cleanLocalLinks();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(`.input-google`);
    labels.forEach((label) =>
      label.addEventListener('click', this.changeLinks.bind(this))
    );
  }

  addDangerBtnListener() {
    const dangerBtn = this.parentNode.querySelector('.danger.google');

    dangerBtn.addEventListener('click', () => {
      const mainMenuBtn = this.parentNode.querySelector('[data-btn="google"]');
      const btnDel = document.querySelector('.delete.google');

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

export default GoogleMenu;
