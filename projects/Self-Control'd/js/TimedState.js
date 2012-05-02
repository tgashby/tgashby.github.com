function TimedState (sprite, duration) {
    this.duration = duration;

    this.sprite = sprite;

    this.lastUpdate = null;

    this.platforms = [];
    this.ladders = [];
}

TimedState.prototype.start = function() {
    this.lastUpdate = Date.now();
};

TimedState.prototype.completed = function(timePassed) {
    this.duration = this.duration - (timePassed - this.lastUpdate);

    this.lastUpdate = timePassed;

    return this.duration <= 0;
};

TimedState.prototype.draw = function(context) {
    this.sprite.draw(context);
};
