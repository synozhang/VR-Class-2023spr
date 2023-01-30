import { controllerMatrix, buttonState, joyStickState } from "../render/core/controllerInput.js";

export const init = async model => {
   let c_arm = [1,0,0];
   let c_hand = [0,1,1];
   let c_body_main = [128/255,169/255,191/255]
   let c_body_bottom = [72/255, 125/255, 153/255]
   let c_eyepit = [103/255,109/255,112/255];

   let larm0 = model.add('sphere').color(1,0,1);
   let larm1 = model.add('tubeX').color(c_arm);
   let larm2 = model.add('sphere').color(1,0,1);
   let larm3 = model.add('tubeX').color(c_arm);

   let lhand = model.add();
   lhand.add('sphere').color(c_hand);
   lhand.add('cube');
   lhand.add('cube');
   lhand.add('cube');

   let upperBody = model.add('cube').color(c_body_main);
   let lowerBody = model.add('cube').color(c_body_bottom);

   let rarm0 = model.add('sphere').color(1,0,1);
   let rarm1 = model.add('tubeX').color(c_arm);
   let rarm2 = model.add('sphere').color(1,0,1);
   let rarm3 = model.add('tubeX').color(c_arm);

   let rhand = model.add();
   rhand.add('sphere').color(c_hand);
   rhand.add('cube');
   rhand.add('cube');
   rhand.add('cube');

   let lleg0 = model.add('sphere').color(1,0,1);
   let lleg1 = model.add('tubeX').color(c_arm);
   let lleg2 = model.add('sphere').color(1,0,1);
   let lleg3 = model.add('tubeX').color(c_arm);
   let lleg4 = model.add('sphere').color(1,0,1);
   let lfoot1 = model.add('cube').color(c_hand);
   let lfoot2 = model.add('cube');

   let rleg0 = model.add('sphere').color(1,0,1);
   let rleg1 = model.add('tubeX').color(c_arm);
   let rleg2 = model.add('sphere').color(1,0,1);
   let rleg3 = model.add('tubeX').color(c_arm);
   let rleg4 = model.add('sphere').color(1,0,1);
   let rfoot1 = model.add('cube').color(c_hand);
   let rfoot2 = model.add('cube');

   let neck = model.add('tubeY').color(c_arm);

   let head = model.add('tubeY').color(c_body_main);

   let leye1 = model.add('tubeZ').color(c_eyepit);
   let leye2 = model.add('sphere').color();

   let reye1 = model.add('tubeZ').color(c_eyepit);
   let reye2 = model.add('sphere').color();

   let mouth = model.add('cube').color(c_eyepit);

   let antenna1 = model.add('tubeY').color(c_body_bottom);
   let antenna2 = model.add('donut').color(c_body_bottom);

   let lshoulder = model.add('cube').color(c_body_bottom);
   let rshoulder = model.add('cube').color(c_body_bottom);

   model.move(0,1.5,0).scale(.1).animate(() => {

      larm0.identity().move(-0.7,0.3,0).scale(0.15,0.15,0.15);
      larm1.identity().move(-1,0,0).turnZ(3.14/4).scale([0.5,0.05,0.05]);
      larm2.identity().move(-1.4,-0.4,0).scale([0.1,0.1,0.1]);
      larm3.identity().move(-1.9,-0.15,0).turnZ(3.14/4*3 + 0.3).scale([0.5,0.05,0.05]);

      lhand.identity().move(-2.4,0.12,0).scale([0.15,0.15,0.15]).turnZ(1);
      lhand.child(1).identity().move(-0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
      lhand.child(2).identity().move(0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
      lhand.child(3).identity().move(0,1,0.7).scale([0.3, 1.2, 0.3]);

      upperBody.identity().move(-0.1,-0.1,0).scale([0.6,0.8,0.3]);
      lowerBody.identity().move(-0.1,-1.3,0).scale([0.75, 0.5, 0.4]);

      rarm0.identity().move(0.5,0.3,0).scale(0.15,0.15,0.15);
      rarm1.identity().move(0.8,0,0).turnZ(-3.14/4).scale([0.5,0.05,0.05]);
      rarm2.identity().move(1.2,-0.4,0).scale([0.1,0.1,0.1]);
      rarm3.identity().move(1.7,-0.15,0).turnZ(-3.14/4*3-0.3).scale([0.5,0.05,0.05]);

      rhand.identity().move(2.2,0.12,0).scale([0.15,0.15,0.15]).turnZ(-1);
      rhand.child(1).identity().move(-0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
      rhand.child(2).identity().move(0.7,1,-0.25).scale([0.2, 1.2, 0.2]);
      rhand.child(3).identity().move(0,1,0.7).scale([0.3, 1.2, 0.3]);

      lleg0.identity().move(-0.55,-1.83,0).scale(0.2,0.2,0.2);
      lleg1.identity().move(-0.55,-2.4,0).turnZ(3.14/2).scale([0.5,0.08,0.08]);
      lleg2.identity().move(-0.55,-2.9,0).scale(0.15,0.15,0.15);
      lleg3.identity().move(-0.55,-3.4,0).turnZ(3.14/2).scale([0.4,0.08,0.08]);
      lleg4.identity().move(-0.55,-3.9,0).scale(0.15,0.15,0.15);

      lfoot1.identity().move(-0.7,-4.05,0).scale([0.4,0.15,0.3]);
      lfoot2.identity().move(-1.2,-4.14,0).scale([0.2,0.075,0.15]);

      rleg0.identity().move(0.35,-1.83,0).scale(0.2,0.2,0.2);
      rleg1.identity().move(0.35,-2.4,0).turnZ(3.14/2).scale([0.5,0.08,0.08]);
      rleg2.identity().move(0.35,-2.9,0).scale(0.15,0.15,0.15);
      rleg3.identity().move(0.35,-3.4,0).turnZ(3.14/2).scale([0.4,0.08,0.08]);
      rleg4.identity().move(0.35,-3.9,0).scale(0.15,0.15,0.15);

      rfoot1.identity().move(0.5,-4.05,0).scale([0.4,0.15,0.3]);
      rfoot2.identity().move(1.0,-4.14,0).scale([0.2,0.075,0.15]);

      neck.identity().move(-0.1,0.9,0).scale([0.22,0.22,0.22]);
      head.identity().move(-0.1,1.4,0).scale([0.5,0.43,0.4]);

      leye1.identity().move(-0.35,1.5,0.25).scale([0.18,0.18,0.18]);
      leye2.identity().move(-0.35,1.5,0.38).scale([0.13,0.13,0.13])
            .color([188/255-182/255*Math.abs(Math.sin(2.5*model.time)),188/255-182/255*Math.abs(Math.sin(2.5*model.time)), 245/255]);
      
      reye1.identity().move(0.15,1.5,0.25).scale([0.18,0.18,0.18]);
      reye2.identity().move(0.15,1.5,0.38).scale([0.13,0.13,0.13])
            .color([188/255-182/255*Math.abs(Math.sin(2.5*model.time)),188/255-182/255*Math.abs(Math.sin(2.5*model.time)), 245/255]);
      
      mouth.identity().move(-0.1,1.16,0.22).scale([0.17,0.10,0.2]);

      antenna1.identity().move(-0.1, 1.95, 0).scale([0.07,0.15,0.07]);
      antenna2.identity().move(-0.1,2.25,0).turnY(Math.sin(2*model.time)).scale([0.3,0.2,0.2]);

      lshoulder.identity().move(-0.75,0.56,0).scale([0.2,0.1,0.2]);
      rshoulder.identity().move(0.55,0.56,0).scale([0.2,0.1,0.2]);

   }).turnY(0);
}

