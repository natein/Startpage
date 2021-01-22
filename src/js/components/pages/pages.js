import './pages.css';
import * as Constants from '../../data/constants';
import * as PG from '../../services/pages';
import create from '../../utils/create';

class Pages {
  constructor() {
    this.pages = Constants.INITIAL_PAGE;
    this.curPage = 0;
    this.loadPages();
    const liElems = [];
    this.pages.forEach(elem => {
      liElems.push(this.createLiElem(elem.name));
    });

    this.list = create('ul', 'menu-pages', liElems);
    location.hash = encodeURI(this.pages[this.curPage].name);
    this.render();
  }
  
  createLiElem(name) {
    const li = create('li', 'page-elem', null, this.list);
    li.innerText = name;
    li.addEventListener('click', this.handleClick.bind(this));
    return li;
  }

  loadPages() {
    const pages = PG.getPages()    
    if (pages) this.pages = pages;
    const curPage = PG.getCurrentPage();
    if (curPage) this.curPage = curPage;
  }

  savePages() {
    PG.setPages(this.pages);
    PG.setCurrentPage(this.curPage);
  }

  clearData() {
    PG.clearPages();
  }

  getActivePage(idx) {
    return this.curPage;
  }

  setActivePage(name) {
    const menuItems = this.list.childNodes;
    menuItems.forEach((elem, idx) => {
      if(elem.innerText === name) {
        this.curPage = idx;
      }
    });
    this.render();
  }

  addPage(name, color = Constants.DEFAULT_COLOR) {
    this.pages.push({ name, color });
    this.curPage = this.pages.length - 1;
    const li = this.createLiElem(name);
    location.hash = encodeURI(name);
    this.render();
  }

  deletePage(name) {
    if (this.pages.length > 1) {
      let i;
      this.pages.forEach((elem, idx) => {
        if(elem.name === name) {
          i = idx;
        }
      });
      if(i === this.curPage) {
        this.curPage = 0;
      }
      this.pages = this.pages.splice(0, i).concat(this.pages.splice(i));
      const menuItems = this.list.childNodes;
      menuItems.forEach(elem => {
        if(elem.innerText === name) {
          elem.remove();
        }
      });      
      this.render();
    }
  }

  renamePage(oldName, newName) {
    this.pages.forEach((elem) => {
      if(elem.name === oldName) {
        elem.name = newName;
      }
    });
    const menuItems = this.list.childNodes;
    menuItems.forEach(elem => {
      if(elem.innerText === oldName) {
        elem.innerText = newName;
      }
    });
    location.replace(`#${newName}`);
  }

  getMenu() {
    return this.list;
  }

  handleClick(evt) {
    location.hash = encodeURI(evt.target.innerText);
  }

  render() {
    const menuItems = this.list.childNodes;
    menuItems.forEach((elem, idx) => {
      if(idx === this.curPage) elem.classList.add('active');
      else elem.classList.remove('active');
    });    
  }
}

export default Pages;
