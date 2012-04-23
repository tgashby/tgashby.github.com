function Sprite(image, w, h) {
    this.image = image;
    this.x = 0;
    this.y = 0;
    this.w = w;
    this.h = h;
    this.flip = false;
    this.cellsWide = this.image.naturalWidth / this.w;
    this.frame = 0;
    this.currentAnim = null;
    this.lastFrameTimestamp = null;
    this.animations = {};
}

Sprite.prototype.draw = function(context) {
    context.save();
    context.translate(this.x, this.y);
    if (this.flip) {
        context.scale(-1, 1);
        context.translate(-this.w, 0);
    }
    context.drawImage(this.image,
            (this.frame % this.cellsWide) * this.w, Math.floor(this.frame / this.cellsWide) * this.h, this.w, this.h,
            0, 0, this.w, this.h);
    context.restore();
}

Sprite.prototype.animate = function(timestamp) {
    // No animation? Don't animate.
    if (!this.currentAnim) {
        return false;
    }

    // First frame?
    var anim = this.animations[this.currentAnim];
    if (!this.lastFrameTimestamp) {
        this.frame = anim.start;
        this.lastFrameTimestamp = timestamp;
        return true;
    }

    // Subsequent frames
    var delta = 1.0 / anim.fps * 1000;
    if (timestamp - this.lastFrameTimestamp > delta) {
        this.frame++;
        if (this.frame > anim.end) {
            this.frame = anim.start;
        }
        this.lastFrameTimestamp += delta;
        return true;
    }

    return false;
}

Sprite.prototype.addAnimation = function(name, start, end, fps) {
    this.animations[name] = {start: start, end: end, fps: fps};
}

Sprite.prototype.setAnimation = function(name) {
    this.currentAnim = name;
    this.lastFrameTimestamp = null;
    if (this.currentAnim) {
        this.frame = 0;
    }
}
