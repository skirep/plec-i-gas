// Each outline is a closed course. The opening segment also holds the starting grid.
export const worlds = [
  {name:'Pati d’escola', icon:'✏', ground:'#ddc18f', panel:'#efd7a6', road:'#425158', rim:'#cd8050', accent:'#eaae37', shade:'#6c4436', art:['crayon','block','house','pencil','tree']},
  {name:'Cuina de diumenge', icon:'✿', ground:'#dca394', panel:'#f0c9a4', road:'#5d414c', rim:'#bc624d', accent:'#dc654d', shade:'#783e50', art:['cake','fruit','cup','block','pencil']},
  {name:'Jardí plegat', icon:'❋', ground:'#a3b384', panel:'#c8ce9c', road:'#435348', rim:'#697d55', accent:'#d5aa46', shade:'#46533e', art:['tree','flower','house','mushroom','block']},
  {name:'Moll de cartó', icon:'⚑', ground:'#84b5b5', panel:'#b8d0c4', road:'#364e61', rim:'#4e8791', accent:'#e29d53', shade:'#34546e', art:['boat','crate','tower','flag','house']},
  {name:'Desert de kraft', icon:'✺', ground:'#d4aa79', panel:'#eac597', road:'#594649', rim:'#a56447', accent:'#e89d48', shade:'#874d41', art:['cactus','tent','tower','block','flag']},
  {name:'Òrbita de paper', icon:'✦', ground:'#8d8cab', panel:'#beb2c5', road:'#44405f', rim:'#6f648e', accent:'#e7aa65', shade:'#453857', art:['rocket','tower','tent','crate','flag']},
];

const outlines = [
  ['El primer timbre','1,5 4,5 8,5 9,4 9,2 8,1 2,1 1,2'],
  ['La goma d’esborrar','1,5 4,5 6,5.5 9,4.5 9,1.5 7.5,.75 6,2.5 4.25,2.5 3,.8 1,1.5'],
  ['Cursa de guixos','1,5 4,5 5,4 7,4 9,5 9.2,2.5 7.6,1 5.5,1.8 3.4,.7 1,1.4'],
  ['Drecera del regle','1,5 4,5.2 7,5.2 9,4 7.7,2.8 9,1.3 7,.6 5.8,2.1 3.5,2.1 2,.9 .8,2.1'],
  ['L’últim recreo','1,5 4,5 5,4.2 6.4,5.3 8.7,5.1 9.2,3.4 7.7,2.7 8.5,1 6.4,.7 4.8,2.7 3.2,1.2 1.25,1'],
  ['Galetes en fuga','1,4.8 4,4.8 7,5.4 8.8,4.3 8.8,2.2 7,.7 5.4,1.6 2.2,.95 .8,2.6'],
  ['Pa torrat','1.2,5.3 4,5.3 5.6,4 5.8,2.75 7.6,2.75 8.65,4.6 9.5,3.35 9.5,1.1 8.7,.65 2,.9 .65,2.3'],
  ['El revolt de la tassa','1,5.15 4,5.15 7.5,5.25 9.2,3.6 8.4,1.8 6.6,.8 4.6,.8 4.4,2.55 2.5,2.5 2,.85 .8,2.2'],
  ['Melmelada doble','1,5.25 4,5.25 5.25,4 7,5.05 9,4.9 9.1,2.5 7.5,1.1 6.1,2.1 4.6,.9 2.6,2.05 1,.85'],
  ['Festival de molles','1,5 4,5 6,5.35 7,3.75 9.2,3.75 9,1.5 7.5,.8 6.1,1.2 5,2.75 3.2,2.5 2.5,.9 .8,1.6'],
  ['Entre margarides','1,5 4,5 6.3,5.5 8.45,4.7 9.05,2.75 7.6,1.1 5,.65 2.8,1.55 .85,2.8'],
  ['La volta del cargol','1,5.2 4,5.25 7.8,5.25 9.3,3.9 9,1.15 6.7,.75 2.9,.55 2.9,2.2 6.8,2.2 7.1,3.75 1.1,3.75 .65,2.4'],
  ['Font de les granotes','1,5.3 4,5.3 5.5,4.35 7.2,4.2 8.5,5.1 9.4,3.2 8.6,1.05 6.8,.7 5.8,2.1 4,2.8 2.55,2.45 1.3,1.05'],
  ['Els tres testos','1,5 4,5 5.3,3.9 6.8,4.9 9,5.25 8.75,1.55 7.2,1 5.7,2.5 4,.75 2.1,1.75 .8,3'],
  ['Tempesta de fulles','1,5.3 4,5.3 5.1,4.5 7.1,5.3 9.35,4.7 9.25,2.9 7.45,3.05 8.25,1.1 6.25,.65 4.6,2.65 3.3,1.1 1.3,1.1 .6,3.4'],
  ['Estiba número u','1,5 4,5 8.1,5 9.25,3.8 9.25,1.8 7.8,.9 6.1,1.6 2.6,1.6 1,.85'],
  ['Marea alta','1,5.1 4,5.1 8,5.5 9.25,4.3 8.2,2.7 6.5,2.7 5.2,.85 2.6,.9 3.2,2.55 .7,2.45'],
  ['Cranc entre caixes','1,5.2 4,5.2 5.25,3.75 6.75,3.75 7.7,5.2 9.2,4.8 9.1,1.15 7.55,.75 6,1.95 4.45,.75 2.85,1.6 1.05,1'],
  ['El far del nord','1,5.1 4,5.1 6.25,5.25 8.65,4.75 9.25,2.4 7.95,.7 6.65,1.1 6.2,3.4 4.45,3.2 4,1.35 2.1,.85 .8,2.5'],
  ['Dics i drassanes','1,5.05 4,5.05 5.7,5.3 6.1,3.65 7.55,3.65 7.65,5.35 9.25,5 9.3,1.1 7.8,.7 6.6,2.2 4.2,2.2 2.7,.85 .85,1.3'],
  ['Duna roja','1,5.2 4,5.2 6.2,5.45 8.5,4.65 9,2.8 7.9,1.35 5.5,.65 3.7,1.9 1.6,1.6 .7,3.7'],
  ['La gola de paper','1,5.3 4,5.3 5.7,4.55 6.8,5.3 9.3,4.7 9.2,1.1 7.45,.8 6,2.6 4.55,.95 2.55,1.05 1.95,2.85 .85,3.7'],
  ['Oasi fugaç','1,5 4,5 6,5.35 8.65,5 9.3,3.4 8.35,1.25 6.15,1.05 4.7,2.65 2.7,2.7 2.6,1 .8,1.65'],
  ['La serra del cactus','1,5.25 4,5.25 5.5,4 7.5,5.25 9.2,4.65 9,2.1 8.05,.8 6.6,1.4 5.3,.7 3.9,2.65 2.5,1.25 .95,1.65'],
  ['Vent de ponent','1,5.45 4,5.45 5.45,4.4 6.5,5.15 8.5,5.35 9.1,3.7 7.4,2.75 9.1,1.1 7.35,.65 5.8,1.2 4.8,2.6 3.15,2.15 2,.7 .75,2.05'],
  ['Hangar lunar','1,5.25 4,5.25 7.5,5.25 9.15,4 9.15,2.25 7.75,.9 6.15,.9 5.15,1.9 2.65,1.9 1,.9'],
  ['Estació en òrbita','1,5.15 4,5.15 6.25,5.4 8.9,5 9.3,3.2 8.2,2.4 8.25,.85 6.2,.65 5.4,2.55 3.2,2.55 2.65,1.05 .85,1.2'],
  ['Revolt del satèl·lit','1,5.25 4,5.25 6.15,4.05 7.7,5.2 9.1,4.7 9.25,2.5 7.65,.85 5.9,1.7 4.85,.8 3.4,1.4 2.1,2.65 .75,2.25'],
  ['Meteorits de cartró','1,5.2 4,5.2 5.65,5.25 6.75,3.55 8.65,5.25 9.2,3.75 9.05,1.7 7.75,.8 6.1,1.75 4.85,.75 3.5,2 1.9,1.05 .8,2.6'],
  ['Apogeu','1,5.35 4,5.35 5.6,4.45 6.95,5.25 9,5.2 9.35,3.35 7.75,2.75 9,1.15 7.15,.65 5.6,1.4 4.65,2.75 3.45,1.45 2,.75 .7,2.5'],
];

export const tracks = outlines.map(([name, shape], index) => ({
  name, world: Math.floor(index / 5), difficulty: index % 5 + 1,
  half: [35, 33, 32, 30, 28][index % 5],
  knots: shape.split(' ').map(pair => pair.split(',').map((n, i) => Number(n) * (i ? 105 : 104))),
}));

// Name, color, contrast, folded body, top speed, acceleration and grip.
export const cars = [
  ['Carmí','#c84b32','#f8d98d','sport',286,245,7.2],
  ['Llima','#829440','#f6c668','buggy',264,278,7.5],
  ['Safrà','#e1a337','#532f43','rally',276,262,7.5],
  ['Marea','#3f879c','#fff0be','sport',304,223,6.6],
  ['Coure','#ae6645','#f2cd80','pickup',254,265,8.0],
  ['Nit','#574b82','#f9ad79','formula',311,235,6.4],
  ['Trèvol','#417f67','#f4d48c','compact',270,275,7.8],
  ['Gerd','#ab4b68','#ffcf98','van',246,255,8.1],
  ['Marbre','#e1ccb1','#4b728b','rally',281,248,7.3],
  ['Blauet','#4166a4','#f3bc53','formula',316,224,6.3],
  ['Canari','#ebbd40','#c24936','buggy',269,284,7.0],
  ['Brasa','#9b3e43','#e7aa60','pickup',263,251,7.9],
  ['Molsa','#6b7654','#efdcb8','compact',259,279,8.4],
  ['Corall','#d3755c','#713c57','sport',296,231,6.9],
  ['Lavanda','#8b81b5','#f6d192','van',250,273,7.6],
  ['Cobalt','#3d779a','#e78055','rally',284,249,7.2],
  ['Pistatxo','#a9a95b','#6b5144','pickup',260,266,8.2],
  ['Granat','#873858','#f3b547','formula',312,230,6.5],
  ['Ivori','#e8dec6','#ad5438','compact',266,267,8.0],
  ['Cometa','#507f82','#efac65','buggy',279,270,7.1],
].map(([name, color, trim, body, top, thrust, grip], index) => ({name,color,trim,body,top,thrust,grip,number:index+1}));

const wrap = (s, length) => (s % length + length) % length;
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export function makeCourse(track) {
  const raw = [];
  const {knots} = track;
  knots.forEach((b, i) => {
    const a = knots[wrap(i-1, knots.length)], c = knots[(i+1)%knots.length], d = knots[(i+2)%knots.length];
    for (let k=0; k<16; k++) {
      const t = k/16;
      raw.push([0,1].map(j => b[j] + .5*t*((c[j]-a[j])+t*((2*a[j]-5*b[j]+4*c[j]-d[j])+t*(3*b[j]-a[j]-3*c[j]+d[j])))));
    }
  });
  const segments = [];
  let length = 0;
  raw.forEach(([x,z], i) => {
    const [ex,ez] = raw[(i+1)%raw.length];
    const dx = ex-x, dz=ez-z, size=Math.hypot(dx,dz);
    segments.push({x,z,dx,dz,size,start:length, angle:Math.atan2(dz,dx)});
    length += size;
  });
  function at(distance, lane = 0) {
    const s = wrap(distance,length);
    let low = 0, high = segments.length-1;
    while(low<high) {
      const mid = (low+high+1)>>1;
      if (segments[mid].start <= s) low=mid;
      else high=mid-1;
    }
    const p = segments[low], offset = (s-p.start)/p.size;
    return {x:p.x+p.dx*offset-p.dz/p.size*lane, z:p.z+p.dz*offset+p.dx/p.size*lane, angle:p.angle};
  }
  function near(x,z) {
    let best = Infinity, progress = 0;
    for (const p of segments) {
      const t = clamp(((x-p.x)*p.dx+(z-p.z)*p.dz)/(p.size*p.size),0,1);
      const dx = x-p.x-p.dx*t, dz = z-p.z-p.dz*t;
      const sq = dx*dx+dz*dz;
      if (sq < best) { best=sq; progress=p.start+t*p.size; }
    }
    return {distance:Math.sqrt(best), s:progress};
  }
  return {raw,length,at,near};
}
