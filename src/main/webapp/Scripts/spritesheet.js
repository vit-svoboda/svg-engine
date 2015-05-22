define(function() {
    'use strict';

    function SpriteSheet(context) {
        this.context = context;
        this.sprites = [];
    }

    /**
     * Loads an image on given URL so it can be
     * 
     * @param {String} url The image url
     * @param {number} width Width of the image to be loaded
     * @param {number} height Height of the image to be loaded
     */
    SpriteSheet.prototype.load = function(url, width, height) {
        this.sheetImage = new Image();
        this.sheetImage.src = url;
        this.sheetImage.width = width;
        this.sheetImage.height = height;
    };

    /**
     * Defines a sprite as a part (or the whole lot) of currently loaded sprite-sheet.
     * 
     * @param {Object} id Identifier or the sprite for later retrieval
     * @param {type} x X-axis position of the sprite in the sprite-sheet image.
     * @param {type} y Y-axis position of the sprite in the sprite-sheet image.
     * @param {type} tallness The simulated Z-axis height of the object.
     * @returns {SVGElement}
     */
    SpriteSheet.prototype.define = function(id, x, y, tallness) {
       
        var attributes = {
                width: this.sheetImage.width,
                height: this.sheetImage.height,
                x: -x,
                y: -y
            },
            url = this.sheetImage.src,
            sprite = this.context.pattern(1, 1, function(add) {
                add.spriteBackground = add.image(url)
                                          .attr(attributes);
            }).attr({ patternUnits: 'objectBoundingBox' });
            
        sprite.tallness = tallness || 0;
        sprite.setupAnimation = setupAnimation;

        return this.sprites[id] = sprite;
    };
    
    
    /**
     * Configures a defined sprite to have an active animation spanning given amount of frames.
     * 
     * @param {type} spriteWidth Width of the sprite to be animated.
     * @param {type} animationFrameCount The number of animation frames.
     * @param {type} animationSpeed The delay after each animation frame. If none defined, animation is played as quickly as possible.
     */
    function setupAnimation (spriteWidth, animationFrameCount, animationSpeed) {
        
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

                    this.spriteBackground.x(i * -spriteWidth);
                    this.currentFrame = i;
                    this.lastFrameTime = timestamp;
                }
            };
        }
    }

    /**
     * Returns a previously defined sprite so it can be used.
     * 
     * @param {type} id Identifier of previously defined sprite.
     * @returns {SVGElement}
     */
    SpriteSheet.prototype.get = function(id) {
        return this.sprites[id];
    };

    /**
     * Performs an animation step by given timestamp on all sprites with configured animation.
     * 
     * @param {type} timestamp Current time, compared with the timestamp of last call.
     */
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