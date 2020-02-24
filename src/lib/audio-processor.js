import BufferLoader from './buffer-loader';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

export const preloadAudio = (audioPath) => {
  return new Promise((resolve) => {
    const audioContext = new AudioContext();

    const bufferLoader = new BufferLoader(
      audioContext,
      [audioPath],
      function (bufferList) {
        const [audioBuffer] = bufferList;

        resolve({ audioContext, audioBuffer });
      }
    );

    bufferLoader.load();
  });
}

export const createSource = (audioContext, audioBuffer) => {
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioContext.destination);

  return audioSource;
}
