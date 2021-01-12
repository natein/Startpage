const faviconUrl = "https://www.google.com/s2/favicons?domain=";

const fullPopularLinks = [
  {
    title: "Wikipedia",
    url: "https://ru.wikipedia.org/",
    favicon: `${faviconUrl}https://ru.wikipedia.org/`,
  },
  {
    title: "YouTube",
    url: "https://www.youtube.com/",
    favicon: `${faviconUrl}https://www.youtube.com/`,
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
    popularLinks.push(fullPopularLinks.slice(0, 3));
    localStorage.setItem("popularLinks", JSON.stringify(popularLinks));
  }
  console.log(popularLinks.flat())
  return popularLinks.flat();
};
getPopularLinks()

class Popular {
  constructor(parentNode, privateClass) {
    this.parentNode = parentNode;
    this.privateClass = privateClass;
    this.render();
  }

  fillContentBlock(localPopularLinks) {
    // const localPopularLinks = getPopularLinks();
    console.log(localPopularLinks)

    const content = document.querySelector(`.${this.privateClass}-content`);

    localPopularLinks.forEach((web) => {
      console.log(web)
      const website = document.createElement("div");
      website.classList.add("website");

      website.innerHTML = `
        <img class="website-img" src="${web.favicon}" alt="website">
        <a class="website-link" title="${web.title}" href="${web.url}" target="_blank">${web.title}</a>
      `;
      content.appendChild(website);
    });

    // setNewsTitle(rssNews.feed.title);
    // setNumberPage(this.numberLink + 1, amountLinks);
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="${this.privateClass}-header">
      <h3>Popular links</h3>
      <div class="${this.privateClass}-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class="${this.privateClass}-content"> </div>
    `;
    this.fillContentBlock(fullPopularLinks.slice(0, 3));
    // this.btnMenu = this.parentNode.querySelector(".rss-menu");
    // this.rssMenu = new RssMenu(this.btnMenu, "Bookmark manager");
  }
}

export default Popular;
