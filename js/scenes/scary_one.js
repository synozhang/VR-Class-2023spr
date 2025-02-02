import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState, viewMatrix } from "../render/core/controllerInput.js";
import { lcb, rcb } from '../handle_scenes.js';
import { Clay } from "../render/core/clay.js";
import { g2 } from "../util/g2.js";

let dist_z = 0;
let dist_p = 0;

let max_beat = 110;
let base_max_beat = 110;
let min_beat = 60;

let curr_beat = 60;

let should_tremble = false;

let x = 0.8;

let dead_flag = false;


// vm: View Matrix
// let projectOntoViewBeam = (P, vm) => {
//     let o = vm.slice(12, 15);		// get origin of beam
//     o = cg.scale(o, -1);
//     let z = vm.slice( 8, 11);		// get z axis of beam
//     z = cg.scale(z, -1);
//     let p = cg.subtract(P, o);	// shift point to be relative to beam origin
//     let d = cg.dot(p, z);		// compute distance of point projected onto beam
//     let q = cg.scale(z, d);		// find point along beam at that distance
//     return cg.add(o, q);		// shift back to global space
// }

// let sightOn = (obj, radius, vm) => {
//     let obj_global_pos = obj.getGlobalMatrix().slice(12,15);
//     let point_on_beam = projectOntoViewBeam(obj_global_pos, vm);
//     let diff = cg.subtract(point_on_beam, obj_global_pos);
//     let hit = cg.norm(diff) < radius;
//     dist = cg.norm(diff);
//     return hit;
// }

let newSightOn = (obj, radius, vm) => {
    let obj_global_pos = obj.getGlobalMatrix().slice(12,15);
    let o = vm.slice(12,15);
    let z = vm.slice(8, 11);
    z = cg.scale(z, -1);
    let p = cg.subtract(obj_global_pos, o);
    let d = cg.dot(p,z) / cg.norm(z);
    let s = d / cg.norm(z);
    let q = cg.scale(z,s);
    let Q = cg.add(o, q);

    let diff = cg.subtract(Q, obj_global_pos);
    let hit = cg.norm(diff) < radius;
    dist_z = cg.norm(diff);
    return hit
}

let getDist = (p1, p2) => {
    let diff = cg.subtract(p1, p2);
    return cg.norm(diff);
}

let testText = 'False';
let X = 0;
let Y = 0;
let Z = 0;

export const init = async model => {


    let Line = t => {
        let r = 0;

        if (dead_flag) {
            return r;
        }

        if (curr_beat <= 90) {
            let base =0;
            if ((t > 0.15 && t < 0.35) || (t > 0.65 && t < 0.85)) {
                if (t > 0.65) {
                base = 0.65;
                } else {
                base = 0.15;
                }
    
                let d = t - base;
                switch(true) {
                case (d <= 0.05):
                    r = d*6;
                    break;
                case (d <= 0.1):
                    r = 0.3 - (d-0.05)*6;
                    break;
                case (d <= 0.15):
                    r = (d - 0.1)*2;
                    break;
                case (d <= 0.2):
                    r = 0.1 - (d - 0.15)*2;
                    break;
                }
            }

            x = 0.8;
        }

        if (curr_beat > 90 && curr_beat <= 130) {
            let base = 0;
            let hi = 0.4/6;
            if ((t>hi && t<hi+0.2) || (t>0.2+3*hi && t<0.4+3*hi) || (t>0.4+5*hi && t<1-hi)) {
                if (t > 0.4 + 5 * hi) {
                    base = 0.4 + 5 * hi;
                } else if (t > 0.2+3*hi) {
                    base = 0.2 + 3 * hi;
                } else {
                    base = hi;
                }

                let d = t - base;
                switch(true) {
                    case (d <= 0.05):
                        r = d*6;
                        break;
                    case (d <= 0.1):
                        r = 0.3 - (d-0.05)*6;
                        break;
                    case (d <= 0.15):
                        r = (d - 0.1)*2;
                        break;
                    case (d <= 0.2):
                        r = 0.1 - (d - 0.15)*2;
                        break;
                }
            }

            x = 0.8;

        }

        if (curr_beat > 130) {
            let b = Math.floor(t/0.2);
            let d = t - b*0.2;
            switch(true) {
                case (d <= 0.05):
                    r = d*6;
                    break;
                case (d <= 0.1):
                    r = 0.3 - (d-0.05)*6;
                    break;
                case (d <= 0.15):
                    r = (d - 0.1)*2;
                    break;
                case (d <= 0.2):
                    r = 0.1 - (d - 0.15)*2;
                    break;
            }

            x = 0.8;
            if (curr_beat > 145) {
                x = 0.9;
            }
            if (curr_beat > 160) {
                x = 1.0;
            }
            if (curr_beat > 175) {
                x = 1.1;
            }

        }


        return r;
    }

    let f = t => [t, Line(t+ x * model.time - Math.floor(t+ x * model.time)), 0]
    let wire = model.add(clay.wire(250,10)).color(5,0.25,0.25);

    model.setTable(false);

    let head = model.add()
    let face = head.add();
    // let eye_beam = model.add();
    // eye_beam.add('tubeZ').color(10,0,0).turnX(-bend).move(0,0,0).scale(.001, .001,10);

    head.add('cube').color(0,0,0);
    face.add('cube').texture('../media/textures/scary_smile.png').move(0,0,1).scale(1,1,0.0001);
    let test_hud = model.add('cube').texture(() => {
        g2.setColor('black');
        g2.textHeight(.05);
        g2.fillText('X: '+ X.toFixed(2), .5, .7, 'center');
        g2.fillText('Y: '+ Y.toFixed(2), .5, .6, 'center');
        g2.fillText('Z: '+ Z.toFixed(2), .5, .5, 'center');
        g2.fillText('dist: '+ dist_z.toFixed(2), .5, .4, 'center');
        g2.fillText('dist: '+ dist_p.toFixed(2), .5, .3, 'center');
        g2.fillText(testText, .5, .2, 'center');
    })

    let heart_hud = model.add()
    let heart_icon = heart_hud.add();
    let heart_display = heart_hud.add();

    heart_icon.add('cube').texture('../media/textures/heart_beat.png');
    heart_display.add('cube').texture(() => {
        let h = .2;
        g2.setColor('red');

        if (should_tremble) {
            h = h + 0.03*Math.sin(6*model.time);
        }

        g2.textHeight(h);
        let mBeat = curr_beat + 3 * Math.sin(0.3 * model.time);
        if (dead_flag) {
            mBeat = 0;
        }
        g2.fillText('' + mBeat.toFixed(0) + ' BPM', .5, .5, 'center');
    })



    model.animate(() => {

        wire.identity().hud_r().scale(.5);
        clay.animateWire(wire, .015, f);

        // heart_hud.identity().move(1,1.5,0).scale(0.2);
        heart_hud.hud_r().scale(0.2);
        heart_icon.identity().move(-0.75, 0, 0).scale(0.7, 0.6, 0.0001);
        heart_display.identity().move(0.95, -0.3, 0).scale(1, 1, 0.0001);

        head.identity().move(0,1.5,-0.3).scale(.15);
        test_hud.hud_l().scale(0.8,0.8,.0001);
        
        // let m = viewMatrix[0];
        // let offset = [-.0015,.014,0];
        // let fallback = [ .2,0,0];
        // m = cg.mMultiply(m, cg.mTranslate(offset))
        // eye_beam.setMatrix(cg.mInverse(m));

        // testText = ''+sightOn(head, 0.5, viewMatrix[0]).toFixed(2);
        // X = -1 * viewMatrix[0][12];
        // Y = -1 * viewMatrix[0][13];
        // Z = -1 * viewMatrix[0][14];

        let vm = cg.mInverse(viewMatrix[0]);

        X = vm[12];
        Y = vm[13];
        Z = vm[14];

        if (!dead_flag) {

            dist_p = getDist(vm.slice(12,15), head.getGlobalMatrix().slice(12,15));

            if (newSightOn(head, 0.45, vm)) {
                should_tremble = true;
                testText = 'true';
                curr_beat = curr_beat >= max_beat ? curr_beat - 0.12 : curr_beat + 2;
                if (max_beat - curr_beat >= 110) {
                    dead_flag = true;
                    curr_beat = 0;
                }
            } else {
                should_tremble = false;
                testText = 'False';
                curr_beat = curr_beat <= min_beat ? min_beat : curr_beat - 0.15;
            }

            let diff_beat = 0;
            if (dist_p <= 1.4) {
                diff_beat = dist_p < 0.40 ? 80 : ((1.4 - dist_p) / (1.4 - 0.40)) * 80;
            }

            max_beat = base_max_beat + diff_beat;
        }

     }).turnY(0);
}