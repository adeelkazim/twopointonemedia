// Fail closed: static page release only. No API calls, file reads or form writes.
(() => {
  const form = document.getElementById('uploadForm');
  const status = document.getElementById('uploadStatus');
  for (const control of form.querySelectorAll('input, textarea, button')) control.disabled = true;
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = 'Uploads are disabled. No files or form details will be sent.';
  });
})();
