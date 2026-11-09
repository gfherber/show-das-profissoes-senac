/* =====================================================================
   A PARTIR DAQUI É O FUNCIONAMENTO DO JOGO
   ===================================================================== */
const $ = s => document.querySelector(s);
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; };
const store = {
  get(k,d){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
};
const show = id => { for(const s of document.querySelectorAll(".screen")) s.hidden = s.id!==id; };

/* logo em todas as telas */
function renderLogo(el){
  if(LOGO_SRC){ el.innerHTML='<span class="un">Taquara</span>'; const img=new Image(); img.src=LOGO_SRC; img.alt="Senac"; el.prepend(img); }
  else el.innerHTML='<span class="wm">Senac</span><span class="un">Taquara</span>';
}
renderLogo($("#brand")); document.querySelectorAll("[data-logo]").forEach(renderLogo);

/* som */
let ac=null;
function audioOn(){ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(ac&&ac.state==="suspended") ac.resume(); }
function tone(f,d,type="sine",v=.15,w=0){ if(!ac) return; const t=ac.currentTime+w,o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(ac.destination);o.start(t);o.stop(t+d); }
const sfx={
  ok(){ [523,659,784,1047].forEach((f,i)=>tone(f,.25,"triangle",.18,i*.09)); },
  bad(){ tone(240,.3,"sawtooth",.12); tone(170,.5,"sawtooth",.12,.25); },
  tick(){ tone(1400,.04,"square",.04); },
  pick(){ tone(440,.12,"triangle",.12); },
  win(){ [523,659,784,659,784,1047].forEach((f,i)=>tone(f,.3,"triangle",.2,i*.12)); },
};

/* tela inicial */
const TEASERS=["O que faz um Técnico em Desenvolvimento de Sistemas?","Quem cria o app do banco no seu celular?","Quem faz os produtos chegarem na prateleira?","Quem monta seus óculos?","Quem cria anúncios no Instagram?","Quem faz fotos aéreas com drone?"];
let tIdx=0;
setInterval(()=>{ const el=$("#teaser"); el.style.opacity=0; setTimeout(()=>{ tIdx=(tIdx+1)%TEASERS.length; el.textContent=TEASERS[tIdx]; el.style.opacity=1; },500); },3500);
$("#attract").addEventListener("click",e=>{
  if(e.target.closest("#brand")) return;
  audioOn();
  try{ if(!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{}); }catch(err){}
  startGame();
});

/* jogo */
let G=null, timerId=null;
function novaFila(){
  const devs=shuffle(BANCO.filter(q=>q.dev)), others=shuffle(BANCO.filter(q=>!q.dev));
  // 1 de Desenvolvimento entre as 3 primeiras, o resto misturado
  const fila=[...others]; fila.splice(Math.random()*3|0,0,devs[0]);
  return fila.concat(devs.slice(1));
}
function startGame(){
  G={fila:novaFila(), atual:null, acertos:0, feitas:0, elim:true, skip:true, locked:false, spun:false};
  $("#h-elim").disabled=false; $("#h-skip").disabled=false;
  proxima();
}
function proxima(){
  if(!G.fila.length) G.fila=novaFila();
  G.atual=G.fila.shift(); G.feitas++;
  show("game"); renderQ();
}
function renderEscada(){
  const L=$("#escada"); L.innerHTML="";
  for(let i=0;i<ACERTOS_PARA_ROLETA;i++){
    const el=document.createElement("i"); el.textContent=i+1;
    if(i<G.acertos) el.className="ok"; else if(i===G.acertos) el.className="cur";
    L.appendChild(el);
  }
  $("#premio").innerHTML=`<small>Valendo</small>${PREMIOS[Math.min(G.acertos,PREMIOS.length-1)]} pts`;
}
function renderQ(){
  const Q=G.atual; G.locked=false;
  renderEscada();
  $("#qtext").textContent=Q.q;
  const box=$("#opts"); box.innerHTML="";
  shuffle([0,1,2,3]).forEach((oi,pos)=>{
    const b=document.createElement("button"); b.className="opt"; b.dataset.oi=oi;
    b.innerHTML=`<b>${"ABCD"[pos]}</b><span></span>`; b.querySelector("span").textContent=Q.o[oi];
    b.addEventListener("click",()=>answer(b)); box.appendChild(b);
  });
  $("#h-elim").disabled=!G.elim; $("#h-skip").disabled=!G.skip;
  startTimer();
}
function startTimer(){
  clearInterval(timerId);
  $("#timer").hidden = !(TEMPO_POR_PERGUNTA>0); if(!(TEMPO_POR_PERGUNTA>0)) return;
  const bar=$("#timerbar"), wrap=$("#timer"), t0=performance.now(); let lastSec=TEMPO_POR_PERGUNTA;
  wrap.classList.remove("low"); bar.style.transform="scaleX(1)";
  timerId=setInterval(()=>{
    const left=TEMPO_POR_PERGUNTA-(performance.now()-t0)/1000;
    bar.style.transform=`scaleX(${Math.max(0,left/TEMPO_POR_PERGUNTA)})`;
    if(left<=5){ wrap.classList.add("low"); if(Math.ceil(left)<lastSec){ lastSec=Math.ceil(left); sfx.tick(); } }
    if(left<=0){ clearInterval(timerId); answer(null); }
  },100);
}
function answer(btn){
  if(G.locked) return; G.locked=true; clearInterval(timerId);
  const all=[...document.querySelectorAll(".opt")]; all.forEach(b=>b.disabled=true);
  const certo=all.find(b=>b.dataset.oi==="0"), acertou=btn===certo;
  const revela=()=>{
    certo.classList.remove("pick"); certo.classList.add("right");
    if(btn&&!acertou){ btn.classList.remove("pick"); btn.classList.add("wrong"); }
    acertou?sfx.ok():sfx.bad();
    if(acertou) G.acertos++;
    setTimeout(()=>telaResposta(acertou,!btn),1100);
  };
  if(btn){ btn.classList.add("pick"); sfx.pick(); setTimeout(revela,1000); } else revela();
}
function telaResposta(acertou,tempo){
  const Q=G.atual, C=CURSOS[Q.c]||{}, sec=$("#answer");
  sec.className="screen "+(acertou?"certo":"errado");
  $("#aicon").textContent=acertou?"✓":"✕";
  $("#atitle").textContent=acertou?"Resposta certa!":(tempo?"Tempo esgotado!":"Resposta errada!");
  const resp=Q.o[0];
  $("#atext").innerHTML = acertou ? "Mandou muito bem! Conheça o curso dessa profissão:" : `A resposta certa era: <b></b>`;
  if(!acertou) $("#atext b").textContent=resp;
  $("#cmod").textContent=C.mod||"";
  $("#cnome").textContent=Q.c;
  $("#cdesc").textContent=Q.i;
  const v=x=>x&&x.trim()?x:"Consulte a equipe";
  $("#cdados").innerHTML="";
  [["Início das aulas",C.inicio],["Carga horária",C.carga],["Dias e horário",C.horario,true]].forEach(([k,val,full])=>{
    const d=document.createElement("div"); d.className="dado"+(full?" full":"");
    d.innerHTML="<span></span><strong></strong>"; d.querySelector("span").textContent=k; d.querySelector("strong").textContent=v(val);
    $("#cdados").appendChild(d);
  });
  const falta=ACERTOS_PARA_ROLETA-G.acertos;
  $("#aprog").innerHTML = falta<=0 ? "Você completou os <b>5 acertos</b>!" : `Faltam <b>${falta} acerto${falta>1?"s":""}</b> para liberar a roleta`;
  $("#next").textContent = falta<=0 ? "Liberar a roleta 🎡" : (acertou ? "Próxima pergunta" : "Tentar outra pergunta");
  show("answer");
}
$("#next").addEventListener("click",()=>{
  if(G.acertos>=ACERTOS_PARA_ROLETA){ show("result"); sfx.win(); confetti(); }
  else proxima();
});
$("#h-elim").addEventListener("click",()=>{
  if(!G.elim||G.locked) return; G.elim=false; $("#h-elim").disabled=true; sfx.pick();
  shuffle([...document.querySelectorAll(".opt")].filter(b=>b.dataset.oi!=="0")).slice(0,2).forEach(b=>{ b.classList.add("gone"); b.disabled=true; });
});
$("#h-skip").addEventListener("click",()=>{
  if(!G.skip||G.locked) return; G.skip=false; sfx.pick();
  if(!G.fila.length) G.fila=novaFila();
  const cur=G.atual; let k=cur.dev?G.fila.findIndex(q=>q.dev):0; if(k<0) k=0;
  G.atual=G.fila.splice(k,1)[0]; renderQ();
});

/* roleta */
const SEG=5, CORES=["#004A8D","#F7941D","#1F6DB8","#FFFFFF","#00336A"], TXT=["#fff","#fff","#fff","#004A8D","#fff"];
let rot=0;
function drawWheel(){
  const c=$("#wc"), dpr=window.devicePixelRatio||1, size=c.clientWidth; if(!size) return;
  c.width=size*dpr; c.height=size*dpr;
  const x=c.getContext("2d"); x.setTransform(dpr,0,0,dpr,0,0);
  const r=size/2, a=2*Math.PI/SEG;
  x.clearRect(0,0,size,size); x.save(); x.translate(r,r); x.rotate(rot*Math.PI/180);
  for(let i=0;i<SEG;i++){
    const s=-Math.PI/2+i*a;
    x.beginPath(); x.moveTo(0,0); x.arc(0,0,r*.95,s,s+a); x.closePath(); x.fillStyle=CORES[i]; x.fill();
    x.lineWidth=size*.01; x.strokeStyle="#F7941D"; x.stroke();
    x.save(); x.rotate(s+a/2); x.translate(r*.62,0); x.rotate(Math.PI/2);
    x.fillStyle=TXT[i]; x.textAlign="center"; x.textBaseline="middle";
    x.font=`900 ${size*.2}px Montserrat,"Arial Black",sans-serif`; x.fillText(String(i+1),0,0); x.restore();
  }
  x.beginPath(); x.arc(0,0,r*.95,0,2*Math.PI); x.lineWidth=size*.035; x.strokeStyle="#FFFFFF"; x.stroke();
  for(let i=0;i<20;i++){ const t=i/20*2*Math.PI; x.beginPath(); x.arc(Math.cos(t)*r*.95,Math.sin(t)*r*.95,size*.009,0,2*Math.PI); x.fillStyle=i%2?"#F7941D":"#004A8D"; x.fill(); }
  x.restore();
  x.beginPath(); x.arc(r,r,r*.18,0,2*Math.PI); x.fillStyle="#FFFFFF"; x.fill(); x.lineWidth=size*.02; x.strokeStyle="#F7941D"; x.stroke();
  x.fillStyle="#004A8D"; x.font=`900 ${size*.055}px Montserrat,"Arial Black",sans-serif`; x.textAlign="center"; x.textBaseline="middle"; x.fillText("Senac",r,r);
}
window.addEventListener("resize",()=>{ if(!$("#wheel").hidden) drawWheel(); });
$("#towheel").addEventListener("click",()=>{ show("wheel"); $("#spin").disabled=false; requestAnimationFrame(drawWheel); });

const lerBrindes=()=>store.get("brindes",{on:[1,1,1,1,1],n:[0,0,0,0,0]});
function sortear(){ const st=lerBrindes(); let pool=[]; st.on.forEach((v,i)=>{ if(v) pool.push(i); }); if(!pool.length) pool=[0,1,2,3,4]; return pool[Math.random()*pool.length|0]; }
$("#spin").addEventListener("click",()=>{
  if(G.spun) return; G.spun=true; audioOn(); $("#spin").disabled=true;
  const win=sortear(), segDeg=360/SEG, jitter=(Math.random()-.5)*segDeg*.7;
  const start=rot, target=(rot-rot%360)+360*6+(360-(win*segDeg+segDeg/2+jitter)), delta=target-start, dur=5200, t0=performance.now();
  const segAt=r=>Math.floor((((360-(r%360))%360)+360)%360/segDeg);
  let last=segAt(start);
  (function step(now){
    const p=Math.min(1,(now-t0)/dur); rot=start+delta*(1-Math.pow(1-p,4)); drawWheel();
    const s=segAt(rot); if(s!==last){ last=s; sfx.tick(); }
    if(p<1) requestAnimationFrame(step); else fim(win);
  })(t0);
});
function fim(win){
  const st=lerBrindes(); st.n[win]++; store.set("brindes",st);
  setTimeout(()=>{ $("#rnum").textContent=win+1; $("#reveal").hidden=false; sfx.win(); confetti(); },500);
}
$("#finish").addEventListener("click",reset);
function reset(){ clearInterval(timerId); $("#reveal").hidden=true; G=null; show("attract"); }

/* confete */
function confetti(){
  const c=$("#confetti"), x=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const cols=["#F7941D","#FFFFFF","#004A8D","#12A150","#FFC56B"];
  const ps=Array.from({length:160},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,s:6+Math.random()*8,r:Math.random()*6,vr:(Math.random()-.5)*.3,col:cols[Math.random()*cols.length|0]}));
  const t0=performance.now();
  (function f(now){ x.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{ p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.r+=p.vr; x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.col;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore(); });
    if(now-t0<4500) requestAnimationFrame(f); else x.clearRect(0,0,c.width,c.height); })(t0);
}

/* painel do operador: segure a logo da tela inicial por 3 segundos */
let pressT=null;
$("#brand").addEventListener("pointerdown",()=>{ pressT=setTimeout(()=>{ renderPanel(); $("#panel").hidden=false; },3000); });
["pointerup","pointerleave","pointercancel"].forEach(ev=>$("#brand").addEventListener(ev,()=>clearTimeout(pressT)));
function renderPanel(){
  const st=lerBrindes(), box=$("#prows"); box.innerHTML="";
  for(let i=0;i<SEG;i++){
    const row=document.createElement("div"); row.className="row";
    row.innerHTML=`<span>Brinde ${i+1} <em>· ${st.n[i]} sorteados</em></span><button class="${st.on[i]?"":"off"}">${st.on[i]?"Disponível":"Esgotado"}</button>`;
    row.querySelector("button").addEventListener("click",()=>{ st.on[i]=st.on[i]?0:1; store.set("brindes",st); renderPanel(); });
    box.appendChild(row);
  }
}
$("#preset").addEventListener("click",()=>{ const st=lerBrindes(); st.n=[0,0,0,0,0]; store.set("brindes",st); renderPanel(); });
$("#pclose").addEventListener("click",()=>{ $("#panel").hidden=true; });

/* volta sozinho se ficar parado */
let idle=Date.now();
document.addEventListener("pointerdown",()=>{ idle=Date.now(); },true);
setInterval(()=>{ if(VOLTAR_SE_PARADO>0 && $("#attract").hidden && $("#panel").hidden && Date.now()-idle>VOLTAR_SE_PARADO*1000){ idle=Date.now(); reset(); } },1000);
document.addEventListener("contextmenu",e=>e.preventDefault());
