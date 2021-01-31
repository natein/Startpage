import ServiceError from './service-error';
import * as Constants from '../data/constants';

const { backend } = Constants;

// Модуль получает данные страниц
// При невалидном token ответ
// 403 (Forbidden) Error: You are not authorized

export function getPages() {
  const locStorage = localStorage.getItem('startpage_pages');
  return (locStorage) ? JSON.parse(locStorage) : null;
}

export function getCurrentPage() {
  const locStorage = localStorage.getItem('startpage_curPage');
  return (locStorage) ? JSON.parse(locStorage) : null;
}

export function setPages(obj) {
  localStorage.setItem('startpage_pages', JSON.stringify(obj));
}

export function setCurrentPage(idx) {
  localStorage.setItem('startpage_curPage', JSON.stringify(idx));
}

export function clearPages() {
  localStorage.removeItem('startpage_pages');
  localStorage.removeItem('startpage_curPage');
}

// Получить список всех страниц

export async function getPagesList(token) {
  const rawResponse = await fetch(`${backend}/pages`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
    },
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // [{id: "uuid", userId: "uuid", name: "Page title", data: "{json}"}]
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}

// Получить страницу по идентификатору

export async function getPageById(id, token) {
  const rawResponse = await fetch(`${backend}/pages/${id}`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
    },
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {id: "uuid", userId: "uuid", name: "Page title", after: null, data: "{json}"}
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  if (rawResponse.status === 404) {
    throw new ServiceError('Page not found', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}

// Создать новую страницу
// name - наименование страницы
// data - данные блоков страницы

export async function createNewPage(name, after, data, token) {
  const rawResponse = await fetch(`${backend}/pages`, {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, after, data }),
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {id: "uuid", userId: "uuid", name: "Page title", after: null, data: "{json}"}
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}

// Удалить страницу по идентификатору

export async function deletePageById(id, token) {
  const rawResponse = await fetch(`${backend}/pages/${id}`, {
    method: 'DELETE',
    headers: {
      authorization: `${token}`,
    },
  });

  if (rawResponse.ok) {
    return true;
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  if (rawResponse.status === 404) {
    throw new ServiceError('Page not found', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw new ServiceError(errorText, rawResponse.status);
}

// Обновить страницу по идентификатору
// name - наименование страницы
// data - данные блоков страницы

export async function updatePagesById(id, name, after, data, token) {
  const rawResponse = await fetch(`${backend}/pages/${id}`, {
    method: 'PUT',
    headers: {
      authorization: `${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, after, data }),
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {id: "uuid", userId: "uuid", name: "Page title", after: null, data: "{json}"}
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  if (rawResponse.status === 404) {
    throw new ServiceError('Page not found', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}
