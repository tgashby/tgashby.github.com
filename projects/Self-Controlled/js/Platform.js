function Platform(x, y, width, height) {
    // Named with sprite for collision detection purposes
    this.sprite = {x: x, y: y, w: width, h: height};
    
    // this.sprite.x = x;
    // this.sprite.y = y;
    // this.sprite.w = width;
    // this.sprite.h = height;
}

Platform.prototype.draw = function(context) {
    context.save();

    context.beginPath();
    context.rect(this.sprite.x, this.sprite.y, this.sprite.w, this.sprite.h);
    context.fillStyle = '#8ED6FF';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = 'black';
    context.stroke();

    context.restore();
};