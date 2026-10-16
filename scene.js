/* Drappr AI v3: cinematic drive-by scene, realistic truck art, map truck icon, trip summary */
const TRUCK_SIDE=`<svg viewBox="0 0 780 230" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block"><defs>
<linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#e1e8ed"/><stop offset="1" stop-color="#aebac3"/></linearGradient>
<linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6288"/><stop offset=".5" stop-color="#17374f"/><stop offset="1" stop-color="#0b1e2d"/></linearGradient>
<linearGradient id="gG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cdeefb"/><stop offset="1" stop-color="#4b86a8"/></linearGradient>
<linearGradient id="gB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff4b8" stop-opacity=".6"/><stop offset="1" stop-color="#fff4b8" stop-opacity="0"/></linearGradient>
<radialGradient id="gR"><stop offset=".6" stop-color="#2b2b2b"/><stop offset="1" stop-color="#090909"/></radialGradient>
<g id="wl"><circle r="27" fill="url(#gR)"/><circle r="16" fill="#b3bcc2"/><circle r="11" fill="#7f8a91"/><path d="M0-15V15M-15 0H15M-10-10 10 10M-10 10 10-10" stroke="#4b565c" stroke-width="3"/><circle r="3" fill="#2a3338"/></g></defs>
<ellipse cx="390" cy="222" rx="395" ry="9" fill="#000" opacity=".4"/>
<rect x="520" y="-14" width="9" height="58" rx="3" fill="#dfe4e8"/><rect x="534" y="-4" width="7" height="48" rx="3" fill="#c3cad0"/>
<rect x="14" y="26" width="480" height="126" rx="6" fill="url(#gT)"/>
<path d="M60 30V148M106 30V148M152 30V148M198 30V148M244 30V148M290 30V148M336 30V148M382 30V148M428 30V148M474 30V148" stroke="#c4cdd4" stroke-width="2" opacity=".8"/>
<rect x="14" y="98" width="480" height="14" fill="#12A594"/><rect x="14" y="112" width="480" height="5" fill="#F5A524"/>
<text x="254" y="78" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="50" fill="#13222C" letter-spacing="4">DRAPPR AI</text>
<rect x="14" y="124" width="6" height="22" fill="#d6262c"/><rect x="10" y="150" width="500" height="14" rx="3" fill="#10171c"/>
<circle cx="110" cy="190" r="31" fill="#0a0f13"/><circle cx="166" cy="190" r="31" fill="#0a0f13"/><circle cx="540" cy="190" r="31" fill="#0a0f13"/><circle cx="596" cy="190" r="31" fill="#0a0f13"/><circle cx="690" cy="190" r="31" fill="#0a0f13"/>
<path d="M506 152V56Q506 40 524 40H584Q598 40 606 52L626 92H700Q730 92 736 110V152Z" fill="url(#gC)"/>
<path d="M522 54H588Q594 54 598 60L614 88H522Z" fill="url(#gG)" stroke="#0a1620" stroke-width="2"/><path d="M562 54V150" stroke="#0a1620" opacity=".5"/>
<path d="M506 124H736" stroke="#F5A524" stroke-width="6"/><rect x="620" y="68" width="6" height="22" rx="2" fill="#0b1318"/>
<rect x="722" y="100" width="14" height="46" rx="3" fill="#d2d9de"/><path d="M724 108H736M724 116H736M724 124H736M724 132H736" stroke="#8d989f"/>
<ellipse cx="731" cy="106" rx="7" ry="5" fill="#fff4b0"/><rect x="716" y="146" width="28" height="12" rx="4" fill="#0f1417"/>
<rect x="628" y="158" width="34" height="24" rx="11" fill="#d3dade"/><path d="M736 106 1020 64V176Z" fill="url(#gB)"/>
<g transform="translate(110 190)"><g class="wh"><use href="#wl"/></g></g><g transform="translate(166 190)"><g class="wh"><use href="#wl"/></g></g>
<g transform="translate(540 190)"><g class="wh"><use href="#wl"/></g></g><g transform="translate(596 190)"><g class="wh"><use href="#wl"/></g></g><g transform="translate(690 190)"><g class="wh"><use href="#wl"/></g></g></svg>`;
const TRUCK_TOP=`<svg viewBox="0 0 40 100" width="34" height="84" style="display:block"><circle cx="20" cy="50" r="30" fill="#F5A524" opacity=".2"/><ellipse cx="20" cy="54" rx="18" ry="46" fill="#000" opacity=".25"/>
<rect x="6" y="38" width="28" height="60" rx="3" fill="#f2f5f7" stroke="#aab6be"/><path d="M10 42V94M16 42V94M22 42V94M28 42V94" stroke="#d3dbe0"/><rect x="6" y="66" width="28" height="5" fill="#12A594"/>
<rect x="7" y="6" width="26" height="30" rx="6" fill="#17374f"/><rect x="10" y="9" width="20" height="9" rx="2" fill="#9fd3ea"/><rect x="11" y="22" width="18" height="10" rx="2" fill="#2d5a7b"/>
<circle cx="11" cy="6" r="2.2" fill="#fff4b0"/><circle cx="29" cy="6" r="2.2" fill="#fff4b0"/><rect x="2" y="14" width="4" height="8" rx="1" fill="#0b1318"/><rect x="34" y="14" width="4" height="8" rx="1" fill="#0b1318"/></svg>`;
const mtn=c=>`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='170'%3E%3Cpath d='M0 170V96L60 52 120 100 200 28 290 104 360 62 450 114 520 74 600 104V170z' fill='${c}'/%3E%3C/svg%3E")`;
const st=document.createElement('style');st.textContent=`
#drive .ds-sky{position:absolute;inset:0;background:radial-gradient(ellipse at 78% 62%,#f0a64a 0,rgba(240,166,74,0) 38%),linear-gradient(#08141c 0,#243b4b 55%,#8a6a4a 100%)}
#drive .ds-m1,#drive .ds-m2{position:absolute;left:0;right:0;background-repeat:repeat-x;background-size:600px 170px}
#drive .ds-m1{bottom:34%;height:170px;background-image:${mtn('%23182c3a')};animation:dsp 26s linear infinite;opacity:.9}
#drive .ds-m2{bottom:33%;height:120px;background-image:${mtn('%230f1e29')};background-size:420px 120px;animation:dsp 11s linear infinite}
#drive .ds-road{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(#3a4d5c,#1a2833);border-top:5px solid #F5A524}
#drive .ds-road::before{content:"";position:absolute;left:0;right:0;top:46%;height:6px;background:repeating-linear-gradient(90deg,#fff 0 70px,transparent 70px 140px);animation:dsl .45s linear infinite}
#drive .ds-truck{position:absolute;left:0;bottom:26%;width:clamp(300px,86vw,780px);transform:translateX(-105%);animation:dsd 2.7s cubic-bezier(.25,.1,.55,1) forwards}
#drive .ds-truck svg{animation:dsb .3s ease-in-out infinite alternate}
#drive .wh{transform-box:fill-box;transform-origin:center;animation:dsw .45s linear infinite}
@keyframes dsp{to{background-position-x:-600px}}@keyframes dsl{to{background-position-x:-140px}}@keyframes dsw{to{transform:rotate(360deg)}}
@keyframes dsb{to{transform:translateY(-2px)}}@keyframes dsd{to{transform:translateX(100vw)}}
.truck-top{display:block;filter:drop-shadow(0 6px 5px rgba(0,0,0,.45))}
@media (prefers-reduced-motion:reduce){#drive .ds-truck,#drive .wh,#drive .ds-road::before{animation-duration:0s}}`;
document.head.appendChild(st);
$('#drive').innerHTML=`<div class="ds-sky"></div><div class="ds-m1"></div><div class="ds-m2"></div><div class="ds-road"></div><div class="ds-truck">${TRUCK_SIDE}</div><p class="absolute bottom-6 inset-x-0 text-center head text-3xl text-fog">Loading your region…</p>`;

/* Realistic top-down truck on the map instead of the emoji */
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&n.classList.contains('truck-pin')&&n.textContent==='🚚'){n.classList.remove('truck-pin');n.classList.add('truck-top');n.innerHTML=TRUCK_TOP}}))).observe($('#map'),{childList:true,subtree:true});

/* Trip summary on arrival: total distance, time, average speed */
const _ar=arrival;
arrival=function(){_ar();
 $('#nRem').previousElementSibling.textContent='Total distance';$('#nRem').textContent=S.km.toFixed(1)+' km';
 const h=Math.floor(S.sec/3600),m=Math.round(S.sec%3600/60),avg=S.km/(S.sec/3600),c=document.createElement('div');c.className='rounded-lg bg-white p-4';
 c.innerHTML=`<b class="head text-xl">Trip summary</b><div class="mt-2 grid grid-cols-3 gap-2 text-center"><div><p class="text-xs text-slate-500">Distance</p><b class="head text-2xl">${S.km.toFixed(1)} km</b></div><div><p class="text-xs text-slate-500">Drive time</p><b class="head text-2xl">${h?h+'h ':''}${m}m</b></div><div><p class="text-xs text-slate-500">Avg speed</p><b class="head text-2xl">${avg.toFixed(0)} km/h</b></div></div>`;
 $('#nStat').after(c)};

/* Safety: camera helper, both location boxes always present, country view fitted above the panel */
if(typeof camPad==='undefined')globalThis.camPad=()=>innerWidth>1024?{top:0,right:0,bottom:0,left:430}:{top:0,left:0,right:0,bottom:$('#sheet').offsetHeight};
const _im3=initMap;
initMap=async function(){await _im3();
 [['#gA','A'],['#gB','B']].forEach(([s,k])=>{if(!$(s).querySelector('input'))mkSearch(s,k)});
 const fb=map.fitBounds.bind(map);map.fitBounds=(b,o={})=>fb(b,o.padding?o:{...o,padding:camPad()})};
