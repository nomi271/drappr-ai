/* Drappr AI v2 add-on: dial codes, languages, satellite, verified bids, escrow, return-load pool */
const DIAL=Object.fromEntries('AF93 AL355 DZ213 AD376 AO244 AG1268 AR54 AM374 AU61 AT43 AZ994 BS1242 BH973 BD880 BB1246 BY375 BE32 BZ501 BJ229 BT975 BO591 BA387 BW267 BR55 BN673 BG359 BF226 BI257 CV238 KH855 CM237 CA1 CF236 TD235 CL56 CN86 CO57 KM269 CG242 CD243 CR506 CI225 HR385 CU53 CY357 CZ420 DK45 DJ253 DM1767 DO1809 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FJ679 FI358 FR33 GA241 GM220 GE995 DE49 GH233 GR30 GD1473 GT502 GN224 GW245 GY592 HT509 HN504 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IL972 IT39 JM1876 JP81 JO962 KZ7 KE254 KI686 XK383 KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MG261 MW265 MY60 MV960 ML223 MT356 MH692 MR222 MU230 MX52 FM691 MD373 MC377 MN976 ME382 MA212 MZ258 MM95 NA264 NR674 NP977 NL31 NZ64 NI505 NE227 NG234 KP850 MK389 NO47 OM968 PK92 PW680 PS970 PA507 PG675 PY595 PE51 PH63 PL48 PT351 QA974 RO40 RU7 RW250 KN1869 LC1758 VC1784 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 LK94 SD249 SR597 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TO676 TT1868 TN216 TR90 TM993 TV688 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VU678 VA379 VE58 VN84 YE967 ZM260 ZW263'.split(' ').map(s=>[s.slice(0,2),'+'+s.slice(2)]));
Object.assign(I,{
 fr:{h1:'Vérifiez une fois. Expédiez partout.',next:'Vérifier et continuer',route:'Planifiez votre trajet',bid:'Trouver des chauffeurs'},
 es:{h1:'Verifica una vez. Envía a cualquier lugar.',next:'Verificar y continuar',route:'Planifica tu ruta',bid:'Buscar conductores'},
 pt:{h1:'Verifique uma vez. Despache em qualquer lugar.',next:'Verificar e continuar',route:'Planeie a sua rota',bid:'Encontrar motoristas'},
 fa:{h1:'یک بار تأیید کنید. به هر جا ارسال کنید.',next:'تأیید و ادامه',route:'مسیر خود را برنامه‌ریزی کنید',bid:'یافتن رانندگان'},
 hi:{h1:'एक बार सत्यापित करें। कहीं भी भेजें।',next:'सत्यापित करें और आगे बढ़ें',route:'अपना रूट चुनें',bid:'ड्राइवर खोजें'},
 zh:{h1:'一次验证，全球发运。',next:'验证并继续',route:'规划路线',bid:'寻找司机'},
 ru:{h1:'Один раз подтвердите. Отправляйте куда угодно.',next:'Подтвердить и продолжить',route:'Спланируйте маршрут',bid:'Найти водителей'}});
$('#lang').insertAdjacentHTML('beforeend','<option value="fr">Français</option><option value="es">Español</option><option value="pt">Português</option><option value="fa">فارسی</option><option value="hi">हिन्दी</option><option value="zh">中文</option><option value="ru">Русский</option>');
applyLang=function(){const l=$('#lang').value,rtl=['ur','ar','fa'].includes(l);document.documentElement.lang=l;document.documentElement.dir='ltr';document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=I[l][e.dataset.i];e.dir=rtl?'rtl':'ltr'})};
$('#lang').onchange=applyLang;
const dial=document.createElement('span');dial.className='grid place-items-center rounded-md border border-slate-300 bg-white px-3 font-semibold text-road';$('#phone').before(dial);
function onCountry(){const c=$('#country').value;dial.textContent=DIAL[c]||'+';$('#phone').placeholder='Mobile number'}
$('#country').onchange=onCountry;onCountry();applyLang();

/* Satellite toggle */
const _im=initMap;
initMap=async function(){await _im();
 map.on('load',()=>{map.addSource('sat',{type:'raster',tiles:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],tileSize:256,maxzoom:19,attribution:'Imagery © Esri'});
  map.addLayer({id:'sat',type:'raster',source:'sat',layout:{visibility:'none'}},'rc')});
 const box=document.createElement('div');box.className='maplibregl-ctrl maplibregl-ctrl-group';
 const b=document.createElement('button');b.type='button';b.title='Satellite';b.textContent='🛰';b.style.fontSize='18px';
 b.onclick=()=>{const on=map.getLayoutProperty('sat','visibility')!=='visible';map.setLayoutProperty('sat','visibility',on?'visible':'none');b.style.background=on?'#F5A524':''};
 box.appendChild(b);map.addControl({onAdd:()=>box,onRemove:()=>box.remove()},'top-right')};

/* Verified bids */
radar=function(){clearInterval(S.rt);$('#bids').innerHTML='';let n=0;$('#radarTxt').textContent='Scanning';
 const who=S.role==='driver'?'Shipper':'Carrier';
 S.rt=setInterval(()=>{
  if(n++>=5){clearInterval(S.rt);$('#radarTxt').textContent='Done';return}
  const ratio=n<3?.9+Math.random()*.1:1+Math.random()*.12,price=Math.max(S.min,Math.round(S.offer*ratio/S.step)*S.step),acc=price<=S.offer;
  const li=document.createElement('li');li.className='flex items-center justify-between gap-2 rounded-lg bg-white p-3 border '+(acc?'border-teal':'border-slate-200');
  li.innerHTML=`<div><b>${NAMES[Math.floor(Math.random()*NAMES.length)]}</b> <span class="text-xs text-slate-500">${who} · ★ ${(4.3+Math.random()*.7).toFixed(1)} · ${40+Math.floor(Math.random()*400)} trips</span>
   <p class="text-xs font-semibold text-teal">✔ ID verified · ✔ Vehicle verified</p><p class="text-xs text-slate-500">${acc?'Accepts your price':'Counter-offer'} · ${2+Math.floor(Math.random()*12)} min away</p></div>
   <div class="text-right"><b class="head text-xl">${fmt(price)}</b><br><button class="btn2 !py-1 text-sm">Accept</button></div>`;
  li.querySelector('button').onclick=()=>startNav(price);$('#bids').prepend(li)},1800)};
$('#sendOffer').onclick=radar;

/* Escrow before the trip */
const pe=document.createElement('div');pe.className='hidden space-y-3 p-4';$('#pn2').after(pe);
const _sn=startNav;
startNav=function(price){clearInterval(S.rt);S.price=price;$('#pn2').classList.add('hidden');
 const fee=Math.round(price*.06);
 pe.innerHTML=`<h2 class="text-3xl font-bold">Secure the payment</h2>
  <div class="space-y-1 rounded-lg bg-white p-4 text-sm"><div class="flex justify-between"><span>Agreed price</span><b>${fmt(price)}</b></div>
  <div class="flex justify-between"><span>Platform fee (6%)</span><b>${fmt(fee)}</b></div>
  <div class="flex justify-between border-t pt-1"><span>Carrier receives</span><b class="text-teal">${fmt(price-fee)}</b></div></div>
  <p class="text-sm text-slate-600">The shipper deposits the full amount. It stays locked until delivery is confirmed, so the carrier is sure of payment and the shipper pays only for completed work.</p>
  <p class="text-xs text-slate-500">Prototype: no real money moves.</p><button id="escGo" class="btn w-full">Deposit to escrow</button>`;
 pe.classList.remove('hidden');
 $('#escGo').onclick=()=>{$('#escGo').disabled=true;$('#escGo').textContent='Held in escrow ✔';setTimeout(()=>{pe.classList.add('hidden');_sn(price);const w=setInterval(()=>{if($('#nPct').textContent==='100%'){clearInterval(w);arrival()}},500)},900)}};

/* Return-load pool */
const soloPrice=(w,dk)=>{const r=rate(),c=w<=1200?VEH.van:w<=8000?VEH.medium:VEH.heavy,wf=1+Math.min(w/c.cap,1.2)*.6;
 return(dk*r[1]*c.m*wf+dk*r[2]*c.f+dk/100*r[3]*c.m)*(1+r[4])};
function arrival(){
 const go=$('#pn3'),btn=go.lastElementChild,rev=S.coords.slice().reverse(),n=rev.length-1,cap=VEH[$('#veh').value].cap,run=S.q.fuel+S.q.toll;
 const pod=document.createElement('div');pod.className='space-y-2 rounded-lg bg-white p-4';
 pod.innerHTML=`<b class="head text-xl">Proof of delivery</b><p class="text-sm text-slate-600">Confirm the goods arrived to release the escrow.</p>
  <button id="relBtn" class="btn w-full !text-lg">Confirm delivery and release ${fmt(S.price*.94)}</button><div id="stars" class="hidden text-2xl text-amber"></div>`;
 const L=[[.1,.02,.45],[.16,.15,.7],[.22,.3,.95]].map(([f,p,d],i)=>{const w=Math.max(10,Math.round(cap*f*(.7+Math.random()*.6)/10)*10),dk=S.km*(d-p),solo=soloPrice(w,dk),share=w/cap*S.q.total*(dk/S.km)*1.4;
  return{w,dk,solo,pool:Math.min(solo*.55,share),pu:rev[Math.floor(p*n)],dr:rev[Math.floor(d*n)],on:true,i}});
 const card=document.createElement('div');card.className='space-y-2 rounded-lg border-2 border-amber bg-white p-4';
 go.insertBefore(pod,btn);go.insertBefore(card,btn);
 $('#relBtn').onclick=()=>{$('#relBtn').disabled=true;$('#relBtn').textContent='Payment released ✔';const s=$('#stars');s.classList.remove('hidden');
  s.innerHTML=[1,2,3,4,5].map(i=>`<button data-s="${i}" aria-label="${i} stars">☆</button>`).join('');
  s.onclick=e=>{const v=+e.target.dataset.s;if(v)s.querySelectorAll('button').forEach((b,i)=>b.textContent=i<v?'★':'☆')}};
 if(!map.getSource('ret')){map.addSource('ret',{type:'geojson',data:line(rev)});map.addLayer({id:'retl',type:'line',source:'ret',paint:{'line-color':'#F5A524','line-width':3,'line-dasharray':[2,2]}})}
 L.forEach((l,i)=>{const e=document.createElement('div');e.className='truck-pin';e.style.cssText='width:28px;height:28px;font-size:14px;font-weight:700';e.textContent=i+1;l.m=new maplibregl.Marker({element:e}).setLngLat(l.pu).addTo(map)});
 setTimeout(()=>{const b=S.coords.reduce((b,c)=>b.extend(c),new maplibregl.LngLatBounds(S.coords[0],S.coords[0]));map.fitBounds(b,{padding:{top:60,bottom:60,left:window.innerWidth>1024?450:30,right:30},duration:1200})},1800);
 function draw(){const sel=L.filter(l=>l.on),w=sel.reduce((a,l)=>a+l.w,0),rev$=sel.reduce((a,l)=>a+l.pool,0),net=rev$*.92,save=sel.reduce((a,l)=>a+l.solo-l.pool,0);
  card.innerHTML=`<b class="head text-xl">Return trip: fill the empty truck</b>
  <p class="text-sm text-slate-600">Your truck is empty on the way back. These small loads are along the route and share the trip.</p>
  ${L.map(l=>`<label class="flex items-center justify-between gap-2 rounded-md bg-fog p-2 text-sm"><span><input type="checkbox" data-i="${l.i}" ${l.on?'checked':''}> <b>Load ${l.i+1}</b> · ${l.w.toLocaleString()} KG · ${l.dk.toFixed(0)} km</span><b>${fmt(l.pool)}</b></label>`).join('')}
  <div class="h-2 overflow-hidden rounded-full bg-slate-300"><div class="h-full bg-teal" style="width:${Math.min(100,w/cap*100)}%"></div></div>
  <div class="space-y-1 text-sm"><div class="flex justify-between"><span>Truck filled</span><b>${(w/cap*100).toFixed(0)}%</b></div>
  <div class="flex justify-between"><span>Carrier earns after 8% fee</span><b class="text-teal">${fmt(net)}</b></div>
  <div class="flex justify-between"><span>Fuel and tolls of the return leg</span><b>${fmt(run)}</b></div>
  <div class="flex justify-between"><span>Shippers save vs a dedicated truck</span><b>${fmt(save)}</b></div></div>
  <p class="text-xs text-slate-500">Prototype with sample loads. Part-load price = 1.4x the load's share of a full truck, capped at 55% of a dedicated truck.</p>`;
  card.querySelectorAll('input').forEach(c=>c.onchange=()=>{L[c.dataset.i].on=c.checked;draw()})}
 draw()}
