// CUSTOMISABLE
var sides  = 6;
var canvasSize = 500;
var padding = 50;
var data = [63,55,70,87,80,80];
var feilds = ['Appetizers','Desserts','Snacks','Drinks','Entrees','Kids'];
// CUSTOMISABLE

// Variable
var canvas = $('#graph')[0];
var ctx = canvas.getContext('2d');
var centerX = canvasSize/2;
var centerY = canvasSize/2;
var shapesArray = [];
var dataArray = [];
var radius = canvasSize/2-padding;


canvas.width = canvasSize;
canvas.height = canvasSize;

// Prototypes
Shape = function() {}
Shape.pt = Shape.prototype;

Point = function() {};
Point.pt = Point.prototype;

// Functions
function loop() {
  ctx.clearRect(0,0,canvasSize,canvasSize);
  
  for (var j = 0; j < shapesArray.length; j++) {
    var shape = shapesArray[j];
    ctx.beginPath();
    ctx.lineTo(shape.points[0].x, shape.points[0].y);
    
    for(var i = 0; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
    
    ctx.fillStyle   = shape.fill;
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth   = shape.linewidth;
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  
  for(var i = 0; i < shapesArray[0].points.length; i++) {
    ctx.strokeStyle = '#ff8400';
    ctx.lineWidth   = 1;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(shapesArray[0].points[i].x, shapesArray[0].points[i].y);
    ctx.stroke();
  }

  for (var j = 0; j < dataArray.length; j++) {
    var shape = dataArray[j];
    ctx.beginPath();
    ctx.lineTo(shape.points[0].x, shape.points[0].y);
    
    for(var i = 0; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
    
    ctx.fillStyle   = shape.fill;
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth   = shape.linewidth;
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    var shape = dataArray[j];
    ctx.textBaseline = 'middle';
    for(var i = 0; i < shape.feilds.length; i++) {
      var _x = Math.round(shape.feilds[i].x);
      if(_x < centerX) {
        ctx.textAlign = 'right';
      } else if(_x > centerX) {
        ctx.textAlign = 'left';
      } else if(_x == centerX) {
        ctx.textAlign = 'center';
      }
      ctx.fillText(feilds[i],shape.feilds[i].x,shape.feilds[i].y);
    }
    

  }
  
  
}

var timer = setInterval(loop, 1000/60);

function setupShape(_sides, _radius, _fill, _stroke, _linewidth) {
  
  var shape = new Shape();
  shape.sides = _sides;
  shape.radius = _radius;
  shape.fill = _fill;
  shape.stroke = _stroke;
  shape.linewidth = _linewidth;
  shape.points = [];
  
  for(var i = 0; i < _sides; i++){
    p    = new Point();
    ang  = Math.PI/(_sides/2)*i;
    sang = Math.sin(ang);
    cang = Math.cos(ang);
    p.x  = centerX + sang*_radius;
    p.y  = centerY + cang*_radius;
    shape.points.push(p);
  }
  
  shapesArray.push(shape);
  
}

function setupData(_data, _fill, _stroke, _linewidth) {
  var shape = new Shape();
  length = data.length;
  shape.sides = length;
  shape.fill = _fill;
  shape.stroke = _stroke;
  shape.linewidth = _linewidth;
  shape.points = [];
  shape.feilds = [];
  
  for(var i = 0; i < length; i++){
    p    = new Point();
    ang  = Math.PI/(length/2)*i;
    sang = Math.sin(ang);
    cang = Math.cos(ang);
    p.x  = centerX + sang*(data[i]/100*radius);
    p.y  = centerY + cang*(data[i]/100*radius);
    shape.points.push(p);
    
    p    = new Point();
    ang  = Math.PI/(length/2)*i;
    sang = Math.sin(ang);
    cang = Math.cos(ang);
    p.x  = centerX + sang*(radius+20);
    p.y  = centerY + cang*(radius+20);
    shape.feilds.push(p);
  }

  dataArray.push(shape);
  for(var i = 0; i < shape.points.length; i++) {
    TweenMax.from(shape.points[i], Math.random()*0.75+0.25, {x:canvasSize/2, y:canvasSize/2, delay:1.2});
  }
}

function play() {
  setupShape(sides, radius, '#febf3e', '#ff8400', 3);
  setupShape(sides, radius*3/4, '#f5a032', '#ff8400', 1);
  setupShape(sides, radius/2, '#f7983c', '#ff8400', 1);
  setupShape(sides, radius*1/4, '#f28f24', '#ff8400', 1);

  for (var j = 0; j < shapesArray.length; j++) {
    var shape = shapesArray[j];
    for(var i = 0; i < shape.points.length; i++) {
      TweenMax.from(shape.points[i], Math.random()*0.75+1, {x:canvasSize/2, y:canvasSize/2, ease:Elastic.easeOut});
    }
  }

  setupData(data, 'rgba(254, 196, 79, .4)', 'ff8400', 2);
  
}

play();