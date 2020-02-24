import anime from 'animejs/lib/anime.es.js';

import { preloadAudio, createSource } from './lib/audio-processor';
import { playTutorial } from './tutorial';

(async () => {
  const { audioContext, audioBuffer } = await preloadAudio('/assets/metronome.wav');

  playTutorial();

  const MIN_BPM = 30;
  const MAX_BPM = 200;
  const DEFAULT_BPM = 80;

  let playTimeout;
  let currentAnimation;
  let playing = false;
  let forwards = true;
  let bpm = DEFAULT_BPM;

  const bpmInput = document.querySelector('[data-js-bpm-input]');
  const metronome = document.querySelector('[data-js-metronome]');
  const decrementButton = document.querySelector('[data-js-decrement]');
  const incrementButton = document.querySelector('[data-js-increment]');

  const playSound = () => {
    const source = createSource(audioContext, audioBuffer);
    source.start(0);
  }

  const getTickRate = () => {
    return (60/bpm)*1000;
  }

  const playAnimation = () => {
    const tickRate = getTickRate();

    setTimeout(() => {
      playSound();
    }, tickRate/2);

    playTimeout = setTimeout(() => {
      playAnimation();
    }, tickRate);

    currentAnimation = anime({
      targets: '.ticker',
      rotate: forwards ? [-35, 35] : [35, -35],
      duration: tickRate,
      direction: 'normal',
      easing: 'easeInOutSine',
      // update: function(anim) {
      //   // const { progress } = anim;
      // },
      // complete: function() {
      //   playAnimation();
      // }
    });

    forwards = !forwards;
  }

  metronome.addEventListener('click', () => {
    if(!currentAnimation) {
      playAnimation();
    } else if(playing) {
      currentAnimation.pause();
      clearTimeout(playTimeout);
    } else {
      playAnimation();
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
})();
