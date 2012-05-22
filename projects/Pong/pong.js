// Example Pong Game
var Game = {width: 600, height: 300};

Goomba.init(Game.width, Game.height);
 
var lftPaddle = Goomba.newEntity("Paddle")
    .addAttrs({x: 10, y: 20, w: 15, h: 150, color: "#000000"})
    .controls({
        W: function () { this.y -= 2 },
        S: function () { this.y += 2 }
    });

var rtPaddle = Goomba.newEntity("Paddle")
    .addAttrs({x: 570, y: 20, w: 15, h: 150, color: "#FF0000"})
    .controls({
        UP_ARROW: function () { this.y -= 2 },
        DOWN_ARROW: function () { this.y += 2 } 
    });

var ball = Goomba.newEntity("Collidable")
    .addAttrs({x: 300, y: 150, w: 10, h: 10, velX: 4, velY: 4})
    .onUpdate(function () {
        // Hit ceiling or floor
        if (this.y + this.h > Game.height || this.y < 0) {
            this.velY = -this.velY;
        }

        // Reaches either side
        if (this.x < 0) {
            this.x = Game.width / 2;
            this.y = Game.height / 2;
            Goomba.triggerEvent("RightScore");
        }

        if (this.x > Game.width) {
            this.x = Game.width / 2;
            this.y = Game.height / 2;
            Goomba.triggerEvent("LeftScore");
        }

        this.x += this.velX;
        this.y += this.velY;
    })
    .onHit("Paddle", function () {
        this.velX = -this.velX;
    });

Goomba.newEntity("Scoreboard")
    .addAttrs({x: 0, y: 10, text: "Left Points: ", score: 0})
    .bindEvent("LeftScore", function () {
        this.score++;
    });

Goomba.newEntity("Scoreboard")
    .addAttrs({x: 500, y: 10, font: "normal 12px Times New Roman", text: "Right Points: ", score: 0})
    .bindEvent("RightScore", function () {
        this.score++;
    });