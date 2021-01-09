export function getPages() {
  const locStorage = localStorage.getItem("startpage_pages");
  return (locStorage) ? JSON.parse(locStorage) : null;
}

export function getCurrentPage() {
  const locStorage = localStorage.getItem("startpage_curPage");
  return (locStorage) ? JSON.parse(locStorage) : null;
}

export function setPages(obj) {
  localStorage.setItem("startpage_pages", JSON.stringify(obj));
}

export function setCurrentPage(idx) {
  localStorage.setItem("startpage_curPage", JSON.stringify(idx))
}

export function clearPages() {
  localStorage.removeItem("startpage_pages");
  localStorage.removeItem("startpage_curPage");
}
