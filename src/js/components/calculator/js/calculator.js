import { expressionCalculator, opPriorities } from './expression-calculator';
import '../css/normalize.css';
import '../css/fonts.css';
import '../css/style.css';

export class Calculator {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
    this.result = 0;
    this.resultElem = document.querySelector('[data-result]');
    this.expression = '';
    this.expressionElem = document.querySelector('[data-expression]');
    this.addEventListeners();
  }

  handleBackspace() {
    const len = this.expression.length;
    this.expression = this.expression.substr(0, len - 1);
    this.expressionElem.innerHTML = this.fixExpression(this.expression);
  }

  handleClearAll() {
    this.result = 0;
    this.expression = '';
    this.expressionElem.innerText = this.expression;
    this.resultElem.innerText = this.result;
  }

  handlePlusMinus() {
    const length = this.expression.length;
    const str = this.expression;
    this.expression =
      str[length - 1] === '!' ? str.substr(0, length - 1) : str + '!';
    this.expressionElem.innerHTML = this.fixExpression(this.expression);
  }

  handleEqual() {
    const isOp = opPriorities[this.expression[0]] ? true : false;
    if (isOp) {
      if (!isNaN(this.result)) {
        this.result = expressionCalculator(this.result + this.expression);
      }
    } else {
      this.result = expressionCalculator(this.expression);
    }
    this.resultElem.innerText = isNaN(this.result) ? 'Error' : this.result;
    this.expression = '';
    this.expressionElem.innerText = '';
  }

  fixExpression(expr) {
    expr = expr.replaceAll('r', '&radic;');
    expr = expr.replaceAll('-', '&mdash;');
    expr = expr.replaceAll('!', '&hyphen;');
    return expr;
  }

  addEventListeners() {
    const btns = document.querySelectorAll('[data-code]');
    btns.forEach((elem) => {
      elem.addEventListener('click', (evt) => {
        const code = evt.target.dataset.code;
        this.expression += code;
        this.expressionElem.innerHTML = this.fixExpression(this.expression);
      });
    });

    const backspaceButton = document.querySelector('[data-backspace]');
    backspaceButton.addEventListener('click', () => this.handleBackspace());

    const clearallButton = document.querySelector('[data-all-clear]');
    clearallButton.addEventListener('click', () => this.handleClearAll());

    const plusminusButton = document.querySelector('[data-plus-minus]');
    plusminusButton.addEventListener('click', () => this.handlePlusMinus());

    const equalsButton = document.querySelector('[data-equals]');
    equalsButton.addEventListener('click', () => this.handleEqual());
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="calculator">
      <div class="calculator-grid">
        <div class="output">          
          <div class="result"><p data-result>0</p></div>
          <div class="expression"><p data-expression></p></div>
        </div>
        <button type="button" data-code="r">&Sqrt;</button>
        <button type="button" data-code="%">%</button>      
        <button type="button" data-backspace>&longleftarrow;</button>
        <button type="button" data-all-clear>C</button>

        <button type="button" data-code="^">^</sup></button>
        <button type="button" data-code="(">&lpar;</button>
        <button type="button" data-code=")">&rpar;</button>
        <button type="button" data-code="/">&sol;</button>      
        
        <button type="button" data-code="1">1</button>
        <button type="button" data-code="2">2</button>
        <button type="button" data-code="3">3</button>
        <button type="button" data-code="*">&ast;</button>
        
        <button type="button" data-code="4">4</button>
        <button type="button" data-code="5">5</button>
        <button type="button" data-code="6">6</button>
        <button type="button" data-code="+">&plus;</button>
        
        <button type="button" data-code="7">7</button>
        <button type="button" data-code="8">8</button>
        <button type="button" data-code="9">9</button>
        <button type="button" data-code="-">&minus;</button>
        
        <button type="button" data-code=".">&period;</button>
        <button type="button" data-code="0">0</button>
        <button type="button" data-plus-minus>&plusmn;</button>      
        <button type="button" data-equals >&equals;</button>
      </div>
    </div>
    `;
  }
}
