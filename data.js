const $=s=>document.querySelector(s), S={role:null,otp:null,verified:false,A:null,B:null,km:0,sec:0,coords:[],steps:[]};
const T=(m,ms=4000)=>{const t=$('#toast');t.textContent=m;t.classList.remove('hidden');clearTimeout(T.h);T.h=setTimeout(()=>t.classList.add('hidden'),ms)};

/* ---------- Countries (195+) ---------- */
const CL=`AF Afghanistan|AL Albania|DZ Algeria|AD Andorra|AO Angola|AG Antigua and Barbuda|AR Argentina|AM Armenia|AU Australia|AT Austria|AZ Azerbaijan|BS Bahamas|BH Bahrain|BD Bangladesh|BB Barbados|BY Belarus|BE Belgium|BZ Belize|BJ Benin|BT Bhutan|BO Bolivia|BA Bosnia and Herzegovina|BW Botswana|BR Brazil|BN Brunei|BG Bulgaria|BF Burkina Faso|BI Burundi|CV Cabo Verde|KH Cambodia|CM Cameroon|CA Canada|CF Central African Republic|TD Chad|CL Chile|CN China|CO Colombia|KM Comoros|CG Congo|CD DR Congo|CR Costa Rica|CI Côte d'Ivoire|HR Croatia|CU Cuba|CY Cyprus|CZ Czechia|DK Denmark|DJ Djibouti|DM Dominica|DO Dominican Republic|EC Ecuador|EG Egypt|SV El Salvador|GQ Equatorial Guinea|ER Eritrea|EE Estonia|SZ Eswatini|ET Ethiopia|FJ Fiji|FI Finland|FR France|GA Gabon|GM Gambia|GE Georgia|DE Germany|GH Ghana|GR Greece|GD Grenada|GT Guatemala|GN Guinea|GW Guinea-Bissau|GY Guyana|HT Haiti|HN Honduras|HU Hungary|IS Iceland|IN India|ID Indonesia|IR Iran|IQ Iraq|IE Ireland|IL Israel|IT Italy|JM Jamaica|JP Japan|JO Jordan|KZ Kazakhstan|KE Kenya|KI Kiribati|XK Kosovo|KW Kuwait|KG Kyrgyzstan|LA Laos|LV Latvia|LB Lebanon|LS Lesotho|LR Liberia|LY Libya|LI Liechtenstein|LT Lithuania|LU Luxembourg|MG Madagascar|MW Malawi|MY Malaysia|MV Maldives|ML Mali|MT Malta|MH Marshall Islands|MR Mauritania|MU Mauritius|MX Mexico|FM Micronesia|MD Moldova|MC Monaco|MN Mongolia|ME Montenegro|MA Morocco|MZ Mozambique|MM Myanmar|NA Namibia|NR Nauru|NP Nepal|NL Netherlands|NZ New Zealand|NI Nicaragua|NE Niger|NG Nigeria|KP North Korea|MK North Macedonia|NO Norway|OM Oman|PK Pakistan|PW Palau|PS Palestine|PA Panama|PG Papua New Guinea|PY Paraguay|PE Peru|PH Philippines|PL Poland|PT Portugal|QA Qatar|RO Romania|RU Russia|RW Rwanda|KN Saint Kitts and Nevis|LC Saint Lucia|VC Saint Vincent and the Grenadines|WS Samoa|SM San Marino|ST São Tomé and Príncipe|SA Saudi Arabia|SN Senegal|RS Serbia|SC Seychelles|SL Sierra Leone|SG Singapore|SK Slovakia|SI Slovenia|SB Solomon Islands|SO Somalia|ZA South Africa|KR South Korea|SS South Sudan|ES Spain|LK Sri Lanka|SD Sudan|SR Suriname|SE Sweden|CH Switzerland|SY Syria|TW Taiwan|TJ Tajikistan|TZ Tanzania|TH Thailand|TL Timor-Leste|TG Togo|TO Tonga|TT Trinidad and Tobago|TN Tunisia|TR Turkey|TM Turkmenistan|TV Tuvalu|UG Uganda|UA Ukraine|AE United Arab Emirates|GB United Kingdom|US United States|UY Uruguay|UZ Uzbekistan|VU Vanuatu|VA Vatican City|VE Venezuela|VN Vietnam|YE Yemen|ZM Zambia|ZW Zimbabwe`
 .split('|').map(s=>({iso:s.slice(0,2),name:s.slice(3)}));
// Known bounding boxes [w,s,e,n]; all others are resolved via the map service geocoding on selection
const BB={PK:[60.87,23.63,77.84,37.08],IT:[6.63,35.49,18.52,47.09],SA:[34.6,16.4,55.67,32.16],TR:[25.66,35.82,44.82,42.11],DE:[5.87,47.27,15.04,55.06],GB:[-8.65,49.86,1.77,60.86],US:[-125,24.4,-66.9,49.4],AE:[51.5,22.6,56.4,26.1],FR:[-5.2,41.3,9.6,51.1],ES:[-9.4,35.9,3.4,43.8],IN:[68.1,6.7,97.4,35.7],QA:[50.7,24.4,51.7,26.2],KW:[46.5,28.5,48.5,30.1],OM:[52,16.6,59.9,26.4],EG:[24.7,22,36.9,31.7],NL:[3.3,50.7,7.3,53.6]};
const flag=i=>String.fromCodePoint(...[...i].map(c=>127397+c.charCodeAt()));
$('#country').innerHTML=CL.map(c=>`<option value="${c.iso}">${flag(c.iso)} ${c.name} (${c.iso})</option>`).join('');
$('#country').value='PK';

/* ---------- Rates: [currency, base/km, fuel/km, toll/100km, tax] ---------- */
const RATE={PK:['PKR',160,95,450,.17],IT:['EUR',1.3,.4,9,.22],DE:['EUR',1.4,.42,8,.19],SA:['SAR',3.2,1.1,0,.15],TR:['TRY',18,12,60,.2],GB:['GBP',1.1,.38,5,.2],US:['USD',1.5,.45,4,0],AE:['AED',3.5,1.2,2,.05],DEF:['USD',1.2,.35,3,.1]};
'AT BE CY EE FI FR GR IE LV LT LU MT NL PT SK SI HR ES'.split(' ').forEach(c=>RATE[c]=RATE.IT);
const VEH={heavy:{m:1.9,f:2.2,cap:26000},medium:{m:1.3,f:1.4,cap:8000},van:{m:1,f:1,cap:1200}};
const rate=()=>RATE[S.iso]||RATE.DEF, fmt=n=>new Intl.NumberFormat(undefined,{style:'currency',currency:rate()[0],maximumFractionDigits:rate()[1]<10?2:0}).format(n);

/* ---------- i18n (headline strings) ---------- */
const I={en:{h1:'Verify once. Dispatch anywhere.',next:'Verify and continue',route:'Plan your route',bid:'Find drivers & bid'},
 ur:{h1:'ایک بار تصدیق، ہر جگہ ترسیل',next:'تصدیق کریں اور آگے بڑھیں',route:'اپنا راستہ منتخب کریں',bid:'ڈرائیور تلاش کریں'},
 it:{h1:'Verifica una volta. Spedisci ovunque.',next:'Verifica e continua',route:'Pianifica il percorso',bid:'Trova autisti e offri'},
 ar:{h1:'تحقق مرة واحدة. اشحن في أي مكان.',next:'تحقق وتابع',route:'خطط مسارك',bid:'ابحث عن سائقين'},
 tr:{h1:'Bir kez doğrula. Her yere gönder.',next:'Doğrula ve devam et',route:'Rotanı planla',bid:'Sürücü bul ve teklif ver'},
 de:{h1:'Einmal verifizieren. Überall disponieren.',next:'Prüfen und weiter',route:'Route planen',bid:'Fahrer finden & bieten'}};
function applyLang(){const l=$('#lang').value;document.documentElement.lang=l;document.documentElement.dir=['ur','ar'].includes(l)?'rtl':'ltr';
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=I[l][e.dataset.i])}
$('#lang').onchange=applyLang;
