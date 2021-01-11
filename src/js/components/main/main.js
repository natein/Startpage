import "./main.css";
import Finance from "../finance/finance";
import Rss from "../rss-news/rss";
import RssMenu from "../rss-menu/rss-menu";

class Main {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const main = document.createElement("main");
    this.parentNode.appendChild(main);
    const financeContainer = document.createElement("div");
    financeContainer.classList.add("block", "finance");
    main.appendChild(financeContainer);
    this.fin = new Finance(financeContainer);

    const rssNewsContainer = document.createElement("div");
    rssNewsContainer.classList.add("block", "rss");
    main.appendChild(rssNewsContainer);
    this.rss = new Rss(rssNewsContainer);

    this.btnMenu = document.querySelector(".rss-menu");
    this.rssMenu = new RssMenu(this.btnMenu, "Bookmark manager");
  }
}

export default Main;
