import "./rss.css";

const jsonApi = "https://api.rss2json.com/v1/api.json?rss_url=";
const url = "https://www.euroline.by/politics/rss.xml";

const getRss = async (url) => {
  const request = await fetch(`${jsonApi}${url}`);
  const data = await request.json();
  console.log(data);
};

class Rss {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const caption = document.createElement("h3");
    caption.textContent = "News";
    this.parentNode.appendChild(caption);
  }
}

export default Rss;

// const feedURL = "https://www.euroline.by/politics/rss.xml";

// async function getRSS() {
//   const request = await fetch(
//     "https://api.rss2json.com/v1/api.json?rss_url=" + feedURL
//   );
//   const data = await request.json();
//   console.log(data);
//   const itemsContainer = document.createElement("DIV");

//   for (let i = 0, t = data.items.length; i < t; ++i) {
//     const item = data.items[i];
//     const itemContainer = document.createElement("DIV");

//     const itemTitleElement = document.createElement("H2");
//     const itemLinkElement = document.createElement("A");
//     const itemDescriptionElement = document.createElement("P");

//     itemLinkElement.setAttribute("href", item.link);
//     itemLinkElement.innerText = item.title;
//     itemTitleElement.appendChild(itemLinkElement);

//     // note : make sure the content is XSS safe before using innerHTML
//     itemDescriptionElement.innerHTML = item.description;

//     itemContainer.appendChild(itemTitleElement);
//     itemContainer.appendChild(itemDescriptionElement);

//     itemsContainer.appendChild(itemContainer);
//   }

//   const titleElement = document.createElement("H1");
//   titleElement.innerText = data.feed.title;

//   content.appendChild(titleElement);
//   content.appendChild(itemsContainer);
// }
// getRSS();
