// THEMING
const btnTheme = document.getElementById('toggle-theme');
btnTheme.onclick = () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', document.body.dataset.theme);
};
document.body.dataset.theme = localStorage.getItem('theme') || 'light';

// PREVIEW/UPLOAD
const imagesInput = document.getElementById('images');
const previewList = document.getElementById('preview-list');
imagesInput.addEventListener('change', () => {
  previewList.innerHTML = '';
  Array.from(imagesInput.files).forEach(file => {
    const img = document.createElement('img');
    img.className = 'preview-img';
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    previewList.appendChild(img);
  });
});

// CONVERT & DOWNLOAD
const form = document.getElementById('convert-form');
const progress = document.getElementById('progress');
const historyList = document.getElementById('history-list');
const history = JSON.parse(localStorage.getItem('history') || '[]');
function addHistoryItem(name, dataURL) {
  history.unshift({ name, dataURL });
  if (history.length > 10) history.pop();
  localStorage.setItem('history', JSON.stringify(history));
  renderHistory();
}
function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.className = 'history-item';
    const img = document.createElement('img');
    img.className = 'history-img';
    img.src = item.dataURL;
    img.alt = item.name;
    const btn = document.createElement('a');
    btn.href = item.dataURL;
    btn.download = item.name;
    btn.className = 'download-btn';
    btn.textContent = 'Unduh';
    li.appendChild(img); li.appendChild(btn);
    historyList.appendChild(li);
  });
}
renderHistory();

form.onsubmit = async e => {
  e.preventDefault();
  progress.textContent = 'Mengonversi gambar...';
  const fd = new FormData(form);
  // PATCH: Remove empty resize/quality fields
  if (!fd.get('width')) fd.delete('width');
  if (!fd.get('height')) fd.delete('height');
  if (!fd.get('quality')) fd.delete('quality');
  try {
    const res = await fetch('/convert', {
      method: 'POST',
      body: fd
    });
    if (!res.ok) throw new Error('Gagal konversi');
    const json = await res.json();
    progress.textContent = `Berhasil: ${json.results.length} file!`;
    json.results.forEach(result => {
      // Membuat link download dan preview hasil
      const dataURL = `data:image/${fd.get('format')};base64,${result.data}`;
      addHistoryItem(result.filename, dataURL);
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = result.filename;
      a.className = 'download-btn';
      a.textContent = `Unduh ${result.filename}`;
      progress.appendChild(document.createElement('br'));
      progress.appendChild(a);
    });
  } catch (err) {
    progress.textContent = 'Terjadi error saat konversi.';
  }
};