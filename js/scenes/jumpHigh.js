import * as cg from "../render/core/cg.js";
import { controllerMatrix, buttonState, joyStickState, viewMatrix } from "../render/core/controllerInput.js";
import { lcb, rcb } from '../handle_scenes.js';
import { Clay } from "../render/core/clay.js";
import { g2 } from "../util/g2.js";
import { floor } from "../third-party/gl-matrix/src/gl-matrix/vec3.js";

// const
let height = 1.1;
let hide_scale = [0.0001, 0.0001, 0.0001];
let show_scale = [0.8,0.8,0.0001];


let num_platform = 2;
let platforms = [];


// m/ms
let v_z = 0;
let v_y = 0;
let v_x = 0;

let act = 10;
let act_xz = 2;

let x = 0;
let y = 0;
let z = 0;

let g = 5;

let prev_time = 0;

let fuel = 100;
let fuel_consuming_y = 20;
let fuel_consuming_xz = 10;
let combo_count = 0;
let praise = " ";

let warning_scale = hide_scale;
let goa_not_played = true;

// helper methods
let getDist = (p1, p2) => {
    let diff = cg.subtract(p1, p2);
    return cg.norm(diff);
}

let hit_target = (tm, r) => {
    let p1 = [0,height,0];
    let p2 = [tm[12], tm[13]+height, tm[14]];
    return getDist(p1,p2) <= r + 0.3;
}

let adjust_praise = () => {

    if (combo_count == 0) {
        praise = " ";
    }

    if (combo_count > 0) {
        praise = "Good!";
    }
    if (combo_count > 1) {
        praise = "Excellent!";
    }
    if (combo_count > 2) {
        praise = "Amazing!";
    }
    if (combo_count > 3) {
        praise = "Extraordinary!";
    }
    if (combo_count > 4) {
        praise = "Incredible!";
    }
    if (combo_count > 5) {
        praise = "Phenomenal!";
    }
    if (combo_count > 6) {
        praise = "Unbelievable!";
    }
    if (combo_count > 7) {
        praise = "Legendary!";
    }
    if (warning_scale == show_scale) {
        praise = "Don't Give Up!"
    }


}

export const init = async model => {
    let world = model.add();

    // audios
    let game_over_audio = new Audio('../../media/sound/Explosion13.wav');
    let succeed_audio = new Audio('../../media/sound/Pickup_Coin13.wav');

    for (let i = 0; i < num_platform; i++) {
        let this_platform = world.add('tubeY');
        this_platform.xyz = [0,0,-1 * i*30];
        this_platform.radius = 2;
        this_platform.color = [0,0,0];
        platforms.push(this_platform);
    }

    let pointer = world.add('cube').texture('./media/textures/triangle_pointer.png');

    let sky_sphere = model.add('sphere').scale(500,500,-500).turnY(0.5*Math.PI).turnX(0.5*Math.PI).texture('./media/textures/skybox.jpeg');



    let hud_display = model.add('cube').texture(() => {
        let h = .05;
        let color = 'black';
        if (fuel <= 30) {
            h = h + 0.02*Math.abs(Math.cos(6*model.time));
            color = 'red';
        }
        g2.setColor(color);
        g2.textHeight(h);
        g2.fillText('Remaining Fuel: ' + fuel.toFixed(1), .5, .7, 'center');

        g2.setColor('black');
        g2.textHeight(.05);
        g2.fillText('Combo: ' + combo_count.toFixed(1), .5, .6, 'center');
    
        g2.setColor('blue');
        g2.textHeight(.05 + 0.02*Math.abs(Math.sin(6*model.time)));
        g2.fillText(praise, .5, .5, 'center');
    });

    let hud_warning = model.add('cube').texture(() => {
        g2.setColor('red');
        g2.textHeight(.1);
        g2.fillText('Game Over', .5,.5,'center');
        g2.textHeight(.07)
        g2.drawWidgets(hud_warning);
    });
    g2.addWidget(hud_warning, 'button', .5, .35, '#ffffff', ' Try Again ', () => {
        try_again();
    })


    let target_index = 1;
    model.setTable(false);
    model.setRoom(false);

    let stopmoving = () => {
        v_x = 0;
        v_y = 0;
        v_z = 0;

    }

    let swapplat = () => {
        let curr_dis = platforms[target_index].xyz[2];
        target_index = (target_index + 1) % 2;
        let delta_dis = 30 + Math.floor(Math.random() * 20);
        platforms[target_index].xyz = [0,0,curr_dis - delta_dis];
        succeed_audio.play();
    }

    let faliure = () => {
        warning_scale = show_scale;
        if (goa_not_played) {
            game_over_audio.play();
            goa_not_played = false;
        }
    }

    let try_again = () => {
        combo_count = 0;
        warning_scale = hide_scale;
        fuel = 100;
        target_index = 1;
        for (let i = 0; i < num_platform; i++) {
            let this_platform = platforms[i];
            this_platform.xyz = [0,0,-1 * i*30];
            this_platform.radius = 2;
            this_platform.color = [0,0,0];
        }
        x = 0;
        y = 0;
        z = 0;
        goa_not_played = true;
    }

    model.scale(1).animate(() => {

        let stop_flag = false;

        hud_display.hud_l().scale(0.8,0.8,.0001);
        hud_warning.hud().scale(warning_scale);

        // calculate time span
        let curr_time = model.time;
        let delta_time = curr_time - prev_time;
        prev_time = curr_time;

        // handle stop
        if (y <= height && v_y < 0) {
            stopmoving();
            stop_flag = true;
        }

        // move
        y += delta_time * v_y;
        x += delta_time * v_x;
        z += delta_time * v_z;


        // handle operation
        if(buttonState.right[0].pressed && fuel > 0) {
            v_y += (act - g) * delta_time;
            fuel -= fuel_consuming_y * delta_time;
            if (fuel < 0) {
                fuel = 0;
            }
        } else {
            v_y -= g * delta_time;
        }
        let joy_x = joyStickState.right.x;
        let joy_y = joyStickState.right.y;
        if ((joy_y > 0.2 || joy_y < -0.2) && fuel > 0) {
            let flag = joy_y > 0 ? 1 : -1;
            v_z += delta_time * act_xz * flag;
            fuel -= fuel_consuming_xz * delta_time;
            if (fuel < 0) {
                fuel = 0;
            }
        }

        world.identity().move(-1*x,-1*y,-1*z);

        for (let i = 0; i < num_platform; i++) {
            // let this_color = platforms[i].isTarget ? (1,0,0) : (0,0,0);
            // platforms[i].color(1,0,0);
            platforms[i].identity().move(platforms[i].xyz).scale(2,0.1,2);
        }
        

        // Set pointer
        let tm = platforms[target_index].getMatrix();
        let m = views[0]._viewMatrix;
        pointer.setMatrix([m[0], m[4], m[8],  0,
                           m[1], m[5], m[9],  0,
                           m[2], m[6], m[10], 0, 
                           tm[12], tm[13] + 1, tm[14], 1]).scale(0.5,0.5,0.0001);


        // handle hit
        if (hit_target(platforms[target_index].getGlobalMatrix(), platforms[target_index].radius) && stop_flag) {
            swapplat();
            combo_count++;
            fuel = 100;
        }

        // handle failure
        let another_index = (target_index + 1) % 2;
        if (stop_flag && !hit_target(platforms[another_index].getGlobalMatrix(), platforms[another_index].radius) 
                        && !hit_target(platforms[target_index].getGlobalMatrix(), platforms[target_index].radius)) {
            faliure();
        } else if (stop_flag && fuel == 0) {
            faliure();
        }

        adjust_praise();
    });
}