import "./baseMenu.css";

const open = () => {
  const overlay = document.querySelector(".overlay");
  const baseMenu = document.querySelector(".baseMenu");

  overlay.classList.add("open");
  baseMenu.classList.add("open");
};

const hide = () => {
  const overlay = document.querySelector(".overlay");
  const baseMenu = document.querySelector(".baseMenu");

  overlay.classList.remove("open");
  baseMenu.classList.remove("open");

  overlay.classList.add("hide");
  baseMenu.classList.add("hide");

  setTimeout(() => {
    overlay.classList.remove("hide");
    baseMenu.classList.remove("hide");
  }, 150);
};

class Menu {
  constructor(clickedElement) {
    this.parentNode = document.querySelector('body');
    this.clickedElement = clickedElement;
    this.render();
  }

  addListeners() {
    this.clickedElement.addEventListener("click", open);
    this.parentNode.addEventListener("click", this.callHide);
  }

  callHide(e) {
    const close = e.target.dataset.close;
    if (close) hide();
  }

  render() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.dataset.close = true;
    overlay.innerHTML = `
    <div class="baseMenu">
      <div class="header-block">
        <h3 class="header-caption">Menu Caption</h3>
        <div class="cross" data-close="true"></div>
      </div> 
      <div class="menu-content"></div>
     </div>
    `;
    this.parentNode.appendChild(overlay);
    this.addListeners();
  }
}

export default Menu;
