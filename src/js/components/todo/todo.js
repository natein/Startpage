import './todo.css';
// import style from 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';

const tasks = {
  started: ['My first task', 'My second task'],
  completed: ['first task', 'second task']
}

class ToDo {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  fillToDoBlock() {
    const startBlock = this.parentNode.querySelector('.started')
    const startedTask = document.createElement('div');
    startedTask.classList.add('start-task', 'task');
    startedTask.textContent = 'Tasks'
    startBlock.appendChild(startedTask);

  }
  

  render() {
    this.parentNode.innerHTML = `
    <h3>To Do</h3>
    <div class='todo-content'>
      <div class="add-item">
        <input type="text" id="input-task" name="input-task" placeholder="New task">
        <button class="add-task"><i class="fa fa-plus" aria-hidden="true"></i></button>
      </div>
      <div class="started"></div>
      <div class="completed"></div>
    </div>
    `;
    this.fillToDoBlock();
    // this.addListeners();
  }
}

export default ToDo;
