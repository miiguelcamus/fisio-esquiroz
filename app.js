(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var H=window.DE_HOURS||[],Z=window.DE_ZONES||[];
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

// cabecera
var top=$('.top');function sc(){top.classList.toggle('sc',scrollY>20)}sc();addEventListener('scroll',sc,{passive:true});

// menú móvil
var bg=$('.burger'),mm=$('.mmenu');
if(bg)bg.addEventListener('click',function(){var o=bg.getAttribute('aria-expanded')!=='true';bg.setAttribute('aria-expanded',o);mm.classList.toggle('on',o);mm.setAttribute('aria-hidden',!o);document.body.style.overflow=o?'hidden':'';top.classList.toggle('sc',o||scrollY>20)});
$$('.mmenu a').forEach(function(a){a.addEventListener('click',function(){if(bg.getAttribute('aria-expanded')==='true')bg.click()})});

// abierto ahora
function mins(t){var p=t.split(':');return +p[0]*60+ +p[1]}
var now=new Date(),wd=(now.getDay()+6)%7,h=H[wd],m=now.getHours()*60+now.getMinutes(),txt,open=false;
if(h&&m>=mins(h[0])&&m<mins(h[1])){open=true;txt='Abierto ahora · hasta las '+h[1]}
else{for(var i=0;i<8;i++){var d=(wd+i)%7,x=H[d];if(!x)continue;if(i===0&&m<mins(x[0])){txt='Cerrado · abre hoy a las '+x[0];break}if(i>0){txt='Cerrado · abre '+(i===1?'mañana':['el lunes','el martes','el miércoles','el jueves','el viernes','el sábado','el domingo'][d])+' a las '+x[0];break}}}
$$('[data-open]').forEach(function(b){b.lastElementChild.textContent=txt;b.classList.toggle('cl',!open)});
$$('.hours li').forEach(function(li){if(+li.dataset.d===now.getDay())li.classList.add('today')});

// entrada escalonada: retraso según la posición dentro de su grupo
var io='IntersectionObserver' in window&&!RM?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -30px'}):null;
var grupos=new Map();
$$('.rv').forEach(function(el){var p=el.parentElement,n=grupos.get(p)||0;grupos.set(p,n+1);
 if(io){el.style.transitionDelay=Math.min(n,7)*90+'ms';io.observe(el)}else el.classList.add('in')});

// figuras decorativas: un punto se enciende por turnos
$$('.fig.late,.fig.mini').forEach(function(f){var hs=$$('.hs',f),k=0;if(!hs.length||RM)return;
 var lst=f.closest('.mapa')?$$('.zl a'):[];
 function on(i){hs.forEach(function(h,j){h.classList.toggle('on',j===i)});lst.forEach(function(a,j){a.classList.toggle('on',j===i)})}
 var t=setInterval(function(){k=(k+1)%hs.length;on(k)},2600);on(0);
 lst.forEach(function(a,j){a.addEventListener('mouseenter',function(){clearInterval(t);on(j)});a.addEventListener('focus',function(){clearInterval(t);on(j)})})});

// tratamientos: cuerpo + pestañas
var zp=$('.zp');
if(zp&&Z.length){
 var tabs=$$('.zb'),pts=$$('.fig.inter .hs');
 function pon(i,anim){var z=Z[i];
  tabs.forEach(function(x,j){x.classList.toggle('on',j===i);x.setAttribute('aria-selected',j===i)});
  pts.forEach(function(x,j){x.classList.toggle('on',j===i)});
  $('[data-zt]').textContent=z.t;$('[data-zh]').textContent=z.h;$('[data-zp]').textContent=z.p;
  $('[data-zq]').textContent='“'+z.q+'”';$('[data-za]').textContent=z.a;
  $('[data-zl]').href='reservar.html?m='+encodeURIComponent(z.t);
  if(anim){zp.classList.remove('sw-in');void zp.offsetWidth;zp.classList.add('sw-in')}}
 tabs.forEach(function(b,i){b.addEventListener('click',function(){pon(i,1)})});
 pts.forEach(function(p,i){p.addEventListener('click',function(){pon(i,1);if(innerWidth<1020)zp.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})});
  p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pon(i,1)}})});
 var qz=+new URLSearchParams(location.search).get('z');pon(qz>=0&&qz<Z.length?qz:0,0);
}

// reservar
var days=$('[data-days]');if(!days)return;
var st={m:null,d:null,t:null},slots=$('[data-slots]'),fm=$('[data-form]'),send=$('[data-send]');
var DN=['dom','lun','mar','mié','jue','vie','sáb'],MN=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
var ML=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
var DL=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
$$('[data-mot] .opt').forEach(function(b){b.addEventListener('click',function(){$$('[data-mot] .opt').forEach(function(x){x.classList.toggle('on',x===b)});st.m=b.dataset.v;sum()})});
var q=new URLSearchParams(location.search).get('m');
if(q){var mp={'Espalda':'Dolor de espalda','Cuello y hombro':'Cuello y hombro','Codo y brazo':'Codo o brazo','Lesiones deportivas':'Lesión deportiva','Contracturas':'Contracturas','Golpes y caídas':'Golpe o caída'}[q];var ob=$$('[data-mot] .opt').filter(function(b){return b.dataset.v===mp})[0];if(ob)ob.click()}
var base=new Date();base.setHours(0,0,0,0);
for(var i=0;i<16;i++){(function(i){var d=new Date(base);d.setDate(base.getDate()+i);var hh=H[(d.getDay()+6)%7];
 var b=document.createElement('button');b.type='button';b.innerHTML='<small>'+DN[d.getDay()]+'</small><b>'+d.getDate()+'</b><small>'+MN[d.getMonth()]+'</small>';
 b.setAttribute('aria-label',DL[d.getDay()]+' '+d.getDate()+' de '+ML[d.getMonth()]);
 if(!hh){b.disabled=true;b.title='Cerrado'}
 b.addEventListener('click',function(){$$('button',days).forEach(function(x){x.classList.toggle('on',x===b)});st.d=d;st.t=null;renderSlots();sum(1)});
 days.appendChild(b)})(i)}
function renderSlots(){slots.innerHTML='';var hh=H[(st.d.getDay()+6)%7],a=mins(hh[0]),z=mins(hh[1]),n=new Date();
 for(var m=a;m+60<=z;m+=60){(function(m){if(st.d.toDateString()===n.toDateString()&&m<=n.getHours()*60+n.getMinutes()+30)return;
  var t=Math.floor(m/60)+':'+('0'+m%60).slice(-2),b=document.createElement('button');b.type='button';b.textContent=t;
  b.addEventListener('click',function(){$$('button',slots).forEach(function(x){x.classList.toggle('on',x===b)});st.t=t;sum()});slots.appendChild(b)})(m)}
 if(!slots.children.length)slots.innerHTML='<p class="empty">Hoy ya no quedan horas. Prueba otro día.</p>'}
fm.addEventListener('input',function(){sum()});
function fd(d){return DL[d.getDay()]+' '+d.getDate()+' de '+ML[d.getMonth()]}
var hc=$('.hc');
function sum(tick){
 $('[data-s=m]').textContent=st.m||'—';$('[data-s=n]').textContent=fm.n.value.trim()||'—';
 if(st.d){$('[data-cd]').textContent=st.d.getDate();$('[data-cm]').textContent='Tu cita · '+ML[st.d.getMonth()];$('[data-cw]').textContent=DL[st.d.getDay()];}
 $('[data-ch]').textContent=st.t?'a las '+st.t:(st.d?'Elige una hora':'');
 if(tick){hc.classList.remove('tick');void hc.offsetWidth;hc.classList.add('tick')}
 send.disabled=!(st.m&&st.d&&st.t&&fm.n.value.trim()&&fm.t.value.trim())}
send.addEventListener('click',function(){var msg='Hola Diego, quería pedir cita.\n\nMotivo: '+st.m+'\nDía: '+fd(st.d)+' a las '+st.t+'\nNombre: '+fm.n.value.trim()+'\nTeléfono: '+fm.t.value.trim()+(fm.m.value.trim()?'\n\n'+fm.m.value.trim():'');
 window.open(window.DE_WA+'?text='+encodeURIComponent(msg),'_blank','noopener')});
})();
