/* 
    Define ProgressBar Class;

    var app_instance = new ProgressBar( autoInvoke[, Arguments] );

    @param canvas {string/object} - canvas id or DOM object
    @param initialPosition {integer} - starting point (%)
*/
"use strict";

/* 
    Global variables uppercase + underscore

    var GLOBAL_VARIABLE = 1;
*/

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var isset = function(val, prop, fb) {
    if(typeof val == 'object') {
        if(typeof val[prop] != 'undefined') {
            return val[prop];
        }
    }
    return fb;
}

function ProgressBar( canvas, initialPosition, options ) {

    var autoInvoke = true;

    this.Canvas = (typeof canvas == 'string') ? document.getElementById(canvas) : canvas;
    this.ctx = this.Canvas.getContext('2d');

    this.options = {
        'strokeStyle': isset(options, 'stroke', '#000'),
        'lineWidth': isset(options, 'width', 3),
        'lineCap': isset(options, 'cap', 'butt'),
        'gradientStart': isset(options, 'gradientStart', '#f1c40f'),
        'gradientEnd': isset(options, 'gradientEnd', '#e89e05'),
        'timer': isset(options, 'timer', 10)
    };

    if( autoInvoke ) {

        this.Init( initialPosition || 0 )

    }

    return this;
}

ProgressBar.prototype = {

    /*
        Class properties
    */
    Canvas: null,
    ctx: null,
    progress: 0,
    width: 0,
    height: 0,
    circ: Math.PI * 2,
    quart: Math.PI / 2,

    /* 
        Built-in Initialization function.
        Called by the constructor.

        @param initialPosition {integer} - starting point (%)
    */
    Init: function( initialPosition, time ) {

        this.progress = initialPosition;

        for(var style in this.options) {
            if(this.ctx.hasOwnProperty(style)) {
                this.ctx[style] = this.options[style];
            }
        }

        this.step = 360/this.options.timer/60;
        this.Calculate();
        this.Update(100);

        return this;
    },

    /*
        Calculate; calculate the canvas size
    */
    Calculate: function() {
        this.realWidth = this.Canvas.width;
        this.realHeight = this.Canvas.height;
        this.width = this.Canvas.width - this.options.lineWidth;
        this.height = this.Canvas.height - this.options.lineWidth;

        this.x = this.width/2 + this.options.lineWidth/2;
        this.y = this.height/2 + this.options.lineWidth/2;
        this.r = Math.min(this.height, this.width)/2;
    },

    /*
        Start; start the progress bar
    */
    Start: function() {

        this.Animate();

        return this;
    },


    /*
        Clear; clear the canvas (remove progress bar)
    */
    Clear: function() {
        this.ctx.clearRect(0, 0, this.realWidth, this.realHeight);
    },

    /*
        Update; update the current progress bar to {value}
        @param value {integer} - position in %
    */
    Update: function(value) {
        
        this.progress = value;

        var grad = this.ctx.createLinearGradient(this.x - this.r, 0, this.x, this.realHeight);
        grad.addColorStop(0, this.options.gradientStart);
        grad.addColorStop(1, this.options.gradientEnd);

        this.Clear();
        this.ctx.beginPath();
        this.ctx.strokeStyle = grad;
        this.ctx.arc(this.x, this.y, this.r, -this.quart * value/100, this.circ - this.quart, false);
        this.ctx.stroke();

    },

    Animate: function() {

        var _this = this;

        this.animation = window.requestAnimationFrame(function() {
            if( (-_this.quart * (_this.progress)/100) < _this.circ - _this.quart) {
                _this.Update(_this.progress);
                _this.progress -= _this.step;

                _this.Animate();
            }
            else {
                window.cancelAnimationFrame(_this.animation);
                _this.Clear();
            }
        });

    },

    /* 
        Built-in destructor function.
        Destroy the current instance of the class.
    */
    Destroy: function( ) {

        /* Optional destruction code */

    }

};