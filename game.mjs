import {cars,tracks,worlds,clamp,makeCourse} from './catalog.mjs';
import {LAPS,Race} from './race.mjs';
import {drawCar,makeBoard,paintBoard} from './paper-view.mjs';

const $=id=>document.getElementById(id);
const canvas=$('game'), g=canvas.getContext('2d');
const preview=$('model').getContext('2d');
const keys=new Set(), pedals=new Set();
const directionKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','Space']);
let steering=0, pointer=null;
let track,world,course,board,race,phase='garage',countdown=0;
let time=0,last=performance.now(),accum=0;
const fmt=t=>{
  const total=Math.round(t*1000), seconds=Math.floor(total/1000);
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+'.'+String(total%1000).padStart(3,'0');
};
function fillOptions(select,data){
  data.forEach(({name},i)=>select.add(new Option(String(i+1).padStart(2,'0')+' · '+name,i)));
}
fillOptions($('car'),cars);
worlds.forEach(({name},worldIndex)=>{
  const group=document.createElement('optgroup');
  group.label=name;
  tracks.forEach((t,i)=>{
    if(t.world===worldIndex)group.append(new Option(String(i+1).padStart(2,'0')+' · '+t.name,i));
  });
  $('track').append(group);
});
function read(key){
  try{return localStorage.getItem('plec-i-gas:'+key);}catch{return null;}
}
function save(key,value){
  try{localStorage.setItem('plec-i-gas:'+key,value);}catch{/* Private browsing can disable persistence. */}
}
const carIndex=()=>Number($('car').value);
const trackIndex=()=>Number($('track').value);
const mode=()=>$('mode').value;
const recordKey=()=>mode()+'-'+trackIndex();
$('car').value=clamp(Number(read('car'))||0,0,cars.length-1);
$('track').value=clamp(Number(read('track'))||0,0,tracks.length-1);
$('mode').value=read('mode')==='time'?'time':'race';
function updateRecord(){
  const best=Number(read(recordKey()));
  $('record').textContent=best>0?'Millor marca · '+fmt(best):'Millor marca · —';
}
function updateCar(){
  const model=cars[carIndex()];
  $('specs').replaceChildren(...[
    ['Velocitat',(model.top-225)/100],
    ['Acceleració',(model.thrust-190)/108],
    ['Adherència',(model.grip-5.5)/3.1],
  ].map(([label,fraction])=>{
    const spec=document.createElement('div');
    spec.className='spec';spec.textContent=label;
    const bar=document.createElement('div'),val=document.createElement('i');
    bar.className='bar';bar.setAttribute('aria-hidden','true');val.style.width=100*fraction+'%';
    bar.append(val);spec.append(bar);return spec;
  }));
  race=new Race(course,track,model,mode());
}
function updateTrack(){
  const index=trackIndex();
  track=tracks[index];world=worlds[track.world];
  course=makeCourse(track);
  board=makeBoard(track,course,world,index);
  $('chapter').textContent=world.icon+'  '+world.name+' / '+String(index+1).padStart(2,'0');
  $('venueName').textContent=track.name;
  $('grade').textContent='◆'.repeat(track.difficulty)+'◇'.repeat(5-track.difficulty);
  $('grade').setAttribute('aria-label','Dificultat '+track.difficulty+' de 5');
  updateCar();updateRecord();
}
$('car').addEventListener('change',()=>{save('car',carIndex());updateCar();});
$('track').addEventListener('change',()=>{save('track',trackIndex());updateTrack();});
$('mode').addEventListener('change',()=>{save('mode',mode());updateCar();updateRecord();});
updateTrack();

function clearInput(){
  keys.clear();pedals.clear();steering=0;pointer=null;$('knob').style.transform='';
}
function start(){
  race=new Race(course,track,cars[carIndex()],mode());
  clearInput();
  phase='countdown';countdown=3;
  document.body.classList.add('racing');
  $('hud').hidden=false;$('rankBox').hidden=mode()==='time';$('overlay').hidden=true;
  $('controls').hidden=false;
  $('count').textContent='3';$('count').hidden=false;
  refreshHUD();
}
function showResult(title,description,resume){
  $('count').hidden=true;
  $('resultTitle').textContent=title;$('resultBody').textContent=description;
  $('resume').hidden=!resume;$('overlay').hidden=false;$('controls').hidden=true;
  (resume?$('resume'):$('retry')).focus();
}
function pause(){
  if(phase==='paused'){
    phase=countdown>0?'countdown':'running';$('overlay').hidden=true;$('controls').hidden=false;
    $('pause').focus();
  }else if(phase==='running'||phase==='countdown'){
    phase='paused';clearInput();showResult('En pausa',track.name,true);
  }
}
function garage(){
  clearInput();phase='garage';$('overlay').hidden=true;$('hud').hidden=true;
  $('controls').hidden=true;$('count').hidden=true;
  document.body.classList.remove('racing');updateCar();updateRecord();$('start').focus();
}
function finish(){
  phase='finished';clearInput();
  const elapsed=race.time+race.penalty;
  const best=Number(read(recordKey()));
  const improved=!best||elapsed<best;
  if(improved)save(recordKey(),elapsed);
  const summary=[fmt(elapsed)];
  if(mode()==='race')summary.push(race.position+'a posició de '+(race.rivals.length+1));
  if(race.penalty)summary.push('Penalització inclosa · +'+race.penalty+' s');
  if(improved)summary.push('Nova millor marca!');
  showResult('Bandera a quadres!',summary.join('\n'),false);
}
function refreshHUD(){
  $('lap').textContent=race.lap+'/'+LAPS;
  $('rank').textContent=race.position+'/'+(race.rivals.length+1);
  $('clock').textContent=fmt(race.time+race.penalty);
}
$('start').onclick=start;$('retry').onclick=start;$('pause').onclick=pause;
$('resume').onclick=pause;$('garage').onclick=garage;
$('reset').onclick=()=>{if(phase==='running')race.reset();};
addEventListener('keydown',e=>{
  if(phase==='garage')return;
  if(directionKeys.has(e.code)&&!(phase==='paused'||phase==='finished')){
    e.preventDefault();keys.add(e.code);
  }
  if(!e.repeat&&e.code==='Escape')pause();
  if(!e.repeat&&e.code==='KeyR'&&phase==='running')race.reset();
});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>{
  clearInput();
  if(phase==='running'||phase==='countdown')pause();
});
const stick=$('stick');
function stickMove(e){
  if(pointer!==e.pointerId)return;
  const rect=stick.getBoundingClientRect();
  const dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2;
  const d=Math.max(1,Math.hypot(dx,dy)/(rect.width*.34));
  steering=clamp(dx/(rect.width*.34),-1,1);
  $('knob').style.transform='translate('+dx/d+'px,'+dy/d+'px)';
}
stick.addEventListener('pointerdown',e=>{
  if(pointer!==null)return;
  pointer=e.pointerId;stick.setPointerCapture(pointer);stickMove(e);
});
stick.addEventListener('pointermove',stickMove);
for(const name of ['pointerup','pointercancel','lostpointercapture']){
  stick.addEventListener(name,e=>{
    if(pointer===e.pointerId){pointer=null;steering=0;$('knob').style.transform='';}
  });
}
for(const button of document.querySelectorAll('[data-pedal]')){
  button.addEventListener('pointerdown',e=>{
    button.setPointerCapture(e.pointerId);pedals.add(button.dataset.pedal);
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture']){
    button.addEventListener(name,()=>pedals.delete(button.dataset.pedal));
  }
}
const pressed=(a,b)=>keys.has(a)||keys.has(b);
function update(dt){
  if(phase==='countdown'){
    countdown-=dt;
    $('count').textContent=countdown>0?Math.ceil(countdown):'GAS!';
    if(countdown<=0)phase='running';
  }else if(phase==='running'){
    const turn=Number(pressed('ArrowRight','KeyD'))-Number(pressed('ArrowLeft','KeyA'));
    race.step(dt,{
      steer:clamp(turn+steering,-1,1), gas:pressed('ArrowUp','KeyW')||pedals.has('gas'),
      brake:pressed('ArrowDown','KeyS')||pedals.has('brake'), drift:keys.has('Space')||pedals.has('drift'),
    });
    $('count').hidden=race.time>.6;
    if(race.done)finish();
  }
}
function render(dt){
  const {viewbox}=board;
  g.setTransform(canvas.width/viewbox.w,0,0,canvas.height/viewbox.h,0,0);
  g.translate(-viewbox.x,-viewbox.y);
  paintBoard(g,board,world,dt,time);
  const racers=[...race.rivals,race.player].sort((a,b)=>a.z-b.z);
  for(const state of racers)drawCar(g,{...state,time});
  if(phase==='garage'){
    preview.clearRect(0,0,152,96);
    drawCar(preview,{model:cars[carIndex()],angle:-.27+Math.sin(time*.9)*.28,x:74,z:57},2.34);
  }else refreshHUD();
}
function frame(now){
  const dt=Math.min(.05,(now-last)/1000);
  last=now;time+=dt;accum+=dt;
  while(accum>=1/120){update(1/120);accum-=1/120;}
  render(dt);requestAnimationFrame(frame);
}
function resize(){
  const pixelRatio=Math.min(2,devicePixelRatio);
  const {width,height}=canvas.getBoundingClientRect();
  canvas.width=Math.max(1,Math.round(width*pixelRatio));canvas.height=Math.max(1,Math.round(height*pixelRatio));
}
new ResizeObserver(resize).observe(canvas);
resize();
requestAnimationFrame(frame);
