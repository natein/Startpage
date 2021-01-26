import TodoMenu from './todo-menu';
import './todo.css';

const tasks = {
  started: ['First task', 'Second task'],
  completed: ['Solved task'],
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
  return allTasks;
};

class ToDo {
  constructor(parentNode) {
    this.parentNode = parentNode;
    this.flag = true;
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
          <input type="text" data-id="${index}" class="input-task input${index} input-text" value="${task}">
          <button type="button" data-id="${index}" class="delete-task"><i data-id="${index}" class="fa fa-trash-o" aria-hidden="true"></i></button>
      `;
      startBlock.appendChild(startedTask);
      this.addDelBtnListener();
      this.addCheckListener();
      this.addInputListeners();
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
          <input type="text" data-id="${index}${index}" class="input-task input${index}${index} input-text resolved" value="${task}">
          <button type="button" data-id="${index}${index}" class="delete-task"><i data-id="${index}${index}" class="fa fa-trash-o" aria-hidden="true"></i></button>
      `;
      completeBlock.appendChild(completed);
      this.addDelBtnListener();
      this.addCheckListener();
      this.addInputListeners();
    });
  }

  addNewTask() {
    const localTasks = getTasks();
    const input = this.parentNode.querySelector('.new-task');

    if (input.value) localTasks.started.unshift(input.value);
    localStorage.setItem('todo', JSON.stringify(localTasks));

    input.value = '';
    this.fillActiveTaskBlock();
  }

  addAddBtnListener() {
    const addBtn = this.parentNode.querySelector('.add-task');
    addBtn.addEventListener('click', this.addNewTask.bind(this));
  }

  addMainInputListener() {
    const input = this.parentNode.querySelector('.new-task');
    input.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        this.addNewTask.bind(this)();
        input.blur();
      }
    });
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
        const { id } = e.target.dataset;
        this.delete.bind(this)(id);
      };
    });
  }

  addCheckListener() {
    const checkboxes = this.parentNode.querySelectorAll('.checkbox-task');
    checkboxes.forEach((checkbox) => {
      checkbox.onclick = (e) => {
        const { id } = e.target.dataset;
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
        completed,
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
        started,
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

  memorizeInputText(e) {
    if (!this.flag) return;
    this.flag = false;
    const { id } = e.target.dataset;
    const input = this.parentNode.querySelector(`.input${id}`);
    localStorage.setItem('inputText', JSON.stringify(input.value));
  }

  setInputText(memorizedText, currentText) {
    const { started, completed } = getTasks();
    const indStartedTask = started.findIndex((text) => text === memorizedText);
    const indCompletedTask = completed.findIndex(
      (text) => text === memorizedText
    );

    if (indStartedTask !== -1) started[indStartedTask] = currentText;
    if (indCompletedTask !== -1) completed[indCompletedTask] = currentText;

    localStorage.setItem('todo', JSON.stringify({ started, completed }));

    this.fillActiveTaskBlock();
    this.fillCompletedTaskBlock();
  }

  getInputText(e) {
    const memorizedText = JSON.parse(localStorage.getItem('inputText'));
    const { id } = e.target.dataset;

    const input = this.parentNode.querySelector(`.input${id}`);
    const currentText = input.value;

    this.setInputText(memorizedText, currentText);
    this.flag = true;
  }

  addInputListeners() {
    const textInputs = this.parentNode.querySelectorAll('.input-text');
    textInputs.forEach((input) => {
      input.onclick = (e) => this.memorizeInputText.bind(this)(e);
      input.onblur = (e) => this.getInputText.bind(this)(e);
      input.onkeypress = (e) => {
        if (e.keyCode === 13) input.onblur(e);
      };
    });
  }

  render() {
    this.parentNode.innerHTML = `
    <div class="popular-header">
      <h3>To Do</h3>
      <div class="dot-menu">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
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
    this.addMainInputListener();
    this.addInputListeners();

    this.btnMenu = this.parentNode.querySelector('.dot-menu');
    this.rssMenu = new TodoMenu(this.btnMenu, 'ToDo');
  }
}

export default ToDo;
