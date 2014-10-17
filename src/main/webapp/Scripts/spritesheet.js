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

    SpriteSheet.prototype.define = function(id, x, y, animationFrameCount, animationSpeed) {
        var width = this.sheetWidth,
                height = this.sheetHeight,
                url = this.sheetUrl,
                sprite = this.context.pattern(1, 1, function(add) {
                    add.image(url).attr({
                        width: width,
                        height: height,
                        x: -x,
                        y: -y
                    });
                }).attr({patternUnits: 'objectBoundingBox'});

        // Default to no animation
        sprite.animationFrameCount = animationFrameCount || 1;

        // Default to full animation speed
        sprite.animationSpeed = animationSpeed || 0;

        sprite.nextFrame = function() {
            var i = this.currentFrame || 0;
            if (i < this.animationFrameCount) {
                // TODO: If animation is not cyclic, it should stay on the last frame
                i = ++i % this.animationFrameCount;                
                
                // TODO: Sprite needs it's width defined.
                this._children[0].attr({ x: i * -100 });
                this.currentFrame = i;
            }
        };

        this.sprites[id] = sprite;
    };

    SpriteSheet.prototype.get = function(id) {
        return this.sprites[id];
    };

    SpriteSheet.prototype.animateSprites = function(timestamp) {

        for (var s in this.sprites) {
            if (s) {
                s = this.sprites[s];
                
                // TODO: Animate only when time's right
                s.nextFrame();
            }
        }
    };

    return SpriteSheet;
});