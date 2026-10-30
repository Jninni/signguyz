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
  for(const field of form.querySelectorAll('[data-contact-field]')){const active=field.dataset.contactField==='email'||radio.value==='phone';field.hidden=!active;const input=field.querySelector('input');input.disabled=!active;input.required=active;}
 });
 const upload=form.querySelector('[type=file]');
 upload.addEventListener('change',()=>{
  const files=Array.from(upload.files);
  const valid=files.length<=5&&files.reduce((n,f)=>n+f.size,0)<=3*1024*1024&&files.every(f=>['image/jpeg','image/png','image/webp','application/pdf'].includes(f.type));
  upload.setCustomValidity(valid?'':'Choose up to 5 JPG, PNG, WebP or PDF files, totalling no more than 3 MB.');
  form.querySelector('.file-status').textContent=valid?(files.length?files.length+' file(s) selected. ':''):'Choose up to 5 JPG, PNG, WebP or PDF files, totalling no more than 3 MB.';
 });
 let requestId=crypto.randomUUID();
 const encodeFile=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({name:file.name,content:String(reader.result).split(',')[1]});reader.onerror=()=>reject(Error('Unable to read an attachment. Please choose the files again.'));reader.readAsDataURL(file);});
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity()||form.elements.website.value)return;
  const status=form.querySelector('.form-status'),button=form.querySelector('[type=submit]');
  if(button.disabled)return;
  const label=button.innerHTML;button.disabled=true;button.textContent='Sending…';status.classList.remove('success');status.textContent='Sending your enquiry…';
  try{
   const payload=Object.fromEntries(new FormData(form));payload.landing_page=attribution.landing_page;payload.files=await Promise.all(Array.from(upload.files).map(encodeFile));payload.request_id=requestId;
   const response=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000)});
   const result=await response.json();if(!response.ok||!result.ok)throw Error(result.message||'Unable to send. Please try again or call our team.');
   status.textContent=result.message;status.classList.add('success');
   let dialog=document.querySelector('#enquiry-confirmation');if(!dialog){dialog=document.createElement('dialog');dialog.id='enquiry-confirmation';dialog.className='enquiry-confirmation';dialog.setAttribute('aria-labelledby','enquiry-confirmation-title');document.body.append(dialog);}
   dialog.replaceChildren();const title=document.createElement('h2');title.id='enquiry-confirmation-title';title.textContent='Thank you for your enquiry';dialog.append(title);
   const message=document.createElement('p');message.textContent=result.message;dialog.append(message);
   const receiptNote=document.createElement('p');receiptNote.textContent=result.receiptSent?'A receipt has been sent to '+payload.email+'. Please check your spam folder too.':'Your enquiry reached our team, but we could not confirm the receipt email. There is no need to submit again.';dialog.append(receiptNote);
   const list=document.createElement('dl');for(const [label,value] of [['Reference',result.summary?.reference],['Name',payload.name],['Service',payload.issue],['Location',payload.location],['Preferred response',payload.contact_method],['Enquiry',payload.details],['Attachments',payload.files.length]]){const term=document.createElement('dt'),description=document.createElement('dd');term.textContent=label;description.textContent=String(value??'');list.append(term,description);}dialog.append(list);
   const close=document.createElement('button');close.className='button';close.type='button';close.textContent='Done';close.onclick=()=>dialog.close();dialog.append(close);dialog.showModal();
   event('enquiry_submitted',{audience:form.dataset.audience,message_variant:variant});
   form.reset();requestId=crypto.randomUUID();upload.setCustomValidity('');form.querySelector('.file-status').textContent='';
   form.querySelector('[name=contact_method]:checked').dispatchEvent(new Event('change'));
  }catch(error){status.textContent=error.name==='TimeoutError'?'We could not confirm submission. Please retry the same enquiry, or call (905) 429-9860.':error.message==='Failed to fetch'?'Connection failed. Please try again or call (905) 429-9860.':error.message;}
  finally{button.disabled=false;button.innerHTML=label;if(!document.querySelector('#enquiry-confirmation[open]'))status.focus();}
 });
}
for(const a of document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]'))a.addEventListener('click',()=>event(a.protocol==='tel:'?'phone_click':'email_click',{message_variant:variant}));

for(const button of document.querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{const filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('.work-tile').forEach(tile=>{tile.hidden=filter!=='All work'&&tile.dataset.category!==filter;if(!tile.hidden)count++;});document.querySelector('.gallery-empty').hidden=count>0;});
