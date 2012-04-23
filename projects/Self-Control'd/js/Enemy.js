function Enemy() {
    this.vel = {
        x: 0,
        y: 0
    }
    
    this.sprite = new Sprite(images.Monster, 64, 64);
    this.sprite.addAnimation("idle", 0, 5, 5);
    this.sprite.setAnimation("idle");
    
    this.sprite.y = 560;
};

Enemy.prototype.update = function() {
    this.vel.x += Math.floor(Math.random() * 3) - 1;
    this.vel.y += Math.floor(Math.random() * 3) - 1;
    
    if (this.vel.x < -3)
        this.vel.x = -3;
        
    if (this.vel.x > 3)
        this.vel.x = 3;
        
    if (this.vel.y < -3)
        this.vel.y = -3;
        
    if (this.vel.y > 3)
        this.vel.y = 3;

    if (this.vel.x > 0)
        this.sprite.flip = false;
    else if (this.vel.x < 0)
        this.sprite.flip = true;
        
    this.sprite.x += this.vel.x;
    this.sprite.y += this.vel.y;
    
    this.sprite.x = Math.min(Math.max(this.sprite.x, 0), Globals.GAMEWIDTH - this.sprite.w);
    this.sprite.y = Math.min(Math.max(this.sprite.y, 0), Globals.GAMEHEIGHT - this.sprite.h);
};

Enemy.prototype.draw = function(context){
    this.sprite.draw(context);
};
