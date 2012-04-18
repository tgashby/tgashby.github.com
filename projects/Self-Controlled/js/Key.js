// Keyboard handler

var Key =
{
	pressed : {},

	LEFT : 37,
	UP : 38,
	RIGHT : 39,
	DOWN : 40,

	isDown : function(keyCode)
	{
		return this.pressed[keyCode];
	},

	onKeydown : function(event)
	{
		this.pressed[event.keyCode] = true;
	},

	onKeyup : function(event)
	{
		delete this.pressed[event.keyCode];
	}
};