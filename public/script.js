// Supported output formats (must match backend)
const outputFormats = [
  { value: "jpeg", label: "JPEG (jpg)" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
  { value: "tiff", label: "TIFF" },
  { value: "avif", label: "AVIF" },
  { value: "heif", label: "HEIF" },
  { value: "gif", label: "GIF*" }
];

// Render select options
const formatSelect = document.getElementById("format");
formatSelect.innerHTML = "";
outputFormats.forEach(f => {
  const option = document.createElement("option");
  option.value = f.value;
  option.textContent = f.label;
  formatSelect.appendChild(option);
});

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
  resultDiv.innerHTML = '';
  resultDiv.style.color = '';
  if (!fileInput.files.length) {
    resultDiv.textContent = 'Please select an image file.';
    resultDiv.style.color = 'red';
    return;
  }
  const formData = new FormData();
  formData.append('images', fileInput.files[0]);
  formData.append('format', formatSelect.value);

  resultDiv.textContent = 'Converting...';
  resultDiv.style.color = '';

  try {
    const res = await fetch('/api/convert', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      // Jika sukses, baca sekali saja sebagai blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted.${formatSelect.value}`;
      a.textContent = 'Download Converted Image';
      resultDiv.innerHTML = '';
      resultDiv.style.color = '';
      resultDiv.appendChild(a);
    } else {
      // Jika error, baca sekali saja sebagai json atau text
      let message = 'Conversion failed';
      try {
        const data = await res.json();
        message = data.message || message;
      } catch {
        try {
          const text = await res.text();
          message = text || message;
        } catch {}
      }
      throw new Error(message);
    }
  } catch (err) {
    resultDiv.textContent = 'Error: ' + err.message;
    resultDiv.style.color = 'red';
  }
});
