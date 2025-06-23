const CLOUD_NAME = "dvci00pm3";          // Ganti jika perlu
const UPLOAD_PRESET = "unsigned_preset"; // Ganti jika perlu

// Semua format output populer & profesional yang didukung Cloudinary
const outputFormats = [
  { value: "jpg", label: "JPEG (jpg)", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/avif", "image/x-icon", "image/svg+xml", "application/pdf", "image/vnd.wap.wbmp", "image/x-xbitmap", "image/x-xpixmap", "image/x-portable-pixmap", "application/postscript", "application/eps", "image/vnd.microsoft.icon", "image/x-tga", "image/heic", "image/heif"] },
  { value: "jpeg", label: "JPEG (jpeg)", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/avif", "image/x-icon", "image/svg+xml", "application/pdf", "image/vnd.wap.wbmp", "image/x-xbitmap", "image/x-xpixmap", "image/x-portable-pixmap", "application/postscript", "application/eps", "image/vnd.microsoft.icon", "image/x-icon", "image/x-tga", "image/heic", "image/heif"] },
  { value: "png", label: "PNG", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/avif", "image/x-icon", "image/svg+xml", "application/pdf", "image/vnd.wap.wbmp", "image/x-xbitmap", "image/x-xpixmap", "image/x-portable-pixmap", "application/postscript", "application/eps", "image/vnd.microsoft.icon", "image/x-icon", "image/x-tga", "image/heic", "image/heif"] },
  { value: "webp", label: "WEBP", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"] },
  { value: "gif", label: "GIF", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"] },
  { value: "bmp", label: "BMP", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"] },
  { value: "tiff", label: "TIFF", accept: ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"] },
  { value: "tif", label: "TIFF (tif)", accept: ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"] },
  { value: "avif", label: "AVIF", accept: ["image/jpeg", "image/png", "image/webp", "image/avif"] },
  { value: "heic", label: "HEIC", accept: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] },
  { value: "heif", label: "HEIF", accept: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] },
  { value: "ico", label: "ICO (icon)", accept: ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/ico", "image/vnd.microsoft.icon", "image/x-icon"] },
  { value: "pdf", label: "PDF", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "application/pdf"] },
  { value: "svg", label: "SVG", accept: ["image/svg+xml", "image/jpeg", "image/png", "image/webp"] },
  { value: "eps", label: "EPS", accept: ["image/eps", "application/eps", "application/postscript"] },
  { value: "ps", label: "PostScript (ps)", accept: ["application/postscript", "application/eps"] },
  { value: "ai", label: "Adobe Illustrator (ai)", accept: ["application/postscript", "application/eps"] },
  { value: "tga", label: "Targa (tga)", accept: ["image/tga", "image/x-tga"] },
  { value: "jpe", label: "JPEG (jpe)", accept: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/avif", "image/x-icon", "image/svg+xml", "application/pdf", "image/vnd.wap.wbmp", "image/x-xbitmap", "image/x-xpixmap", "image/x-portable-pixmap", "application/postscript", "application/eps", "image/vnd.microsoft.icon", "image/x-icon", "image/x-tga", "image/heic", "image/heif"] },
  { value: "jxr", label: "JPEG XR (jxr)", accept: ["image/jpeg", "image/png", "image/webp", "image/jxr"] },
  { value: "wdp", label: "JPEG XR (wdp)", accept: ["image/jpeg", "image/png", "image/webp", "image/jxr", "image/wdp"] },
  { value: "jp2", label: "JPEG 2000 (jp2)", accept: ["image/jpeg", "image/png", "image/webp", "image/jp2"] },
  { value: "j2k", label: "JPEG 2000 (j2k)", accept: ["image/jpeg", "image/png", "image/webp", "image/j2k"] },
  { value: "wbmp", label: "WBMP (wbmp)", accept: ["image/vnd.wap.wbmp", "image/jpeg", "image/png"] },
  { value: "xbm", label: "XBM (xbm)", accept: ["image/x-xbitmap", "image/jpeg", "image/png"] },
  { value: "xpm", label: "X PixMap (xpm)", accept: ["image/x-xpixmap", "image/jpeg", "image/png"] },
  { value: "ppm", label: "Portable Pixmap (ppm)", accept: ["image/x-portable-pixmap", "image/jpeg", "image/png"] }
];

const formatSelect = document.getElementById("format");
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const uploadForm = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');

function updateFormatOptions(mimeType) {
  formatSelect.innerHTML = "";
  // Hanya tampilkan format output yang menerima mimeType file input
  const filtered = outputFormats.filter(f => f.accept.includes(mimeType));
  if (filtered.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No compatible format";
    formatSelect.appendChild(option);
    formatSelect.disabled = true;
  } else {
    filtered.forEach(f => {
      const option = document.createElement("option");
      option.value = f.value;
      option.textContent = f.label;
      formatSelect.appendChild(option);
    });
    formatSelect.disabled = false;
  }
}

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
    updateFormatOptions(fileInput.files[0].type);
  }
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    chooseFileBtn.textContent = fileInput.files[0].name;
    updateFormatOptions(fileInput.files[0].type);
  } else {
    chooseFileBtn.textContent = "Choose File";
    formatSelect.innerHTML = "";
    formatSelect.disabled = true;
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

  if (formatSelect.disabled || !formatSelect.value) {
    resultDiv.textContent = 'No compatible output format available!';
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

// Inisialisasi agar select format tidak bisa dipilih sebelum ada file
formatSelect.innerHTML = "";
formatSelect.disabled = true;
