import PopMenu from '../popular-menu/popular-menu';
import './popular.css'

const faviconUrl = "https://www.google.com/s2/favicons?domain=";

export const fullPopularLinks = [
  {
    title: "Wikipedia",
    url: "https://ru.wikipedia.org/",
    favicon: `${faviconUrl}https://ru.wikipedia.org/`,
  },
  {
    title: "YouTube",
    url: "https://www.youtube.com/",
    favicon: `${faviconUrl}https://www.youtube.com/`,
    // favicon: `./img/www_youtube_com.ico`,
  },
  {
    title: "Одноклассники",
    url: "https://ok.ru/",
    favicon: `${faviconUrl}https://ok.ru/`,
  },
  {
    title: "ВКонтакте",
    url: "https://vk.com/",
    favicon: `${faviconUrl}https://vk.com/`,
  },
  {
    title: "Linkedin",
    url: "https://www.linkedin.com/",
    favicon: `${faviconUrl}https://www.linkedin.com/`,
  },
];

let popularLinks = [];

const getPopularLinks = () => {
  const localPopularLinks = JSON.parse(localStorage.getItem("popularLinks"));

  if (localPopularLinks) {
    popularLinks = localPopularLinks;
  } else {
    popularLinks=fullPopularLinks.slice(0, 4);
    localStorage.setItem("popularLinks", JSON.stringify(popularLinks));
  }
  console.log(popularLinks);
  return popularLinks;
};
getPopularLinks();



class Popular {
  constructor(parentNode, privateClass) {
    this.parentNode = parentNode;
    this.privateClass = privateClass;
    this.render();
  }

  clearLinks() {
    const links = document.querySelectorAll(`.websites`);
    links.forEach((link) => link.parentElement.removeChild(link));
  };

  fillContentBlock() {
    this.clearLinks()
    const localPopularLinks = getPopularLinks();
    console.log(localPopularLinks)

    const content = document.querySelector(`.popular-content`);
    console.log(content)


    localPopularLinks.forEach((web) => {
      console.log(web)
      const website = document.createElement("div");
      website.classList.add("websites");

      website.innerHTML = `
        
        <a class="website-link" title="${web.title}" href="${web.url}" target="_blank">
          <img class="website-img" src="${web.favicon}" alt="website">  
          <span>${web.title}</span>
        </a>
      `;
      content.appendChild(website);
    });

    // setNewsTitle(rssNews.feed.title);
    // setNumberPage(this.numberLink + 1, amountLinks);
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="${this.privateClass} popular-header">
      <h3>Popular links</h3>
      <div class="dot-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class="${this.privateClass} popular-content"> </div>
    `;
    this.fillContentBlock.bind(this)();
    // this.fillContentBlock();
    this.btnMenu = this.parentNode.querySelector(".dot-menu");
    this.popMenu = new PopMenu(this.btnMenu, "Popular links manager");
  }
}

export default Popular;
