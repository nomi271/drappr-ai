/* Drappr AI v4 fix: remove the duplicate id "gB" (loading-scene SVG vs Destination box) + tap-on-map pins */
const _bg=document.querySelector('#drive linearGradient#gB');
if(_bg){_bg.id='dsBeam';document.querySelectorAll('#drive [fill="url(#gB)"]').forEach(e=>e.setAttribute('fill','url(#dsBeam)'))}
let pickMode=null;
function addPickButtons(){const row=document.createElement('div');row.style.cssText='display:flex;gap:8px';
 [['A','📍 Set pickup on map'],['B','🏁 Set destination on map']].forEach(([k,t])=>{const b=document.createElement('button');b.type='button';b.textContent=t;
  b.style.cssText='flex:1;padding:9px 6px;border:1px solid #1E3441;border-radius:6px;font-weight:600;font-size:13px;background:#fff;color:#1E3441';
  b.onclick=()=>{pickMode=k;T('Tap the map above to place the '+(k==='A'?'pickup':'destination')+' pin.',3500)};row.appendChild(b)});
 $('#gB').parentElement.after(row)}
const _im4=initMap;
initMap=async function(){await _im4();addPickButtons();
 map.on('click',e=>{if(!pickMode)return;const k=pickMode;pickMode=null;setPt(k,[e.lngLat.lng,e.lngLat.lat]);
  const i=$(k==='A'?'#gA':'#gB').querySelector('input');if(i)i.value='Pin on map ('+e.lngLat.lat.toFixed(4)+', '+e.lngLat.lng.toFixed(4)+')'})};
