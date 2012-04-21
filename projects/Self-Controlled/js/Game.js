var mousePos;

window.addEventListener('keyup', function(event) {
    Key.onKeyup(event);
}, false);

window.addEventListener('keydown', function(event) {
    Key.onKeydown(event);
}, false);

window.addEventListener('mousemove', function(event) {
    mousePos = Mouse.getPosition(document.getElementById("478Canvas"), event);
}, false);

window.addEventListener('click', function(event) {
    // var canvas = document.getElementById("478Canvas");
    // var ctx = canvas.getContext("2d");
    //          
    // ctx.moveTo(0, 0);
    // ctx.lineTo(mousePos.x, mousePos.y);
    // ctx.stroke();
}, false);

var Game = {
    fps: 60,
    width: 800,
    height: 600,
    enemies: new Array(),
    states: [],
    background: null,
    stopped: false,
    camx: 0,
    camy: 0
};

Game.onEachFrame = (function() {
    var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

    if (requestAnimationFrame) {
        return function(cb) {
            var callB = function() {
                    cb();
                    if (!Game.stopped) {
                        requestAnimationFrame(callB);
                    }
                }
            callB();
        };
    } else {
        return function(cb) {
            setInterval(cb, 1000 / Game.fps);
        }
    }
})();

Game.start = function() {
    Game.canvas = document.getElementById("478Canvas");
    Game.context = Game.canvas.getContext("2d");

    Game.player = new Player();

    Game.enemies.push(new Enemy());
    Game.enemies.push(new Enemy());
    Game.enemies.push(new Enemy());

    console.log(Game.enemies.top());

    // var state2sprite = new Sprite(images.BeginningRoom, 1600, 600);
    // state2sprite.addAnimation("idle", 0, 3, 3);
    // state2sprite.setAnimation("idle");
    // Game.states.push(new State(state2sprite, 10000));

    var state1sprite = new Sprite(images.RoomBackground, 1600, 600);
    state1sprite.addAnimation("idle", 0, 1, 3);
    state1sprite.setAnimation("idle");
    Game.states.push(new State(state1sprite, 10000));
    Game.states.top().platforms.push(new Platform(44, 301, 185, 75));
    Game.states.top().platforms.push(new Platform(571, 325, 196, 60));
    Game.states.top().platforms.push(new Platform(332, 249, 144, 40));

    Game.onEachFrame(Game.run);
};

Game.stop = function() {
    Game.stopped = true;
};

Game.restart = function() {
    Game.stopped = false;
}

Game.run = (function() {
    var loops = 0;
    var skipTicks = 1000 / Game.fps;
    var nextGameTick = (new Date).getTime();

    return function() {
        while ((new Date).getTime() > nextGameTick) {
            Game.update();
            nextGameTick += skipTicks;
        }

        Game.draw();
    }
})();

Game.draw = function() {
    Game.context.clearRect(0, 0, Game.width, Game.height);

    Game.context.save();
    Game.context.translate(-1 * Game.camx, 0);
    
    Game.states.top().platforms.forEach(function(platform) {
        platform.draw(Game.context);
    });
    Game.states.top().draw(Game.context);
    

    Game.player.draw(Game.context);

    Game.enemies.forEach(function(enemy) {
        enemy.draw(Game.context);
    });

    Game.context.restore();
};

Game.update = function() {
    var now = Date.now();

    Game.player.update();
    Game.player.sprite.animate(now);

    Game.states.top().sprite.animate(now);

    if (Game.states.top().completed(now))
    {
        if (Game.states.length > 1) {
            Game.states.pop();
        }
    }

    Game.enemies.forEach(function(enemy) {
        enemy.update();
    });
    Game.camx = Game.player.sprite.x - Globals.GAMEWIDTH/2;
    if (Game.camx < 0) {
        Game.camx = 0;
    }
    if (Game.camx > Game.states.top().sprite.w - Globals.GAMEWIDTH){
        Game.camx = Game.states.top().sprite.w - Globals.GAMEWIDTH;
    }
    Game.camy = Game.player.sprite.y;
    checkCollisions();
};

function collides(a, b) {
    return a.sprite.x < b.sprite.x + b.sprite.w && a.sprite.x + a.sprite.w > b.sprite.x && a.sprite.y < b.sprite.y + 
        b.sprite.h && a.sprite.y + a.sprite.h > b.sprite.y;
}

function checkCollisions() {
    Game.enemies.forEach(function(enemy) {
        if (collides(enemy, Game.player)) {
            // Collision stuff!
            Game.enemies.splice(Game.enemies.indexOf(enemy), 1);
        }
       });

    Game.states.top().platforms.forEach(function(platform) {
        if (collides(platform, Game.player)) {
            if (Game.player.sprite.y < platform.sprite.y) {
                Game.player.jumping = false;
                Game.player.vel.y = 0;
                Game.player.sprite.y = platform.sprite.y - Game.player.sprite.h + 5;
            } else {
                Game.player.sprite.y = platform.sprite.y + platform.sprite.h;
                Game.player.vel.y = 0;
            };

            Game.player.offPlatform = false;

        } else {
            Game.player.offPlatform = true;
        };
    })
}