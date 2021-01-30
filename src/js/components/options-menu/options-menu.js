import './options-menu.css';
import Menu from '../base-menu/baseMenu';
import create from '../../utils/create';
// import Google from '../../../assets/audio';

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
    name: 'thunder',
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
      const option = create('div', `option-${item.myClass}`, ``, itemsBlock);

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

  createSelectSound() {
    const select = create('select', 'select-sound', '', this.contentBlock);
    select.name = 'selectSound';

    sounds.forEach((sound) => {
      const option = create('option', 'option-sound', `${sound.name}`, select);
      option.value = `${sound.name}`;
      if (sound.selected) option.selected = true;
      // option.textContent = `${sound.name}`;
      // select.appendChild(option);
    });
  }

  creteAudioElements() {
    sounds.forEach((item) => {
      const audio = create(
        'audio',
        `audio-${item.name}`,
        '',
        this.contentBlock
      );
      audio.src = item.src;
    });
  }

  playSound() {
    const toggle = this.contentBlock.querySelector('.checkbox-bg-sound');
    if (!toggle.checked) return;

    const localSoundList = getSoundList();
    const selectedSound = localSoundList.find(
      (sound) => sound.selected === true
    );
    const audio = this.contentBlock.querySelector(
      `.audio-${selectedSound.name}`
    );

    console.log('Ok');
    audio.play();
  }

  toggleCheckbox() {
    const toggle = this.contentBlock.querySelector('.checkbox-bg-sound');
    toggle.onClick = () => {
      if (toggle.checked) {
        toggle.checked = false;
        this.playSound.bind(this)();
        console.log('toggle');
      } else {
        toggle.checked = true;
      }
    };
  }

  renderContent() {
    this.fillItemsBlock();
    this.createSelectSound();
    this.creteAudioElements();
    // this.playSound();
    this.toggleCheckbox();
  }
}

export default OptionsMenu;
