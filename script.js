// The Well Loved Finds portfolio: filters, video dialog, copy email.

const filterButtons = [...document.querySelectorAll('.filter')];
const workCards = [...document.querySelectorAll('.work-grid .card')];
const filterCount = document.querySelector('#filter-count');

function updateCount(filter, label) {
  const visible = workCards.filter((card) => !card.classList.contains('is-hidden')).length;
  const noun = visible === 1 ? 'project' : 'projects';
  filterCount.textContent = filter === 'all'
    ? `${visible} selected ${noun}`
    : `${visible} ${label.toLowerCase()} ${noun}`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    workCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.classList.toggle('is-hidden', !matches);
    });
    updateCount(filter, button.textContent.trim());
  });
});

if (filterCount) updateCount('all', 'All');

const dialog = document.querySelector('#video-dialog');
const dialogVideo = document.querySelector('#dialog-video');
const dialogTitle = document.querySelector('#video-dialog-title');
const closeButton = document.querySelector('.video-dialog__close');

if (dialog && dialogVideo && dialogTitle && closeButton && typeof dialog.showModal === 'function') {
  let opener = null;

  document.querySelectorAll('[data-video]').forEach((button) => {
    button.addEventListener('click', () => {
      opener = button;
      dialogTitle.textContent = button.dataset.title || 'Portfolio sample';
      dialogVideo.src = button.dataset.video;
      const poster = button.querySelector('img');
      if (poster) dialogVideo.poster = poster.currentSrc || poster.src;
      dialogVideo.muted = button.dataset.muted === 'true';
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialogVideo.play().catch(() => {});
    });
  });

  const closeDialog = () => {
    dialogVideo.pause();
    dialogVideo.removeAttribute('src');
    dialogVideo.removeAttribute('poster');
    dialogVideo.load();
    if (dialog.open) dialog.close();
  };

  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (opener) opener.focus();
  });
}

const copyButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('.copy-email__status');

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail;
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      const range = document.createRange();
      const address = document.querySelector('.copy-email__address');
      if (address) {
        range.selectNodeContents(address);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copied = document.execCommand && document.execCommand('copy');
      }
    }
    copyStatus.textContent = copied ? 'Copied.' : 'Selected. Press Copy to finish.';
    window.setTimeout(() => { copyStatus.textContent = ''; }, 2400);
  });
}
