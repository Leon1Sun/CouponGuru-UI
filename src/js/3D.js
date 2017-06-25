/**
 * Created by tianrsun on 17/06/2017.
 */
//向量旋转
export default class CanvasService {
  constructor() {
    this.r = 200;
    this.rotateXAngle = Math.PI / 3;
    this.rotateYAngle = 0;
    this.rotateZAngle = 0;
    // this.rotateRAngle = Math.PI / 8;

    // var delta = Math.PI / 200;
  }

  rotateX(x, y, z, a) {
    return {
      x: x,
      y: y * Math.cos(a) - z * Math.sin(a),
      z: y * Math.sin(a) + z * Math.cos(a)
    };
  }

  rotateY(x, y, z, a) {
    return {
      x: x * Math.cos(a) + z * Math.sin(a),
      y: y,
      z: z * Math.cos(a) - x * Math.sin(a)
    };
  }

  rotateZ(x, y, z, a) {
    return {
      x: x * Math.cos(a) - y * Math.sin(a),
      y: x * Math.sin(a) + y * Math.cos(a),
      z: z
    };
  }

  drawCube(context) {
    let _this = this;
    let z_max,z_min;
    function getMaxMin(points) {
      let max = 0,min=2;
      for(let i=0;i<points.length;i++){
        if(points[i].z>max){
          max = points[i].z;
        }
        if(points[i].z <= min){
          min = points[i].z;
        }
      }
      z_max = max;
      z_min = min;
    }
    function f(x, y, z,text) {
      let c1 = _this.rotateX(x, y, z, _this.rotateXAngle);
      let c2 = _this.rotateY(c1.x, c1.y, c1.z, _this.rotateYAngle);
      let c3 = _this.rotateZ(c2.x, c2.y, c2.z, _this.rotateZAngle);

      //平行投影至XOY平面
      //return {x: c3.x, y: c3.y};

      //透视投影至XOY平面，观察点(0, 0, 1000)
      let h = 1 - c3.z / 1000;
      return {x: c3.x / h, y: c3.y / h, z: h,text:text || "123"};
    }
    let points = [
      f.apply(null,[-125, -125, -125,'Vertical']),
      f.apply(null,[-125, 125, -125,'Test/Control']),
      f.apply(null,[-125, -125, 125,'Coupon Type']),
      f.apply(null,[125, -125, -125,'Coupon Value']),
      f.apply(null,[125, 125, -125,'Issue Time']),
      f.apply(null,[125, -125, 125,'New User']),
      f.apply(null,[-125, 125, 125,'Retained User']),
      f.apply(null,[125, 125, 125,'Reactivated User'])
    ];
    let point0= f(0,0,0);



    function strokeText(ctx,  point) {
      let text = point.text;
      let fontSize = 15 *(z_max-point.z)/(z_max-z_min) + 25; // max = 15 + 25 min = 25
      let fontColor = (point.z-z_min)/(z_max-z_min).toFixed(3); // max limt => 1 ;min limt => 0
      if (isNaN(fontColor) ) {
        fontColor =0;
      }
      fontColor = 1-fontColor;
      // fontColor += 100;
      ctx.font = fontSize+'px Microsoft yahei';
      ctx.fillStyle = "rgb(" + parseInt(fontColor*(0xDD-0x33)+0x33)+","+parseInt(fontColor*(0xDD-0x33)+0x33)+","+parseInt(fontColor*(0xDD-0x33)+0x33) + ")";
      let textWidth = ctx.measureText(text).width;
      let textHight = fontSize;
      ctx.moveTo(point0.x, point0.y);
      // ctx.lineTo(point.x, point.y);
      ctx.fillText(text,point.x-textWidth/2,point.y+textHight/2)
    }
    function drawLine(ctx,point) {
      ctx.moveTo(point0.x, point0.y);
      ctx.lineTo(point.x, point.y);
    }
    function sort(ps){
      let temp;
      for(let i=0;i<ps.length;i++){
        for(let j=i+1;j<ps.length;j++){
          if(ps[i].z < ps[j].z){
            temp = {
              x:ps[i].x,
              y:ps[i].y,
              z:ps[i].z,
              text:ps[i].text
            };
            ps[i] = {
              x:ps[j].x,
              y:ps[j].y,
              z:ps[j].z,
              text:ps[j].text
          };
            ps[j] = temp;
          }
        }
      }
    }
    context.clearRect(-400, -400, 900, 700);
    context.beginPath();
    context.arc(point0.x,point0.y,5,0,360,false);
    context.fillStyle="#FFF";//填充颜色,默认是黑色
    context.fill();//画实心圆
    // context.moveTo(points[0].x, points[0].y);
    // points = points.sort(compare);
    sort(points);

    getMaxMin(points);
    context.beginPath();
    for(let i=0;i<points.length;i++){
      drawLine(context,points[i]);
    }
    for(let i=0;i<points.length;i++){
      strokeText(context,points[i]);
    }

    // ctx2.strokeText("123", f(-125, -125, -125).x, f(-125, -125, -125).y);

    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(125, -125, -125).x, f(125, -125, -125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(125, 125, -125).x, f(125, 125, -125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(-125, 125, -125).x, f(-125, 125, -125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(-125, -125, -125).x, f(-125, -125, -125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(-125, -125, 125).x, f(-125, -125, 125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(125, -125, 125).x, f(125, -125, 125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(125, 125, 125).x, f(125, 125, 125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(-125, 125, 125).x, f(-125, 125, 125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(-125, -125, 125).x, f(-125, -125, 125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(125, -125, -125).x, f(125, -125, -125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(125, 125, -125).x, f(125, 125, -125).y);
    //
    // context.moveTo(f(0, 0, 0).x, f(0, 0, 0).y);
    // context.lineTo(f(-125, 125, -125).x, f(-125, 125, -125).y);
    context.stroke();
  }
}
