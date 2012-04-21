function State (sprite, duration) {
    this.duration = duration;

    this.sprite = sprite;

    this.lastUpdate = null;

    this.platforms = [];
}

State.prototype.start = function() {
    
};

State.prototype.completed = function(timePassed) {
    if (!this.lastUpdate) 
    {
        this.lastUpdate = Date.now();
    }

    this.duration = this.duration - (timePassed - this.lastUpdate);

    this.lastUpdate = timePassed;

    return this.duration <= 0;
};

State.prototype.update = function(cb) {
    if (cb) {
        cb();
    }
};

State.prototype.draw = function(context) {
    this.sprite.draw(context);
};
