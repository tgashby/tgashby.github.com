var maxCamY = 200;
var camOffset = 60;
var scrollDownYOffset = 300;

Camera = Class.create({
   initialize: function() {
      this.globalY = 0;
      this.peakY = player.globalY;
      this.lowY = player.globalY;
      this.cameraScrollSpeed = 1;
      this.gameTimeSpeed = 0;
   },

   update: function() {
      //console.log(this.globalY);
      this.gameTimeSpeed = (2*game.rootScene.age/5000);
      if(this.gameTimeSpeed > 2.5)
      {
         this.gameTimeSpeed=2.5;
      }
       //console.log(game.rootScene.age); 
      if (game.gameStateUp && this.cameraScrollSpeed != 0) {
         // this.cameraScrollSpeed = 1;
         this.globalY -= this.cameraScrollSpeed + this.gameTimeSpeed*this.cameraScrollSpeed;

         if (this.peakY > player.globalY) {
            //console.log(this.peakY + ":"+player.globalY)
            this.peakY = player.globalY;
         }

         if ((this.peakY - this.globalY) < (maxCamY)) {
            this.globalY += (((this.peakY - maxCamY)-this.globalY)/10);
            //  console.log("Im in ur thingy");
         }
      } 
      else if(this.cameraScrollSpeed != 0){
         // this.cameraScrollSpeed = 3;

         if (this.lowY < player.globalY) //Remember inverted y
         {
            this.lowY = player.globalY;
         }

         //console.log((this.lowY-(this.globalY+(gameHeight-scrollDownYOffset))));
         this.globalY += this.cameraScrollSpeed + this.gameTimeSpeed*(this.cameraScrollSpeed/3);

         if ((this.lowY - (this.globalY + (gameHeight - scrollDownYOffset))) > 0) {
            //console.log("Hi!")
            this.globalY +=  ((this.lowY - (gameHeight - scrollDownYOffset)-this.globalY)/10);
         }
      }
   },
   
   onFlip: function () {
      if(!game.gameStateUp)
      {
         this.lowY = this.peakY;
      }
      else
      {
         this.peakY = this.lowY;
      }
      /*   
      this.globalY = 0;

      this.peakY = player.globalY;
      this.lowY = player.globalY;
      */
   },

   chill: function () {
      this.cameraScrollSpeed = 0;
   },

   stopChillin: function () {
      if (game.gameStateUp)
         camera.cameraScrollSpeed = 2;
      else
         camera.cameraScrollSpeed = 3.5;
   }
   

});