import './travel-menu.css';
import { fullTravelLinks, faviconUrl } from '../../data/constants';
import Menu from '../base-menu/baseMenu';
import Travel from '../travel/travel';
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
  const localTravelLinks = JSON.parse(localStorage.getItem('fullTravelLinks'));

  if (localTravelLinks) {
    fullLinks = localTravelLinks;
  } else {
    fullLinks = fullTravelLinks;
    localStorage.setItem('fullTravelLinks', JSON.stringify(fullTravelLinks));
  }
  return fullLinks;
};

const getTravelLinks = () => {
  let travelLinks = [];

  const localTravelLinks = JSON.parse(localStorage.getItem('travelLinks'));

  if (localTravelLinks) {
    travelLinks = localTravelLinks;
  } else {
    travelLinks = fullTravelLinks.slice(0, 6);
    localStorage.setItem('travelLinks', JSON.stringify(travelLinks));
  }
  return travelLinks;
};

class TravelMenu extends Menu {
  constructor(clickedElement, caption, privateClass) {
    super(clickedElement, caption);
    this.renderContent();
    this.privateClass = privateClass;
  }

  findActiveWebsite(title) {
    const localTravelLinks = getTravelLinks();
    const activeLinks = localTravelLinks.some(
      (website) => website.title === title
    );

    let check = '';
    if (activeLinks) check = 'checked';

    return check;
  }

  changeWebsiteArray(activeService, serviceClickedCheckbox) {
    const localTravelLinks = getTravelLinks();
    const fullLocalLinks = getFullLinks();

    if (activeService) {
      const index = localTravelLinks.findIndex(
        (service) => service.title === serviceClickedCheckbox
      );
      localTravelLinks.splice(index, 1);
    } else {
      const necessaryService = fullLocalLinks.find(
        (service) => service.title === serviceClickedCheckbox
      );
      localTravelLinks.push(necessaryService);
    }

    localStorage.setItem('travelLinks', JSON.stringify(localTravelLinks));
  }

  clearMenuContent() {
    const websites = document.querySelectorAll(`.website.travel`);
    websites.forEach((link) => link.parentElement.removeChild(link));

    const nameWebsite = document.querySelector('.name-input.travel');
    const urlWebsite = document.querySelector('.url-input.travel');

    if (nameWebsite) nameWebsite.value = '';
    if (urlWebsite) urlWebsite.value = '';
  }

  fillMenuContent() {
    this.clearMenuContent();

    const menuContent = document.querySelector('.menu-content.Trav');
    const fragment = document.createDocumentFragment();
    const fullLocalLinks = getFullLinks();

    fullLocalLinks.forEach((website) => {
      const check = this.findActiveWebsite(website.title);
      const web = document.createElement('div');
      web.classList.add('website', 'travel');

      web.innerHTML = `
      <input class="input-travel" type="checkbox" data-travel="${website.title}" id="${website.title}" name="${website.title}" ${check}>
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
    const menuContent = document.querySelector('.menu-content.Trav');
    const form = document.createElement('div');
    form.classList.add('form');
    form.innerHTML = `
    <div class="name">
      <label class="name-label" for="name-travel">Add your private links</label>
      <input type="text" class="name-input travel" id="name-travel" placeholder="Enter source name">
      <input type="url" class="url-input travel" id="url" placeholder="Enter url">
    </div>
    <div class="url">
    </div>
    <div class="btn-block">
      <button class="delete travel">Delete private links</button>
      <button class="submit travel">Submit</button>
    </div>
    <div class="danger-block">
      <button class="danger travel">Delete block Travels</button>
    </div>
    `;

    menuContent.appendChild(form);
  }

  createObjForSet() {
    const nameWebsite = document.querySelector('.name-input.travel');
    const urlWebsite = document.querySelector('.url-input.travel');
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
        localStorage.getItem('fullTravelLinks')
      );
      fullLocalLinks.push(data);
      localStorage.setItem('fullTravelLinks', JSON.stringify(fullLocalLinks));
    }
  }

  cleanLocalLinks() {
    localStorage.removeItem('fullTravelLinks');
    localStorage.removeItem('travelLinks');
    Travel.prototype.fillContentBlock(this.privateClass, 'travelLinks');
  }

  changeLinks(e) {
    const websiteClickedCheckbox = e.target.dataset.travel;
    const activeWebsite = this.findActiveWebsite(websiteClickedCheckbox);
    this.changeWebsiteArray(activeWebsite, websiteClickedCheckbox);

    Travel.prototype.fillContentBlock(this.privateClass, 'travelLinks');
  }

  addListenerToBtn() {
    const btnSub = document.querySelector(`.submit.travel`);
    btnSub.addEventListener('click', () => {
      this.createObjForSet.bind(this)();
      this.setObjData.bind(this)();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  addListenerToDelBtn() {
    const btnDel = document.querySelector(`.delete.travel`);
    btnDel.addEventListener('click', () => {
      this.cleanLocalLinks();
      this.fillMenuContent.bind(this)();
      this.addListenerToLabel.bind(this)();
    });
  }

  addListenerToLabel() {
    const labels = this.parentNode.querySelectorAll(`.input-travel`);
    labels.forEach((label) =>
      label.addEventListener('click', this.changeLinks.bind(this))
    );
  }

  addDangerBtnListener() {
    const dangerBtn = this.parentNode.querySelector('.danger.travel');

    dangerBtn.addEventListener('click', () => {
      const mainMenuBtn = this.parentNode.querySelector('[data-btn="travel"]');
      const btnDel = document.querySelector('.delete.travel');

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

export default TravelMenu;
