
p5.disableFriendlyErrors = true; // disables FES
let d,n,s;

function preload(){
  d = loadImage('img/char1_d.png');
  n = loadImage('img/char1_n.png');
  s = loadImage('img/char1_s.png');
}

let N = [];
const q = 32;
let showD,showS;

let L,V,R,Ia,Lcolor;
function setup() {
  let w,h;
  w = d.width; h = d.height;
  /*
  w= floor( 1.5 * w ); h = floor( 1.5 * h );
  d.resize(w,h);
  n.resize(w,h);
  s.resize(w,h);
  */
  createCanvas(w, h);
  showD=true;showS=true;
  pixelDensity(1);
  frameRate(60);
  
  d.loadPixels();
  n.loadPixels();
  s.loadPixels();
  for(let i=0;i<w;i++){
    for(let j=0;j<h;j++){
      let k = (i+j*w)*4;
      N[k] = createVector(n.pixels[k],n.pixels[k+1],n.pixels[k+2]);
      N[k].normalize();
    }
  }
  
  L = createVector(0,0,1);
  V = createVector(0,0,1);
  R = createVector(0,0,1);
  Ia = createVector(20,20,20); // ambient light
  Lcolor = createVector(250,255,255);// light color 
  Ia.x = floor(Lcolor.x * 0.1);
  Ia.y = floor(Lcolor.y * 0.1);
  Ia.z = floor(Lcolor.z * 0.1);
  
}
   
  

function draw() {
  background(Ia.x,Ia.y,Ia.z);
  let w = d.width, h = d.height;
  let lx = -1 + 2*Math.min(mouseX,w)/w;
  let ly = -1 + 2*Math.min(mouseY,h)/h;
  let bla = lx*lx + ly*ly + 1;
  bla = Math.sqrt(bla);
  L.x=lx/bla;L.y=ly/bla;L.z=1/bla;
  
  loadPixels();
  let oof=0;
  for(let j=0;j<h;j++,oof+=4*w){
    for(let i=0;i<w;i++){
      let k = 4*i+oof
      //pixels[k]=Ia.x;pixels[k+1]=Ia.y;pixels[k+2]=Ia.z;
      if(showD){
        let foo =L.x*N[k].x + L.y*N[k].y + L.z*N[k].z;
        if(foo<0)foo=0;
        
        pixels[k] += Math.floor( foo* (Lcolor.x/255)* d.pixels[k]);
        pixels[k+1] += Math.floor( foo* (Lcolor.y/255) * d.pixels[k+1]);
        pixels[k+2] += Math.floor( foo* (Lcolor.z/255) * d.pixels[k+2]);  
      }
      if(showS){
        let foo = 2*(L.x*N[k].x + L.y*N[k].y + L.z*N[k].z);
        R.x = foo*N[k].x - L.x;
        R.y = foo*N[k].y - L.y;
        R.z = foo*N[k].z - L.z;
        
        let c = R.x*R.x + R.y*R.y + R.z*R.z;
        c=Math.sqrt(c);  
        R.x/=c;R.y/=c;R.z/=c;
        
        let ni = -1 + 2*i/w, nj = -1 + 2*j/h;
        V.x=ni;V.y=nj;V.z=1;
        
        c = V.x*V.x + V.y*V.y + V.z*V.z;
        c=Math.sqrt(c);
        
        V.x/=c;V.y/=c;V.z/=c;
        
        let spec = R.x*V.x + R.y*V.y + R.z*V.z;
        if(spec<0)spec=0;
        
        spec = Math.pow(spec,q);
        
        pixels[k] += Math.floor( spec * s.pixels[k]);
        pixels[k+1] += Math.floor( spec * s.pixels[k+1]);
        pixels[k+2] += Math.floor( spec * s.pixels[k+2]); 
        
      }
    }
  }
  updatePixels();
  
}

function getZ(x,y){
  let w = width, h = height;
  let RR = w*w/4 + h*h/4;
  return Math.sqrt(RR - x*x - y*y);
}
