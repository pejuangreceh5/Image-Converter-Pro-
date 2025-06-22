const CLOUD_NAME = "dvci00pm3";
const UPLOAD_PRESET = "unsigned_preset";

// Output formats allowed by Cloudinary
const outputFormats = [
  { value: "jpg", label: "JPEG (jpg)" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
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

chooseFileBtn.addEventListener('click', (e) => {
  fileInput.click();
});

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

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    chooseFileBtn.textContent = fileInput.files[0].name;
  } else {
    chooseFileBtn.textContent = "Choose File";
  }
});

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.innerHTML = '';
  resultDiv.style.color = '';
  if (!fileInput.files.length) {
    resultDiv.textContent = 'Please select an image file.';
    resultDiv.style.color = 'red';
    return;
  }
  const file = fileInput.files[0];
  const format = formatSelect.value;

  resultDiv.textContent = 'Uploading & converting via Cloudinary...';

  try {
    // 1. Upload ke Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    // 2. Generate URL hasil konversi format
    const convertedUrl = data.secure_url.replace('/upload/', `/upload/f_${format}/`);
    // 3. Tampilkan hasil download & preview
    resultDiv.innerHTML = `
      <a href="${convertedUrl}" download="converted.${format}" target="_blank">Download Converted Image (${format.toUpperCase()})</a><br>
      <img src="${convertedUrl}" alt="Converted Preview" style="max-width:100%;margin-top:12px;border:1px solid #ddd;">
    `;
    resultDiv.style.color = '';
  } catch (err) {
    resultDiv.textContent = 'Error: ' + err.message;
    resultDiv.style.color = 'red';
  }
});
