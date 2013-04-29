var particleSpeed = 30;


Particle = Class.create(Sprite,{
      initialize:function(x,y,yVec){
      Sprite.call(this,15,15);
     
      this.x = x;
      this.y = y;
      this.image=game.assets['particle.png'];
      this.rotationSpeed = (Math.random()*10-5)*3;
      this.Xangle = (Math.random()*180)
      this.angleVector = {x:(Math.cos(this.Xangle))*particleSpeed,y:Math.sin(this.Xangle)*yVec*particleSpeed};
      this.speed=particleSpeed;
      },
      onenterframe:function(){
         if(game.gameStateUp){
         this.frame = 0;
         }
         else{
         this.frame = 1;
         }
         this.x+=this.angleVector.x;
         this.y+=this.angleVector.y;
         this.angleVector.x *=.9;
         this.angleVector.y *=.9;
         this.rotate(this.rotationSpeed);

         this.scale(0.95,0.95);
         if(this.scaleX < 0.01)
         {
            game.rootScene.removeChild(this);
         }
         //console.log("Particles");
      }

});

ParticleSystem = Class.create({
      fireSystem:function(particleCount,x,y,yVec){
         for(i = 0; i < particleCount; i++)
         {
            game.rootScene.addChild(new Particle(x,y,yVec));
         }
      }

});