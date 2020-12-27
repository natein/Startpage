import './finance.scss';

class Finance {
  constructor(parentNode) {
    // parentNode - это обычный div, в который вставляешь свои элементы
    this.parentNode = parentNode;
    this.render();
  }

  render() {
    const caption = document.createElement('h3');
    caption.textContent = 'Finance';
    this.parentNode.appendChild(caption);
  }
}

export default Finance;
