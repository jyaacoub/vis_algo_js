// display vars:
const screenW = document.querySelector('body').clientWidth;
const screenH =  document.querySelector('body').clientHeight - document.querySelector('#info_header').offsetHeight - 1;
const FR = 10000;
var DISPLAY_ON = true;

// used to keep track of time
var startDate = new Date();

function setup() {
    createCanvas(screenW, screenH);

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