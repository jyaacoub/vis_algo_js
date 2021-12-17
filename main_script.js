// display vars:
const screenW = document.querySelector('body').clientWidth;
const screenH =  document.querySelector('body').clientHeight - document.querySelector('#info_header').offsetHeight - 1;
const FR = 1;
var DISPLAY_ON = true;

// used to keep track of time
var startDate = new Date();

const NUM_POINTS = 20;
const POINTS_PADDING = [300,300];
var points = new Array(NUM_POINTS);
// var points = [[313.8302185085997, 603.5218287855582],
//                 [462.1563737447342, 325.31362441743624],
//                 [540.3952399532217, 566.277302588829],
//                 [688.2170107207221, 600.2671524179689],
//                 [839.3533587995337, 216.8270832232185],
//                 [937.8532402856262, 619.0426384744126]];
var hull;

function setup() {
    frameRate(FR);

    createCanvas(screenW, screenH);

    angleMode(DEGREES);
    rectMode(CENTER); // From where rectangles are drawn from

    // randomly selecting points to draw
    for (let i = 0; i < NUM_POINTS; i++) {
        // x-bounds is half the canvas width - padding
        var x = (Math.random() * (width - POINTS_PADDING[0])) + POINTS_PADDING[0]/2;
        // y-bounds is the canvas height - padding
        var y = (Math.random() * (height - POINTS_PADDING[1])) + POINTS_PADDING[1]/2;
        points[i] = [x,y];
    }
    hull = find_convex_hull(points);
    console.log(hull);
}

// This function is called every frame (by P5.js):
function draw(){
    if (DISPLAY_ON){   
        clear();
        // Background:
        background(0,20,0);
        // hull
        render_hull(hull, 'yellow', 15, 4);
        // points
        render_points(points, 'red', 10);

        // 2nd set on opposite side:
        // render_points(points.map(e => [e[0] + width/2, e[1]]), 'yellow', 10);
    }
}
function render_points(points, color, weight=10){
    stroke(color);
    strokeWeight(weight);
    points.forEach(e => {
        point(e[0], e[1]);
    });
}

function render_hull(hull, color, weight=15, line_weight=5){
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