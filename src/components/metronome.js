import anime from 'animejs/lib/anime.es.js';

import { clampInt, bpmToTickRate } from '../lib/utils';
import { preloadAudio, createSource } from '../lib/audio-processor';

const MIN_BPM = 40;
const MAX_BPM = 200;
const DEFAULT_BPM = 80;

const bpmInput = document.querySelector('[data-js-bpm-input]');
const metronome = document.querySelector('[data-js-metronome]');
const decrementButton = document.querySelector('[data-js-decrement]');
const incrementButton = document.querySelector('[data-js-increment]');

export class Metronome {
  // state
  bpm = DEFAULT_BPM;
  forwards = true;
  playing = false;

  playTimeout;
  holdInterval;
  holdTimeout;

  constructor() {
    this.addEventListeners();

    this.preloadAudio();
  }

  preloadAudio = async () => {
    const { audioContext, audioBuffer } = await preloadAudio('/assets/metronome.wav');

    this.audioContext = audioContext;
    this.audioBuffer = audioBuffer;
  }

  playSound = () => {
    const { audioContext, audioBuffer } = this;
    const source = createSource(audioContext, audioBuffer);
    source.start(0);
  }

  playAnimation = () => {
    const tickRate = bpmToTickRate(this.bpm);

    setTimeout(this.playSound, tickRate/2);
    this.playTimeout = setTimeout(this.playAnimation, tickRate);

    this.currentAnimation = anime({
      targets: '.ticker',
      rotate: this.forwards ? [-35, 35] : [35, -35],
      duration: tickRate,
      direction: 'normal',
      easing: 'easeInOutSine',
    });

    this.forwards = !this.forwards;
  }

  setBpm = (bpm) => {
    bpmInput.value = bpm;
    this.bpm = bpm;
  }

  addEventListeners = () => {
    bpmInput.addEventListener('blur', this.handleInputBlur);

    metronome.addEventListener('click', this.toggleMetronome);

    decrementButton.addEventListener('mousedown', this.handleDecrementButton);
    incrementButton.addEventListener('mousedown', this.handleIncrementButton);
    
    document.addEventListener('mouseup', this.handleCancelHold);

    decrementButton.addEventListener('touchstart', this.handleDecrementButton);
    incrementButton.addEventListener('touchstart', this.handleIncrementButton);

    document.addEventListener('touchend', this.handleCancelHold);
  }

  handleInputBlur = () => {
    const clampedBpmValue = clampInt(MIN_BPM, MAX_BPM, bpmInput.value);
    bpmInput.value = clampedBpmValue;

    this.bpm = clampedBpmValue;
  }

  toggleMetronome = () => {
    if(!this.currentAnimation) {
      this.playAnimation();
    } else if(this.playing) {
      this.currentAnimation.pause();
      clearTimeout(this.playTimeout);
    } else {
      this.playAnimation();
    }

    this.playing = !this.playing;
  }

  handleDecrementButton = () => {
    this.handleDecrement();

    this.holdTimeout = setTimeout(() => {
      this.holdInterval = setInterval(this.handleDecrement, 100);
    }, 300);
  }
  
  handleIncrementButton = () => {
    this.handleIncrement();

    this.holdTimeout = setTimeout(() => {
      this.holdInterval = setInterval(this.handleIncrement, 100);
    }, 300);
  }
  
  handleDecrement = () => {
    if (this.bpm <= MIN_BPM) return;
    this.setBpm(this.bpm - 1);
  };

  handleIncrement = () => {
    if (this.bpm >= MAX_BPM) return;
    this.setBpm(this.bpm + 1);
  };

  handleCancelHold = () => {
    clearInterval(this.holdInterval);
    clearTimeout(this.holdTimeout);
  }
}
