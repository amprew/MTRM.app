import { timeout } from './utils';

const tooltipContainer = document.querySelector('.tooltip-container');

document.addEventListener('click', (e) => {
  const element = e.target;
  if (element && element.matches('.tooltip')) {
    element.classList.add('done');
  }
});

const createTooltip = (text, timeoutMs = 3000) => {
  const tooltipElement = document.createElement('div');
  tooltipElement.className = 'tooltip';
  tooltipElement.textContent = text;

  const tooltip = tooltipContainer.appendChild(tooltipElement);

  return new Promise(async (resolve) => {
    await timeout(timeoutMs);

    tooltip.classList.add('done');
    resolve();

    await timeout(500);
    tooltip.parentElement.removeChild(tooltip);
  });
};

export const playTutorial = async () => {
  await createTooltip('Click the metronome to toggle on or off.', 4000)

  await timeout(2000);

  await createTooltip('Increment and decremment BPM with input or "+" / "-".');
}
