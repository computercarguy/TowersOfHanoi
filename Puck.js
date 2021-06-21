class Puck
{
	height = 0;
	width = 0;
	color = "";
	name = "A";
	peg = 0;
	path = "";
	pathElement = null;
	textElement = null;
	transform = new Point(0, 0);
	
	constructor(id, fillColor = "#fff", height = 100, width = 200)
	{
		this.name = id;
		this.height = height;
		this.width = width;
		this.color = fillColor;
		
		var start = "25 " + height;
		var arc = " A 25 " + Math.ceil(height / 2) + " 0 0 1"
		var rightArcStart = width - 25;

		this.path = "M " + start + arc + " 25 0 L " + rightArcStart + " 0" + arc + " " + rightArcStart + " " + height + " L " + start;
	}
}