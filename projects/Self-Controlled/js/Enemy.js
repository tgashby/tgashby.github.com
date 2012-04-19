function Enemy()
{
	this.pos =
	{
		x: 0,
		y: 0
	}
	
	this.vel =
	{
		x: 0,
		y: 0
	}
	
	this.sprite = new Image();
	this.sprite.src = "img/BadGuy.png";
	
	// If we need to collision detect, since we're using a spritesheet we need to keep track of width seperately
	this.width = 40;
	this.height = 40;
	
	this.moveTimer = 0;
	
	this.pos.y = 560;
};

Enemy.prototype.update = function()
{
	this.vel.x += Math.floor(Math.random() * 3) - 1;
	this.vel.y += Math.floor(Math.random() * 3) - 1;
	
	if (this.vel.x < -3)
		this.vel.x = -3;
		
	if (this.vel.x > 3)
		this.vel.x = 3;
		
	if (this.vel.y < -3)
		this.vel.y = -3;
		
	if (this.vel.y > 3)
		this.vel.y = 3;
		
		
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
	
	Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
	
	this.pos.x = Math.min(Math.max(this.pos.x, 0), Globals.GAMEWIDTH - this.width);
	this.pos.y = Math.min(Math.max(this.pos.y, 0), Globals.GAMEHEIGHT - this.height);
};

Enemy.prototype.draw = function(context)
{
	context.drawImage(this.sprite, 0, 0, this.width, this.height, this.pos.x, this.pos.y, this.width, this.height);
};
