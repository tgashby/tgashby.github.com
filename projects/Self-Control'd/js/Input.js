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
	},

	onKeyup : function(event)
	{
		delete this.pressed[event.keyCode];
	}
};

// Mouse Handler
var Mouse =
{
	getPosition: function(canvas, evt)
	{
		var top = 0;
		var left = 0;
		var tmpCanvas = canvas;
		
		while (tmpCanvas && tmpCanvas.tagName != 'BODY')
		{
			top += tmpCanvas.offsetTop;
			left += tmpCanvas.offsetLeft;
			tmpCanvas = tmpCanvas.offsetParent;
		}
		
		var mouseX = evt.clientX - left + window.pageXOffset;
		var mouseY = evt.clientY - top + window.pageYOffset;
		
		return {
			x: mouseX,
			y: mouseY
		};
	}
};