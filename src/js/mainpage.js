import onResize from './onresize.js';
import config from './config.js';

onResize.addListener(([width, height]) => {
  const html = document.documentElement;
  html.style.setProperty('--window-width', width + 'px');
  html.style.setProperty('--window-height', height + 'px');
});

document.body.addEventListener('touchmove', function (event) {
  const target = event.target;
  if (target instanceof Element) {
    if (target.matches('.scroll, .scroll *')) {
      return;
    }
  }
  event.preventDefault();
}, { passive: false, useCapture: false });

; (function () {
  let currentTheme = 'dark';
  let autoUseLight = false;
  const updateTheme = function () {
    const useLightTheme = currentTheme === 'light' || currentTheme === 'auto' && autoUseLight;
    const root = document.documentElement;
    root.classList.add(useLightTheme ? 'light-theme' : 'dark-theme');
    root.classList.remove(useLightTheme ? 'dark-theme' : 'light-theme');
  };
  const updateAutoTheme = function (useLightTheme) {
    autoUseLight = useLightTheme;
    updateTheme();
  };
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  updateAutoTheme(mediaQuery.matches);
  mediaQuery.addListener(event => { updateAutoTheme(event.matches); });
  const updateConfigTheme = theme => {
    currentTheme = theme;
    updateTheme();
  };
  config.addListener('theme', updateConfigTheme);
  config.get('theme').then(updateConfigTheme);
}());
