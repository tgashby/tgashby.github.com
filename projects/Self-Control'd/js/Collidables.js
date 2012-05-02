function Platform(x, y, width, height) {
    // Named with sprite for collision detection purposes
    this.sprite = {x: x, y: y, w: width, h: height};

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

function Ladder(x, y, width, height) {
    // Named with sprite for collision detection purposes
    this.sprite = {x: x, y: y, w: width, h: height};

}

Ladder.prototype.draw = function(context) {
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