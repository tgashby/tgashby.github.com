 function CallbackState (sprite, duration, callback) {
    this.sprite = sprite;
    this.duration = duration;
    this.callback = callback;

    this.lastUpdate = null;

    this.platforms = [];
}

CallbackState.prototype.start = function() {
    this.lastUpdate = Date.now();
    this.callback();
};

CallbackState.prototype.completed = function(timePassed) {
    this.duration = this.duration - (timePassed - this.lastUpdate);

    this.lastUpdate = timePassed;

    return this.duration <= 0;
};

CallbackState.prototype.draw = function(context) {
    this.sprite.draw(context);
};
