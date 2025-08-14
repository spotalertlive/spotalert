// --- DOM refs
const video = document.getElementById('liveVideo');
const canvas = document.getElementById('captureCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startCameraBtn');
const stopBtn = document.getElementById('stopCameraBtn');
const capBtn = document.getElementById('captureFrameBtn');
const openBtn = document.getElementById('openCameraBtn');
const enableAlertsBtn = document.getElementById('enableAlertsBtn');
const statusEl = document.getElementById('cameraStatus');

let stream = null;

// --- helpers
function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

// --- OneSignal permission
async function enableAlerts() {
  try {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.Slidedown.promptPush();
    });
  } catch (e) {
    console.error(e);
    alert('Unable to enable alerts. Please try again.');
  }
}

// --- camera controls
async function startCamera() {
  if (stream) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    video.srcObject = stream;
    setStatus('Camera running.');
    capBtn.disabled = false;
    stopBtn.disabled = false;
  } catch (e) {
    console.error(e);
    setStatus('Camera failed: ' + e.message);
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
    capBtn.disabled = true;
    stopBtn.disabled = true;
    setStatus('Camera stopped.');
  }
}

// draw current frame to canvas
function snapshotBlob() {
  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 720;
  canvas.width = w; canvas.height = h;
  ctx.drawImage(video, 0, 0, w, h);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
}

async function captureAndAnalyze() {
  try {
    setStatus('Capturing frame…');
    const blob = await snapshotBlob();

    // 1) get S3 presigned PUT URL for evidence upload
    const key = `evidence/${Date.now()}.jpg`;
    const presign = await fetch(`/api/s3-presign?key=${encodeURIComponent(key)}&type=${encodeURIComponent(blob.type)}`).then(r=>r.json());

    // 2) PUT the image to S3
    await fetch(presign.url, { method: 'PUT', headers: { 'Content-Type': blob.type }, body: blob });

    // 3) ask backend to analyze (and alert if threat)
    setStatus('Analyzing…');
    const result = await fetch('/api/analyze', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ key })
    }).then(r=>r.json());

    if (result.threat) {
      setStatus(`⚠️ Threat: ${result.reason || 'Detected'}`);
    } else {
      setStatus('No threat detected.');
    }
  } catch (e) {
    console.error(e);
    setStatus('Capture/analyze failed: ' + e.message);
  }
}

// --- events

openBtn?.addEventListener('click', startCamera);
startBtn?.addEventListener('click', startCamera);
stopBtn?.addEventListener('click', stopCamera);
capBtn?.addEventListener('click', captureAndAnalyze);
enableAlertsBtn?.addEventListener('click', enableAlerts);
