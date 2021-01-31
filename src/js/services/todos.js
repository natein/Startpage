import ServiceError from './service-error';
import * as Constants from '../data/constants';

const { backend } = Constants;

// Модуль получает данные для списка ToDo
// При невалидном token ответ
// 403 (Forbidden) Error: You are not authorized

// Получить все задачи

export async function taskList(token) {
  const rawResponse = await fetch(`${backend}/todos`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
    },
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // [{id: "uuid", title: "Task title", complete: true, userId: "uuid"}]
  }

  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}

// Получить задачу по идентификатору

export async function taskById(id, token) {
  const rawResponse = await fetch(`${backend}/todos/${id}`, {
    method: 'GET',
    headers: {
      authorization: `${token}`,
    },
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {id: "uuid", title: "Task title", complete: true, userId: "uuid"}
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  if (rawResponse.status === 404) {
    throw new ServiceError('Task not found', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}

// Создать новую задачу
// title - наименование
// complete - состояние задачи.
// true - выполнено, false - не выполнено, null - не установлено

export async function createNewTask(title, complete, token) {
  const rawResponse = await fetch(`${backend}/todos`, {
    method: 'POST',
    headers: {
      authorization: `${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, complete }),
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {id: "uuid", title: "Task title", complete: true, userId: "uuid"}
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}

// Удалить задачу по идентификатору

export async function deleteTaskById(id, token) {
  const rawResponse = await fetch(`${backend}/todos/${id}`, {
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
    throw new ServiceError('Task not found', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw new ServiceError(errorText, rawResponse.status);
}

// Обновить задачу по идентификатору
// title - наименование
// complete - состояние задачи.
// true - выполнено, false - не выполнено, null - не установлено

export async function updateTaskById(id, title, complete, token) {
  const rawResponse = await fetch(`${backend}/todos/${id}`, {
    method: 'PUT',
    headers: {
      authorization: `${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, complete }),
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {id: "uuid", title: "Task title", complete: true, userId: "uuid"}]
  }
  if (rawResponse.status === 403) {
    throw new ServiceError('You are not authorized', rawResponse.status);
  }
  if (rawResponse.status === 404) {
    throw new ServiceError('Task not found', rawResponse.status);
  }
  const errorText = await rawResponse.text();
  throw Error(errorText);
}
