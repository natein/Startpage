import "./main.css";
import Finance from "../finance/finance";
import Rss from "../rss-news/rss";
import Popular from "../popular-links/popular";
import Shops from "../shops/shops";

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
    // this.fin = new Finance(financeContainer);

    const rssNewsContainer = document.createElement("div");
    rssNewsContainer.classList.add("block", "rss");
    main.appendChild(rssNewsContainer);
    // this.rss = new Rss(rssNewsContainer);

    const popularContainer = document.createElement("div");
    popularContainer.classList.add("block", "popular");
    main.appendChild(popularContainer);
    this.popularContainer = new Popular({
      parentNode: popularContainer,
      privateClass: "popular",
      caption: "Popular links",
      arrayDataName: "popularLinks",
    });

    const shopsContainer = document.createElement("div");
    shopsContainer.classList.add("block", "shops");
    main.appendChild(shopsContainer);
    this.shopsContainer = new Shops({
      parentNode: shopsContainer,
      privateClass: "shops",
      caption: "Shops links",
      arrayDataName: "shopsLinks",
    });
  }
};

export default Main;
