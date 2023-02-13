import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";
import { rotateByQuatAppend } from "../third-party/gl-matrix/src/gl-matrix/quat2.js";
import * as cg from "../render/core/cg.js";

let leftTriggerPrev = false;
let onetimeRender = false;

let lhand_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let larm1_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let rhand_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let rarm1_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let lfoot_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let lleg1_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let rfoot_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let rleg1_const = {
      MA : cg.mIdentity(),
      local_m : cg.mIdentity()
}

let A = [0,0,0];
let MA = cg.mIdentity();

let robot_x_value = 0;
let robot_y_value = 0;


// let MP_hand = cg.mTranslate

export const init = async model => {
   let c_arm = [1,0,0];
   let c_hand = [0,1,1];
   let c_body_main = [128/255,169/255,191/255]
   let c_body_bottom = [72/255, 125/255, 153/255]
   let c_eyepit = [103/255,109/255,112/255];
   let c_touching = [1,0,1];
   let c_untouching = [0,1,1];
   let c_moving = [0.5,0.5,1];

   let robot = model.add();

   let larm0 = robot.add();
   let larm1 = larm0.add();
   let lhand = larm1.add();

   let rarm0 = robot.add();
   let rarm1 = rarm0.add();
   let rhand = rarm1.add();

   let lleg0 = robot.add();
   let lleg1 = lleg0.add();
   let lfoot = lleg1.add();

   let rleg0 = robot.add();
   let rleg1 = rleg0.add();
   let rfoot = rleg1.add();
   
//    let box = robot.add('cube').move(0, 1, 0).scale(0.1)

   larm0.add('sphere').color(c_body_main).scale(0.15);
   larm1.add('sphere').scale(0.15);
   let llim1 = model.add('tubeZ');
   let llim2 = model.add('tubeZ');

   lhand.add('sphere');
   lhand.add('cube');
   lhand.add('cube');
   lhand.add('cube');


   rarm0.add('sphere').color(c_body_main).scale(0.15);
   rarm1.add('sphere').scale(0.15);
   let rlim1 = model.add('tubeZ');
   let rlim2 = model.add('tubeZ');

   rhand.add('sphere');
   rhand.add('cube');
   rhand.add('cube');
   rhand.add('cube');


   lleg0.add('sphere').color(c_body_bottom).scale(0.15);
   lleg1.add('sphere').scale(0.15);
   let lLlim1 = model.add('tubeZ');
   let lLlim2 = model.add('tubeZ');

   lfoot.add('cube').color(c_body_bottom);
   lfoot.add('cube');
   lfoot.add('cube');


   rleg0.add('sphere').color(c_body_bottom).scale(0.15);
   rleg1.add('sphere').scale(0.15);
   let rLlim1 = model.add('tubeZ');
   let rLlim2 = model.add('tubeZ');

   rfoot.add('cube').color(c_body_bottom);
   rfoot.add('cube');
   rfoot.add('cube');

   let upperBody = robot.add('cube').color(c_body_main);
   let lowerBody = robot.add('cube').color(c_body_bottom);
   let neck = robot.add('tubeY').color(c_arm);

//    let rarm0 = robot.add('sphere').color(1,0,1);
//    let rarm1 = robot.add('tubeX').color(c_arm);
//    let rarm2 = robot.add('sphere').color(1,0,1);
//    let rarm3 = robot.add('tubeX').color(c_arm);

//    let rhand = robot.add();
//    rhand.add('sphere').color(c_hand);
//    rhand.add('cube');
//    rhand.add('cube');
//    rhand.add('cube');

//    let lleg0 = robot.add('sphere').color(1,0,1);
//    let lleg1 = robot.add('tubeX').color(c_arm);
//    let lleg2 = robot.add('sphere').color(1,0,1);
//    let lleg3 = robot.add('tubeX').color(c_arm);
//    let lleg4 = robot.add('sphere').color(1,0,1);
//    let lfoot1 = robot.add('cube').color(c_hand);
//    let lfoot2 = robot.add('cube');

//    let rleg0 = robot.add('sphere').color(1,0,1);
//    let rleg1 = robot.add('tubeX').color(c_arm);
//    let rleg2 = robot.add('sphere').color(1,0,1);
//    let rleg3 = robot.add('tubeX').color(c_arm);
//    let rleg4 = robot.add('sphere').color(1,0,1);
//    let rfoot1 = robot.add('cube').color(c_hand);
//    let rfoot2 = robot.add('cube');

//    let neck = robot.add('tubeY').color(c_arm);

   let head = robot.add();
   head.add('tubeY').color(c_body_main).scale([0.5,0.43,0.4]);
   head.add('tubeZ').color(c_eyepit).move(-0.2,0.05,0.23).scale([0.18,0.18,0.18]);
   head.add('sphere').move(-0.2,0.05,0.35).scale([0.13,0.13,0.13]);
   head.add('tubeZ').color(c_eyepit).move(0.2,0.05,0.23).scale([0.18,0.18,0.18]);
   head.add('sphere').move(0.2,0.05,0.35).scale([0.13,0.13,0.13]);
   head.add('cube').color(c_eyepit).move(0, -0.25, 0.25).scale([0.15,0.08,0.15])
//    let head = robot.add('tubeY').color(c_body_main);

//    let leye1 = robot.add('tubeZ').color(c_eyepit);
//    let leye2 = robot.add('sphere').color();

//    let reye1 = robot.add('tubeZ').color(c_eyepit);
//    let reye2 = robot.add('sphere').color();

//    let mouth = robot.add('cube').color(c_eyepit);

//    let antenna1 = robot.add('tubeY').color(c_body_bottom);
//    let antenna2 = robot.add('donut').color(c_body_bottom);

//    let lshoulder = robot.add('cube').color(c_body_bottom);
//    let rshoulder = robot.add('cube').color(c_body_bottom);


   let limb = (a,b,c,r) => {
      if (r === undefined) r = .012;
      a.color(.7,.7,.7);
      let B = b.getGlobalMatrix().slice(12, 15);
      let C = c.getGlobalMatrix().slice(12, 15);
      a.setMatrix(cg.mMultiply(cg.mTranslate(cg.mix(B,C,.5)),
                  cg.mMultiply(cg.mAimZ(cg.subtract(C,B), [0,0,1]),
		               cg.mScale(r,r,.5*cg.distance(B,C)))));
   }

   let isInBox = (p,box) => {

      // FIRST TRANSFORM THE POINT BY THE INVERSE OF THE BOX'S MATRIX.

      let q = cg.mTransform(cg.mInverse(box.getGlobalMatrix()), p);

      // THEN WE JUST NEED TO SEE IF THE RESULT IS INSIDE A UNIT CUBE.

      return q[0] >= -1 & q[0] <= 1 &&
             q[1] >= -1 & q[1] <= 1 &&
             q[2] >= -1 & q[2] <= 1 ;
   }

   let moveJoint = (ml, obj, consts) => {
      let isLeftInBox = isInBox(ml.slice(12,15), obj);

      if (isLeftInBox) {
            obj.color(c_touching);
            let MP = obj.getGlobalMatrix();
            let leftTrigger = buttonState.left[0].pressed;
            if (leftTrigger) {
                  obj.color(c_moving);
                  let B = ml.slice(12,15);
                  if (!leftTriggerPrev) {
                        A = B;
                  } else {
                        MP = cg.mMultiply(cg.mTranslate(cg.subtract(B,A)), MP);
                        consts.local_m = obj.globalToLocal(MP);
                  }
      
                  A = B;
            }
            leftTriggerPrev = leftTrigger;
      } else {
            obj.color(c_untouching);
      }

      obj.setMatrix(consts.local_m);
   }

   let moveRotateJoint = (ml, obj, consts) => {
      let isLeftInBox = isInBox(ml.slice(12,15), obj);

      if (isLeftInBox) {
            obj.color(c_touching);
            let MP = obj.getGlobalMatrix();
            let leftTrigger = buttonState.left[0].pressed;
            if (leftTrigger) {
                  obj.color(c_moving);
                  let MB = ml.slice();
                  if (!leftTriggerPrev) {
                        MA = MB;
                  } else {
                        MP = cg.mMultiply(cg.mMultiply(MB, cg.mInverse(MA)), MP);
                        consts.local_m = obj.globalToLocal(MP);
                  }
      
                  MA = MB;
            }
            leftTriggerPrev = leftTrigger;
      } else {
            obj.color(c_untouching);
      }

      obj.setMatrix(consts.local_m);
   }

   model.animate(() => {

      let joy_x = joyStickState.right.x;
      let joy_y = joyStickState.right.y;

      let del_x = 0;
      let del_y = 0;
      if (joy_x != 0) {
            del_x = (joy_x > 0) ? 1 : -1;
      }

      if (joy_y != 0) {
            del_y = (joy_y > 0) ? 1 : -1;
      }


      robot_x_value += del_x*0.1;
      robot_y_value += del_y*0.1;
      robot.identity().move(0,1.8,0).turnY(robot_x_value).turnX(robot_y_value).scale(.2);

      if (!onetimeRender) {

            larm0.identity().move(-0.7,0.3,0);
            larm1.identity().move(-1.1,-0.7,0);

            lhand.identity().move(-1,0.52,0).turnZ(1).scale(0.25);
            lhand.child(1).identity().move(-0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
            lhand.child(2).identity().move(0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
            lhand.child(3).identity().move(0,1,0.7).scale([0.3, 1.2, 0.3]);

            rarm0.identity().move(0.5,0.3,0);
            rarm1.identity().move(1.1,-0.7,0);

            rhand.identity().move(1,0.52,0).turnZ(-1).scale(0.25);
            rhand.child(1).identity().move(-0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
            rhand.child(2).identity().move(0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
            rhand.child(3).identity().move(0,1,0.7).scale([0.3, 1.2, 0.3]);

            lleg0.identity().move(-0.55,-1.83,0);
            lleg1.identity().move(0,-1,0);

            lfoot.identity().move(0,-1.2,0).scale(0.2);
            lfoot.child(1).identity().move(-0.5,-0.6,0).scale([2,0.9,0.6]);
            lfoot.child(2).identity().move(-0.6,-1.3,0).scale([2.6,0.4,1.2]);

            rleg0.identity().move(0.35,-1.83,0);
            rleg1.identity().move(0,-1,0);

            rfoot.identity().move(0,-1.2,0).scale(0.2);
            rfoot.child(1).identity().move(0.5,-0.6,0).scale([2,0.9,0.6]);
            rfoot.child(2).identity().move(0.6,-1.3,0).scale([2.6,0.4,1.2]);

            upperBody.identity().move(-0.1,-0.1,0).scale([0.6,0.8,0.3]);
            lowerBody.identity().move(-0.1,-1.3,0).scale([0.75, 0.5, 0.4]);

            lhand_const.local_m = lhand.getMatrix();
            larm1_const.local_m = larm1.getMatrix();
            rhand_const.local_m = rhand.getMatrix();
            rarm1_const.local_m = rarm1.getMatrix();

            lfoot_const.local_m = lfoot.getMatrix();
            lleg1_const.local_m = lleg1.getMatrix();
            rfoot_const.local_m = rfoot.getMatrix();
            rleg1_const.local_m = rleg1.getMatrix();

            onetimeRender = true;
      }

      let ml = controllerMatrix.left;
      moveJoint(ml, larm1, larm1_const);
      moveRotateJoint(ml, lhand, lhand_const);
      moveJoint(ml, rarm1, rarm1_const);
      moveRotateJoint(ml, rhand, rhand_const);

      moveJoint(ml, lleg1, lleg1_const);
      moveRotateJoint(ml, lfoot, lfoot_const);
      moveJoint(ml, rleg1, rleg1_const);
      moveRotateJoint(ml, rfoot, rfoot_const);


      neck.identity().move(-0.1,0.8,0).scale([0.12,0.3,0.12]);

      
      // head.identity().move(-0.1,1.4,0).scale([0.5,0.43,0.4]);

      // leye1.identity().move(-0.35,1.5,0.25).scale([0.18,0.18,0.18]);
      // leye2.identity().move(-0.35,1.5,0.38).scale([0.13,0.13,0.13])
      //       .color([188/255-182/255*Math.abs(Math.sin(2.5*model.time)),188/255-182/255*Math.abs(Math.sin(2.5*model.time)), 245/255]);
      
      // reye1.identity().move(0.15,1.5,0.25).scale([0.18,0.18,0.18]);
      // reye2.identity().move(0.15,1.5,0.38).scale([0.13,0.13,0.13])
      //       .color([188/255-182/255*Math.abs(Math.sin(2.5*model.time)),188/255-182/255*Math.abs(Math.sin(2.5*model.time)), 245/255]);
      
      // mouth.identity().move(-0.1,1.16,0.22).scale([0.17,0.10,0.2]);

      // antenna1.identity().move(-0.1, 1.95, 0).scale([0.07,0.15,0.07]);
      // antenna2.identity().move(-0.1,2.25,0).turnY(Math.sin(2*model.time)).scale([0.3,0.2,0.2]);

      // lshoulder.identity().move(-0.75,0.56,0).scale([0.2,0.1,0.2]);
      // rshoulder.identity().move(0.55,0.56,0).scale([0.2,0.1,0.2]);

      head.identity().move(-0.1,1.4,0).turnY(Math.sin(model.time));

      limb(llim1, larm0, larm1, .010);
      limb(llim2, larm1, lhand, .010);

      limb(rlim1, rarm0, rarm1, .010);
      limb(rlim2, rarm1, rhand, .010);

      limb(lLlim1, lleg0, lleg1, .010);
      limb(lLlim2, lleg1, lfoot, .010);

      limb(rLlim1, rleg0, rleg1, .010);
      limb(rLlim2, rleg1, rfoot, .010);

   }).turnY(0);
}
