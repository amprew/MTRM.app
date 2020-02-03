import anime from 'animejs/lib/anime.es.js';

import { playTutorial } from './tutorial';
import BufferLoader from './utils/buffer-loader';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

window.onload = init;

let audioContext;
let audioSource;
let audioBuffer;

function init() {
  audioContext = new AudioContext();

  let bufferLoader = new BufferLoader(
    audioContext,
    ['/assets/metronome.wav'],
    onAudioLoad
  );

  bufferLoader.load();
}

function onAudioLoad (bufferList) {
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = bufferList[0];
  audioBuffer = bufferList[0];

  audioSource.connect(audioContext.destination);
}

playTutorial();

const MIN_BPM = 30;
const MAX_BPM = 200;
const DEFAULT_BPM = 80;

let currentAnimation;
let playing = false;
let forwards = true;
let bpm = DEFAULT_BPM;

const bpmInput = document.querySelector('[data-js-bpm-input]');
const metronome = document.querySelector('[data-js-metronome]');
const decrementButton = document.querySelector('[data-js-decrement]');
const incrementButton = document.querySelector('[data-js-increment]');

// const soundBuffer = new Array(3).fill(null).map(() => new Audio('/assets/metronome.wav'));
// let soundBufferIndex = 0;
// const playSound = () => {
//   soundBuffer[soundBufferIndex].play();
//   soundBufferIndex++;
//   if(soundBufferIndex+1 > soundBuffer.length) {
//     soundBufferIndex = 0;
//   }
// }

// const soundBuffer = new Array(3).fill(null).map(() => new Audio('/assets/metronome.wav'));
// let soundBufferIndex = 0;
const playSound = () => {
  var source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(0);
}

const getTickRate = () => {
  const clampedBpm = +Math.max(bpm, 60);
  return (60/clampedBpm)*1000;
}

let currentInterval;

window.onblur = function() {
  if(!playing) return;

  playSound();

  currentInterval = setInterval(() => {
    playSound();
  }, getTickRate());
}

window.onfocus = function() {
  if (currentInterval) {
    clearInterval(currentInterval);
  }
}

const playAnimation = () => {
  const tickRate = getTickRate();
  let soundPlayed = false;

  setTimeout(() => {
    playSound();
  }, tickRate/2);

  currentAnimation = anime({
    targets: '.ticker',
    rotate: forwards ? [-35, 35] : [35, -35],
    duration: tickRate,
    direction: 'normal',
    easing: 'easeInOutSine',
    update: function(anim) {
      // const { progress } = anim;
    },

    complete: function() {
      playAnimation();
    }
  });

  forwards = !forwards;
}

metronome.addEventListener('click', () => {
  if(!currentAnimation) {
    playAnimation();
  } else if(playing) {
    currentAnimation.pause();
  } else {
    currentAnimation.play();
  }

  playing = !playing;
});

bpmInput.addEventListener('blur', () => {
  const clampedBpmValue = Math.min(Math.max(+bpmInput.value, MIN_BPM), MAX_BPM);
  bpmInput.value = clampedBpmValue;

  bpm = clampedBpmValue;
});

decrementButton.addEventListener('click', () => {
  if (bpmInput.value <= MIN_BPM)  return;
  const decrementedBpmValue = +bpmInput.value - 1;
  bpmInput.value = decrementedBpmValue;
  bpm = decrementedBpmValue;
});

incrementButton.addEventListener('click', () => {
  if (bpmInput.value >= MAX_BPM)  return;
  const incrementedBpmValue = +bpmInput.value + 1;
  bpmInput.value = incrementedBpmValue;
  bpm = incrementedBpmValue;
});
