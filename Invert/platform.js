var maxUpHeight = 160;
var minUpHeight = 100;
var maxWidth = 100;
var minWidth = 40;
var downWidthMax = 300;
var gapSpaceMax = 200;
var gapSpaceMin = 150;
var maxDownHeight = 160;
var minDownHeight = 100;
var frameWidth = 100;
var platWidth = 0.6;

Platform = Class.create(Sprite, {
   initialize: function(x, y, width, upPlatform) {
      Sprite.call(this, 100, 50);
      this.remove = false;
      this.platWidth = width;
      this.image = game.assets['platform.png'];
      this.platWidth = width;
      this.frame = 0;
      this.originX = 0;
      
      //this.originY = 25;
      this.scaleY = 0;

      // this.scaleX = width / frameWidth;
      //is.width = width;
      
      this.scaleX = this.platWidth / frameWidth;
        
   
      this.x = x;
      this.globalY = y;
      this.y = y;
      this.isUpPlatform = (typeof upPlatform === 'undefined') ? true : upPlatform;

      this.addEventListener('added', function (e) {
         if(this.isUpPlatform === true){
            platforms.push(this);
         }

      });

      this.intersect = function (sprite) {
         if (sprite.x > this.x && sprite.x < this.x + (this.scaleX * this.width) &&
          sprite.y > this.y && sprite.y < this.y + this.height)
            return true;

         if (sprite.x + sprite.width > this.x && sprite.x + sprite.width < this.x + (this.scaleX * this.width) && 
          sprite.y > this.y && sprite.y < this.y + this.height)
            return true;

         if (sprite.x > this.x && sprite.x < this.x + (this.scaleX * this.width) &&
          sprite.y + sprite.height > this.y && sprite.y + sprite.height < this.y + this.height)
            return true;

         if (sprite.x + sprite.width > this.x && sprite.x + sprite.width < this.x + (this.scaleX * this.width) && 
          sprite.y + sprite.height > this.y && sprite.y + sprite.height < this.y + this.height)
            return true;

         return false;
      }
   },

   onenterframe: function() {
      if(game.gameStateUp){
         this.frame = 0;
      }
      else{
         this.frame = 1;
      }
      if(this.scaleY < platWidth && !this.remove)
      {
         this.scaleY += 0.1;
      }
      
      if (this.intersect(player)) {
         if (player.bounce === true && player.vel.y < 0) {
            player.vel.y = 20;
         } else if (player.bounce === false) {
            player.vel.y = 0;
            player.globalY = this.globalY - player.height;
         }
      }

      
      this.y = this.globalY - camera.globalY;

// Leave this out!
      // if (this.globalY > (camera.globalY + gameHeight) && this.isUpPlatform === true) {
      //    game.rootScene.removeChild(this);
      // } else if (this.globalY + 50 < camera.globalY && this.isUpPlatform === false) {
      //    game.rootScene.removeChild(this);
      // }
     
      if(this.remove)
      {
         this.removeSelf();
      }
   },
   switchSpaces:function(){
      pRow = new PlatformRow(this.globalY,this.x,this.width);
      
      console.log("platformRows count: "+ platformRows.length)
      //Add pRow to array
      //Remove from Platform array
      this.remove = true;
      console.log("---");
   },
   removeSelf:function(){

      console.log(this.remove);
      if(this.scaleY > 0)
      {
         console.log(this.remove);
         this.scaleY -= 0.1;
      }
      else
      {
         game.rootScene.removeChild(this);
      }
   }

});

PlatformRow = Class.create({
   initialize: function(blockHeight,gapX,gapWidth) {
      this.gapX =gapX;
      this.gapX2 = gapWidth;
      this.p1 = new Platform(0, blockHeight, this.gapX, false);
      this.p2 = new Platform(this.gapX + this.gapX2, this.p1.globalY, gameWidth - (this.gapX + this.gapX2), false);
      game.rootScene.addChild(this.p1);
      game.rootScene.addChild(this.p2);
      // console.log("Added plats");
      this.globalY = this.p1.globalY;

      platformRows.push(this);
      console.log("Added row "+platformRows.length);

   },
   onenterframe: function() {
      //console.log(globalY);
      this.y = this.globalY - camera.globalY;
      /*
      if (this.globalY - 50 < camera.globalY) {
         game.rootScene.removeChild(this);
      */
   },
   
   switchSpaces: function() {
      plat = new Platform(this.gapX,this.globalY,(this.gapX2),true);
      console.log("Added platfrom at "+plat.globalY +"from "+this.globalY);
      game.rootScene.addChild(plat);
      //Add plat to array
      //Remove from PlatformRow array
      this.p1.remove = true;
      this.p2.remove = true;

      //game.rootScene.removeChild(this);
   },
   removeSelf: function(){
      game.rootScene.removeChild(this.p1);
      game.rootScene.removeChild(this.p2);
   }
});

function createUpPlatforms(blockHeight) {
   width = 100;
   p = new Platform(Math.random() * (gameWidth - width), 
      (blockHeight - (Math.random() * (maxUpHeight - minUpHeight) + minUpHeight)), width, true);
   game.rootScene.addChild(p);
   //console.log(p.globalY);
   return p.globalY;
}

function createDownPlatforms(blockHeight) {
   pRow = new PlatformRow(blockHeight+(Math.random() * (maxDownHeight - minDownHeight) + minDownHeight),
                                       Math.random()*(gameWidth-downWidthMax),
                                       Math.random()*(gapSpaceMax-gapSpaceMin)+gapSpaceMin);
   return pRow.globalY;
}
