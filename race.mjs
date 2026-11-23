import {cars,clamp} from './catalog.mjs';

const START=175;
const GATES=10;
export const LAPS=3;
export const angleDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

export class Race {
  constructor(course,track,car,mode) {
    Object.assign(this,{course,track,mode,time:0,penalty:0,done:false,nextGate:1});
    this.player={...course.at(START-13,-track.half*.5),model:car,vx:0,vz:0,player:true,progress:-13};
    this.rivals=[];
    if(mode==='race'){
      const potentials=cars.filter(model=>model!==car);
      this.rivals=Array.from({length:5},(_,i)=>{
        const distance=-13-Math.floor((i+1)/2)*42;
        const lane=(i%2===0?1:-1)*(track.half*.5);
        return {...course.at(START+distance,lane),model:potentials[(i*3+track.world)%potentials.length],
          progress:distance,lane,speed:0,index:i,finish:null};
      });
    }
    this.resetProgress=-13;
    this.lap=1;
  }
  get position(){
    return 1+this.rivals.filter(rival=>rival.finish!==null||rival.progress>this.player.progress+1).length;
  }
  reset(){
    if(this.done)return;
    const progress=this.resetProgress ? this.resetProgress+7 : -13;
    Object.assign(this.player,this.course.at(START+progress),{vx:0,vz:0,progress});
    this.penalty+=2;
  }
  step(dt,{steer=0,gas=false,brake=false,drift=false}={}){
    if(this.done)return;
    this.time+=dt;
    const p=this.player, m=p.model, course=this.course, half=this.track.half;
    const oldX=p.x, oldZ=p.z;
    const here=course.near(p.x,p.z);
    const off=here.distance>half;
    const speed=Math.hypot(p.vx,p.vz);
    const longitudinal=p.vx*Math.cos(p.angle)+p.vz*Math.sin(p.angle);
    const reverse=longitudinal < -4 || (speed<5&&brake&&!gas);
    const rotation=(.55+Math.min(1,speed/115)*2.55)*(drift?1.32:1);
    p.angle+=steer*rotation*(reverse?-1:1)*dt;
    const c=Math.cos(p.angle),s=Math.sin(p.angle);
    let forward=p.vx*c+p.vz*s, sideways=-p.vx*s+p.vz*c;
    if(gas)forward+=m.thrust*dt;
    if(brake)forward-=(forward>8?420:132)*dt;
    forward*=Math.exp(-(gas||brake ? .22 : 1.38)*dt);
    sideways*=Math.exp(-(drift?1.75:m.grip)*dt);
    if(drift)forward*=Math.exp(-.4*dt);
    if(off)forward*=Math.exp(-2.6*dt);
    forward=clamp(forward,-72,off?105:m.top);
    p.vx=c*forward-s*sideways;
    p.vz=s*forward+c*sideways;
    p.x+=p.vx*dt;
    p.z+=p.vz*dt;

    for(const ai of this.rivals){
      if(ai.finish!==null)continue;
      const d=START+ai.progress;
      const base=course.at(d);
      const corner=Math.abs(angleDiff(course.at(d+49).angle,base.angle));
      const target=(ai.model.top*(.72+ai.index*.020)-Math.min(91,corner*61));
      ai.speed+=clamp(target-ai.speed,-290*dt,ai.model.thrust*.77*dt);
      ai.progress+=ai.speed*dt;
      if(ai.progress>=course.length*LAPS){
        ai.finish=this.time;
        ai.progress=course.length*LAPS;
      }
      const lane=ai.lane+Math.sin(d/186+ai.index)*4;
      Object.assign(ai,course.at(START+ai.progress,lane));
      if(ai.finish===null){
        const dx=p.x-ai.x,dz=p.z-ai.z, gap=Math.hypot(dx,dz);
        if(gap>0&&gap<22){
          p.x+=dx/gap*(22-gap)*.19;
          p.z+=dz/gap*(22-gap)*.19;
          p.vx*=Math.exp(-1.35*dt);
          p.vz*=Math.exp(-1.35*dt);
        }
      }
    }

    const near=course.near(p.x,p.z);
    if(near.distance>half+69||p.x<14||p.x>1025||p.z<9||p.z>623){
      this.reset();
      return;
    }
    // Gates have to be physically crossed in order and in the driving direction.
    const length=course.length, sector=length/GATES;
    const target=this.nextGate*sector;
    const gate=course.at(START+target), cos=Math.cos(gate.angle), sin=Math.sin(gate.angle);
    const before=(oldX-gate.x)*cos+(oldZ-gate.z)*sin;
    const after=(p.x-gate.x)*cos+(p.z-gate.z)*sin;
    if(before<0&&after>=0){
      const fraction=-before/(after-before);
      const crossX=oldX+(p.x-oldX)*fraction-gate.x;
      const crossZ=oldZ+(p.z-oldZ)*fraction-gate.z;
      if(Math.abs(crossZ*cos-crossX*sin)<=half+13){
        this.resetProgress=target;
        this.nextGate++;
        this.lap=Math.min(LAPS,Math.floor((this.nextGate-1)/GATES)+1);
        this.done=this.nextGate>LAPS*GATES;
      }
    }
    const progress=near.s-START;
    const around=this.resetProgress+sector*.5;
    const unwrapped=progress+Math.round((around-progress)/length)*length;
    p.progress=clamp(unwrapped, this.resetProgress-sector*.12, this.nextGate*sector);
  }
}
