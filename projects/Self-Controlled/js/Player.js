function Player()
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
	
	this.gravity = 1;
	
	this.jumping = false;
	
	this.sprite = new Image();
	this.sprite.src = "img/BillyHappy.png";
	
	// If we need to collision detect, since we're using a spritesheet we need to keep track of width seperately
	this.width = 40;
	this.height = 40;
	
	this.pos.y = Globals.GAMEHEIGHT - this.height;
	
	this.moveTimer = 0;
}

Player.prototype.draw = function(context)
{
	var spritePos;
	
	if (this.moveTimer % 60 < 60 / 3)
		spritePos = 0; 
	else if (this.moveTimer % 60 < 60 / 2)
		spritePos = this.width;
	else
		spritePos = this.width * 2;
			
	context.drawImage(this.sprite, spritePos, 0, this.width, this.height, this.pos.x, this.pos.y, this.width, this.height);
}

Player.prototype.moveLeft = function()
{
	this.vel.x -= 1;
	
	if (this.vel.x < -3)
		this.vel.x = -3;
}

Player.prototype.moveRight = function()
{
	this.vel.x += 1;
	
	if (this.vel.x > 3)
		this.vel.x = 3;
}

Player.prototype.moveUp = function()
{
	if (!this.jumping)
	{
		this.vel.y = -10;
		
		this.jumping = true;
	}
}

Player.prototype.moveDown = function()
{
	this.pos.y += 1;
}

Player.prototype.update = function()
{
	this.moveTimer++;
	
	if (this.moveTimer > 60)
		this.moveTimer = 0;
	
	// HACK for now, may just stay in if we don't have anything to jump on...
	if (this.pos.y + this.sprite.height >= Globals.GAMEHEIGHT)
	{
		this.jumping = false;
		this.vel.y = 0;
		this.pos.y = Globals.GAMEHEIGHT - this.sprite.height;
	}
	
	if (this.jumping)
		this.vel.y += this.gravity;
	
	if (Key.isDown(Key.UP))
		this.moveUp();
		
	if (Key.isDown(Key.DOWN))
		this.moveDown();
		
	if (Key.isDown(Key.LEFT))
		this.moveLeft();
		
	if (Key.isDown(Key.RIGHT))
		this.moveRight();
		
	if (!Key.isDown(Key.LEFT) && !Key.isDown(Key.RIGHT))
	{
		this.vel.x = 0;
	}
	
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
}