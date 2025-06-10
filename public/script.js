const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const uploadForm = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');

// Open file dialog when "Choose File" button is clicked
chooseFileBtn.addEventListener('click', (e) => {
  fileInput.click();
});

// Drag & drop highlight
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    chooseFileBtn.textContent = fileInput.files[0].name;
  }
});

// Show selected file name
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    chooseFileBtn.textContent = fileInput.files[0].name;
  } else {
    chooseFileBtn.textContent = "Choose File";
  }
});

// Handle form submit (upload & convert image)
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.textContent = '';
  if (!fileInput.files.length) {
    resultDiv.textContent = 'Please select an image file.';
    return;
  }
  const formData = new FormData();
  formData.append('images', fileInput.files[0]);
  formData.append('format', document.getElementById('format').value);

  resultDiv.textContent = 'Converting...';

  try {
    const res = await fetch('/convert', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Conversion failed');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${document.getElementById('format').value}`;
    a.textContent = 'Download Converted Image';
    resultDiv.innerHTML = '';
    resultDiv.appendChild(a);
  } catch (err) {
    resultDiv.textContent = 'Error: ' + err.message;
  }
});
