document.querySelector('.menu-toggle').addEventListener('click',e=>{const btn=e.currentTarget;const open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(open));document.querySelector('#main-nav').classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');document.querySelector('#main-nav').classList.remove('open');}});
// Events stay local until an approved analytics destination is configured.
window.dataLayer=window.dataLayer||[];
const event=(name,details={})=>window.dataLayer.push({event:name,page_path:location.pathname,...details});
const parameters=new URL(location.href).searchParams;
const attribution={landing_page:location.pathname};
for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'])if(parameters.has(key))attribution[key]=parameters.get(key).slice(0,300);
try{const saved=JSON.parse(sessionStorage.getItem('signguyz-attribution')||'null');if(saved&&!parameters.has('utm_source')&&!parameters.has('gclid'))Object.assign(attribution,saved);else sessionStorage.setItem('signguyz-attribution',JSON.stringify(attribution));}catch{}
// Deliberate query selection supports a controlled message comparison; no automatic experiment is running.
const variant=parameters.get('message')==='coordination'?'coordination':'accountability';
if(location.pathname==='/property-managers/'&&variant==='coordination'){
 document.querySelector('h1').textContent='One contact for your property sign work.';
 document.querySelector('.hero .lede').textContent='Keep sign installation, repairs and inspections moving with our team as your point of contact. Work through access, tenant arrangements and site priorities before the job begins.';
}

for(const form of document.querySelectorAll('.enquiry')){
 form.elements.landing_page.value=attribution.landing_page;
 form.elements.attribution.value=JSON.stringify(attribution);
 form.elements.message_variant.value=variant;
 let started=false;
 form.addEventListener('input',()=>{if(!started){event('enquiry_start',{audience:form.dataset.audience,message_variant:variant});started=true;}},{once:true});
 for(const radio of form.querySelectorAll('[name=contact_method]'))radio.addEventListener('change',()=>{
  for(const field of form.querySelectorAll('[data-contact-field]')){const active=field.dataset.contactField===radio.value;field.hidden=!active;const input=field.querySelector('input');input.disabled=!active;input.required=active;}
 });
 const upload=form.querySelector('[type=file]');
 upload.addEventListener('change',()=>{
  const files=Array.from(upload.files);
  const valid=files.length<=5&&files.reduce((n,f)=>n+f.size,0)<=10*1024*1024&&files.every(f=>f.type.startsWith('image/')||f.type==='application/pdf');
  upload.setCustomValidity(valid?'':'Choose up to 5 images or PDFs, totalling no more than 10 MB.');
  form.querySelector('.file-status').textContent=valid?(files.length?files.length+' file(s) selected. Files stay on your device.':''):'Choose up to 5 images or PDFs, totalling no more than 10 MB.';
 });
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(form.elements.website.value)return;
  const status=form.querySelector('.form-status');const data=new FormData(form);
  status.textContent='Enquiry preview: '+data.get('issue')+' in '+data.get('location')+'. Nothing has been sent. Please call or email our team to discuss the job.';
  status.classList.add('success');status.focus();
  event('enquiry_preview',{audience:form.dataset.audience,message_variant:variant});
 });
}
for(const a of document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]'))a.addEventListener('click',()=>event(a.protocol==='tel:'?'phone_click':'email_click',{message_variant:variant}));

for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{const filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('.work-tile').forEach(tile=>{tile.hidden=filter!=='All work'&&tile.dataset.category!==filter;if(!tile.hidden)count++;});document.querySelector('.gallery-empty').hidden=count>0;});
