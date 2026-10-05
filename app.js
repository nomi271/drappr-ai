/* ---------- Phase 1: onboarding ---------- */
document.querySelectorAll('.role').forEach(b=>b.onclick=()=>{S.role=b.dataset.role;
 document.querySelectorAll('.role').forEach(x=>x.classList.toggle('border-amber',x===b));
 document.querySelectorAll('.role').forEach(x=>x.classList.toggle('border-transparent',x!==b));
 document.querySelectorAll('.role').forEach(x=>x.classList.toggle('bg-white',true));
 $('#drv').classList.toggle('hidden',S.role!=='driver')});
document.querySelectorAll('.role').forEach(x=>x.classList.add('border-transparent'));
$('#sendOtp').onclick=()=>{if($('#phone').value.replace(/\D/g,'').length<7)return T('Enter a valid mobile number first.');
 S.otp=String(1000+Math.floor(Math.random()*9000));$('#otpRow').classList.remove('hidden');T('Demo code (no SMS is sent): '+S.otp,9000)};
$('#verOtp').onclick=()=>{if($('#otp').value===S.otp){S.verified=true;$('#otpOk').classList.remove('hidden');$('#otpRow').classList.add('hidden')}else T('That code is incorrect. Check the code and try again.')};
$('#go1').onclick=async()=>{
 const need=[[S.role,'Choose a role.'],[$('#name').value.trim(),'Enter your full name.'],[$('#idn').value.trim(),'Enter your ID or license number.'],[S.verified,'Verify your phone number.']];
 if(S.role==='driver')need.push([$('#reg').value.trim(),'Enter your vehicle registration.'],[+$('#vcap').value>0,'Enter your vehicle capacity.']);
 const bad=need.find(n=>!n[0]);if(bad)return T(bad[1]);
  S.iso=$('#country').value;S.lang=$('#lang').value;
 if(S.role==='driver'){$('#veh').value=$('#vtype').value}
 $('#drive').classList.remove('hidden');
 const t0=Date.now();await initMap();
 setTimeout(()=>{$('#p1').classList.add('hidden');$('#app').classList.remove('hidden');map.resize();map.fitBounds(S.bb,{duration:0});$('#drive').classList.add('hidden')},Math.max(0,2700-(Date.now()-t0)));
};
applyLang();

/* ---------- Phase 2/3: map, geocoders, quote ---------- */
let map,mA,mB;
async function initMap(){
 const c=CL.find(x=>x.iso===S.iso);$('#ctry').textContent=flag(c.iso)+' '+c.name;
 let bb=BB[S.iso];
 if(!bb){try{const r=await(await fetch(`https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(c.name)}&format=json&limit=1`)).json();const q=r[0].boundingbox.map(Number);bb=[q[2],q[0],q[3],q[1]]}
  catch(e){T('Could not load the country boundary. Showing the whole world.');bb=[-180,-60,180,75]}}
 S.bb=bb;const ctr=S.ctr=[(bb[0]+bb[2])/2,(bb[1]+bb[3])/2],px=(bb[2]-bb[0])*.08,py=(bb[3]-bb[1])*.08;
 map=new maplibregl.Map({container:'map',center:ctr,zoom:5,maxBounds:[[bb[0]-px,bb[1]-py],[bb[2]+px,bb[3]+py]],
  style:{version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,maxzoom:19,attribution:'© OpenStreetMap contributors'}},layers:[{id:'osm',type:'raster',source:'osm'}]}});
 map.addControl(new maplibregl.NavigationControl(),'top-right');
 map.on('load',()=>{
  map.addSource('route',{type:'geojson',data:line([])});map.addSource('done',{type:'geojson',data:line([])});
  map.addLayer({id:'rc',source:'route',type:'line',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#13222C','line-width':9}});
  map.addLayer({id:'rl',source:'route',type:'line',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#12A594','line-width':5}});
  map.addLayer({id:'rd',source:'done',type:'line',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':'#F5A524','line-width':5}});
 });
 mkSearch('#gA','A');mkSearch('#gB','B');
}
/* Local-only place search (Photon / OpenStreetMap), limited to the country's box and ISO code */
function mkSearch(sel,k){const box=$(sel);box.className='relative';
 box.innerHTML='<input class="in" placeholder="Street, junction or landmark"><ul class="absolute z-20 mt-1 hidden max-h-56 w-full overflow-auto rounded-md border bg-white shadow-lg"></ul>';
 const inp=box.firstChild,ul=box.lastChild;let h;
 inp.oninput=()=>{clearTimeout(h);const q=inp.value.trim();if(q.length<3){ul.classList.add('hidden');if(!q)setPt(k,null);return}
  h=setTimeout(async()=>{try{const lg=['en','de','it','fr'].includes(S.lang)?'&lang='+S.lang:'';
   const r=await(await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10${lg}&bbox=${S.bb.join(',')}&lat=${S.ctr[1]}&lon=${S.ctr[0]}`)).json();
   const f=r.features.filter(x=>(x.properties.countrycode||'').toUpperCase()===S.iso).slice(0,6);
   ul.innerHTML=f.length?'':'<li class="p-2 text-sm text-slate-500">No local match. Try a street or landmark name.</li>';
   f.forEach(x=>{const p=x.properties,t=[p.name||p.street,p.district||p.locality,p.city].filter(Boolean).join(', '),li=document.createElement('li');
    li.className='cursor-pointer p-2 text-sm hover:bg-fog';li.textContent=t;li.onclick=()=>{inp.value=t;ul.classList.add('hidden');setPt(k,x.geometry.coordinates)};ul.appendChild(li)});
   ul.classList.remove('hidden')}catch(e){T('Search is unavailable right now. Try again in a moment.')}},350)}}
const ins=s=>{const m=s.maneuver,n=s.name?' onto '+s.name:'';if(m.type==='arrive')return'Arrive at your destination';if(m.type==='depart')return'Head out'+(s.name?' on '+s.name:'');
 if(/roundabout|rotary/.test(m.type))return'Take the roundabout'+n;return(!m.modifier||m.modifier==='straight'?'Continue straight':'Turn '+m.modifier)+n};
const line=c=>({type:'Feature',geometry:{type:'LineString',coordinates:c}});
const pin=col=>{const d=document.createElement('div');d.className='pin';d.style.background=col;return d};
function setPt(k,c){S[k]=c;const key=k==='A'?'mA':'mB';
 if(k==='A'){mA&&mA.remove();mA=c?new maplibregl.Marker(pin('#12A594')).setLngLat(c).addTo(map):null}
 else{mB&&mB.remove();mB=c?new maplibregl.Marker(pin('#F5A524')).setLngLat(c).addTo(map):null}
 if(S.A&&S.B)getRoute();else{S.km=0;map.getSource('route').setData(line([]));render()}}
const hav=(a,b)=>{const R=6371e3,r=Math.PI/180,dl=(b[1]-a[1])*r,dn=(b[0]-a[0])*r,x=Math.sin(dl/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
async function getRoute(){
 const id=S.rid=(S.rid||0)+1;
 try{const r=await(await fetch(`https://router.project-osrm.org/route/v1/driving/${S.A.join(',')};${S.B.join(',')}?overview=full&geometries=geojson&steps=true`)).json();
  if(id!==S.rid)return;const R=r.routes[0];S.km=R.distance/1000;S.sec=R.duration*1.25;S.coords=R.geometry.coordinates;
  S.steps=R.legs[0].steps.map(x=>({t:ins(x),loc:x.maneuver.location}));S.real=true}
 catch(e){S.km=hav(S.A,S.B)*1.3/1000;S.sec=S.km/55*3600;S.coords=Array.from({length:61},(_,i)=>[S.A[0]+(S.B[0]-S.A[0])*i/60,S.A[1]+(S.B[1]-S.A[1])*i/60]);
  S.steps=[{t:'Head toward your destination',loc:S.A},{t:'Arrive at your destination',loc:S.B}];T('Road routing is unavailable. Showing an estimated straight-line route.')}
 map.getSource('route').setData(line(S.coords));
 const b=S.coords.reduce((b,c)=>b.extend(c),new maplibregl.LngLatBounds(S.coords[0],S.coords[0]));
 map.fitBounds(b,{padding:{top:80,bottom:80,left:window.innerWidth>1024?460:40,right:40},duration:900});render()}
function calc(){const w=+$('#wt').value||0,v=VEH[$('#veh').value],r=rate(),d=S.km,wf=1+Math.min(w/v.cap,1.2)*.6;
 const base=d*r[1]*v.m,wt=base*(wf-1),fuel=d*r[2]*v.f,toll=d/100*r[3]*v.m,sub=base+wt+fuel+toll,tax=sub*r[4];
 return{base,wt,fuel,toll,tax,total:sub+tax,w,v,r}}
function render(){
 const w=+$('#wt').value||0,v=VEH[$('#veh').value],over=w>v.cap;
 $('#capWarn').classList.toggle('hidden',!over);$('#capWarn').textContent=over?`This vehicle carries up to ${v.cap.toLocaleString()} KG. Choose a larger class.`:'';
 const ok=S.km>0&&w>0&&!over;$('#qEmpty').classList.toggle('hidden',S.km>0);$('#qBody').classList.toggle('hidden',!(S.km>0));$('#toBid').disabled=!ok;
 if(!S.km)return;const q=calc();S.q=q;
 $('#qKm').textContent=S.km.toFixed(1)+' km';$('#qEta').textContent='≈ '+Math.floor(S.sec/3600)+' h '+Math.round(S.sec%3600/60)+' min drive';
 const rows=[['Distance charge',q.base],['Weight surcharge ('+q.w.toLocaleString()+' KG)',q.wt],['Fuel',q.fuel],['Tolls',q.toll],['Tax ('+Math.round(q.r[4]*100)+'%)',q.tax]];
 $('#qRows').innerHTML=rows.map(r=>`<div class="flex justify-between"><dt class="text-slate-600">${r[0]}</dt><dd class="font-semibold">${fmt(r[1])}</dd></div>`).join('');
 $('#qTot').textContent=fmt(q.total)}
['wt','veh'].forEach(i=>$('#'+i).addEventListener('input',render));

/* ---------- Phase 4: bidding radar ---------- */
const NAMES=['Bilal K.','Marco R.','Ahmet Y.','Faisal M.','Jonas W.','Omar S.','Sam T.','Luca B.'];
function niceStep(x){return Math.pow(10,Math.floor(Math.log10(Math.max(x*.01,1))))}
$('#toBid').onclick=()=>{S.q=calc();S.base=Math.round(S.q.total);S.step=niceStep(S.base);S.min=Math.round(S.base*.8/S.step)*S.step;S.offer=S.base;
 $('#pn1').classList.add('hidden');$('#pn2').classList.remove('hidden');
 $('#bBase').textContent=fmt(S.base);$('#bMin').textContent=fmt(S.min);showOffer();radar()};
function showOffer(){$('#bOffer').textContent=fmt(S.offer);$('#bStep').textContent='± '+fmt(S.step)+' per tap'}
$('#dec').onclick=()=>{S.offer=Math.max(S.min,S.offer-S.step);showOffer()};
$('#inc').onclick=()=>{S.offer+=S.step;showOffer()};
$('#sendOffer').onclick=radar;
function radar(){clearInterval(S.rt);$('#bids').innerHTML='';let n=0;$('#radarTxt').textContent='Scanning';
 const who=S.role==='driver'?'Shipper':'Carrier';
 S.rt=setInterval(()=>{
  if(n++>=5){clearInterval(S.rt);$('#radarTxt').textContent='Done';return}
  const ratio=n<3?.9+Math.random()*.1:1+Math.random()*.12,price=Math.max(S.min,Math.round(S.offer*ratio/S.step)*S.step),acc=price<=S.offer;
  const li=document.createElement('li');li.className='flex items-center justify-between rounded-lg bg-white p-3 border '+(acc?'border-teal':'border-slate-200');
  li.innerHTML=`<div><b>${NAMES[Math.floor(Math.random()*NAMES.length)]}</b> <span class="text-xs text-slate-500">${who} · ★ ${(4.3+Math.random()*.7).toFixed(1)} · ${2+Math.floor(Math.random()*12)} min away</span><p class="text-xs ${acc?'text-teal font-semibold':'text-slate-500'}">${acc?'Accepts your price':'Counter-offer'}</p></div>
   <div class="text-right"><b class="head text-xl">${fmt(price)}</b><br><button class="btn2 !py-1 text-sm">Accept</button></div>`;
  li.querySelector('button').onclick=()=>startNav(price);$('#bids').prepend(li)},1800)}

/* ---------- Phase 4: animated navigation ---------- */
function bearing(a,b){const r=Math.PI/180,y=Math.sin((b[0]-a[0])*r)*Math.cos(b[1]*r),x=Math.cos(a[1]*r)*Math.sin(b[1]*r)-Math.sin(a[1]*r)*Math.cos(b[1]*r)*Math.cos((b[0]-a[0])*r);return(Math.atan2(y,x)/r+360)%360}
function startNav(price){
 clearInterval(S.rt);$('#pn2').classList.add('hidden');$('#pn3').classList.remove('hidden');
 const co=S.coords,cum=[0];for(let i=1;i<co.length;i++)cum.push(cum[i-1]+hav(co[i-1],co[i]));const total=cum[cum.length-1]||1;
 const sIdx=S.steps.map(s=>{let bi=0,bd=1e18;co.forEach((c,i)=>{const d=(c[0]-s.loc[0])**2+(c[1]-s.loc[1])**2;if(d<bd){bd=d;bi=i}});return bi});
 const el=document.createElement('div');el.className='truck-pin';el.textContent='🚚';
 const tm=new maplibregl.Marker({element:el}).setLngLat(co[0]).addTo(map);
 map.easeTo({center:co[0],zoom:15,pitch:55,duration:1200});
 $('#nStat').textContent='Offer accepted at '+fmt(price)+'. Your driver is on the way.';
 const dur=Math.min(50000,Math.max(20000,total/1000*140)),avg=S.km/(S.sec/3600),t0=performance.now()+1300;let f=0,si=-1;
 (function frame(now){
  const p=Math.min(1,Math.max(0,(now-t0)/dur)),d=p*total;
  let lo=0,hi=cum.length-1;while(lo<hi-1){const m=(lo+hi)>>1;cum[m]<=d?lo=m:hi=m}
  const sl=(cum[hi]-cum[lo])||1,fr=(d-cum[lo])/sl,pos=[co[lo][0]+(co[hi][0]-co[lo][0])*fr,co[lo][1]+(co[hi][1]-co[lo][1])*fr];
  tm.setLngLat(pos);el.style.transform=`scaleX(${bearing(co[lo],co[hi])>180?-1:1})`;
  map.jumpTo({center:pos});
  if(f++%5===0)map.getSource('done').setData(line(co.slice(0,lo+1).concat([pos])));
  let k=0;sIdx.forEach((ix,i)=>{if(ix<=lo)k=i});const nx=Math.min(k+1,S.steps.length-1),dn=Math.max(0,cum[sIdx[nx]]-d);
  $('#nTxt').textContent=(p>=1?'You have arrived':S.steps[Math.min(nx,S.steps.length-1)].t);
  $('#nDist').textContent=p>=1?'Arrived':(dn>=1000?(dn/1000).toFixed(1)+' km':Math.round(dn/10)*10+' m');
  $('#nBar').style.width=p*100+'%';$('#nPct').textContent=Math.round(p*100)+'%';
  $('#nRem').textContent=((total-d)/1000).toFixed(1)+' km';$('#nSpd').textContent=p>=1?'0 km/h':Math.round(avg*(.9+.2*Math.sin(now/900)))+' km/h';
  if(p>=1){$('#nStat').textContent='Delivery complete at '+fmt(price)+'.';map.easeTo({pitch:0,zoom:11,duration:1500});return}
  requestAnimationFrame(frame)})(performance.now());
}
