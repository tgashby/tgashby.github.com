var mousePos;

window.addEventListener('keyup', function(event) {
     if (Key.onKeyup(event)) {
         event.stopPropagation();
         event.preventDefault();
     }
}, false);

window.addEventListener('keydown', function(event) {
     if (Key.onKeydown(event)) {
         event.stopPropagation();
         event.preventDefault();
     }
}, false);

function placePlatforms(state) {
    state.platforms.push(new Platform(state.sprite.x-10, state.sprite.y, 10, state.sprite.h));
    state.platforms.push(new Platform(state.sprite.w, state.sprite.y, 10, state.sprite.h));
    state.platforms.push(new Platform(state.sprite.x, state.sprite.y-10, state.sprite.w, 10));
    state.platforms.push(new Platform(state.sprite.x, state.sprite.h- 40, state.sprite.w, 10));
    state.platforms.push(new Platform(33, 375, 185, 60));
    state.platforms.push(new Platform(655, 490, 200, 40));
    state.platforms.push(new Platform(250, 525, 174, 40));
    state.platforms.push(new Platform(970, 580, 204, 50));
    state.platforms.push(new Platform(490, 490, 90, 30));
    state.platforms.push(new Platform(285, 225, 344, 50));
    state.platforms.push(new Platform(720, 235, 240, 40));

    state.ladders.push(new Ladder(655, 255, 50, 150));
}

var Game = {
     fps: 60,
     width: 800,
     height: 600,
     enemies: new Array(),
     states: [],
     background: null,
     overlaySprite: null,
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

var lastFrameTime = Date.now();
var frameRate = null;

Game.start = function() {
    Game.canvas = document.getElementById("478Canvas");
    Game.context = Game.canvas.getContext("2d");
    Game.overlayContext = document.getElementById("OverlayCanvas").getContext("2d");
    frameRate = document.getElementById("frameRate");

    Game.overlaySprite = new Sprite(images.DamageOverlay, 800, 600);
    Game.overlaySprite.addAnimation("idle", 0, 3, 4);
    Game.overlaySprite.setAnimation("idle");

    Game.player = new Player();

    var blankSprite = new Sprite(images.BeginningRoom, 800, 600);
    var endSprite = new Sprite(images.EndRoom, 4000, 600);

    var basicRoomSprite = new Sprite(images.RoomBackground, 1200, 800);
    basicRoomSprite.addAnimation("idle", 0, 3, 3);
    basicRoomSprite.setAnimation("idle");

    doorSprite = new Sprite(images.Door, 64, 128);
    doorSprite.x = 4000 - doorSprite.w; // Put at end of last level
    doorSprite.y = 600 - doorSprite.h; // Put at end of last level
    doorSprite.addAnimation("idle", 0, 4, 4);
    doorSprite.setAnimation("idle");
    
    var beginningSound = new Audio("sound/beginVO.ogg");
    var firstRoomSound = new Audio("sound/roomVO.ogg");

    var beginningState = new SoundState(blankSprite, beginningSound);

    var noEnemiesState = new SoundState(basicRoomSprite, firstRoomSound);
    placePlatforms(noEnemiesState);

    var randomEnemiesState = new CallbackState(basicRoomSprite, 10000,
        function () {
            for (var i = 0; i < 6; i++) {
                Game.enemies.push(new Enemy(Math.round(Math.random()*basicRoomSprite.w), 
                    Math.round(Math.random()*basicRoomSprite.h), EnemyAI.vMove));
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

    var endState = new CallbackState(endSprite, 100000,
        function() {
            Game.enemies = new Array();
        });

    // States are a stack, so these happen in reverse order.
    Game.states.push(endState);
    Game.states.push(getToTopState);
    Game.states.push(getToBottomState);
    Game.states.push(getToMiddleState);
    Game.states.push(randomEnemiesState);
    Game.states.push(noEnemiesState);
    Game.states.push(beginningState);

    // Start the game!
    Game.states.top().start();
    Game.onEachFrame(Game.run);
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
     var now = Date.now();
     frameRate.innerText = (1 / (now - lastFrameTime) * 1000) + " FPS";
     lastFrameTime = now;

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

     if (Game.states.length == 1) {
        doorSprite.draw(Game.context);
        doorSprite.animate(now);
     };
     
     Game.player.draw(Game.context);

     Game.enemies.forEach(function(enemy) {
          enemy.draw(Game.context);
     });

     Game.context.restore();

     // Draw overlay
     Game.overlaySprite.animate(now);
     Game.overlayContext.clearRect(0, 0, Game.width, Game.height);
     if (Game.player.health < 100) {
         Game.overlaySprite.draw(Game.overlayContext);
         if (Game.player.health > 0) {
             var spotRadius = Game.player.health * 2 + 30;
             var spotRadiusSqr = spotRadius*spotRadius;
             var spotInnerRadius = spotRadius - 10;
             var spotInnerRadiusSqr = spotInnerRadius*spotInnerRadius;
             var spotCenter = {
                 x: Game.player.sprite.x + Game.player.sprite.w / 2 - Game.camx,
                 y: Game.player.sprite.y + Game.player.sprite.h / 2 - Game.camy
             };
             var region = Game.overlayContext.getImageData(spotCenter.x - spotRadius, spotCenter.y - spotRadius, spotRadius * 2, spotRadius * 2);
             for (var y = 0; y < region.height; y++) {
                 for (var x = 0; x < region.width; x++) {
                     var i = (y*region.width+x)*4+3;
                     var dx = x - spotRadius;
                     var dy = y - spotRadius;
                     var distSqr = dx*dx + dy*dy;
                     if (distSqr < spotInnerRadiusSqr) {
                         region.data[i] = 0;
                     } else if (distSqr < spotRadiusSqr) {
                         var dist = Math.sqrt(distSqr);
                         region.data[i] *= (dist - spotInnerRadius) / (spotRadius - spotInnerRadius);
                     }
                 }
             }
             Game.overlayContext.putImageData(region, spotCenter.x - spotRadius, spotCenter.y - spotRadius);
        }
    }
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
    var landed = false;
    if (a.sprite.x + a.sprite.colBox["x1"] < b.sprite.x + b.sprite.w && a.sprite.x + a.sprite.colBox["x2"] > b.sprite.x) {
        if (a.sprite.y + a.sprite.colBox["y0"] > b.sprite.y && a.sprite.y + a.sprite.colBox["y0"] < b.sprite.y + b.sprite.h) {
            landed = true;
        }
        else if (a.sprite.y + a.sprite.colBox["y3"] > b.sprite.y && a.sprite.y + a.sprite.colBox["y3"] < b.sprite.y + b.sprite.h) {
            if (a.vel.y > 0) {
                landed = true;
            }
        }
        else if (a.sprite.y + a.sprite.colBox["y3"] == b.sprite.y) {
            landed = true;
        }
    }

    if (a.sprite.y + a.sprite.colBox["y1"] < b.sprite.y + b.sprite.h && a.sprite.y + a.sprite.colBox["y2"] > b.sprite.y) {
        if (a.sprite.x + a.sprite.colBox["x0"] > b.sprite.x && a.sprite.x + a.sprite.colBox["x0"] < b.sprite.x + b.sprite.w) {
            landed = true;
        }
        else if (a.sprite.x + a.sprite.colBox["x3"] > b.sprite.x && a.sprite.x + a.sprite.colBox["x3"] < b.sprite.x + b.sprite.w) {
            landed = true;
        }
    }
    return landed;
}

function pToMCollision(a, b) {
    var beenHit = false;
    if (a.sprite.x + a.sprite.colBox["x1"] < b.sprite.x + b.sprite.colBox["x3"] && a.sprite.x + a.sprite.colBox["x2"] > b.sprite.x + b.sprite.colBox["x0"]) {
        if (a.sprite.y + a.sprite.colBox["y0"] > b.sprite.y + b.sprite.colBox["y0"] && a.sprite.y + a.sprite.colBox["y0"] < b.sprite.y + b.sprite.colBox["y3"]) {
            beenHit = true;
        }
        else if (a.sprite.y + a.sprite.colBox["y3"] > b.sprite.y + b.sprite.colBox["y0"] && a.sprite.y + a.sprite.colBox["y3"] < b.sprite.y + b.sprite.colBox["y3"]) {
            beenHit = true;
        }
    }

    if (a.sprite.y + a.sprite.colBox["y1"] < b.sprite.y + b.sprite.colBox["y3"] && a.sprite.y + a.sprite.colBox["y2"] > b.sprite.y + b.sprite.colBox["y0"]) {
        if (a.sprite.x + a.sprite.colBox["x0"] > b.sprite.x + b.sprite.colBox["x0"] && a.sprite.x + a.sprite.colBox["x0"] < b.sprite.x + b.sprite.colBox["x3"]) {
            beenHit = true;
        }
        else if (a.sprite.x + a.sprite.colBox["x3"] > b.sprite.x + b.sprite.colBox["x0"] && a.sprite.x + a.sprite.colBox["x3"] < b.sprite.x + b.sprite.colBox["x3"]) {
            beenHit = true;
        }
    }
    return beenHit;
};

function MToTCollision(a, b) {
    if (a.sprite.x + a.sprite.colBox["x1"] < b.sprite.x + b.sprite.w && a.sprite.x + a.sprite.colBox["x2"] > b.sprite.x) {
        if (a.sprite.y + a.sprite.colBox["y0"] > b.sprite.y && a.sprite.y + a.sprite.colBox["y0"] < b.sprite.y + b.sprite.h) {
            a.sprite.y = b.sprite.y + b.sprite.h - a.sprite.colY;
            a.vel.y = -1 * a.vel.y;           
        }
        else if (a.sprite.y + a.sprite.colBox["y3"] > b.sprite.y && a.sprite.y + a.sprite.colBox["y3"] < b.sprite.y + b.sprite.h) {
            a.sprite.y = b.sprite.y - a.sprite.colBox["y3"];
            a.vel.y = -1 * a.vel.y;
        }
    }

    if (a.sprite.y + a.sprite.colBox["y1"] < b.sprite.y + b.sprite.h && a.sprite.y + a.sprite.colBox["y2"] > b.sprite.y) {
        if (a.sprite.x + a.sprite.colBox["x0"] > b.sprite.x && a.sprite.x + a.sprite.colBox["x0"] < b.sprite.x + b.sprite.w) {
            a.sprite.x = b.sprite.x + b.sprite.w - a.sprite.colX;
            a.vel.x = -1 * a.vel.x;
        }
        else if (a.sprite.x + a.sprite.colBox["x3"] > b.sprite.x && a.sprite.x + a.sprite.colBox["x3"] < b.sprite.x + b.sprite.w) {
            a.sprite.x = b.sprite.x - a.sprite.colBox["x3"]; 
            a.vel.x = -1 * a.vel.x;
        }
    }
};

function checkCollisions() {
    var hasLanded = false;
    var beenHit;
    Game.states.top().ladders.forEach(function(ladder) {
        Game.player.onLadder = boxToBoxCollision(Game.player, ladder);
    });


    Game.states.top().platforms.forEach(function(platform) {
        if (collideTile(Game.player, platform)) {
            hasLanded = true;
        };
    });

    Game.states.top().platforms.forEach(function(platform) {
        if (collideTile(Game.player, platform)) {
            hasLanded = true;
        };
    });

    Game.enemies.forEach(function(enemy) {
        Game.states.top().platforms.forEach(function(platform) {
            MToTCollision(enemy, platform);
        });
        if (pToMCollision(Game.player, enemy)) {
            Game.player.health -= 1;
        }
    });

    if (!hasLanded && !Game.player.onLadder) {
        Game.player.jumping = true;
    }
};
