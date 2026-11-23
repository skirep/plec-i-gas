/*
Paper specification: tabletop racing in six original worlds, from a schoolyard to orbit.
Matte 1.5–3% cut stock, patterned paper and warm directional shadows. School inks:
#ddc18f ground, #efd7a6 sheet, #425158 tarmac, #cd8050 cut kerb, #eaae37 signal,
#6c4436 shadow. Warm upper-left key (48° elevation), subtle one-sided lit lips.
Orthographic overhead camera (65° down), full circuit framed for steering in portrait
and landscape. The whole driving surface stays sharp. Shadow penumbra 3–8 units.
Road and runoffs are printed. Scenery uses fold-up panels, slotted crosses and boxes.
Launch banner opens with a damped hinge, then flags, floating confetti and dust move
quietly. Review targets: settled desktop, portrait race HUD, other world palettes.
*/
import {rng, mix, rgba, paperSheet} from './vendor/paperkit-2d.js';
import {FlapSpring, windSway} from './vendor/paper-motion.js';

const cream='#f8e5b9', ink='#332b32', squash=.91, altitude=.42;
const box=(width,length,x=0,z=0)=>[[x-length/2,z-width/2],[x+length/2,z-width/2],[x+length/2,z+width/2],[x-length/2,z+width/2]];
const regular=(n,r,x=0,z=0)=>Array.from({length:n},(_,i)=>[x+r*Math.cos(i*Math.PI*2/n),z+r*Math.sin(i*Math.PI*2/n)]);
const project=([x,y,z])=>[x,z*squash-y*altitude];
function path(g, points) {
  g.beginPath();
  points.forEach(([x,y],i)=>i ? g.lineTo(x,y) : g.moveTo(x,y));
  g.closePath();
}
function fill(g, points, color, edge, width=1) {
  path(g,points);
  g.fillStyle=color;
  g.fill();
  if(edge){g.lineWidth=width;g.strokeStyle=edge;g.lineJoin='round';g.stroke();}
}
function line(g, points, color, width) {
  g.beginPath();
  points.forEach(([x,y],i)=>i ? g.lineTo(x,y) : g.moveTo(x,y));
  g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.stroke();
}
function disc(g,x,y,rx,ry,color) {
  g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=color;g.fill();
}
function layer(g, footprint, lo, hi, color, map, roof=footprint) {
  const base=footprint.map(([x,z])=>map([x,lo,z]));
  const top=roof.map(([x,z])=>map([x,hi,z]));
  const edge=mix(color,ink,.64);
  for(let i=0;i<base.length;i++){
    const j=(i+1)%base.length;
    const a=base[i], b=base[j], c=top[j], d=top[i];
    const area=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]);
    if(area>0)fill(g,[a,b,c,d],mix(color,ink,.26+(i%3)*.1),edge,.8);
  }
  fill(g,top,color,edge,.85);
  const lit=top.reduce((best,p,i)=>p[0]+p[1]<top[best][0]+top[best][1]?i:best,0);
  const next=top[(lit+1)%top.length], p=top[lit];
  line(g,[p,[p[0]+(next[0]-p[0])*.7,p[1]+(next[1]-p[1])*.7]],mix(color,cream,.56),.85);
}
function prop(g, item, world) {
  const {x,z,size:s,angle,color,kind}=item;
  const c=Math.cos(angle),n=Math.sin(angle);
  const map=([a,y,b])=>project([x+s*(a*c-b*n),s*y,z+s*(a*n+b*c)]);
  const stamp=(p,y,paint,edge)=>fill(g,p.map(([a,b])=>map([a,y,b])),paint,edge,.75);
  const folded=(p,b,h,col,roof)=>layer(g,p,b,h,col,map,roof);
  const contact=project([x,0,z]);
  disc(g,contact[0]+s*.27,contact[1]+s*.14,s*.85,s*.38,rgba(world.shade,.15));
  disc(g,contact[0]+s*.2,contact[1]+s*.08,s*.67,s*.29,rgba(world.shade,.23));
  if(['tree','cactus','flower','mushroom','rocket'].includes(kind)) {
    const cuts={
      tree:[[-.16,0],[.16,0],[.16,.45],[.66,.45],[.4,.89],[.54,.89],[0,1.65],[-.53,.89],[-.38,.89],[-.65,.45],[-.16,.45]],
      cactus:[[-.2,0],[.22,0],[.22,.5],[.54,.5],[.63,.67],[.63,1.05],[.43,1.11],[.39,.74],[.22,.74],[.22,1.35],[.12,1.55],[-.13,1.55],[-.22,1.33],[-.22,.92],[-.49,.92],[-.5,1.18],[-.68,1.18],[-.7,.68],[-.2,.68]],
      flower:[[-.1,0],[.1,0],[.13,.63],[.56,.82],[.49,1.15],[.18,1.21],[.02,1.47],[-.21,1.42],[-.33,1.16],[-.55,1.07],[-.51,.77],[-.12,.66]],
      mushroom:[[-.15,0],[.15,0],[.19,.61],[.65,.61],[.61,.93],[.35,1.24],[0,1.33],[-.38,1.23],[-.63,.92],[-.65,.61],[-.18,.61]],
      rocket:[[-.58,0],[.58,0],[.52,.51],[.31,.67],[.33,1.15],[.18,1.56],[0,1.81],[-.18,1.56],[-.33,1.15],[-.31,.67],[-.52,.51]],
    };
    for(const axis of [true,false]){
      const plane=(a,y,edge=0)=>map(axis?[a,y,edge]:[edge,y,a]);
      const silhouette=cuts[kind];
      fill(g,silhouette.map(([a,b])=>plane(a,b,.028)),mix(color,ink,.47));
      fill(g,silhouette.map(([a,b])=>plane(a,b)),axis?mix(color,ink,.17):color,ink,.65);
      const ornament=kind==='tree'?regular(3,.27,0,.75):regular(8,.15,0,.99);
      fill(g,ornament.map(([a,b])=>plane(a,b)),mix(color,cream,.55));
      line(g,[plane(-.13,.15),plane(-.13,.43)],mix(color,cream,.59),.95);
    }
    return;
  }
  if(kind==='flag'){
    folded(box(.19,.19),0,1.6,color);
    fill(g,[[.03,1.5,0],[.82,1.3,0],[.06,1.02,0]].map(map),world.accent,ink,.8);
    return;
  }
  if(kind==='pencil'||kind==='crayon'){
    folded([[-.76,-.18],[.47,-.18],[.88,0],[.47,.18],[-.76,.18]],0,.30,color);
    stamp(box(.35,.24,-.58),.303,cream);
    stamp([[.47,-.14],[.88,0],[.47,.14]],.304,kind==='pencil'?'#d6ac76':mix(color,ink,.26));
    stamp([[.74,-.055],[.88,0],[.74,.055]],.305,ink);
    return;
  }
  if(kind==='cup'||kind==='cake'||kind==='fruit'||kind==='tower'){
    const r=kind==='tower'?.47:.67, h=kind==='tower'?1.25:.55;
    const profile=regular(9,r);
    folded(profile,0,h,color);
    folded(regular(9,r*1.08),h,h+.12,mix(color,cream,.42));
    stamp(regular(9,r*.76),h+.123,kind==='cup'?world.shade:color,rgba(ink,.55));
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5;
      stamp(regular(5,.085,Math.cos(a)*r*.44,Math.sin(a)*r*.44),h+.13,i%2?cream:world.accent);
    }
    return;
  }
  if(kind==='boat'){
    const hull=[[-.8,-.32],[.36,-.38],[.88,0],[.36,.38],[-.8,.32]];
    folded(hull,0,.2,color);stamp(box(.27,.92,-.2),.204,cream);
    fill(g,[[-.38,.25,0],[.44,.25,0],[-.25,1.3,0]].map(map),mix(color,cream,.7),ink,.8);
    return;
  }
  if(kind==='house'||kind==='tent'){
    const h=kind==='tent'?.13:.57;
    folded(box(.91,1.17),0,h,mix(color,cream,.5));
    const planes=[
      [[-.69,h,-.54],[.69,h,-.54],[.69,h+.58,0],[-.69,h+.58,0]],
      [[-.69,h+.58,0],[.69,h+.58,0],[.69,h,.54],[-.69,h,.54]],
      [[-.69,h,-.54],[-.69,h+.58,0],[-.69,h,.54]],
      [[.69,h,-.54],[.69,h+.58,0],[.69,h,.54]],
    ];
    const visible=planes.map(plane=>plane.map(map));
    visible.forEach((p,i)=>fill(g,p,i%2?color:mix(color,ink,.24),ink,.85));
    for(const t of [-.4,-.12,.16,.44])line(g,[map([t,h+.56,0]),map([t,h+.07,.48])],mix(color,cream,.39),1.1);
    return;
  }
  const isCrate=kind==='crate';
  const size=kind==='block'?.85:1.12;
  folded(box(.84,size),0,.57,color);
  stamp(box(.64,size*.8),.575,mix(color,cream,.34),rgba(ink,.64));
  if(isCrate){
    for(const x of [-.42,-.14,.14,.42])line(g,[map([x,.58,-.32]),map([x,.58,.32])],mix(color,ink,.45),.9);
  }else stamp(regular(5,.23),.58,world.accent,rgba(ink,.62));
}
const bodyShapes = {
  sport:[26,46,11,24,8], buggy:[19,40,13,16,6], rally:[26,42,15,25,5],
  formula:[13,50,10,18,8], van:[27,44,21,30,3], pickup:[29,44,17,16,4], compact:[25,37,16,22,6],
};
export function drawCar(g,state,scale=1) {
  const {model,angle,x,z}=state;
  const [w,l,h,roof,nose]=bodyShapes[model.body];
  const cos=Math.cos(angle),sin=Math.sin(angle), k=scale;
  const map=([a,y,b])=>project([x+k*(a*cos-b*sin),k*y,z+k*(a*sin+b*cos)]);
  const panel=(points,y,color,edge)=>fill(g,points.map(([a,b])=>map([a,y,b])),color,edge,.7*k);
  const pos=project([x+4*k,0,z+4*k]);
  g.save();
  g.translate(...pos);
  g.scale(1,squash);
  g.rotate(angle);
  disc(g,0,0,l*.61*k,(w*.67+4)*k,'#32283454');
  disc(g,0,0,l*.52*k,(w*.62+3)*k,'#3b29394d');
  g.restore();
  const fold=(p,b,t,color,upper)=>layer(g,p,b,t,color,map,upper);
  for(const a of [-l*.32,l*.29])for(const b of [-w*.48,w*.48]){
    fold(box(7,11,a,b),1.2,7,'#322d35');
    panel(box(4,7,a,b),7.09,'#59535b');
  }
  const hull=[[-l/2,-w*.37],[-l*.4,-w*.5],[l/2-nose,-w*.5],[l/2,-w*.3],[l/2,w*.3],[l/2-nose,w*.5],[-l*.4,w*.5],[-l/2,w*.37]];
  fold(hull,3,10,model.color);
  panel(box(w*.2,l*.91),10.06,model.trim);
  const cabin=box(w*.8,roof,-2);
  fold(cabin,10, h+6,'#41495c',box(w*.64,roof*.57,-3));
  panel(box(w*.62,roof*.52,-3),h+6.06,model.color,ink);
  panel(box(w*.19,roof*.50,-3),h+6.12,model.trim);
  for(const d of [-1,1]){
    panel(box(4,4,l*.43,d*w*.28),10.15,cream,ink);
    panel(box(3,3,-l*.45,d*w*.27),10.17,'#f58062');
  }
  if(model.body==='formula'||model.body==='rally')fold(box(w+7,5,-l*.42),10,15,model.trim);
  if(model.body==='pickup'){
    panel(box(w*.63,11,-l*.34),10.18,'#59424b',cream);
    panel(box(w*.49,2,-l*.32),10.24,model.trim);
  }
  if(state.player){
    const y=19+Math.sin(state.time*5)*2;
    fill(g,[[-4,y+8,0],[4,y+8,0],[0,y,0]].map(map),'#ffdc78',ink,1.1);
  }
}

function routeStroke(g,course,width,color,offset=0,dash=[]){
  g.save();g.translate(0,offset);g.scale(1,squash);
  path(g,course.raw);g.lineJoin='round';
  g.setLineDash(dash);g.lineWidth=width;g.strokeStyle=color;g.stroke();g.restore();
}
const podium = ['#be654f','#5d8f80','#d4a64e','#7576a0','#936449','#466b84'];
const viewbox={x:-22,y:-28,w:1084,h:620};
export function makeBoard(track,course,world,index) {
  const canvas=document.createElement('canvas');
  canvas.width=1626;canvas.height=930;
  const g=canvas.getContext('2d');
  g.scale(1.5,1.5);
  g.translate(-viewbox.x,-viewbox.y);
  const random=rng(9483+index*629);
  g.fillStyle=g.createPattern(paperSheet({size:256,color:world.ground,seed:index+3,fibres:1.8,mottle:.12}),'repeat');
  g.fillRect(viewbox.x,viewbox.y,viewbox.w,viewbox.h);
  for(let z=-1;z<7;z++)for(let x=-1;x<13;x++){
    const x0=x*94,z0=z*94;
    const opacity=(x+z)%2===0?.09:.04;
    const skew=4+random()*5;
    fill(g,[[x0,z0+skew],[x0+94,z0],[x0+94,z0+94-skew],[x0,z0+94]].map(([a,b])=>project([a,0,b])),rgba(world.panel,opacity),rgba(world.shade,.09),1);
  }
  for(let i=0;i<29;i++){
    const x=-40+random()*1120,z=-30+random()*690,r=28+random()*61;
    const blot=regular(11,r,x,z).map(([a,b])=>project([a,0,b]));
    fill(g,blot,rgba(i%2?world.shade:world.panel,.10),rgba(world.panel,.15),1.4);
  }
  routeStroke(g,course,track.half*2+20,rgba(world.shade,.24),8);
  routeStroke(g,course,track.half*2+15,world.rim,4.2);
  routeStroke(g,course,track.half*2+14,world.panel);
  routeStroke(g,course,track.half*2+4,world.rim);
  routeStroke(g,course,track.half*2,world.road);
  routeStroke(g,course,1.7,rgba(cream,.24),0,[12,12]);
  for(let s=24;s<course.length;s+=40){
    for(const side of [-1,1]){
      const p=course.at(s,side*(track.half+1));
      g.save();g.translate(...project([p.x,0,p.z]));g.scale(1,squash);g.rotate(p.angle);
      g.fillStyle=s%80<40?cream:world.rim;g.fillRect(-6,-2.1,12,4.2);g.restore();
    }
  }
  const grid=course.at(175);
  g.save();g.translate(...project([grid.x,0,grid.z]));g.scale(1,squash);g.rotate(grid.angle);
  for(let a=0;a<2;a++)for(let b=0;b<8;b++){
    g.fillStyle=(a+b)%2?cream:ink;
    g.fillRect(a*6-6,b*track.half/4-track.half,6,track.half/4+.2);
  }
  g.restore();
  const props=[];
  for(let k=0;k<540 && props.length<118;k++){
    const x=10+random()*1020,z=3+random()*627;
    const size=9+random()*18;
    if(course.near(x,z).distance<track.half+15+size*.78)continue;
    if(props.some(p=>Math.hypot(p.x-x,p.z-z)<(p.size+size)*.73))continue;
    const k=(Math.floor(random()*world.art.length));
    props.push({x,z,size,angle:random()*Math.PI,color:podium[(k+Math.floor(random()*4)+world.art.length+index)%podium.length],kind:world.art[k]});
  }
  props.sort((a,b)=>a.z-b.z).forEach(p=>prop(g,p,world));

  // Oversized set pieces sit in the empty centre of each course wherever the outline permits.
  const clearSpot=[470,580,390,650,510].flatMap(x=>[270,310,235,340].map(z=>({x,z})))
    .sort((a,b)=>course.near(b.x,b.z).distance-course.near(a.x,a.z).distance)[0];
  const room=course.near(clearSpot.x,clearSpot.z).distance-track.half;
  if(room>40){
    const size=Math.min(58,room*.68);
    prop(g,{...clearSpot,size,angle:-.24,color:podium[index%6],kind:world.art[0]},world);
  }
  // A small printed marshal label gives the track its own place on the sheet.
  const tag=course.at(174,-track.half-24);
  const [tx,ty]=project([tag.x,0,tag.z]);
  g.save();g.translate(tx,ty);g.rotate(-.04);
  fill(g,[[-35,-9],[36,-9],[32,10],[-35,10]],world.panel,world.shade,1);
  g.font='700 9px monospace';g.fillStyle=ink;g.textAlign='center';g.fillText('SORTIDA '+String(index+1).padStart(2,'0'),0,3);
  g.restore();
  const specks=Array.from({length:20},()=>({x:random()*1040,z:random()*630,t:random()*6.28,r:1+random()*2}));
  const hinge=new FlapSpring({size:.47});
  hinge.set(1);
  return {canvas,viewbox,grid,hinge,specks};
}
export function paintBoard(g,board,world,dt,time){
  const {canvas,viewbox,grid,hinge,specks}=board;
  g.drawImage(canvas,viewbox.x,viewbox.y,viewbox.w,viewbox.h);
  for(const p of specks){
    const x=p.x+9*Math.cos(time*.42+p.t),y=p.z*squash+5*Math.sin(time*.65+p.t);
    g.save();g.translate(x,y);g.rotate(time*.6+p.t);
    g.fillStyle=rgba(world.panel,.62);g.fillRect(-p.r,-p.r*.4,2*p.r,p.r*.8);g.restore();
  }
  const rise=hinge.step(dt)*Math.PI/2;
  const {x,z}=grid;
  const flap=(a,b)=>project([x+a,b*Math.sin(rise),z-trackSignOffset+b*Math.cos(rise)]);
  const sway=windSway(time,x,z,{amp:2})*24;
  fill(g,[flap(-25,0),flap(25,0),flap(25+sway,27),flap(-25+sway,27)],world.accent,ink,1);
  line(g,[flap(-22,22),flap(23,22)],cream,1.8);
  if(rise>.7){
    const [a,b]=flap(0,11);
    g.font='bold 8px monospace';g.textAlign='center';g.fillStyle=ink;g.fillText('P+G',a,b);
  }
}
const trackSignOffset=45;
