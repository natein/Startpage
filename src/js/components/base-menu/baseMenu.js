import "./baseMenu.css";

class Menu {
  constructor(clickedElement, caption) {
    this.caption = caption;
    this.privetClass = caption.slice(0, 4);
    this.parentNode = document.querySelector("body");
    this.clickedElement = clickedElement;
    this.render();
  }

  open() {
    const overlay = document.querySelector(`.overlay.${this.privetClass}`);
    const baseMenu = document.querySelector(`.baseMenu.${this.privetClass}`);

    overlay.classList.add("open");
    baseMenu.classList.add("open");
  }

  hide() {
    const overlay = document.querySelector(`.overlay.${this.privetClass}`);
    const baseMenu = document.querySelector(`.baseMenu.${this.privetClass}`);

    overlay.classList.remove("open");
    baseMenu.classList.remove("open");

    overlay.classList.add("hide");
    baseMenu.classList.add("hide");

    setTimeout(() => {
      overlay.classList.remove("hide");
      baseMenu.classList.remove("hide");
    }, 150);
  }

  addListeners() {
    this.clickedElement.addEventListener("click", this.open.bind(this));
    this.parentNode.addEventListener("click", (e) => {
      this.hide.bind(this);
      if (e.target.dataset.close) this.hide();
    });
  }

  render() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay", `${this.privetClass}`);
    overlay.dataset.close = true;
    overlay.innerHTML = `
    <div class="baseMenu ${this.privetClass}">
      <div class="header-block ${this.privetClass}">
        <h3 class="header-caption ${this.privetClass}">${this.caption}</h3>
        <div class="cross" data-close="true"></div>
      </div> 
      <div class="menu-content ${this.privetClass}"></div>
     </div>
    `;
    this.parentNode.appendChild(overlay);
    this.addListeners();
  }
}

export default Menu;
