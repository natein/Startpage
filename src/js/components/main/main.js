import './main.scss';
import Finance from '../finance/finance';

class Main {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const main = document.createElement('main');
    this.parentNode.appendChild(main);
    const financeContainer = document.createElement('div');
    financeContainer.classList.add('block');
    main.appendChild(financeContainer);
    this.fin = new Finance(financeContainer);
  }
}

export default Main;
