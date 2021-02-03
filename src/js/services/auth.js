import * as Constants from '../data/constants';

const { backend, userItemLocalStorage } = Constants;

// Регистрация пользователя
// Если задать уже имеющийся email или username, возвращает
// statusCode: 400, reason: "User username is already registered"

export function isLogged() {
  const token = localStorage.getItem(userItemLocalStorage);
  return !!(token);
}

export async function registerUser(username, email = '', password) {
  const rawResponse = await fetch(`${backend}/auth/register`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {statusCode: code, token: "uuid"}
  }

  const errorText = await rawResponse.text();
  throw new Error(errorText);
}

// Логин
// Если задать неправильный password или username, возвращает
// statusCode: 403, reason: "Invalid username or password"

export async function loginUser(username, password) {
  const rawResponse = await fetch(`${backend}/auth/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (rawResponse.ok) {
    const content = await rawResponse.json();
    return content; // {statusCode: code, token: "uuid"}
  }

  const errorText = await rawResponse.text();
  throw new Error(errorText);
}
