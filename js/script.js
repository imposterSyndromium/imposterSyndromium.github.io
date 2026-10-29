/** Shared page behavior. Navigation is owned by header-include.js. */
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main-content';
});
