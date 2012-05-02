function SoundState (sprite, sound) {
    this.sprite = sprite;

    this.soundOver = false;

    this.sound = sound;
    
    var a = this;
    this.sound.addEventListener('ended', function() {
        a.soundOver = true;
    }, false);

    this.platforms = [];
    this.ladders = [];
}

SoundState.prototype.start = function() {
    this.sound.play();
};

SoundState.prototype.completed = function(timePassed) {
    return this.soundOver;
};

SoundState.prototype.draw = function(context) {
    this.sprite.draw(context);
};
