import './todo.css';
// import style from 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';

const tasks = {
  started: ['My first task', 'My second task'],
  completed: ['first task', 'second task'],
};

const getTasks = () => {
  let allTasks = {};

  const localTasks = JSON.parse(localStorage.getItem('todo'));

  if (localTasks) {
    allTasks = localTasks;
  } else {
    allTasks = { ...tasks };
    localStorage.setItem('todo', JSON.stringify(allTasks));
  }
  // console.log(allTasks);
  return allTasks;
};
// console.log(getTasks())

class ToDo {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.render();
  }

  fillActiveTaskBlock() {
    const localTasks = getTasks();
    const startBlock = this.parentNode.querySelector('.started');

    startBlock.innerHTML = '';

    localTasks.started.forEach((task, index) => {
      const startedTask = document.createElement('div');
      startedTask.classList.add('active-task', 'task');
      startedTask.dataset.task = `task${index}`;
      startedTask.innerHTML = `
          <input type="checkbox" data-id="${index}" class="checkbox-task checkbox${index}">
          <input type="text" data-id="${index}${index}" class="input-task input${index}" value="${task}">
          <button type="button" data-id="${index}" class="delete-task"><i data-id="${index}" class="fa fa-trash-o" aria-hidden="true"></i></button>
      `;
      startBlock.appendChild(startedTask);
      this.addDelBtnListener();
      this.addCheckListener();
    });
  }

  fillCompletedTaskBlock() {
    const localTasks = getTasks();
    const completeBlock = this.parentNode.querySelector('.completed');
    const title = document.createElement('div');
    title.classList.add('complete-title');

    completeBlock.innerHTML = '';

    localTasks.completed.forEach((task, index) => {
      const completed = document.createElement('div');
      completed.classList.add('complete-task', 'task');
      completed.dataset.task = `task${index}${index}`;
      completed.innerHTML = `
          <input type="checkbox" checked data-id="${index}${index}" class="checkbox-task checkbox${index}${index}">
          <input type="text" data-id="${index}${index}" class="input-task input${index}${index}" value="${task}">
          <button type="button" data-id="${index}${index}" class="delete-task"><i data-id="${index}${index}" class="fa fa-trash-o" aria-hidden="true"></i></button>
      `;
      completeBlock.appendChild(completed);
      this.addDelBtnListener();
      this.addCheckListener();
    });
  }

  addNewTask() {
    const localTasks = getTasks();
    const input = this.parentNode.querySelector('.new-task');
    localTasks.started.unshift(input.value);
    input.value = '';
    localStorage.setItem('todo', JSON.stringify(localTasks));
    this.fillActiveTaskBlock();
  }

  addAddBtnListener() {
    const addBtn = this.parentNode.querySelector('.add-task');
    addBtn.addEventListener('click', this.addNewTask.bind(this));
  }

  delete(id) {
    const localTasks = getTasks();
    const deletedTask = this.parentNode.querySelector(`.input${id}`);

    const startedTasks = localTasks.started.filter(
      (task) => task !== deletedTask.value
    );
    const completedTasks = localTasks.completed.filter(
      (task) => task !== deletedTask.value
    );

    localStorage.setItem(
      'todo',
      JSON.stringify({
        started: startedTasks,
        completed: completedTasks,
      })
    );

    this.fillActiveTaskBlock();
    this.fillCompletedTaskBlock();
  }

  addDelBtnListener() {
    const delBtn = this.parentNode.querySelectorAll('.delete-task');
    delBtn.forEach((btn) => {
      btn.onclick = (e) => {
        const id = e.target.dataset.id;
        this.delete.bind(this)(id);
      };
    });
  }

  addCheckListener() {
    const checkboxes = this.parentNode.querySelectorAll('.checkbox-task');
    checkboxes.forEach((checkbox) => {
      checkbox.onclick = (e) => {
        const id = e.target.dataset.id;
        console.log(id);
        this.checkTask.bind(this)(id);
      };
    });
  }

  replaceStartedTask(id) {
    const { started, completed } = getTasks();
    const checkedTask = this.parentNode.querySelector(`.input${id}`);

    const checked = started.find((task) => task === checkedTask.value);
    completed.unshift(checked);
    const startedTasks = started.filter((task) => task !== checkedTask.value);

    localStorage.setItem(
      'todo',
      JSON.stringify({
        started: startedTasks,
        completed: completed,
      })
    );

    this.fillActiveTaskBlock();
    this.fillCompletedTaskBlock();
  }

  replaceCompletedTask(id) {
    const { started, completed } = getTasks();
    const checkedTask = this.parentNode.querySelector(`.input${id}`);

    const checked = completed.find((task) => task === checkedTask.value);
    started.push(checked);
    const completedTasks = completed.filter(
      (task) => task !== checkedTask.value
    );

    localStorage.setItem(
      'todo',
      JSON.stringify({
        started: started,
        completed: completedTasks,
      })
    );

    this.fillActiveTaskBlock();
    this.fillCompletedTaskBlock();
  }

  checkTask(id) {
    const checkbox = this.parentNode.querySelector(`.checkbox${id}`);

    if (checkbox.checked) this.replaceStartedTask(id);
    if (!checkbox.checked) this.replaceCompletedTask(id);
  }

  // setTitle(e) {
  //   const id = e.target.dataset.id
  //   const input = this.parentNode.querySelector(`.checkbox${id}`);
  //   const pressedEnter = e.which === 13 || e.keyCode === 13;
  //   if (e.type === 'keypress') {
  //   }
  // }

  render() {
    this.parentNode.innerHTML = `
    <h3>To Do</h3>
    <div class='todo-content'>
      <div class="add-item">
        <input type="text" class="input-task new-task" name="input-task" placeholder="New task">
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
    this.addAddBtnListener();
  }
}

export default ToDo;
