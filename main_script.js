// display vars:
const screenW = document.querySelector('body').clientWidth;
const screenH =  document.querySelector('body').clientHeight - document.querySelector('#info_header').offsetHeight - 1;
const FR = 10;
var auto_mode = true;

// used to keep track of time
var startDate = new Date();

const NUM_POINTS = 250;
const POINTS_PADDING = [200,200];
// var points = [[313.8302185085997, 603.5218287855582],
//                 [462.1563737447342, 325.31362441743624],
//                 [540.3952399532217, 566.277302588829],
//                 [688.2170107207221, 600.2671524179689],
//                 [839.3533587995337, 216.8270832232185],
//                 [937.8532402856262, 619.0426384744126]];
// var points = [[377.10313038732534, 532.6455551874569],
//                     [397.24608553409587, 513.7461394508997],
//                     [479.196451703766, 436.50496603526744],
//                     [675.8645931502813, 615.5545037806918],
//                     [783.9454820661717, 184.38044960965144],
//                     [999.7880262381167, 525.2545493678044],
//                     [1011.1470148153405, 513.5417861088572],
//                     [1118.7081515397356, 481.2225415632788],
//                     [1189.0848009552749, 262.2679699808657],
//                     [1231.6691016582433, 302.26749607372153]];
// intersection edge case
var points = [[1011.1470148153405, 513.5417861088572],
            [1118.7081515397356, 481.2225415632788],
            [1189.0848009552749, 262.2679699808657],
            [1231.6691016582433, 302.26749607372153]];

// moving points to center of screen
points = points.map(e => [e[0] - 500, e[1]]);

var RANDOM_POINTS = true;
var hull, steps, upper_len;
var step_index = 0;
var hold_frames = 50; // how many frames to hold on the final step
var frame_counter = 0; // how many frames to hold on the final step

function setup() {
    frameRate(FR);

    createCanvas(screenW, screenH);

    angleMode(DEGREES);
    rectMode(CENTER); // From where rectangles are drawn from

    // randomly selecting points to draw if no points are given
    if (RANDOM_POINTS){
        console.log("randomly picking points...");
        points = new Array(NUM_POINTS);
        for (let i = 0; i < NUM_POINTS; i++) {
            // x-bounds is half the canvas width - padding
            var x = (Math.random() * (width - POINTS_PADDING[0])) + POINTS_PADDING[0]/2;
            // y-bounds is the canvas height - padding
            var y = (Math.random() * (height - POINTS_PADDING[1])) + POINTS_PADDING[1]/2;
            points[i] = [x,y];
        }
    }

    // finding the convex hull
    out = find_convex_hull(points);
    hull = out[0];
    steps = out[1];
    upper_len = out[2];
    console.log(out);
}

// This function is called every frame (by P5.js):
function draw(){
    clear();
    background(0,20,0);
    if (auto_mode){
        if (step_index == steps.length-1){ // hold on the final step
            frame_counter += 1;
            if (frame_counter >= hold_frames){
                step_index = 0;
                frame_counter = 0;
            }
        }else{
            step_index += 1;
        }
    } else{
        if (keyIsDown(UP_ARROW)){
            console.log("NEXT ITER");
            step_index += 1;
            if (step_index >= steps.length)
                step_index = 0;
        }else if (keyIsDown(DOWN_ARROW)){
            console.log("PREV ITER");
            step_index -= 1;
            if (step_index < 0)
                step_index = steps.length-1;
        }        
    }

    let step_points = steps[step_index];
    
    render_hull_array(step_points, 'yellow', 15, 5);
    render_points(points, 'red', 10);
    render_step_points(step_points, 'white');
}
function render_step_points(points, color, color_secondary='blue', weight=20){
    // Displaying the points
    stroke(color);
    strokeWeight(weight);

    // Displaying the points
    for (let index = 0; index < points.length; index++) {
        if (index >= upper_len){
            stroke(color_secondary);
            strokeWeight(weight);
        }
        point(...points[index]);
    }
}

function render_points(points, color, weight=10, label=false){
    // Displaying the points
    stroke(color);
    strokeWeight(weight);
    points.forEach(e => {
        const [x, y] = e;
        point(x, y);
    });
    
    // Labelling the points
    if (label) {
        fill('white');
        stroke('black');
        strokeWeight(1);
        points.forEach(e => {
            const [x, y] = e;
            const str = "("+parseInt(x)+","+parseInt(y)+")";
            text(str, x+10, y);
        });
    }
}

function render_hull_array(hull, color, weight=15, line_weight=5, length=null){
    // renders the hull, assumes array data structure
    stroke(color);
    strokeWeight(weight);

    if (length == null)
        length = hull.length-1;

    for (let index = 0; index < length; index++) {
        strokeWeight(weight);
        point(...hull[index]);
        strokeWeight(line_weight);

        line(hull[index][0], hull[index][1],
             hull[index+1][0], hull[index+1][1]);
    }

    if (length >= hull.length-1){
        let head = hull[0];
        let tail = hull[hull.length-1];

        if (head === tail && hull.length > 1){
            tail = hull[hull.length-2];
        }

        // connecting tail to head
        strokeWeight(weight);
        point(tail[0], tail[1]);
    
        stroke('purple')
        strokeWeight(line_weight);
        line(head[0], head[1], tail[0], tail[1]);
    }

}


function render_hull(hull, color, weight=15, line_weight=5){
    // renders the hull, assumes linked list data structure
    stroke(color);
    strokeWeight(weight);

    // hull is a linked list so we just need to create lines:
    var curr_node = hull.head;
    var next_node = curr_node.next;
    point(curr_node.data[0], curr_node.data[1]);


    while (next_node != hull.head){ // loops until it reaches head again             
        strokeWeight(weight);
        point(next_node.data[0], next_node.data[1]);
        strokeWeight(line_weight);
        line(curr_node.data[0], curr_node.data[1],
             next_node.data[0], next_node.data[1]);
        
        curr_node = next_node;
        next_node = curr_node.next;
    }

    // connecting tail to head
    stroke('purple')
    strokeWeight(line_weight);
    line(curr_node.data[0], curr_node.data[1],
         next_node.data[0], next_node.data[1]);
}


$(document).ready(function() {
  $('#auto').click(function() {
    $('#description').toggleClass('hidden');
    auto_mode = !auto_mode;
    $('#auto').text(auto_mode ? 'Auto Mode' : 'Manual Mode');
  });
});