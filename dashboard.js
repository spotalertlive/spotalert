async function j(url, opt){ const r = await fetch(url,{headers:{'Content-Type':'application/json'}, ...opt}); return r.json(); }

const fmt = iso => new Date(iso).toLocaleString();

async function loadAlerts(){
  const rows = await j('/api/alerts');
  document.getElementById('alertsCount').textContent = rows.length;
  const tb = document.querySelector('#alertsTable tbody');
  tb.innerHTML = rows.map(r=>`
    <tr>
      <td>${fmt(r.created_at)}</td>
      <td>${r.severity}</td>
      <td>${r.camera_id ?? ''}</td>
      <td>${r.title ?? ''}</td>
      <td>${r.image_url?`<a href="${r.image_url}" target="_blank">image</a>`:''}</td>
    </tr>`).join('');
}

async function loadCameras(){
  const rows = await j('/api/cameras');
  const tb = document.querySelector('#camsTable tbody');
  tb.innerHTML = rows.map(r=>`
    <tr><td>${r.name}</td><td><a href="${r.hls_url}" target="_blank">HLS</a></td><td>${fmt(r.created_at)}</td></tr>
  `).join('');
}

async function loadPeople(){
  const rows = await j('/api/people');
  const tb = document.querySelector('#peopleTable tbody');
  tb.innerHTML = rows.map(r=>`<tr><td>${r.label}</td><td>${fmt(r.created_at)}</td></tr>`).join('');
}

document.getElementById('addCam').onclick = async ()=>{
  const name = document.getElementById('camName').value.trim();
  const hls  = document.getElementById('camHls').value.trim();
  if(!name||!hls) return alert('Name & HLS URL required');
  await j('/api/cameras',{method:'POST', body:JSON.stringify({name, hls_url:hls})});
  document.getElementById('camName').value='';
  document.getElementById('camHls').value='';
  loadCameras();
};

document.getElementById('addPerson').onclick = async ()=>{
  const label = document.getElementById('personLabel').value.trim();
  if(!label) return;
  await j('/api/people',{method:'POST', body:JSON.stringify({label})});
  document.getElementById('personLabel').value='';
  loadPeople();
};

loadAlerts(); loadCameras(); loadPeople();
