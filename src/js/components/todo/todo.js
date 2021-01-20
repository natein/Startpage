import './todo.css';
// import style from 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';

const tasks = {
  started: ['My first task', 'My second task'],
  completed: ['first task', 'second task'],
};


const getTasks=()=> {
  let allTasks = [];

  const localAllTasks = JSON.parse(localStorage.getItem('arrayDataName'));

  if (localAllTasks) {
    allTasks = localAllTasks;
  } else {
    allTasks = tasks;
    localStorage.setItem('arrayDataName', JSON.stringify(allTasks));
  }
  return allTasks;
}


class ToDo {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  fillActiveTaskBlock() {
    const startBlock = this.parentNode.querySelector('.started');
    tasks.started.forEach((task, index) => {
      const startedTask = document.createElement('div');
      startedTask.classList.add('active-task', 'task');
      startedTask.dataset.task = `task${index}`;
      startedTask.innerHTML = `
          <input type="checkbox" class="checkbox${index}">
          <input type="text" class="input-task" name="input-task" value="${task}">
          <button type="button" data-id="${index}" class="delete-task"><i data-id="${index}" class="fa fa-trash-o" aria-hidden="true"></i></button>
      `;
      startBlock.appendChild(startedTask);
    });
  }

  fillCompletedTaskBlock() {
    const startBlock = this.parentNode.querySelector('.completed');
    const title = document.createElement('div');
    title.classList.add('complete-title');


    tasks.completed.forEach((task, index) => {
      const startedTask = document.createElement('div');
      startedTask.classList.add('complete-task', 'task');
      startedTask.dataset.task = `task${index}${index}`;
      startedTask.innerHTML = `
          <input type="checkbox" checked class="checkbox${index}${index}">
          <input type="text" class="input-task new-task" name="input-task" value="${task}">
          <button type="button" data-id="${index}${index}" class="delete-task"><i data-id="${index}${index}" class="fa fa-trash-o" aria-hidden="true"></i></button>
      `;
      startBlock.appendChild(startedTask);
    });
  }

  addNewTask() {
    const input = this.parentNode.querySelector('.new-task');

  }

  delete(id) {
    const delBtn = this.parentNode.querySelector(`[data-task="task${id}"]`);
    delBtn.parentNode.removeChild(delBtn);
  }

  addDelListener() {
    const delBtn = this.parentNode.querySelectorAll('.delete-task');
    console.log(delBtn);
    delBtn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.delete.bind(this)(id);
      });
    });
  }

  render() {
    this.parentNode.innerHTML = `
    <h3>To Do</h3>
    <div class='todo-content'>
      <div class="add-item">
        <input type="text" class="input-task" name="input-task" placeholder="New task">
        <button class="add-task"><i class="fa fa-plus" aria-hidden="true"></i></button>
      </div>
      <div>Active:</div>
      <div class="started block-task"></div>
      <div>Completed:</div>
      <div class="completed block-task"></div>
    </div>
    `;
    this.fillActiveTaskBlock();
    this.fillCompletedTaskBlock();
    this.addDelListener();
  }
}

export default ToDo;
