function Player() {
    this.vel = {
        x: 0,
        y: 0
    }
    
    this.gravity = .8;
    this.health = 100;
    
    this.jumping = false;

    this.sprite = new Sprite(images.Billy, 64, 128, 16, 16, 32, 96);
    this.sprite.addAnimation("idle", 0, 4, 5);
    this.sprite.addAnimation("walk", 5, 18, 15);
    this.sprite.addAnimation("cry", 20, 24, 10);
    this.sprite.setAnimation("walk");
    
    this.sprite.y = Globals.FLOOR - this.sprite.h;
    
    this.moveTimer = 0;
    this.onLadder = false;
    this.firstCry = true;
    this.firstHurt = true;

    this.sounds = {
        cry : new Audio("sound/cry.wav"),
        firstCry : new Audio("sound/FirstCry.ogg"),
        firstHurt : new Audio("sound/TwoHits.ogg")
    }

    var a = this;

    this.sounds.cry.addEventListener('ended', function() {
        a.crying = false;

        if (a.firstCry) {
            a.sounds.firstCry.play();
            a.firstCry = false;
        };
    }, false);
}

Player.prototype.draw = function(context) {
    this.sprite.draw(context);
}

Player.prototype.moveLeft = function() {
    if (this.vel.x > 0) {
    	this.vel.x = 0;
    }

    this.vel.x -= 1;
    
    if (this.vel.x < -4)
        this.vel.x = -4;
}

Player.prototype.moveRight = function() {
    if (this.vel.x < 0) {
    	this.vel.x = 0;
    }

    this.vel.x += 1;
    
    if (this.vel.x > 4)
        this.vel.x = 4;
}

Player.prototype.moveUp = function() {
    if (this.onLadder && !this.haunted) {
        this.sprite.y -= 4;
    };
}

Player.prototype.jump = function() {
    if (this.canJump) {
        if (!this.jumping) {
            this.vel.y = -11;       
            this.jumping = true;
        }
        else if (this.vel.y < 0) {
            this.vel.y -= .5;
        }
        else if (this.vel.y > 0) {
            this.vel.y -= .3;
        }
    }
};

Player.prototype.moveDown = function() {
    if (this.onLadder && !this.haunted) {
        this.sprite.y += 4;
    }
}

Player.prototype.update = function() {
    this.moveTimer++;

    if (this.crying) {
        return;
    };

    if (this.health < 70 && this.firstHurt && !this.firstCry) {
        this.sounds.firstHurt.play();
        this.firstHurt = false;
    };
    
    if (this.moveTimer > 60)
        this.moveTimer = 0;
    
    // HACK for now, may just stay in if we don't have anything to jump on...
    if (this.sprite.y + this.sprite.h + 40 >= Game.states.top().sprite.h) {
      
        this.jumping = false;
        this.vel.y = 0;
        this.sprite.y = Game.states.top().sprite.h - this.sprite.h - 40;
    }

    if (this.sprite.y <= 0) {
        this.vel.y = 0;
        this.sprite.y = 0;
    }

    if (this.sprite.x < 0) {
    	this.sprite.x = 0;
    }
    if (this.sprite.x + this.sprite.w > Game.states.top().sprite.w) {
    	this.sprite.x = Game.states.top().sprite.w - this.sprite.w;
    }
    
    if (this.jumping)
        this.vel.y += this.gravity;
    
    if (Key.isDown(Key.SPACE))
        this.jump();

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
        
    var haunted = this.nearbyEnemies();
    this.canJump = !haunted; // If you're scared, you can't jump.

    if (!Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT) && !haunted) {
        this.vel.x = 0;
        if (this.sprite.currentAnim != "idle") {
            this.sprite.setAnimation("idle");
        }
    } else if (!haunted) {
        if (this.sprite.currentAnim != "walk") {
            this.sprite.setAnimation("walk");
        }
    } else if (!this.jumping) {
        this.vel.x = 0;
        if (this.sprite.currentAnim != "cry") {
            this.sprite.setAnimation("cry");
            this.crying = true;
        };

        this.sounds.cry.play();
    };

    if (this.onLadder && (Key.isDown(Key.UP) || Key.isDown(Key.DOWN))) {
        this.vel.y = 0;
        this.jumping = false;
    };
    
    this.sprite.x += this.vel.x;
    this.sprite.y += this.vel.y;
}

Player.prototype.nearPlayer = function(enemy) {
    var dist = 
        Math.sqrt((this.sprite.x - enemy.sprite.x) * (this.sprite.x - enemy.sprite.x) +
            (this.sprite.y - enemy.sprite.y) * (this.sprite.y - enemy.sprite.y));

    return dist < 150;
};

Player.prototype.nearbyEnemies = function() {
    var enemies = 0;
    var p = this;

    Game.enemies.forEach(function (enemy) {
        if (p.nearPlayer(enemy)) {
            enemies++;
        };
    });

    return enemies > 1;
}
