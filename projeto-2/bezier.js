//MODO DE USO:
//1 - Aperte "Add Curva" para começar a desenhar
//2 - Para adicionar um novo ponto clique no canvas
//3 - A curva selecionada no momento é indicado pela cor vermelha
//4 - Para remover um ponto clique duas vezes num ponto da curva selecionada
//5 - Para mover um ponto arreste um ponto da curva selecionada com o mouse
//6 - "Del Curva" deleta a curva selecionada no momento
//7 - Para selecionar uma nova curva use as setas ← → 
//8 - Para definir o número de avaliações da curva selecionada digite um numero no campo "Número de avaliações" e aperte Enter. O número default definido foi 50.
//9 - O número de avaliações é limitado entre [2,350]. O limitante inferior é para que a curva exista, e o superior é para evitar lag na maquina
//10 - Para tornar visível/invísivel os pontos/curvas/poligonais marque ou desmarque as suas respectivas checkboxes

var logf = [];var curva=[];
var mode,index;

var avaliacao;
function setup() {
  createCanvas(600, 600);
  addCurvaB = createButton('Add Curva');
  goLeftB = createButton('←');
  goRightB = createButton('→');
  delCurvaB = createButton('Del Curva');
  avalNumB = createInput('');
  avalNumB.attribute('placeholder','Número de avaliações');
  
  addCurvaB.position(20,20);
  delCurvaB.position(addCurvaB.x+addCurvaB.width+20,addCurvaB.y);
  goLeftB.position(delCurvaB.x+delCurvaB.width+20,addCurvaB.y);
  goRightB.position(goLeftB.x+goLeftB.width+20,addCurvaB.y);
  avalNumB.position(goRightB.x+goRightB.width+20,addCurvaB.y);
  
  showPtB=createCheckbox('Pontos', true);
  showCuB=createCheckbox('Curvas', true);
  showPoB=createCheckbox('Poligonais', true);
  showPtB.style('color','white');
  showCuB.style('color','white');
  showPoB.style('color','white');
  
  showPtB.position(17,55);
  showCuB.position(showPtB.x+102,showPtB.y);
  showPoB.position(showCuB.x+95,showPtB.y);
  
  addCurvaB.mousePressed(modoAdd);
  delCurvaB.mousePressed(removeCurva);
  goLeftB.mousePressed(goLeft);
  goRightB.mousePressed(goRight);
  avalNumB.changed(updateAvaliacao);
  
  
  logf[0]=0;
  for(let i =1;i<=800;i++){//ln(i!)=ln((i-1)!)+ln(i)
    logf[i] = logf[i-1] + Math.log(i);
  }
  
  index = -1;
  mode = -1;
  avaliacao = 50;
}
function binomial(n,k){
  return Math.exp(logf[n] - logf[k] - logf[n-k]);
}


function modoAdd(){
  mode=0;
  curva.push(new Bezier([]));
  index = curva.length - 1;
}

function updateAvaliacao(){
  let v = this.value();
  v=parseInt(v);
  if(Number.isInteger(v)){
    v = max(2,v);
    v = min(350,v);
    if(index>=0 && index<curva.length){
      curva[index].cnt = v;
    }
    avaliacao=v;
  }
  this.value('');
}
function goLeft(){
  index--;
  if(index<-1)index = curva.length -1;
  mode=0;
  if(curva.length == 0) mode=-1;
}
function goRight(){
  index++;
  if(index==curva.length)index=-1;
  mode=0;
  if(curva.length == 0) mode=-1;
  
}
function draw(){
  background(220);
  noStroke();fill(50);rect(0,0,600,90);
  
  stroke('black');
  strokeWeight(4);
  point(mouseX,mouseY);
  for(let i = curva.length - 1; i>=0; i--){
    if(curva[i].controlPts.length == 0){ // se tiver vazio continua
        continue;
    }else{
      if(i==index)curva[i].selected=true;
      curva[i].show();
      if(i==index)curva[i].selected=false;
    }
  }
  
  //console.log(index, mode);
  
}
function doubleClicked(){
  
  let x = mouseX,y=mouseY;
  let point = getPoint(x,y);
  let i=point[0],j=point[1];
  if(i!=-1){
    curva[index].controlPts.splice(j,1);
  }
}
function mouseDragged(){
  let x = mouseX,y=mouseY;
  let point = getPoint(x,y);
  let i=point[0],j=point[1];
  if(i!=-1){
    curva[i].controlPts[j] = createVector(x,y);
  }
}


function mousePressed(){
  if(mouseY >125 && mode==0 && getPoint(mouseX,mouseY)[0] ==-1 && index !=-1){
    let v = createVector(mouseX,mouseY);
    curva[index].controlPts.push(v);
  }
 
}



function removeCurva(){
  if(index!=-1){
    curva.splice(index,1);
    index=-1;
    mode=-1;
  }
}

function getPoint(x,y){
  let a=index,b=0,mn = 10000;
  for(let j=0;index<curva.length && index>=0 && j<curva[index].controlPts.length;j++){
    let tx = curva[index].controlPts[j].x;
    let ty = curva[index].controlPts[j].y;
    let d = dist(x,y,tx,ty);
    if(d < mn){
      b=j;
      mn=d;
    }
  }
  if(mn<10){
    return [a,b];
  }else{
    return [-1,-1];
  }
}

class Bezier{
  constructor(controlPts,cnt=avaliacao){
    this.controlPts=controlPts;
    this.cnt=cnt;
    this.selected=false;
  }
  show(){
    if(showPtB.checked()){
      for(let p of this.controlPts){
        stroke('black');
        strokeWeight(6); 
        point(p.x,p.y);
      }
    }
    if(showPoB.checked()){
      for(let i = 1;i<this.controlPts.length;i++){
        let l = this.controlPts[i-1],r=this.controlPts[i];
        stroke('black');
        strokeWeight(1);
        line(l.x,l.y,r.x,r.y);
      }
    }
    
    if(showCuB.checked()){
      let tmp = this.cnt - 1,dt = 1 / tmp, t=dt;
      let lst=this.controlPts[0];
      
      if(this.selected)stroke('red');
      else stroke('grey');
      
      strokeWeight(1); 
      while(tmp >= 1){
        let nlst = this.getBezier(t);
        line(lst.x,lst.y,nlst.x,nlst.y);
        t+=dt;
        tmp--;
        lst=nlst;
      }
      
    }
  }
  getBezier(t){
    let p = createVector(0,0);
    let n = this.controlPts.length - 1;
    for(let i=0;i<=n;i++){
      let val = binomial(n,i)*pow(1-t,n-i)*pow(t,i);
      
      p.x = p.x + this.controlPts[i].x * val;
      p.y = p.y + this.controlPts[i].y * val;
      
    }
    
    return p;
  }
  
}
