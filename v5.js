/* Drappr AI v5: readable demo-speed navigation, named pickup/drop points, accept-load flow, return trip with stops */
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const nearIdx=(co,p)=>{let bi=0,bd=1e18;co.forEach((c,i)=>{const d=(c[0]-p[0])**2+(c[1]-p[1])**2;if(d<bd){bd=d;bi=i}});return bi};

/* Escrow, then navigation */
startNav=function(price){clearInterval(S.rt);S.price=price;$('#pn2').classList.add('hidden');const fee=Math.round(price*.06);
 pe.innerHTML=`<h2 class="text-3xl font-bold">Secure the payment</h2>
  <div class="space-y-1 rounded-lg bg-white p-4 text-sm"><div class="flex justify-between"><span>Agreed price</span><b>${fmt(price)}</b></div>
  <div class="flex justify-between"><span>Platform fee (6%)</span><b>${fmt(fee)}</b></div>
  ${S.role==='shipper'?'':`<div class="flex justify-between border-t pt-1"><span>You receive</span><b class="text-teal">${fmt(price-fee)}</b></div>`}</div>
  <p class="text-sm text-slate-600">The shipper deposits the full amount. It stays locked until delivery is confirmed, so the carrier is sure of payment and the shipper pays only for completed work.</p>
  <p class="text-xs text-slate-500">Prototype: no real money moves.</p><button id="escGo" class="btn w-full">Deposit to escrow</button>`;
 pe.classList.remove('hidden');
 $('#escGo').onclick=()=>{$('#escGo').disabled=true;$('#escGo').textContent='Held in escrow ✔';
  setTimeout(()=>{pe.classList.add('hidden');$('#pn3').classList.remove('hidden');
   runNav({co:S.coords,steps:S.steps,label:'Offer accepted at '+fmt(price)+'. Your driver is on the way.',done:()=>arrival()})},900)}};

/* Navigation engine: slower, zoom chosen from speed so the map can load, pauses at stops */
function runNav(o){
 const co=o.co,cum=[0];for(let i=1;i<co.length;i++)cum.push(cum[i-1]+hav(co[i-1],co[i]));const total=cum[cum.length-1]||1;
 const st=o.steps.map(s=>({t:s.t,i:nearIdx(co,s.loc),stop:s.stop}));
 if(S.tm)S.tm.remove();
 const el=document.createElement('div');el.className='truck-pin';el.textContent='🚚';
 const tm=S.tm=new maplibregl.Marker({element:el}).setLngLat(co[0]).addTo(map);
 map.getSource('route').setData(line(co));map.getSource('done').setData(line([]));
 map.setPaintProperty('rd','line-color','#9fb3c0');
 const dur=S.navMs||clamp(total/1000*350,40000,90000),mps=total/(dur/1000),real=S.sec||total/15;
 const z=clamp(Math.log2(156543*Math.cos(co[0][1]*Math.PI/180)*90/mps),10.5,16.2),pitch=z>13?55:30,avg=total/1000/(real/3600);
 S.hd=null;$('#nStat').textContent=o.label;
 let x=$('#nX');if(!x){x=document.createElement('p');x.id='nX';x.className='text-xs text-slate-500';$('#nStat').after(x)}
 x.textContent=`Demo speed ×${Math.round(real/(dur/1000))}. In real life this ${(total/1000).toFixed(0)} km trip takes about ${Math.floor(real/3600)} h ${Math.round(real%3600/60)} min.`;
 map.jumpTo({center:co[0],zoom:z,pitch,padding:camPad()});
 let t0=performance.now()+1200,hold=0,f=0;const seen=new Set();
 (function frame(now){
  if(now<hold){requestAnimationFrame(frame);return}
  const p=clamp((now-t0)/dur,0,1),d=p*total;
  let lo=0,hi=cum.length-1;while(lo<hi-1){const m=(lo+hi)>>1;cum[m]<=d?lo=m:hi=m}
  const sl=(cum[hi]-cum[lo])||1,fr=(d-cum[lo])/sl,pos=[co[lo][0]+(co[hi][0]-co[lo][0])*fr,co[lo][1]+(co[hi][1]-co[lo][1])*fr],tb=bearing(co[lo],co[hi]);
  S.hd=S.hd==null?tb:S.hd+((((tb-S.hd+540)%360)-180)*.06);
  tm.setLngLat(pos);map.jumpTo({center:pos,bearing:S.hd,pitch,zoom:z,padding:camPad()});
  if(f++%5===0)map.getSource('done').setData(line(co.slice(0,lo+1).concat([pos])));
  const hit=st.findIndex((s,i)=>s.stop&&s.i<=lo&&!seen.has(i));
  if(hit>=0&&p<1){seen.add(hit);hold=now+1800;t0+=1800;$('#nTxt').textContent='Now: '+st[hit].t;$('#nDist').textContent='Stop';requestAnimationFrame(frame);return}
  let k=0;st.forEach((s,i)=>{if(s.i<=lo)k=i});const nx=Math.min(k+1,st.length-1),dn=Math.max(0,cum[st[nx].i]-d);
  $('#nTxt').textContent=p>=1?'You have arrived':st[nx].t;$('#nDist').textContent=p>=1?'Arrived':(dn>=1000?(dn/1000).toFixed(1)+' km':Math.round(dn/10)*10+' m');
  $('#nBar').style.width=p*100+'%';$('#nPct').textContent=Math.round(p*100)+'%';$('#nRem').textContent=((total-d)/1000).toFixed(1)+' km';
  $('#nSpd').textContent=p>=1?'0 km/h':Math.round(avg*(.9+.2*Math.sin(now/900)))+' km/h';
  if(p>=1){map.easeTo({pitch:0,zoom:Math.min(z,11),duration:1500});if(o.done)o.done();return}
  requestAnimationFrame(frame)})(performance.now());
}

/* Return trip: named loads, accept, then drive with stops */
const _ar5=arrival;
arrival=function(){_ar5();buildPool()};
async function buildPool(){
 const go=$('#pn3'),btn=go.lastElementChild,rev=S.coords.slice().reverse(),n=rev.length-1,cap=VEH[$('#veh').value].cap,run=S.q.fuel+S.q.toll;
 go.querySelectorAll('.border-amber').forEach(e=>e.remove());
 const card=document.createElement('div');card.className='space-y-2 rounded-lg border-2 border-amber bg-white p-4';go.insertBefore(card,btn);
 if(S.role==='shipper'){card.innerHTML=`<b class="head text-xl">Delivery receipt</b><div class="mt-1 space-y-1 text-sm"><div class="flex justify-between"><span>Paid</span><b>${fmt(S.price)}</b></div><div class="flex justify-between"><span>Distance</span><b>${S.km.toFixed(1)} km</b></div></div><p class="text-xs text-slate-500">Carrier earnings and return-trip loads are private to the carrier.</p>`;return}
 card.innerHTML='<b class="head text-xl">Return trip: loads along your way back</b><p class="text-sm text-slate-500">Finding pickup and drop places…</p>';
 const L=[[.1,.02,.45],[.16,.15,.7],[.22,.3,.95]].map(([f,p,d],i)=>{const w=Math.max(10,Math.round(cap*f*(.7+Math.random()*.6)/10)*10),dk=S.km*(d-p),solo=soloPrice(w,dk),share=w/cap*S.q.total*(dk/S.km)*1.4;
  return{i,w,dk,p,d,price:Math.min(solo*.55,share),solo,pu:rev[Math.floor(p*n)],dr:rev[Math.floor(d*n)],st:'open'}});
 const nm=async c=>{try{const r=await(await fetch(`https://photon.komoot.io/api/reverse?lon=${c[0]}&lat=${c[1]}`)).json(),q=r.features[0].properties;return[q.name||q.street,q.district||q.city].filter(Boolean).join(', ')||null}catch(e){return null}};
 await Promise.all(L.flatMap(l=>[nm(l.pu).then(v=>l.pn=v),nm(l.dr).then(v=>l.dn=v)]));
 L.forEach(l=>{l.pn=l.pn||`Roadside point, ${Math.round(l.p*S.km)} km after drop-off`;l.dn=l.dn||`Roadside point, ${Math.round(l.d*S.km)} km after drop-off`;
  const e=document.createElement('div');e.className='truck-pin';e.style.cssText='width:30px;height:30px;font-size:14px;font-weight:700';e.textContent=l.i+1;l.me=e;new maplibregl.Marker({element:e}).setLngLat(l.pu).addTo(map)});
 const draw=()=>{const ok=L.filter(l=>l.st==='ok'),w=ok.reduce((a,l)=>a+l.w,0),net=ok.reduce((a,l)=>a+l.price,0)*.92;
  card.innerHTML=`<b class="head text-xl">Return trip: loads along your way back</b><p class="text-sm text-slate-600">Tap Accept on a load. The shipper confirms, then the load joins your trip. No new search needed.</p>
  ${L.map(l=>`<div class="rounded-md bg-fog p-3 text-sm"><div class="flex justify-between"><b>Load ${l.i+1} · ${l.w.toLocaleString()} KG</b><b>${fmt(l.price)}</b></div>
   <p class="mt-1">📍 <b>Pickup:</b> ${l.pn}</p><p>🏁 <b>Drop:</b> ${l.dn}</p>
   ${l.st==='open'?`<button data-a="${l.i}" class="btn2 mt-2 w-full !py-1.5">Accept load</button>`:l.st==='req'?'<p class="mt-2 font-semibold text-amber">Request sent. Waiting for the shipper…</p>':'<p class="mt-2 font-semibold text-teal">✔ Confirmed by shipper</p>'}</div>`).join('')}
  <div class="h-2 overflow-hidden rounded-full bg-slate-300"><div class="h-full bg-teal" style="width:${Math.min(100,w/cap*100)}%"></div></div>
  <div class="space-y-1 text-sm"><div class="flex justify-between"><span>Truck filled</span><b>${(w/cap*100).toFixed(0)}%</b></div><div class="flex justify-between"><span>You earn after 8% fee</span><b class="text-teal">${fmt(net)}</b></div><div class="flex justify-between"><span>Fuel and tolls of the return leg</span><b>${fmt(run)}</b></div></div>
  <button id="goRet" class="btn w-full" ${ok.length?'':'disabled'}>Start return trip${ok.length?' with '+ok.length+' load'+(ok.length>1?'s':''):''}</button>
  <p class="text-xs text-slate-500">Prototype with sample loads and prices.</p>`};
 card.onclick=e=>{const b=e.target.closest('button[data-a]');if(b){const l=L[+b.dataset.a];l.st='req';draw();setTimeout(()=>{l.st='ok';l.me.style.background='#12A594';draw()},1500)}
  if(e.target.closest('#goRet')&&!e.target.closest('#goRet').disabled){const ok=L.filter(l=>l.st==='ok');
   const sp=[{t:'Head back along the same route',loc:rev[0]}];ok.forEach(l=>{sp.push({t:`Pick up Load ${l.i+1} (${l.w.toLocaleString()} KG) at ${l.pn}`,loc:l.pu,stop:1});sp.push({t:`Deliver Load ${l.i+1} at ${l.dn}`,loc:l.dr,stop:1})});
   sp.sort((a,b)=>nearIdx(rev,a.loc)-nearIdx(rev,b.loc));sp.push({t:'Arrive back at your start',loc:rev[n]});
   const net=ok.reduce((a,l)=>a+l.price,0)*.92;card.style.display='none';
   runNav({co:rev,steps:sp,label:`Return trip started with ${ok.length} load${ok.length>1?'s':''}.`,done:()=>{$('#nStat').textContent=`Return trip complete. ${ok.length} load${ok.length>1?'s':''} delivered. You earned ${fmt(net)} on the way back.`}})}};
 draw()}
