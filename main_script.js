// display vars:
const screenW = 1500;
const screenH =  840;
const FR = 10000;
var DISPLAY_ON = true;

// used to keep track of time
var startDate = new Date();

function setup() {
    createCanvas(windowWidth, windowHeight-document.getElementById('header').offsetHeight-4);

    angleMode(DEGREES);
    rectMode(CENTER); // From where rectangles are drawn from
}

// This function is called every frame (by P5.js):
function draw(){
    if (DISPLAY_ON){   
        clear();
        // Background:
        background(0,20,0);
    }
}