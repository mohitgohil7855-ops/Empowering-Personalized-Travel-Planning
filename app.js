const GT = (() => {
  const api = async (url, options={}) => {
    const opts = {...options, credentials:'include', headers:{'Content-Type':'application/json', ...(options.headers||{})}};
    const r = await fetch(url, opts);
    let data={}; try { data=await r.json(); } catch(e) {}
    if(!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
    return data;
  };
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const toast=(msg,type='info')=>{let t=$('#gt-toast');if(!t){t=document.createElement('div');t.id='gt-toast';t.style.cssText='position:fixed;right:24px;bottom:24px;z-index:99999;padding:14px 18px;border-radius:12px;background:#131b2e;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.2);font:600 14px Inter,sans-serif;max-width:360px';document.body.appendChild(t)}t.textContent=msg;t.style.background=type==='error'?'#b42318':'#131b2e';clearTimeout(window.__gt);window.__gt=setTimeout(()=>t.remove(),3500)};
  const go=(file)=>{location.href=file};
  const me=()=>api('/api/auth/me');
  const requireLogin=async()=>{const d=await me();if(!d.user){toast('Please log in first','error');setTimeout(()=>go('globetrotter_login.html'),600);return null}return d.user};
  function bindNavigation(){
    const map={
      'Dashboard':'globetrotter_dashboard.html','Trips':'globetrotter_my_trips.html','My Trips':'globetrotter_my_trips.html','Plan':'globetrotter_itinerary_builder.html','Planner':'globetrotter_itinerary_builder.html','Itinerary':'globetrotter_itinerary_view.html','Explore':'globetrotter_city_search.html','Discover':'globetrotter_city_search.html','Calendar':'globetrotter_dynamic_trip_calendar.html','Budget':'globetrotter_trip_budget_cost_breakdown.html','Profile':'globetrotter_user_profile_settings.html','Settings':'globetrotter_user_profile_settings.html','Log In':'globetrotter_login.html','Register':'globetrotter_register.html','Start Planning':'globetrotter_start_planning.html','Create Trip':'globetrotter_start_planning.html','Plan a New Trip':'globetrotter_start_planning.html'
    };
    $$('a,button').forEach(el=>{const txt=el.textContent.trim().replace(/\s+/g,' '); if(map[txt] && (el.tagName==='BUTTON'||el.getAttribute('href')==='#'||el.getAttribute('href')?.includes('{{DATA:SCREEN'))){el.addEventListener('click',e=>{e.preventDefault();go(map[txt])})}});
  }
  async function authForms(){
    const path=location.pathname;
    if(path.includes('register')){
      const form=$('form'), name=$('#fullName'), email=$('#email'), pass=$('#password');
      const submit=$$('button').find(b=>/create account|sign up/i.test(b.textContent));
      if(submit)submit.addEventListener('click',async e=>{e.preventDefault();try{const d=await api('/api/auth/register',{method:'POST',body:JSON.stringify({fullName:name?.value,email:email?.value,password:pass?.value})});toast('Account created');setTimeout(()=>go('globetrotter_dashboard.html'),600)}catch(x){toast(x.message,'error')}});
      if(form)form.addEventListener('submit',e=>e.preventDefault());
    }
    if(path.includes('login')){
      const form=$('#loginForm')||$('form'), email=$('#email'), pass=$('#password');
      if(form)form.addEventListener('submit',async e=>{e.preventDefault();try{await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:email?.value,password:pass?.value})});toast('Welcome back');setTimeout(()=>go('globetrotter_dashboard.html'),500)}catch(x){toast(x.message,'error')}});
      $$('button').filter(b=>/^Sign in with Google$/i.test(b.textContent.trim())).forEach(b=>b.addEventListener('click',()=>toast('Google sign-in is a demo button; use email/password for the hackathon demo.')));
    }
  }
  function modal(title, fields, onSave){
    const old=$('#gt-modal'); if(old)old.remove();
    const m=document.createElement('div');m.id='gt-modal';m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:99998;display:grid;place-items:center;padding:20px';
    const box=document.createElement('div');box.style.cssText='width:min(560px,100%);background:white;border-radius:20px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:Inter,sans-serif';
    box.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><h2 style="font:700 22px Montserrat;margin:0">${title}</h2><button id="gt-close" style="border:0;background:#eee;border-radius:10px;padding:7px 10px">✕</button></div><div id="gt-fields" style="display:grid;gap:12px"></div><button id="gt-save" style="margin-top:18px;width:100%;padding:12px;border:0;border-radius:12px;background:#00668a;color:white;font-weight:700">Save</button>`;
    m.appendChild(box);document.body.appendChild(m);const wrap=$('#gt-fields',box);fields.forEach(f=>{const lab=document.createElement('label');lab.style.cssText='display:grid;gap:6px;font-size:13px;font-weight:600';lab.innerHTML=`${f.label}<input id="${f.id}" type="${f.type||'text'}" value="${f.value||''}" placeholder="${f.placeholder||''}" style="padding:11px;border:1px solid #ddd;border-radius:10px;font:inherit">`;wrap.appendChild(lab)});
    $('#gt-close',box).onclick=()=>m.remove();$('#gt-save',box).onclick=async()=>{const d={};fields.forEach(f=>d[f.id]=$('#'+f.id,box).value);try{await onSave(d);m.remove()}catch(e){toast(e.message,'error')}};
  }
  async function createTrip(){
    const u=await requireLogin();if(!u)return;
    modal('Create a new trip',[{id:'title',label:'Trip name',placeholder:'Italian Alps Escape'},{id:'destination',label:'Destination',placeholder:'Switzerland'},{id:'start_date',label:'Start date',type:'date'},{id:'end_date',label:'End date',type:'date'},{id:'travelers',label:'Travelers',type:'number',value:'2'},{id:'budget',label:'Budget',type:'number',value:'0'}],async d=>{const r=await api('/api/trips',{method:'POST',body:JSON.stringify(d)});toast('Trip saved');location.href='globetrotter_itinerary_builder.html?trip_id='+r.trip.id});
  }
  async function addActivity(){
    const u=await requireLogin();if(!u)return;let trips=(await api('/api/trips')).trips;if(!trips.length){toast('Create a trip first','error');return}
    modal('Add itinerary activity',[{id:'trip_id',label:'Trip ID',value:String(trips[0].id),type:'number'},{id:'title',label:'Activity title',placeholder:'Museum visit'},{id:'date',label:'Date',type:'date'},{id:'start_time',label:'Start time',type:'time'},{id:'end_time',label:'End time',type:'time'},{id:'notes',label:'Notes'}],async d=>{await api('/api/itinerary',{method:'POST',body:JSON.stringify({...d,day_number:1})});toast('Activity added')});
  }
  async function liveTrips(){
    if(!['globetrotter_dashboard.html','globetrotter_my_trips.html','globetrotter_dynamic_trip_calendar.html'].some(x=>location.pathname.endsWith(x)))return;
    try{const d=await api('/api/trips');const section=document.createElement('section');section.id='gt-live-trips';section.style.cssText='margin:24px 0;padding:20px;border-radius:18px;background:#fff;border:1px solid #e5e7eb';section.innerHTML='<h2 style="font:700 20px Montserrat;margin:0 0 14px">Your live trips</h2>'+(d.trips.length?d.trips.map(t=>`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #eee"><div><b>${esc(t.title)}</b><div style="font-size:13px;color:#667">${esc(t.destination)} · ${esc(t.start_date||'No date')} → ${esc(t.end_date||'')}</div></div><button data-trip="${t.id}" style="padding:8px 12px;border:0;border-radius:10px;background:#00668a;color:white">Open</button></div>`).join(''):'<p style="color:#667">No saved trips yet. Use Create Trip to add one.</p>');const main=$('main')||document.body;main.prepend(section);section.querySelectorAll('[data-trip]').forEach(b=>b.onclick=()=>go('globetrotter_itinerary_view.html?trip_id='+b.dataset.trip));}catch(e){if(!e.message.includes('Login'))console.warn(e)}
  }
  async function searchPages(){
    if(location.pathname.includes('city_search')){const input=$$('input').find(i=>(i.placeholder||'').includes('Find cities'));const btn=$$('button').find(b=>b.textContent.trim()==='Search');const run=async()=>{const d=await api('/api/search/destinations?q='+encodeURIComponent(input?.value||''));renderResults('Destinations',d.results,r=>`<b>${esc(r.name)}</b> · ${esc(r.country)}<div style="font-size:13px;color:#667">${esc(r.description)}</div>`)};btn?.addEventListener('click',run);run()}
    if(location.pathname.includes('activity_search')){const input=$$('input').find(i=>(i.placeholder||'').includes('Search activities'));const btn=$$('button').find(b=>b.textContent.trim()==='sort Group by')||null;input?.addEventListener('keydown',e=>{if(e.key==='Enter')run()});async function run(){const d=await api('/api/search/activities?q='+encodeURIComponent(input?.value||''));renderResults('Activities',d.results,r=>`<b>${esc(r.name)}</b> · ${esc(r.city)} · $${r.price}<div style="font-size:13px;color:#667">${esc(r.description)}</div>`)}run()}
  }
  function renderResults(title,rows,fn){let old=$('#gt-results');if(old)old.remove();const box=document.createElement('section');box.id='gt-results';box.style.cssText='margin:20px 0;padding:18px;background:#fff;border:1px solid #e5e7eb;border-radius:18px;font-family:Inter';box.innerHTML=`<h2 style="font:700 20px Montserrat;margin:0 0 12px">Live ${title}</h2>`+(rows.length?rows.map(x=>`<div style="padding:12px 0;border-bottom:1px solid #eee">${fn(x)}</div>`).join(''):'<p>No results found.</p>');($('main')||document.body).prepend(box)}
  async function profile(){if(!location.pathname.includes('user_profile_settings'))return;try{const d=await me();if(!d.user)return;const inputs=$$('input');const email=inputs.find(i=>i.type==='email');if(email)email.value=d.user.email;const text=inputs.filter(i=>i.type==='text');if(text[0])text[0].value=d.user.full_name;const phone=inputs.find(i=>i.type==='tel');if(phone)phone.value=d.user.phone||'';const edit=$$('button').find(b=>b.textContent.trim()==='Edit');edit?.addEventListener('click',()=>toast('Profile fields are connected to the logged-in account.'))}catch(e){}}
  async function admin(){if(!location.pathname.includes('admin_analytics'))return;try{const d=await api('/api/admin/stats');renderResults('Admin live stats',[d],x=>`Users: <b>${x.users}</b> · Trips: <b>${x.trips}</b> · Payments: <b>${x.payments}</b> · Revenue: <b>${x.revenue}</b>`)}catch(e){toast(e.message,'error')}}
  async function wireButtons(){
    $$('button').forEach(b=>{const t=b.textContent.trim().replace(/\s+/g,' ');if(/^(Create Trip|Plan a New Trip|Get Started)$/i.test(t))b.addEventListener('click',e=>{e.preventDefault();createTrip()});if(/^Add Activity$/i.test(t))b.addEventListener('click',e=>{e.preventDefault();addActivity()});if(/^Copy Trip$/i.test(t))b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('Trip link copied')}catch(e){toast('Copy failed','error')}});if(/^Delete Account$/i.test(t))b.addEventListener('click',()=>toast('Demo account deletion is disabled in hackathon mode.'))});
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  return {init:async()=>{bindNavigation();await authForms();await searchPages();await liveTrips();await profile();await admin();await wireButtons()}};
})();
document.addEventListener('DOMContentLoaded',()=>GT.init());
