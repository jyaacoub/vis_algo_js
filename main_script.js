// display vars:
const screenW = document.querySelector('body').clientWidth;
const screenH =  document.querySelector('body').clientHeight - document.querySelector('#info_header').offsetHeight - 1;
const FR = 10;
var DISPLAY_ON = true;

// used to keep track of time
var startDate = new Date();

const NUM_POINTS = 6;
const POINTS_PADDING = [300,300];
// var points = [[313.8302185085997, 603.5218287855582],
//                 [462.1563737447342, 325.31362441743624],
//                 [540.3952399532217, 566.277302588829],
//                 [688.2170107207221, 600.2671524179689],
//                 [839.3533587995337, 216.8270832232185],
//                 [937.8532402856262, 619.0426384744126]];
var points = [[377.10313038732534, 532.6455551874569],
                    [397.24608553409587, 513.7461394508997],
                    [479.196451703766, 436.50496603526744],
                    [675.8645931502813, 615.5545037806918],
                    [783.9454820661717, 184.38044960965144],
                    [999.7880262381167, 525.2545493678044],
                    [1011.1470148153405, 513.5417861088572],
                    [1118.7081515397356, 481.2225415632788],
                    [1189.0848009552749, 262.2679699808657],
                    [1231.6691016582433, 302.26749607372153]];

const RECURSIVE = true; // whether or not to use recursive algo for hull
var hull, merge_stack;

function setup() {
    frameRate(FR);

    createCanvas(screenW, screenH);

    angleMode(DEGREES);
    rectMode(CENTER); // From where rectangles are drawn from

    // randomly selecting points to draw if no points are given
    // if (!points){
    //     console.log("randomly picking points...");
    //     var points = new Array(NUM_POINTS);
    //     for (let i = 0; i < NUM_POINTS; i++) {
    //         // x-bounds is half the canvas width - padding
    //         var x = (Math.random() * (width - POINTS_PADDING[0])) + POINTS_PADDING[0]/2;
    //         // y-bounds is the canvas height - padding
    //         var y = (Math.random() * (height - POINTS_PADDING[1])) + POINTS_PADDING[1]/2;
    //         points[i] = [x,y];
    //     }
    // }

    // sorting the points
    points = merge_sort(points, 0);
    console.log("Using recursive algorithm: " + RECURSIVE);
    if (RECURSIVE)
        hull = find_convex_hull(points);
    else
        [hull, merge_stack] = iterative_convex_hull(points, 0, 7); // points, axis, merge_stack, num_steps
    console.log(hull);
}

// This function is called every frame (by P5.js):
function draw(){
    if (keyIsDown(UP_ARROW)){
        console.log("NEXT ITER");
        if (!RECURSIVE)
            [hull, merge_stack] = iterative_convex_hull(points, 0, 1, merge_stack, hull);
    }

    if (DISPLAY_ON){   
        clear();
        // Background:
        background(0,20,0);
        // hull
        if (RECURSIVE)
            render_hull(hull, 'yellow', 15, 4);
        else
            for (const [key, value] of Object.entries(hull))
                render_hull(value, 'yellow', 15, 4);
        // points
        render_points(points, 'red', 10);
    }
}
function render_points(points, color, weight=10){
    // Displaying the points
    stroke(color);
    strokeWeight(weight);
    points.forEach(e => {
        const [x, y] = e;
        point(x, y);
    });
    
    // Labelling the points
    fill('white');
    stroke('black');
    strokeWeight(2);
    points.forEach(e => {
        const [x, y] = e;
        const str = "("+parseInt(x)+","+parseInt(y)+")";
        text(str, x+10, y);
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