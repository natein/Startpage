import './auth.css';
import * as Constants from '../../data/constants';
import create from '../../utils/create';
import { validatePassword, validateEmail } from './validation';
import * as RemoteAuth from '../../services/auth';

export class Auth {
  constructor(register) {
    this.isLogin = register;
    this.modelContainer = create('div', 'modal-shadow');
    this.modal = create('div', 'auth');
    this.modelContainer.appendChild(this.modal);
    this.modelContainer.addEventListener('click', this.clickShadow.bind(this));
    document.body.appendChild(this.modelContainer);
    this.render();
    this.addListeners();
  }

  render() {
    const formCaption = (this.isLogin) ? 'Login' : 'Register';
    const emailInput = (this.isLogin) ? '' : `;
          <input
            id="auth-email"
            class="auth-form-input"
            name="login"
            type="email"
            placeholder="youremail@domain.com"
            required
          />`;
    const buttonLogin = (this.isLogin) ? 'Login' : 'Register';
    const buttonRegister = (this.isLogin) ? 'Register' : 'Login';
    const template = `
      <h1 class="auth-header">${formCaption}</h1>
      <span class="auth-description">Insert your e-mail and password.</span>
      <form class="auth-form" method="post">
        <div class="auth-inputs">
          <input
            id="auth-username"
            class="auth-form-input"
            name="username"
            type="text"
            placeholder="Username"
            required
          />      
          ${emailInput}
         <input
            id="auth-password"
            class="auth-form-input"
            name="password"
            type="password"
            placeholder="**************"
            autocomplete ="off"
            required
          />
         <span class="auth-form-error"></span>
        </div>
        <div class="auth-buttons">
          <button
              class="auth-button button-register"
              type="button"
          >
          ${buttonRegister}
          </button>
          <button class="auth-button button-log-in" 
            type="submit">${buttonLogin}</button>
        </div>
      </form>
    `;
    this.modal.innerHTML = template;
  }
  
  addListeners() {
    this.regBtn = document.querySelector('.button-register');
    this.loginBtn = document.querySelector('.button-log-in');
    if (this.isLogin) {
      this.regBtn.addEventListener('click', this.switchForm.bind(this));
      this.loginBtn.addEventListener('click', this.login.bind(this));
    } else {
      this.regBtn.addEventListener('click', this.switchForm.bind(this));
      this.loginBtn.addEventListener('click', this.register.bind(this));
      const password = document.querySelector('#auth-password');
      password.addEventListener('change', this.validatePassword.bind(this));
      const email = document.querySelector('#auth-email');
      email.addEventListener('change', this.validateEmail.bind(this));
    }    
  }

  register(evt) {
    evt.preventDefault();
    const username = document.querySelector('#auth-username');
    const email = document.querySelector('#auth-email');
    const password = document.querySelector('#auth-password');
    this.registerUser(username.value, email.value, password.value);
  }

  login(evt) {
    evt.preventDefault();
    const username = document.querySelector('#auth-username');
    const password = document.querySelector('#auth-password');
    this.loginUser(username.value, password.value);  
  }

  switchForm() {
    this.isLogin = !this.isLogin;
    this.modal.innerHTML = '';
    this.render();
    this.addListeners();
  }

  validatePassword(evt) {
    const mess = document.querySelector('.auth-form-error');
    if (!validatePassword(evt.target.value)) {
      mess.innerText = 'password must contain digits, uppercase and lovercase letters, special symbols';
    } else {
      mess.innerText ='';      
    }
  }

  validateEmail(evt) {
    const mess = document.querySelector('.auth-form-error');
    if (!validateEmail(evt.target.value)) {
      mess.innerText = 'incorrect email';
    } else {
      mess.innerText ='';      
    }
  }  

  clickShadow(evt) {
    if(evt.target === this.modelContainer) {
      this.closeModal();
    }      
  }
  
  closeModal() {
    document.body.removeChild(this.modelContainer);
    window.myapp.header.deleteLoginForm();    
  }  
  
  async registerUser(username, email, password) {
    try {
      const res = await RemoteAuth.registerUser(username, email, password);
      if (res.statusCode === 200) {
        localStorage.setItem(Constants.userItemLocalStorage, JSON.stringify(res.token));
        window.myapp.header.setLogged();
        this.closeModal();
      }
      if (res.statusCode === 400) {
        const mess = document.querySelector('.auth-form-error');
        mess.innerText = `${res.reason}`;
      }      
    } catch (err) {
      const mess = document.querySelector('.auth-form-error');
      mess.innerText = `${err.name}: ${err.message}`;
    }
  }  
  
  async loginUser(username, password) {
    try {
      const res = await RemoteAuth.loginUser(username, password);
      if (res.statusCode === 200) {
        localStorage.setItem(Constants.userItemLocalStorage, JSON.stringify(res.token));
        window.myapp.header.setLogged();
        this.closeModal();        
      }
      if (res.statusCode === 403) {
        const mess = document.querySelector('.auth-form-error');
        mess.innerText = `${res.reason}`;
      }
    } catch (err) {
      const mess = document.querySelector('.auth-form-error');
      mess.innerText = `${err.name}: ${err.message}`;
    }
  }
}

export default Auth;
