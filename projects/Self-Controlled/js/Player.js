function Player()
{
	this.x = 0;
	this.y = 0;
	
	this.sprite = new Image();
	this.sprite.src = "img/BillyHappy.png";
}

Player.prototype.draw = function(context)
{
	context.drawImage(this.sprite, this.x, this.y);
}

Player.prototype.moveLeft = function()
{
	this.x -= 1;
}

Player.prototype.moveRight = function()
{
	this.x += 1;
}

Player.prototype.moveUp = function()
{
	this.y -= 1;
}

Player.prototype.moveDown = function()
{
	this.y += 1;
}

Player.prototype.update = function()
{
	if (Key.isDown(Key.UP))
		this.moveUp();
		
	if (Key.isDown(Key.DOWN))
		this.moveDown();
		
	if (Key.isDown(Key.LEFT))
		this.moveLeft();
		
	if (Key.isDown(Key.RIGHT))
		this.moveRight();
}