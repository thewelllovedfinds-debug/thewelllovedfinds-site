// The Well Loved Finds portfolio: video dialog, copy email.

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
