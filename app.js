(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var H=window.DE_HOURS||[];
// header shadow
var top=$('.top');addEventListener('scroll',function(){top.classList.toggle('sc',scrollY>8)},{passive:true});
// mobile menu
var bg=$('.burger'),mm=$('.mmenu');
if(bg)bg.addEventListener('click',function(){var o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);mm.classList.toggle('on',o);mm.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':''});
$$('.mmenu a').forEach(function(a){a.addEventListener('click',function(){bg.click()})});
// open now
function mins(t){var p=t.split(':');return +p[0]*60+ +p[1]}
var now=new Date(),wd=(now.getDay()+6)%7,h=H[wd],m=now.getHours()*60+now.getMinutes();
var txt,open=false;
if(h&&m>=mins(h[0])&&m<mins(h[1])){open=true;txt='Abierto ahora · hasta las '+h[1]}
else{for(var i=0;i<8;i++){var d=(wd+i)%7,x=H[d];if(!x)continue;if(i===0&&m<mins(x[0])){txt='Cerrado · abre hoy a las '+x[0];break}if(i>0){txt='Cerrado · abre '+(i===1?'mañana':['el lunes','el martes','el miércoles','el jueves','el viernes','el sábado','el domingo'][d])+' a las '+x[0];break}}}
$$('[data-open]').forEach(function(b){b.lastElementChild.textContent=txt;b.classList.toggle('cl',!open)});
$$('.hours li').forEach(function(li){if(+li.dataset.d===now.getDay())li.classList.add('today')});
// reveal
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px'}):null;
$$('.rv').forEach(function(el,i){if(io){el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)}else el.classList.add('in')});
// zones
var Z=window.DE_ZONES;
if(Z){var zp=$('.zp');$$('.zb').forEach(function(b){b.addEventListener('click',function(){
 $$('.zb').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
 var z=Z[+b.dataset.z];$('[data-zt]').textContent=z.t;$('[data-zh]').textContent=z.h;$('[data-zp]').textContent=z.p;$('[data-zq]').textContent=z.q;$('[data-za]').textContent=z.a;
 $('[data-zl]').href='reservar.html?m='+encodeURIComponent(z.t);
 zp.classList.remove('sw-in');void zp.offsetWidth;zp.classList.add('sw-in')})})}
// booking
var days=$('[data-days]');if(!days)return;
var st={m:null,d:null,t:null},slots=$('[data-slots]'),fm=$('[data-form]'),send=$('[data-send]');
var DN=['dom','lun','mar','mié','jue','vie','sáb'],MN=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
var DL=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
$$('[data-mot] .opt').forEach(function(b){b.addEventListener('click',function(){$$('[data-mot] .opt').forEach(function(x){x.classList.toggle('on',x===b)});st.m=b.dataset.v;sum()})});
var q=new URLSearchParams(location.search).get('m');
if(q){var mp={'Espalda':'Dolor de espalda','Cuello y hombro':'Cuello y hombro','Codo y brazo':'Codo o brazo','Lesiones deportivas':'Lesión deportiva','Contracturas':'Contracturas','Golpes y caídas':'Golpe o caída'}[q];var ob=$$('[data-mot] .opt').filter(function(b){return b.dataset.v===mp})[0];if(ob)ob.click()}
var base=new Date();base.setHours(0,0,0,0);
for(var i=0;i<16;i++){(function(i){var d=new Date(base);d.setDate(base.getDate()+i);var hh=H[(d.getDay()+6)%7];
 var b=document.createElement('button');b.type='button';b.innerHTML='<small>'+DN[d.getDay()]+'</small><b>'+d.getDate()+'</b><small>'+MN[d.getMonth()]+'</small>';
 b.setAttribute('aria-label',DL[d.getDay()]+' '+d.getDate());
 if(!hh){b.disabled=true;b.title='Cerrado'}
 b.addEventListener('click',function(){$$('button',days).forEach(function(x){x.classList.toggle('on',x===b)});st.d=d;st.t=null;renderSlots();sum()});
 days.appendChild(b)})(i)}
function renderSlots(){slots.innerHTML='';var hh=H[(st.d.getDay()+6)%7],a=mins(hh[0]),z=mins(hh[1]),n=new Date();
 for(var m=a;m+60<=z;m+=60){(function(m){if(st.d.toDateString()===n.toDateString()&&m<=n.getHours()*60+n.getMinutes()+30)return;
  var t=Math.floor(m/60)+':'+('0'+m%60).slice(-2),b=document.createElement('button');b.type='button';b.textContent=t;
  b.addEventListener('click',function(){$$('button',slots).forEach(function(x){x.classList.toggle('on',x===b)});st.t=t;sum()});slots.appendChild(b)})(m)}
 if(!slots.children.length)slots.innerHTML='<p class="empty">Hoy ya no quedan horas. Prueba otro día.</p>'}
fm.addEventListener('input',sum);
function fd(d){return DL[d.getDay()]+' '+d.getDate()+' de '+['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][d.getMonth()]}
function sum(){$('[data-s=m]').textContent=st.m||'—';$('[data-s=d]').textContent=st.d?fd(st.d)+(st.t?' · '+st.t:''):'—';$('[data-s=n]').textContent=fm.n.value.trim()||'—';
 send.disabled=!(st.m&&st.d&&st.t&&fm.n.value.trim()&&fm.t.value.trim())}
send.addEventListener('click',function(){var msg='Hola Diego, quería pedir cita.\n\nMotivo: '+st.m+'\nDía: '+fd(st.d)+' a las '+st.t+'\nNombre: '+fm.n.value.trim()+'\nTeléfono: '+fm.t.value.trim()+(fm.m.value.trim()?'\n\n'+fm.m.value.trim():'');
 window.open(window.DE_WA+'?text='+encodeURIComponent(msg),'_blank','noopener')});
})();
