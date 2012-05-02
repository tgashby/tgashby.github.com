// Keyboard handler
var Key =
{
	pressed : {},

	SPACE: 32,
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
                return event.keyCode == Key.UP || event.keyCode == Key.DOWN || event.keyCode == Key.LEFT || event.keyCode == Key.RIGHT || event.keyCode == Key.SPACE;
	},

	onKeyup : function(event)
	{
		delete this.pressed[event.keyCode];
                return event.keyCode == Key.UP || event.keyCode == Key.DOWN || event.keyCode == Key.LEFT || event.keyCode == Key.RIGHT || event.keyCode == Key.SPACE;
	}
};
