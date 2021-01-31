import './rss.css';
import RssMenu from '../rss-menu/rss-menu';
import { getOptionItems } from '../options-menu/options-menu';

export const fullUrlArray = [
  {
    service: 'Lenta-ru',
    logo: 'https://lenta.ru/images/small_logo.png',
    links: [
      'https://lenta.ru/rss/news',
      'https://lenta.ru/rss/top7',
      'https://lenta.ru/rss/last24',
      'https://lenta.ru/rss/articles',
      'https://lenta.ru/rss/news/russia',
      'https://lenta.ru/rss/photo',
    ],
  },
  {
    service: 'Газета-Ru',
    logo: 'https://img.gazeta.ru/files3/677/4728677/gazeta_logo.jpg',
    links: [
      'https://www.gazeta.ru/export/rss/first.xml',
      'https://www.gazeta.ru/export/rss/lenta.xml',
      'https://www.gazeta.ru/export/rss/lastnews.xml',
      'https://www.gazeta.ru/export/rss/politics.xml',
      'https://www.gazeta.ru/export/rss/business.xml',
      'https://www.gazeta.ru/export/rss/social.xml',
    ],
  },
  {
    service: 'TUT-BY',
    logo: 'https://img.tyt.by/i/rss/news/logo.gif',
    links: [
      'https://news.tut.by/rss/index.rss',
      'https://news.tut.by/rss/economics.rss',
      'https://news.tut.by/rss/society.rss',
    ],
  },
  {
    service: 'Yahoo',
    logo: 'http://l.yimg.com/rz/d/yahoo_news_en-US_s_f_p_168x21_news.png',
    links: [
      'https://www.yahoo.com/news/rss',
      'https://finance.yahoo.com/news/rssindex',
    ],
  },
  {
    service: 'cnn',
    logo: 'http://i2.cdn.turner.com/cnn/2015/images/09/24/cnn.digital.png',
    links: [
      'http://rss.cnn.com/rss/edition.rss',
      'http://rss.cnn.com/rss/edition_world.rss',
    ],
  },
  {
    service: 'Un-org',
    logo:
      'https://news.un.org/en/sites/all/themes/bootstrap_un_news/images/un-emblem-for-rss.png',
    links: [
      'https://news.un.org/feed/subscribe/en/news/all/rss.xml',
      'https://news.un.org/feed/subscribe/en/news/topic/health/feed/rss.xml',
    ],
  },
  {
    service: 'bbc',
    logo: 'http://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif',
    links: [
      'http://feeds.bbci.co.uk/news/world/rss.xml',
      'http://feeds.bbci.co.uk/news/politics/rss.xml',
    ],
  },
];

let urlArray = [];

const getUrlArray = () => {
  const localUrlArray = JSON.parse(localStorage.getItem('urlArray'));

  if (localUrlArray) {
    urlArray = localUrlArray;
  } else {
    urlArray.push(fullUrlArray[0]);
    localStorage.setItem('urlArray', JSON.stringify(urlArray));
  }
  return urlArray;
};

const clearBookmarks = () => {
  const bookmarks = document.querySelectorAll('.logo-bookmark');
  bookmarks.forEach((bookmark) => bookmark.parentElement.removeChild(bookmark));
};

const setNewsTitle = (text) => {
  const title = document.querySelector('.title');
  title.textContent = text;
};

const setNumberPage = (currentNumber, amountNumbers) => {
  const currentPage = document.querySelector('.current-page');
  const amountPages = document.querySelector('.amount-pages');

  currentPage.textContent = currentNumber;
  amountPages.textContent = amountNumbers;
};

const showErrorApi = (text) => {
  const body = document.querySelector('body');
  const block = document.createElement('div');
  block.textContent = text;
  block.classList.add('error');

  body.appendChild(block);

  setTimeout(() => {
    const hiddenBlock = document.createElement('div');
    hiddenBlock.textContent = text;
    hiddenBlock.classList.add('hiddenBlock', 'hide');
    body.appendChild(hiddenBlock);
    block.parentElement.removeChild(block);
    setTimeout(() => {
      hiddenBlock.parentElement.removeChild(hiddenBlock);
    }, 500);
  }, 3000);
};

const jsonApi = 'https://api.rss2json.com/v1/api.json?rss_url=';
const apiKey = '&api_key=j0hwglpcodohzh4p4j8pdhejx1kdhkgtxmxgba6n';

const getRss = async (url = 'https://lenta.ru/rss/news') => {
  const request = await fetch(`${jsonApi}${url}${apiKey}`);
  const data = await request.json();
  const status = data.status === 'error';

  if (status) {
    showErrorApi('You are converting new feeds in a very short period');
    throw new Error("Api doesn't provides with information");
  }

  return data;
};

const clearContentBlock = () => {
  const topics = document.querySelectorAll('.topic');
  topics.forEach((topic) => topic.parentElement.removeChild(topic));
};

const getImage = (url) => {
  const optionFavicon = getOptionItems()[0];
  let img;
  if (optionFavicon.checked) {
    img = `<img class="topic-img" src="${
      url || 'https://www.clker.com/cliparts/s/N/X/c/y/n/info-arrow.svg'
    }" alt="topic">`;
  } else {
    img = '';
  }
  return img;
};

const getTargetBlank = () => {
  let targetBlank;
  const optionTarget = getOptionItems()[1];
  if (optionTarget.checked) {
    targetBlank = '_blank';
  } else {
    targetBlank = '';
  }
  return targetBlank;
};

class Rss {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.numberLink = 0;
    this.permissionAddListener = true;
    this.render();
  }

  fillNewsBookmarks() {
    clearBookmarks();
    const localUrlArray = getUrlArray();
    const bookmarksContainer = document.querySelector('.bookmarks');

    localUrlArray.forEach((service) => {
      const bookmark = document.createElement('img');
      bookmark.classList.add('logo-bookmark', `${service.service}`);
      bookmark.src = service.logo;
      bookmarksContainer.appendChild(bookmark);
      bookmark.addEventListener('click', () => {
        this.listenerBookmark(service);
      });
    });
  }

  listenerBookmark(service) {
    this.numberLink = 0;
    this.fillContentBlock(service);
    this.changePage(service);
  }

  async fillContentBlock(service, shift = 0) {
    this.numberLink += shift;

    if (!service) return;
    const amountLinks = service.links.length;
    if (this.numberLink < 0) this.numberLink = amountLinks - 1;
    if (this.numberLink >= amountLinks) this.numberLink = 0;

    const url = service.links[this.numberLink];
    const rssNews = await getRss(url);

    const content = document.querySelector('.content');

    clearContentBlock();

    rssNews.items.forEach((news) => {
      const correctTitle =
        news.description.includes('<img') === true ? '' : news.description;

      const topic = document.createElement('div');
      topic.classList.add('topic');
      topic.innerHTML = `
        ${getImage(news.enclosure.link)}
        <a class="topic-link" title="${correctTitle}" href="${
        news.link
      }" target="${getTargetBlank()}">${news.title}</a>
      `;
      content.appendChild(topic);
    });

    setNewsTitle(rssNews.feed.title);
    setNumberPage(this.numberLink + 1, amountLinks);
  }

  changePage(service) {
    const prevPage = document.querySelector('.prev-page');
    const nextPage = document.querySelector('.next-page');

    prevPage.onclick = () => {
      this.fillContentBlock(service, -1);
    };

    nextPage.onclick = () => {
      this.fillContentBlock(service, 1);
    };
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="rss-header">
      <h3>News</h3>
      <div class="rss-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
    <div class="bookmarks"> </div>
    <div class="title"> </div>
    <div class="content"> </div>
    <div class="number-pages">
      <span class="prev-page">&lt;</span>
      <span class="nav-page">
        <span class="current-page">1</span>
        <span>&frasl;</span>
        <span class="amount-pages">3</span>
      </span>
      <span class="next-page">&gt;</span>
    </div>
    `;
    this.fillNewsBookmarks.bind(this)();
    this.fillContentBlock(urlArray[0], 0);
    this.changePage(urlArray[0]);
    this.btnMenu = this.parentNode.querySelector('.rss-menu');
    this.rssMenu = new RssMenu(this.btnMenu, 'Bookmark manager');
  }
}

export default Rss;
