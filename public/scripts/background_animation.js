const STAR_COLOR = '#fff';
const STAR_SIZE = 3;
const STAR_MIN_SCALE = 2;
const OVERFLOW_THRESHOLD = 50;
//const STAR_COUNT = 50;
const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 32;



const canvas = new fabric.Canvas('canvas');
const context = canvas.getContext( '2d' );


let scale = 1, // device pixel ratio
    width,
    height;

let stars = [];

let pointerX,
    pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0 };

let touchInput = false;

generate();
resize();
step();



// canvas.ontouchmove = onTouchMove;
// canvas.ontouchend = onMouseLeave;


window.onresize = resize;



function generate() {

  for( let i = 0; i < STAR_COUNT; i++ ) {
    
    const rect = new fabric.Rect({
      top: 0,
      left: 0,
      width: 20,
      height: 20,
      originX: 'center',
      originY: 'center',
      fill: 'red',
    });
   

    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE ),
      pushVal: 1,
      fabObj: rect
    });
  }

}



function placeStar( star ) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;
  star.fabObj.left = star.x;
  star.fabObj.top = star.y;
  star.fabObj.scaleX = star.z;
  star.fabObj.scaleY = star.z;

  star.fabObj.on('mouseover',function onMouseOver( event ) {

    star.fabObj.animate('scaleX', star.z * 1.5,{
      duration: 100
    });
    star.fabObj.animate('scaleY', star.z * 1.5,{
      duration: 100
    });

  });
  star.fabObj.on('mouseout',function onMouseOut( event ) {
    star.fabObj.animate('scaleX', star.z,{
      duration: 100
    });
    star.fabObj.animate('scaleY', star.z,{
      duration: 100
    });
  });


  canvas.add(star.fabObj);

}


function resize() {
  
  scale = window.devicePixelRatio || 1;

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.setWidth(width);
  canvas.setHeight(height);

  stars.forEach( placeStar );
  
  

}

function step() {


  
  update();
  

  requestAnimationFrame( step );

  

  canvas.requestRenderAll();







}

function update() {

  velocity.tx *= 0.96;
  velocity.ty *= 0.96;

  velocity.x += ( velocity.tx - velocity.x ) * 0.8;
  velocity.y += ( velocity.ty - velocity.y ) * 0.8;

  stars.forEach( ( star ) => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += ( star.x - width/2 ) * velocity.z * star.z * star.pushVal;
    star.y += ( star.y - height/2 ) * velocity.z * star.z * star.pushVal;
    //star.z += velocity.z;
  



    star.fabObj.left = star.x;
    star.fabObj.top = star.y;
    star.fabObj.setCoords();
    

  


  } );

}


function movePointer( x, y ) {

  if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

    let ox = x - pointerX,
        oy = y - pointerY;

    velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 ) *.01;
    velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 ) *.01;

  }

  pointerX = x;
  pointerY = y;


}

canvas.on('mouse:move',function onMouseMove( event ) {
 
  touchInput = false;

  movePointer( event.pointer.x, event.pointer.y);


});

// function onTouchMove( event ) {

//   touchInput = true;

//   movePointer( event.touches[0].clientX, event.touches[0].clientY, true );

//   event.preventDefault();

// }

canvas.on('mouse:out',function onMouseLeave() {

 
  pointerX = null;
  pointerY = null;

});
