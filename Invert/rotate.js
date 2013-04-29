var speed = 3;
var pic_size = 32;

Rotating = Class.create(Sprite, {
   initialize: function(falling) {
      Sprite.call(this, pic_size, pic_size);
      size = 12 + Math.random() * 20;
      this.falling = falling;
      //this.scale(1/size, 1/size);
      this.image = game.assets['backgroundCube.png'];
      this.x = Math.random() * (gameWidth - pic_size);

      if (this.falling)
         this.globalY = this.y = (camera.globalY - 120);
      else
         this.globalY = this.y = (camera.globalY + gameHeight + 120);
   },

   onenterframe: function() {
      this.scaleY = Math.sin(this.age * .1);

      if (this.falling) {
         this.globalY += speed;
         this.y = this.globalY - camera.globalY;
      }
      else {
         this.globalY -= speed;
         this.y = this.globalY - camera.globalY;
      }

      if (this.intersect(player)) {
         game.score += 1000;
         game.rootScene.removeChild(this);
      }

      if (this.falling && this.globalY > camera.globalY + gameHeight ||
       !this.falling && this.globalY < camera.globalY - this.height)
         game.rootScene.removeChild(this);
   }
});
