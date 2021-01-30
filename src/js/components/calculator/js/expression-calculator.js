export const opPriorities = {"+":1, "-":1, "/":2, "*":2, "r":3, "^":3};
let num_stack = [];
let op_stack = [];

export function expressionCalculator(expr) {
  let ret;
  try {
    if (checkBrackets(expr) == false) throw new Error('ExpressionError: Brackets must be paired');
    let parsedExpr = parseString(expr);
    let len = parsedExpr.length;

    for(let i = 0; i < len; i++) {
      if (typeof(parsedExpr[i]) == "number") num_stack.push(parsedExpr[i]);
      else if (parsedExpr[i] == "(") op_stack.push(parsedExpr[i]);
      else if (parsedExpr[i] == ")") {
        while(op_stack[op_stack.length - 1] != '(') doOperations();
        op_stack.pop();
      }
      else {
        while(true) {
          if(op_stack.length == 0 || op_stack[op_stack.length - 1] == '(' || opPriorities[parsedExpr[i]] > opPriorities[op_stack[op_stack.length - 1]]) {
            op_stack.push(parsedExpr[i]);
            break;
          }
          else doOperations();
        }
      }
    }
    while(op_stack.length != 0) doOperations();    
    ret = toFixed(num_stack.pop());
  }
  catch(err) {
    console.log(err.message);
    return NaN;
  }
  finally {
    num_stack = [];
    op_stack = [];
  }  
  return ret;
}

function checkBrackets(expr) {
  let open_brackets = 0;
  let closed_brackets = 0;
  let len = expr.length;
  for(let i = 0; i < len; i++) {
    if(expr[i] == '(') open_brackets++;
    else if(expr[i] == ')') closed_brackets++;
  }
  if(open_brackets == closed_brackets) return true;
  else return false;
}

function parseString(expr) {
  let arr = [];
  let len = expr.length;
  let number = '';
  for(let i = 0; i < len; i++) {
    let code = expr.charCodeAt(i);
    if(code >= 48 && code <=57 || code === '.'.charCodeAt() || code === '!'.charCodeAt()) number += expr[i];
    else {
      if(number != '') {
        number = number.replace('!','-');
        arr.push(parseFloat(number));
        number = '';
      }
      if(expr[i] != ' ') arr.push(expr[i]);
    }
  }
  if(number != '') {
    number = number.replace('!','-');
    arr.push(parseFloat(number));
  }
  return arr;
}

function doOperations() {  
  const cur_op = op_stack.pop();
   
  let val;
  if (cur_op === 'r') {
    const x = num_stack.pop();
    if(x < 0) {
      throw new Error("Square root from negative number");
    }    
    val = Math.sqrt(x);    
  } else {
    const y = num_stack.pop();
    const x = num_stack.pop();       
    val = calculateOperation(x, y, cur_op);    
  }
  num_stack.push(val);
}

function calculateOperation(arg1, arg2, op) {
  let res = 0;
  switch (op) {
  case '+':
    res = arg1 + arg2; break;
  case '-':
    res = arg1 - arg2; break;
  case '*':
    res = arg1 * arg2; break;
  case '/':
    if(arg2 == 0) {
      throw new Error("Division by zero");
    }
    res = arg1 / arg2; break;
  case '%':
    res = arg1 * arg2 / 100; break;
  case '^':
    res = Math.pow(arg1, arg2);
  }
  return res;
}

function toFixed(value) {
  var power = Math.pow(10, 14);
  return String(Math.round(value * power) / power);
}
