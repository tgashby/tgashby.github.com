var gravity = 1;

Player = Class.create(Sprite, {
   initialize: function() {
      Sprite.call(this, 50, 50);
      this.bounce = game.gameStateUp;
      this.image = game.assets['player.png'];
      this.x = gameWidth / 2 - this.width / 2;
      this.y = gameHeight - this.height * 2;
      this.arrowsRemoved=false;
      this.globalY = this.y;
      this.vel = {
         x: 10,
         y: 0
      };

      // Only give it an initial position if we're starting the game moving up
      if (this.bounce) {
         this.y = 25;
      };
   },

   onenterframe: function() {
      this.globalY -= this.vel.y;
      this.vel.y -= gravity;

      if (game.input.left) {
         this.x -= this.vel.x;
         this.rotate(-15);
      }

      if (game.input.right){
         this.x += this.vel.x;
         this.rotate(15);
      }
      this.y = this.globalY - camera.globalY;

      if (this.x + this.width < 0)
      {
         if(!this.arrowsRemoved)
         {
            game.leftArrow.removeslf = true;
            game.rightArrow.removeslf = true;
            this.arrowsRemoved = true;
         }
         this.x = gameWidth;
      }
      if (this.x > gameWidth){
         if(!this.arrowsRemoved)
         {
            game.leftArrow.removeslf = true;
            game.rightArrow.removeslf = true;
            this.arrowsRemoved = true;
         }

         this.x = 0 - this.width;
      }
      if (this.globalY < camera.globalY - 50 || (this.bounce && this.globalY > camera.globalY
       + gameHeight + 50)){
         game.gameOver=true;
         camera.chill();
         p = new ParticleSystem();
         p.fireSystem(360,this.x,this.y,-1);
         game.rootScene.removeChild(this);
      }
         
         //game.end();
   },

   onFlip: function() {
      this.bounce = game.gameStateUp;

      if (game.gameStateUp) {
         this.frame = 0;
      }
      else {
         this.frame = 1;
      }
      
      /*
      this.x = gameWidth / 2;
      this.y = gameHeight / 2;
      this.globalY = this.y;
      `*/
   },

   chill: function () {
      gravity = 0;
      this.vel.y = 0;
   },

   stopChillin: function () {
      gravity = 1;
   }
});
