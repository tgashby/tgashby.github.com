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
    endSprite.addAnimation("idle", 0, 1, 3);
    endSprite.setAnimation("idle");

    var basicRoomSprite = new Sprite(images.RoomBackground, 1200, 800);
    basicRoomSprite.addAnimation("idle", 0, 3, 3);
    basicRoomSprite.setAnimation("idle");

    doorSprite = new Sprite(images.Door, 64, 128);
    doorSprite.x = 4000 - doorSprite.w; // Put at end of last level
    doorSprite.y = 550 - doorSprite.h; // Put at end of last level
    doorSprite.addAnimation("idle", 0, 4, 4);
    doorSprite.setAnimation("idle");
    
    var beginningSound = new Audio("sound/Intro.ogg");
    var firstRoomSound = new Audio("sound/BoredBilly.ogg");
    var enterMonstersSound = new Audio("sound/MonstersIntro.ogg");

    Game.dieEndSound = new Audio("sound/BillyWeak.ogg");
    var endRoomSound = new Audio("sound/EndRoomStart.ogg");
    var goBack1Sound = new Audio("sound/ToldYouToWait.ogg");
    var goBack2Sound = new Audio("sound/TakeOneMoreStep.ogg");
    var goBack3Sound = new Audio("sound/StopRightNow.ogg");
    var goBack4Sound = new Audio("sound/PleaseDont.ogg");
    var endSound = new Audio("sound/Hello.ogg");
    var darkEndSound = new Audio("sound/BillyWaits.ogg");

    var beginningState = new SoundState(blankSprite, beginningSound);

    var boredState = new TimedState(blankSprite, 5000);

    var enterRoomState = new SoundState(blankSprite, firstRoomSound);

    var noEnemiesState = new CallbackState(basicRoomSprite, 16000,
        function () {
            Game.player.sprite.x = 0;
            Game.player.sprite.y = 600 - Game.player.sprite.h;
        });
    placePlatforms(noEnemiesState);

    var enterMonstersState = new SoundState(basicRoomSprite, enterMonstersSound);
    placePlatforms(enterMonstersState);

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

            for (var i = 0; i < 3; i++) {
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
                enemy.sprite.x = 230;
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

            for (var i = 0; i < 3; i++) {
                var enemy = new Enemy(0, 0, EnemyAI.backAndForth);
                enemy.sprite.y = enemy.sprite.h * i + 550;
                Game.enemies.push(enemy);
            };
        });
    placePlatforms(getToTopState);

    Game.dieEndState = new CallbackState(basicRoomSprite, 100000,
        function () {
            Game.enemies = new Array();
            Game.dieEndSound.play();
            Game.player.onLadder = false;
        });    

    Game.endRoomState = new CallbackState(endSprite, 30000,
        function() {
            Game.enemies = new Array();
            Game.player.sprite.x = 50;
            Game.player.onLadder = false;
            endRoomSound.play(); 
            Game.player.velmax = 2;
        });

    Game.goBack1State = new CallbackState(endSprite, 15000,
        function () {
            Game.enemies = new Array();
            goBack1Sound.play();
        });

    Game.goBack2State = new CallbackState(endSprite, 15000,
        function () {
            Game.enemies = new Array();
            goBack2Sound.play();
        });

    Game.goBack3State = new CallbackState(endSprite, 15000,
        function () {
            Game.enemies = new Array();
            goBack3Sound.play();
        });
    Game.goBack4State = new CallbackState(endSprite, 15000,
        function () {
            Game.enemies = new Array();
            goBack4Sound.play();
        });
    Game.endState = new CallbackState(endSprite, 100000,
        function () {
            Game.enemies = new Array();
            Game.player.sprite.x = 800 - Game.player.sprite.w;
            Game.player.health = 20;
            endSound.play();
        });
    Game.darkEndState = new CallbackState(blankSprite, 100000,
        function () {
            Game.enemies = new Array();
            darkEndSound.play();
            darkEndSound.addEventListener('ended', function() {
                 Game.player.dieing = true;
            }, false);
        });

                    
    // States are a stack, so these happen in reverse order.
    Game.states.push(Game.endRoomState);
    Game.states.push(getToTopState);
    Game.states.push(getToBottomState);
    Game.states.push(getToMiddleState);
    Game.states.push(randomEnemiesState);
    Game.states.push(enterMonstersState);
    Game.states.push(noEnemiesState);
    Game.states.push(enterRoomState);
    Game.states.push(boredState);
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
     lastFrameTime = now;

     Game.context.clearRect(0, 0, Game.width, Game.height);

     Game.context.save();
     Game.context.translate(-1 * Game.camx, -1 * Game.camy);
     
     // Game.states.top().platforms.forEach(function(platform) {
     //      platform.draw(Game.context);
     // });
     // Game.states.top().ladders.forEach(function(ladder) {
     //      ladder.draw(Game.context);
     // });
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
         if (Game.player.health > 50) {
             Game.overlayContext.globalAlpha = 1 - (Game.player.health - 50) / 50;
         }
         Game.overlaySprite.draw(Game.overlayContext);
         Game.overlayContext.globalAlpha = 1.0;
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


     if (!Game.player.dieing) {
        Game.player.update();
     }

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

     if (Game.states.top() === Game.dieEndState && Game.dieEndSound.currentTime >= 3.3) {
        Game.player.dieing = true;
     }
     if (Game.player.dieing) {
        Game.player.health = (Game.player.health *.98) - .02;
     }

     if (Game.player.health < 20 && Game.enemies.length != 0) {
        Game.states = new Array();
        Game.states.push(Game.dieEndState);
        Game.states.top().start();
     }
     if (Game.states.top() === Game.endRoomState && Game.player.sprite.x >= 1400) {
        Game.states.pop();
        Game.states.push(Game.goBack1State);
        Game.states.top().start();
     }
          if (Game.states.top() === Game.goBack1State && Game.player.sprite.x >= 2100) {
        Game.states.pop();
        Game.states.push(Game.goBack2State);
        Game.states.top().start();
     }
          if (Game.states.top() === Game.goBack2State && Game.player.sprite.x >= 2800) {
        Game.states.pop();
        Game.states.push(Game.goBack3State);
        Game.states.top().start();
     }
          if (Game.states.top() === Game.goBack3State && Game.player.sprite.x >= 3400) {
        Game.states.pop();
        Game.states.push(Game.goBack4State);
        Game.states.top().start();
     }
          if (Game.states.top() === Game.goBack4State && Game.player.sprite.x >= 3920) {
        Game.states.pop();
        Game.states.push(Game.endState);
        Game.states.top().start();
     }

    if (Game.player.health < 70 && Game.player.firstHurt && !Game.player.sounds.firstCry.playing && Game.enemies.length > 0) {
        Game.player.sounds.firstHurt.play();
        Game.player.firstHurt = false;
    };

    // if (haunted && !Game.player.jumping && Game.player.crying && Game.enemies.length > 0 && !Game.player.sounds.firstHurt.playing) {
    //     Game.player.
    // };

     if (Game.states.top().completed(now))
     {
          if (Game.states.top() === Game.endRoomState || Game.states.top() === Game.goBack1State || Game.states.top() === Game.goBack2State 
            || Game.states.top() === Game.goBack3State || Game.states.top() === Game.goBack4State) {
                Game.states.pop();
                Game.states.push(Game.darkEndState);
                Game.states.top().start();
          }
          else if (Game.states.length > 1) {

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
            Game.player.health -= 0.5;
        }
    });

    if (!hasLanded && !Game.player.onLadder) {
        Game.player.jumping = true;
    }
};
