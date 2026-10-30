import {createHash} from 'node:crypto';
const TO=['contact@thesignguyz.ca','andrew@thesignguyz.ca'];
const LIMIT=3*1024*1024;
const attempts=new Map();
const email=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
function clean(value,max,required=false){if(typeof value!=='string'||value.length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value))throw Error('Please check the form fields.');const s=value.trim();if(required&&!s)throw Error('Please complete the required fields.');return s;}
export function prepare(body,from){
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('Invalid form.');
 const name=clean(body.name,100,true), company=clean(body.company||'',140),location=clean(body.location,180,true),issue=clean(body.issue,120,true),details=clean(body.details,3000,true);
 const audience=clean(body.audience,40,true);if(!['business-owners','property-managers','sign-companies','other'].includes(audience))throw Error('Choose who you are enquiring for.');
 if(audience==='sign-companies'&&!company)throw Error('Enter your sign company.');
 const method=body.contact_method;if(!['email','phone'].includes(method))throw Error('Choose a contact method.');
 const customerEmail=clean(body.email,180,true);if(!email.test(customerEmail))throw Error('Enter a valid email for your receipt.');
 const contact=clean(body[method],method==='email'?180:35,true);
 if(method==='email'&&!email.test(contact)||method==='phone'&&!/^[+()\d .-]{7,35}$/.test(contact))throw Error('Enter a valid contact detail.');
 const date=clean(body.target_date||'',10);if(date&&!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Check the target date.');
 const files=body.files||[];if(!Array.isArray(files)||files.length>5)throw Error('Choose up to five files.');
 let total=0;const attachments=files.map((f,i)=>{
  if(!f||typeof f.content!=='string'||f.content.length>4*1024*1024||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(f.content))throw Error('Invalid attachment.');
  const bytes=Buffer.from(f.content,'base64');total+=bytes.length;if(!bytes.length||total>LIMIT)throw Error('Attachments must total 3 MB or less.');
  const hex=bytes.subarray(0,12).toString('hex');let ext;
  if(hex.startsWith('ffd8ff'))ext='jpg';else if(hex.startsWith('89504e470d0a1a0a'))ext='png';else if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')ext='webp';else if(bytes.subarray(0,5).toString()==='%PDF-')ext='pdf';else throw Error('Use JPG, PNG, WebP or PDF files.');
  const stem=clean(f.name||'attachment',180).replace(/\.[^.]*$/,'').replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,70)||'attachment';
  return {filename:`${i+1}-${stem}.${ext}`,content:f.content};
 });
 const page=clean(body.landing_page||'',300);
 const text=[`Name: ${name}`,`Company: ${company||'Not supplied'}`,`Customer group: ${audience}`,`Preferred contact: ${method}`,`Contact: ${contact}`,`Receipt email: ${customerEmail}`,`Site location: ${location}`,`Service: ${issue}`,`Target date: ${date||'Not supplied'}`,`Discuss aftercare: ${body.aftercare==='yes'?'Yes':'No'}`,`\nProject details:\n${details}`,`\nWebsite page: ${page}`].join('\n');
 return {from,to:TO,subject:`Website enquiry: ${issue.replace(/[\r\n]/g,' ')} (${location.replace(/[\r\n]/g,' ')})`,text,reply_to:customerEmail,...(attachments.length?{attachments}:{})};
}
export function makeHandler({env=process.env,send=fetch,now=Date.now}={}){return async(req,res)=>{
 const reply=(code,message,extra={})=>res.status(code).json({ok:code===200,message,...extra});res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return reply(405,'Use the enquiry form.');}
 const origins=(env.ENQUIRY_ALLOWED_ORIGINS||env.SITE_URL||'https://thesignguyz.ca').split(',').map(x=>x.trim().replace(/\/$/,''));
 if(!origins.includes(req.headers.origin))return reply(403,'Please submit from our website.');
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return reply(415,'Invalid form format.');
 if(Number(req.headers['content-length']||0)>4300000)return reply(413,'Attachments must total 3 MB or less.');
 if(!env.RESEND_API_KEY||!env.RESEND_FROM)return reply(503,'Online enquiries are temporarily unavailable. Please call (905) 429-9860 or email contact@thesignguyz.ca.');
 let body=req.body;if(typeof body==='string'){try{body=JSON.parse(body);}catch{return reply(400,'Invalid form.');}}
 if(body?.website)return reply(400,'Unable to submit this enquiry.');
 const ip=createHash('sha256').update(String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||'unknown').split(',')[0]).digest('hex');
 for(const [k,v] of attempts)if(v.until<now())attempts.delete(k);
 const rate=attempts.get(ip)||{count:0,until:now()+600000};if(rate.count>=8){res.setHeader('Retry-After','600');return reply(429,'Please wait a few minutes before trying again.');}rate.count++;if(attempts.size<10000||attempts.has(ip))attempts.set(ip,rate);
 let message;try{message=prepare(body,env.RESEND_FROM);}catch(e){return reply(400,e.message);}
 const key=String(body.request_id||'');if(!/^[0-9a-f-]{36}$/i.test(key))return reply(400,'Refresh the page and try again.');
 const digest=createHash('sha256').update(JSON.stringify(message)).digest('hex');
 try{
  const response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`enquiry-${key}-${digest}`},body:JSON.stringify(message),signal:AbortSignal.timeout(15000)});
  const result=await response.json();if(!response.ok||!result.id)return reply(502,'We could not confirm submission. Please try again, or call (905) 429-9860.');
  const reference='SG-'+key.slice(0,8).toUpperCase();
  const confirmation='Thank you for your enquiry. Your submission has been received, and you can expect a response in less than 24 hours.';
  const summary={reference,name:body.name.trim(),service:body.issue.trim(),location:body.location.trim(),details:body.details.trim(),email:body.email.trim(),contactMethod:body.contact_method,phone:body.contact_method==='phone'?body.phone.trim():'',attachments:message.attachments?.length||0};
  const receipt={from:env.RESEND_FROM,to:[summary.email],reply_to:'contact@thesignguyz.ca',subject:'Your enquiry has been received | The Sign Guyz | '+reference,text:[confirmation,'','Reference: '+reference,'Name: '+summary.name,'Service: '+summary.service,'Location: '+summary.location,'Preferred response: '+summary.contactMethod,(summary.phone?'Phone: '+summary.phone:''),'','Your enquiry:',summary.details,'','Attachments received: '+summary.attachments,'','If you need to add anything, reply to this email or call (905) 429-9860.','The Sign Guyz'].filter(x=>x!==undefined).join('\n')};
  let receiptSent=false;
  try{const receiptResponse=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`receipt-${key}-${digest}`},body:JSON.stringify(receipt),signal:AbortSignal.timeout(10000)});const receiptResult=await receiptResponse.json();receiptSent=receiptResponse.ok&&Boolean(receiptResult.id);}catch{}
  return reply(200,confirmation,{summary,receiptSent});
 }catch{return reply(502,'We could not confirm submission. Please retry the same enquiry, or call (905) 429-9860.');}
};}
export default makeHandler();
