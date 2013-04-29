
LeftArrow = Class.create(Sprite,{
	initialize:function(){
	Sprite.call(this,25,150);
	this.image = game.assets['leftArrow.png'];
	this.frame =0;
	this.x = 15;
	this.y = 250;
	this.removeslf = false;
	},
	onenterframe:function(){
	  this.x = 15 + Math.sin(game.rootScene.age/30)*10;
	  if(this.removeslf)
	  {
	  	this.scaleX-=.1;
	  	if(this.scaleX < 0.1)
	  	{
	  		game.rootScene.removeChild(this);
	  	}
	  }
	}
});

RightArrow = Class.create(Sprite,{
	initialize:function(){
	Sprite.call(this,25,150);
	this.image = game.assets['rightArrow.png'];
	this.frame = 0;
	this.x = 465;
	this.y = 250;
	this.removeslf = false;
	},
	onenterframe:function(){
	  this.x = 465 - Math.sin(game.rootScene.age/30)*10;
	  if(this.removeslf)
	  {
	  	this.scaleX-=.1;
	  	if(this.scaleX < 0.1)
	  	{
	  		game.rootScene.removeChild(this);
	  	}
	  }
	}
});