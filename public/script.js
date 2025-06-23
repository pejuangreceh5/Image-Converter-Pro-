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

// Fungsi untuk memaksa download hasil dari Cloudinary
async function forceDownload(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

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

  resultDiv.textContent = 'Uploading & converting...';

  try {
    // Upload ke Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();

    // Generate URL hasil konversi format
    const convertedUrl = data.secure_url.replace('/upload/', `/upload/f_${format}/`);

    // Fetch gambar hasil sebagai blob untuk preview (tanpa expose url aslinya)
    const imgRes = await fetch(convertedUrl);
    const imgBlob = await imgRes.blob();
    const imgSrc = URL.createObjectURL(imgBlob);

    // Render preview dan tombol download (tanpa expose url Cloudinary)
    resultDiv.innerHTML = `
      <img src="${imgSrc}" alt="Converted Preview">
      <button id="downloadBtn" type="button" class="download-btn">Download</button>
    `;

    document.getElementById('downloadBtn').addEventListener('click', function() {
      forceDownload(convertedUrl, `converted.${format}`);
    });

    resultDiv.style.color = '';
  } catch (err) {
    resultDiv.textContent = 'Error: ' + err.message;
    resultDiv.style.color = 'red';
  }
});
