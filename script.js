(function(){
var PI=Math.PI, box=document.getElementById('box'), stage=document.getElementById('stage'), root=document.documentElement;
var yaw=-0.55,pitch=0.2,ty=yaw,tp=pitch,zoom=1,tz=1,spin=true,dragging=false;
function size(){var s=Math.min(innerWidth/15,innerHeight/19)*zoom;root.style.setProperty('--s',s.toFixed(2)+'px');}
addEventListener('resize',size);size();
var views={front:[0,0],back:[PI,0],left:[PI/2,0],right:[-PI/2,0],top:[0,PI/2],bottom:[0,-PI/2]};
var spinBtn=document.getElementById('spin');
function setSpin(v){spin=v;spinBtn.classList.toggle('on',v);}
Array.prototype.forEach.call(document.querySelectorAll('[data-v]'),function(b){
  b.onclick=function(){setSpin(false);var v=views[b.dataset.v];ty=v[0]+Math.round((ty-v[0])/(2*PI))*2*PI;tp=v[1];};
});
spinBtn.onclick=function(){setSpin(!spin);};
var pts={},n=0,lastX=0,lastY=0,pinch=0;
function cnt(){return Object.keys(pts).length;}
stage.addEventListener('pointerdown',function(e){
  try{stage.setPointerCapture(e.pointerId);}catch(_){}
  pts[e.pointerId]=[e.clientX,e.clientY];
  if(cnt()===1){dragging=true;lastX=e.clientX;lastY=e.clientY;setSpin(false);}
  if(cnt()===2){var a=pts[Object.keys(pts)[0]],b=pts[Object.keys(pts)[1]];pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}
});
stage.addEventListener('pointermove',function(e){
  if(!pts[e.pointerId])return;pts[e.pointerId]=[e.clientX,e.clientY];
  if(cnt()===2){var k=Object.keys(pts),a=pts[k[0]],b=pts[k[1]],d=Math.hypot(a[0]-b[0],a[1]-b[1]);
    tz=Math.min(2.2,Math.max(.6,tz*d/pinch));pinch=d;return;}
  ty+=(e.clientX-lastX)*.009;tp=Math.max(-PI/2,Math.min(PI/2,tp+(e.clientY-lastY)*.009));
  lastX=e.clientX;lastY=e.clientY;
});
function up(e){delete pts[e.pointerId];var k=Object.keys(pts);if(k.length===1){lastX=pts[k[0]][0];lastY=pts[k[0]][1];}if(!k.length)dragging=false;}
stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
stage.addEventListener('wheel',function(e){e.preventDefault();tz=Math.min(2.2,Math.max(.6,tz*Math.exp(-e.deltaY*.0012)));},{passive:false});
function tick(){
  if(spin&&!dragging)ty+=.006;
  yaw+=(ty-yaw)*.14;pitch+=(tp-pitch)*.14;
  if(Math.abs(tz-zoom)>.001){zoom+=(tz-zoom)*.14;size();}
  box.style.transform='rotateX('+(-pitch)+'rad) rotateY('+yaw+'rad)';
  requestAnimationFrame(tick);
}
tick();
})();