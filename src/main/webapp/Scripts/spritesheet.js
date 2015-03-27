define(function() {
    'use strict';

    function SpriteSheet(context) {
        this.context = context;
        this.sprites = [];
    }

    SpriteSheet.prototype.load = function(url, width, height) {
        // TODO: Pre-load the image so individual sprites just add the same image object.
        this.sheetUrl = url;
        this.sheetWidth = width;
        this.sheetHeight = height;
    };

    SpriteSheet.prototype.define = function(id, x, y, tallness) {
        if (tallness) {
            y -= tallness;
        }
        
        var width = this.sheetWidth,
            height = this.sheetHeight,
            url = this.sheetUrl,
            sprite = this.context.pattern(1, 1, function(add) {
                add.spriteBackground = add.image(url).attr({
                    width: width,
                    height: height,
                    x: -x,
                    y: -y
                });
            }).attr({ patternUnits: 'objectBoundingBox' });
            
        sprite.tallness = tallness || 0;
        sprite.setupAnimation = setupAnimation;

        return this.sprites[id] = sprite;
    };
    
    
    function setupAnimation (animationFrameCount, animationSpeed) {
        
        // Default to no animation
        if (animationFrameCount > 1) {            
            this.animationFrameCount = animationFrameCount;
            this.currentFrame = 0;
            this.lastFrameTime = 0;

            // Default to full animation speed
            this.animationSpeed = animationSpeed || 0;

            this.nextFrame = function(timestamp) {
            
                // Show new frame only if the previous one has been displayed for sufficient time
                if (timestamp > this.lastFrameTime + this.animationSpeed) {
                    var i = this.currentFrame;
            
                    i = ++i % this.animationFrameCount;

                    // TODO: Sprite needs it's width defined.
                    this.spriteBackground.x(i * -100);
                    this.currentFrame = i;
                    this.lastFrameTime = timestamp;
                }
            };
        }
    }

    SpriteSheet.prototype.get = function(id) {
        return this.sprites[id];
    };

    SpriteSheet.prototype.animateSprites = function(timestamp) {
        var s, sprites = this.sprites;
        
        for (s in sprites) {
            if (sprites.hasOwnProperty(s)) {
                s = sprites[s];
                if (s.nextFrame) {
                    s.nextFrame(timestamp);
                }
            }
        }
    };

    return SpriteSheet;
});