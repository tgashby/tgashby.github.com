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

function placePlatforms(state) {
    state.platforms.push(new Platform(33, 375, 185, 60));
    state.platforms.push(new Platform(655, 490, 200, 40));
    state.platforms.push(new Platform(250, 525, 174, 40));
    state.platforms.push(new Platform(970, 580, 204, 50));
    state.platforms.push(new Platform(490, 490, 90, 30));
    state.platforms.push(new Platform(285, 225, 344, 50));
    state.platforms.push(new Platform(720, 235, 240, 40));

    state.ladders.push(new Ladder(655, 255, 50, 230));
}

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

    var blankSprite = new Sprite(images.BeginningRoom, 800, 600);
    var basicRoomSprite = new Sprite(images.RoomLong, 1200, 800);
    basicRoomSprite.addAnimation("idle", 0, 1, 3);
    basicRoomSprite.setAnimation("idle");

    var beginningSound = new Audio("sound/chant.wav");    

    var beginningState = new SoundState(blankSprite, beginningSound);

    var noEnemiesState = new TimedState(basicRoomSprite, 3000);
    placePlatforms(noEnemiesState);

    var randomEnemiesState = new CallbackState(basicRoomSprite, 10000,
        function () {
            for (var i = 0; i < 6; i++) {
                Game.enemies.push(new Enemy(Math.round(Math.random()*basicRoomSprite.w), 
                    Math.round(Math.random()*basicRoomSprite.h), EnemyAI.randomMove));
            };
        });
    placePlatforms(randomEnemiesState);

    var getToMiddleState = new CallbackState(basicRoomSprite, 10000,
        function () {
            Game.enemies = new Array();

            for (var i = 0; i < 4; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i;
                Game.enemies.push(enemy);
            };

            for (var i = 0; i < 4; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i + 550;
                Game.enemies.push(enemy);
            };
        });
    placePlatforms(getToMiddleState);

    var getToBottomState = new CallbackState(basicRoomSprite, 10000,
        function () {
            Game.enemies = new Array();

            for (var i = 0; i < 4; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i;
                Game.enemies.push(enemy);
            };

            for (var i = 0; i < 4; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i + 300;
                Game.enemies.push(enemy);
            };
        });
    placePlatforms(getToBottomState);

    var getToTopState = new CallbackState(basicRoomSprite, 10000,
        function () {
            Game.enemies = new Array();

            for (var i = 0; i < 4; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i + 300;
                Game.enemies.push(enemy);
            };

            for (var i = 0; i < 4; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i + 550;
                Game.enemies.push(enemy);
            };
        });
    placePlatforms(getToTopState);

    // States are a stack, so these happen in reverse order.
    Game.states.push(getToTopState);
    Game.states.push(getToBottomState);
    Game.states.push(getToMiddleState);
    Game.states.push(randomEnemiesState);
    Game.states.push(noEnemiesState);
    Game.states.push(beginningState);

    Game.onEachFrame(Game.run);
    Game.states.top().start();
};

Game.stop = function() {
     Game.stopped = true;
};

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
     Game.context.translate(-1 * Game.camx, -1 * Game.camy);
     
     Game.states.top().platforms.forEach(function(platform) {
          platform.draw(Game.context);
     });
     Game.states.top().ladders.forEach(function(ladder) {
          ladder.draw(Game.context);
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

     Game.enemies.forEach(function(enemy) {
          enemy.update();
          enemy.sprite.animate(now);
     });
     
     Game.camx = Game.player.sprite.x - Globals.GAMEWIDTH/2;
     if (Game.camx < 0) {
          Game.camx = 0;
     }
     if (Game.camx > Game.states.top().sprite.w - Globals.GAMEWIDTH) {
          Game.camx = Game.states.top().sprite.w - Globals.GAMEWIDTH;
     }
     
     Game.camy = Game.player.sprite.y - Globals.GAMEHEIGHT/2;
     if (Game.camy < 0) {
        Game.camy = 0;
     }
     if (Game.camy > Game.states.top().sprite.h - Globals.GAMEHEIGHT) {
        Game.camy = Game.states.top().sprite.h - Globals.GAMEHEIGHT;
     }

     checkCollisions();

     if (Game.states.top().completed(now))
     {
          if (Game.states.length > 1) {
                Game.states.pop();
                Game.states.top().start();
          }
     }
};

function collideTile(a, b) {
    var landed = false;
    if (a.sprite.x + a.sprite.colBox["x1"] < b.sprite.x + b.sprite.w && a.sprite.x + a.sprite.colBox["x2"] > b.sprite.x) {
        if (a.sprite.y + a.sprite.colBox["y0"] > b.sprite.y && a.sprite.y + a.sprite.colBox["y0"] < b.sprite.y + b.sprite.h) {
            a.sprite.y = b.sprite.y + b.sprite.h - a.sprite.colY;
            a.vel.y = 0;
        }
        else if (a.sprite.y + a.sprite.colBox["y3"] > b.sprite.y && a.sprite.y + a.sprite.colBox["y3"] < b.sprite.y + b.sprite.h) {
            if (a.vel.y > 0) {
                a.sprite.y = b.sprite.y - a.sprite.colBox["y3"];
                a.vel.y = 0;
                a.jumping = false;
                landed = true;
            }
        }
        else if (a.sprite.y + a.sprite.colBox["y3"] == b.sprite.y) {
            landed = true;
        }
    }

    if (a.sprite.y + a.sprite.colBox["y1"] < b.sprite.y + b.sprite.h && a.sprite.y + a.sprite.colBox["y2"] > b.sprite.y) {
        if (a.sprite.x + a.sprite.colBox["x0"] > b.sprite.x && a.sprite.x + a.sprite.colBox["x0"] < b.sprite.x + b.sprite.w) {
            a.sprite.x = b.sprite.x + b.sprite.w - a.sprite.colX;
        }
        else if (a.sprite.x + a.sprite.colBox["x3"] > b.sprite.x && a.sprite.x + a.sprite.colBox["x3"] < b.sprite.x + b.sprite.w) {
            a.sprite.x = b.sprite.x - a.sprite.colBox["x3"];
        }
    }
    return landed;
};

function boxToBoxCollision(a, b) {
    return a.sprite.x < b.sprite.x + b.sprite.w && a.sprite.x + a.sprite.w > b.sprite.x && a.sprite.y < b.sprite.y + 
         b.sprite.h && a.sprite.y + a.sprite.h > b.sprite.y;
}

function checkCollisions() {
    var hasLanded = false;

    Game.states.top().ladders.forEach(function(ladder) {
        Game.player.onLadder = boxToBoxCollision(Game.player, ladder);
    });


    Game.states.top().platforms.forEach(function(platform) {
        if (collideTile(Game.player, platform)) {
            hasLanded = true;
        };
    });

    if (!hasLanded && !Game.player.onLadder) {
        Game.player.jumping = true;
    }
};
