function Player() {
    this.vel = {
        x: 0,
        y: 0
    }
    
    this.gravity = 1;
    
    this.jumping = false;
    this.onPlatform = false;

    this.sprite = new Sprite(images.Billy, 64, 128);
    this.sprite.addAnimation("idle", 0, 4, 5);
    this.sprite.addAnimation("walk", 5, 18, 15);
    this.sprite.setAnimation("walk");
    
    this.sprite.y = Globals.FLOOR - this.sprite.h;
    
    this.moveTimer = 0;
}

Player.prototype.draw = function(context) {
    this.sprite.draw(context);
}

Player.prototype.moveLeft = function() {
    this.vel.x -= 1;
    
    if (this.vel.x < -3)
        this.vel.x = -3;
}

Player.prototype.moveRight = function() {
    this.vel.x += 1;
    
    if (this.vel.x > 3)
        this.vel.x = 3;
}

Player.prototype.moveUp = function() {
    if (!this.jumping) {
        this.vel.y = -23;
        
        this.jumping = true;
    }
}

Player.prototype.moveDown = function() {
    this.sprite.y += 1;
}

Player.prototype.update = function() {
    this.moveTimer++;
    
    if (this.moveTimer > 60)
        this.moveTimer = 0;
    
    // HACK for now, may just stay in if we don't have anything to jump on...
    if (this.sprite.y + this.sprite.h >= Globals.FLOOR) {
        this.jumping = false;
        this.vel.y = 0;
        this.sprite.y = Globals.FLOOR - this.sprite.h;
    }
    
    if (this.jumping || this.offPlatform)
        this.vel.y += this.gravity;
    
    if (Key.isDown(Key.UP))
        this.moveUp();
        
    if (Key.isDown(Key.DOWN))
        this.moveDown();
        
    if (Key.isDown(Key.LEFT)) {
        this.moveLeft();
        this.sprite.flip = true;
    }
        
    if (Key.isDown(Key.RIGHT)) {
        this.moveRight();
        this.sprite.flip = false;
    }
        
    if (!Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT)) {
        this.vel.x = 0;
        if (this.sprite.currentAnim != "idle") {
            this.sprite.setAnimation("idle");
        }
    } else {
        if (this.sprite.currentAnim != "walk") {
            this.sprite.setAnimation("walk");
        }
    }
    
    this.sprite.x += this.vel.x;
    this.sprite.y += this.vel.y;
}
