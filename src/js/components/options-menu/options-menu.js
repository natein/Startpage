import './options-menu.css';
import Menu from '../base-menu/baseMenu';
import create from '../../utils/create';

const optionItems = [
  {
    title: 'Show favicons for websites',
    checked: true,
    myClass: 'favicon-item',
  },
  {
    title: 'Turn on background sound',
    checked: false,
    myClass: 'bg-sound',
  },
];

const sounds = [
  {
    name: 'ambient',
    src: 'audio/ambient.mp3',
    selected: false,
  },
  {
    name: 'birds-waves',
    src: 'audio/birds-waves.mp3',
    selected: false,
  },
  {
    name: 'birds',
    src: 'audio/birds.mp3',
    selected: true,
  },
  {
    name: 'cafe',
    src: 'audio/cafe.mp3',
    selected: false,
  },
  {
    name: 'thunder',
    src: 'audio/thunder.mp3',
    selected: false,
  },
  {
    name: 'waves',
    src: 'audio/waves.mp3',
    selected: false,
  },
];

const getOptionList = () => {
  let optionList = [];

  const localOptionList = JSON.parse(localStorage.getItem('optionList'));

  if (localOptionList) {
    optionList = localOptionList;
  } else {
    optionList = optionItems;
    localStorage.setItem('optionList', JSON.stringify(optionItems));
  }
  return optionList;
};

const getSoundList = () => {
  let soundList = [];

  const localSoundList = JSON.parse(localStorage.getItem('soundList'));

  if (localSoundList) {
    soundList = localSoundList;
  } else {
    soundList = sounds;
    localStorage.setItem('soundList', JSON.stringify(sounds));
  }
  return soundList;
};

class OptionsMenu extends Menu {
  constructor(clickedElement, caption, privateClass) {
    super(clickedElement, caption);
    this.contentBlock = this.parentNode.querySelector('.menu-content.Opti');
    this.renderContent();
    this.privateClass = privateClass;
  }

  fillItemsBlock() {
    const itemsBlock = create('div', 'items-block', '', this.contentBlock);

    optionItems.forEach((item) => {
      const option = create('div', `option ${item.myClass}`, ``, itemsBlock);

      create('div', `title-${item.myClass}`, `${item.title}`, option);

      const check = item.checked && 'checked';
      const toggleHtml = `
      <label class="switch">
        <input type="checkbox" class="checkbox-${item.myClass}" ${check} ">
        <span class="slider round"></span>
      </label>
    `;
      create('div', `toggle-switch`, toggleHtml, option);
    });
  }

  addSelectListener(value) {
    const localSoundList = JSON.parse(localStorage.getItem('soundList'));
    const newList = localSoundList.map((sound) => {
      if (sound.name === value) {
        return { ...sound, selected: true };
      } else {
        return { ...sound, selected: false };
      }
    });

    localStorage.setItem('soundList', JSON.stringify(newList));
    this.playSound();
  }

  createSelectSound() {
    const selectBlock = create('div', 'select-block', 'Choose sound', this.contentBlock);
    const select = create('select', 'select-sound', '', selectBlock);

    const localSoundList = getSoundList();

    localSoundList.forEach((sound) => {
      const option = create('option', 'option-sound', `${sound.name}`, select);
      option.value = `${sound.name}`;
      if (sound.selected) option.selected = true;
    });

    select.onclick = (e) => this.addSelectListener.bind(this)(e.target.value);
  }

  creteAudioElements() {
    sounds.forEach((item) => {
      const audio = document.createElement('audio');
      audio.classList.add(`audio-${item.name}`)
      audio.src = item.src;
      audio.loop = true;
      this.contentBlock.appendChild(audio);
    });
  }

  stopCurrentSound(selectedSound) {
    const currentSound = JSON.parse(localStorage.getItem('currentSound'));

    if (!currentSound) return;
    if (currentSound.name === selectedSound.name) return;

    const audio = this.contentBlock.querySelector(
      `.audio-${currentSound.name}`
    );

    audio.pause();
    audio.currentTime = 0;
  }

  playSound() {
    const toggle = this.contentBlock.querySelector('.checkbox-bg-sound');

    const localSoundList = getSoundList();
    const selectedSound = localSoundList.find(
      (sound) => sound.selected === true
    );
    this.stopCurrentSound(selectedSound);

    localStorage.setItem('currentSound', JSON.stringify(selectedSound));

    const audio = this.contentBlock.querySelector(
      `.audio-${selectedSound.name}`
    );

    if (toggle.checked) audio.play();
    if (!toggle.checked) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  toggleCheckbox() {
    const toggle = this.contentBlock.querySelector('.checkbox-bg-sound');
    toggle.onclick = () => this.playSound.bind(this)();
  }

  renderContent() {
    this.fillItemsBlock();
    this.createSelectSound();
    this.creteAudioElements();
    this.toggleCheckbox();
  }
}

export default OptionsMenu;
