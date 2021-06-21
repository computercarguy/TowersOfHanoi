class Hanoi
{
	svgns = "http://www.w3.org/2000/svg";
	level = 0;
	pegQuantity = 3;
	disks = 3;
	colors = ["#9CA1FF","#7298D7","#8594E0","#936ED4","#344DCD","#5D32A8","#0D228C","#571CBE","#1F2E7A","#321B5A"];
	letters = "ABCDEFGHIJ";
	puckHeight = 0;

	maxPegs = 6;
	maxDisks = 10;
	initialSetup = false;

	context = document.getElementById("hanoiTowers");
	maxWidth = this.context.width.baseVal.value;
	maxHeight = this.context.height.baseVal.value;

	selectedElement = null;
	platform = null;
	platformTop = 0;

	targetPeg = [];
	pucks = [];
	pegLocations = [];
	pegs = [];
	pegNotation = [];
	disabledPegs = [];
	disablePegOrder = [0, 1];

	DrawBoard()
	{
		this.setLevel();

		var puckWidth = (this.maxWidth * 0.9) / this.pegQuantity;
		
		this.puckHeight = this.maxHeight / (this.disks + 2);
		this.platformTop = this.maxHeight - this.puckHeight - 2;
		
		this.setupTargetPeg();
		
		this.pegLocations.push((this.maxWidth * 0.05) + (puckWidth / 2));
		
		for (var i = 0; i < this.pegQuantity; i++)
		{
			if (i != 0)
			{
				this.pegLocations.push(this.pegLocations[i-1] + puckWidth);
			}
			
			this.pegs.push([]);
			this.drawPeg(this.pegLocations[i], i);
		}

		this.setupPlatform();
		this.addDisks(puckWidth);
		
		if (!this.initialSetup)
		{
			this.addDragging();
			this.setupLevel();
			this.addMenu();
			
			this.initialSetup = true;
		}
		else
		{
			this.updateLevel();
		}
	}
	
	addMenu()
	{
		var me = this;
		var menuElement = this.drawText("menu", 770, 20, "\u2630", null, "menu");
		this.context.appendChild(menuElement);
		
		menuElement.onclick = function (e)
		{
			me.removeCredits();
			me.removeInstructions();
			
			me.drawRectangle("menuBox", 610, 10, 165, 130, 1, "#000", "#fff")

			var instructions = me.drawText("instructions", 620, 40, "Instructions", null, "menu");
			me.context.appendChild(instructions);

			var restartLevel = me.drawText("restartLevel", 620, 70, "Restart Level", null, "menu");
			me.context.appendChild(restartLevel);

			var restartGame = me.drawText("restartGame", 620, 100, "Restart Game", null, "menu");
			me.context.appendChild(restartGame);

			var credits = me.drawText("credits", 620, 130, "Credits", null, "menu");
			me.context.appendChild(credits);

			var box = me.context.getBBox();

			instructions.onclick = function (ev)
			{
				me.removeMenu();

				me.drawRectangle("instructionsBox", 148, 115, 500, 290, 2, "#000", "#fff");
				me.drawRectangle("okButton", 358, 360, 80, 30, 2, "#000", "#fff");
				
				me.context.appendChild(me.drawText("instructions1", 175, 140, "The premise of this game is fairly simple: ", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions2", 155, 165, "move the stacks of pucks from one peg to another.", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions3", 155, 190, " However, there are some rules. You can only move", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions4", 155, 215, "one puck at a time, you can't put a puck on top", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions5", 155, 240, "of a smaller puck, and you only have 3 usable", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions6", 155, 265, "pegs at any one time.", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions7", 175, 290, "The targer peg is the one labeled with a black", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions8", 155, 315, "number, and you might have to move the stack", null, "instructionText"));
				me.context.appendChild(me.drawText("instructions9", 155, 340, "more than once.", null, "instructionText"));
				
				me.context.appendChild(me.drawText("ok", 380, 385, "OK", null, "menu"));
				
				document.getElementById("okButton").onclick = function (ev)
				{
					me.removeInstructions();
				};
				
				document.getElementById("okText").onclick = function (ev)
				{
					me.removeInstructions();
				};
			};

			restartLevel.onclick = function (ev)
			{
				me.removeMenu();
				me.textBlock("Are you sure you want", "to reset this level?", me.resetBoard);
			};

			restartGame.onclick = function (ev)
			{
				me.removeMenu();
				me.textBlock("Are you sure you want", "to reset the game?", me.resetGame);
			};

			credits.onclick = function (ev)
			{
				me.removeMenu();
				
				me.drawRectangle("creditsBox", 148, 115, 500, 290, 2, "#000", "#fff")
				me.drawRectangle("okButton", 358, 360, 80, 30, 2, "#000", "#fff");

				me.context.appendChild(me.drawText("credits1", 264, 164, "Towers of Hanoi", null, "peg"));
				me.context.appendChild(me.drawText("credits2", 338, 210, "Eric's Gear", null, "menu"));
				me.context.appendChild(me.drawText("credits3", 310, 260, "By Eric Ingamells", null, "instructionText"));
				me.context.appendChild(me.drawText("credits4", 323, 310, "Copyright 2021", null, "instructionText"));

				me.context.appendChild(me.drawText("ok", 380, 385, "OK", null, "menu"));

				document.getElementById("okButton").onclick = function (ev)
				{
					me.removeCredits();
				};
				
				document.getElementById("okText").onclick = function (ev)
				{
					me.removeCredits();
				};
			};
		};
	}
	
	resetGame()
	{
		this.level = 0;
		this.resetBoard();
	}
	
	textBlock(message1, message2, okMethod, useCancel = true)
	{
		this.drawRectangle("messageBox", 248, 180, 300, 120, 2, "#000", "#fff")
		this.drawRectangle("okButton", 308, 260, 80, 30, 2, "#000", "#fff");

		var message1text = this.drawText("message1", 254, 210, message1, null, "instructionText");

		this.context.appendChild(message1text);
		
		var okText = this.drawText("ok", 330, 285, "OK", null, "menu");
		this.context.appendChild(okText);

		var me = this;
		var rescopedMethod = okMethod ? okMethod.bind(this) : null;     
		var box1 = message1text.getBBox();

		message1text.setAttributeNS(null, "x", 398 - (box1.width / 2));

		if (message2)
		{
			var message2text = this.drawText("message2", 284, 240, message2, null, "instructionText");
			this.context.appendChild(message2text);

			var box2 = message2text.getBBox();
			message2text.setAttributeNS(null, "x", 398 - (box2.width / 2));
		}
		
		var okButton = document.getElementById("okButton");
		
		okButton.onclick = function (ev)
		{
			me.removeTextBlock();
			
			if (rescopedMethod)
			{
				rescopedMethod();
			}
		};
		
		okText.onclick = function (ev)
		{
			me.removeTextBlock();
			
			if (rescopedMethod)
			{
				rescopedMethod();
			}
		};

		if (useCancel)
		{
			this.drawRectangle("cancelButton", 408, 260, 100, 30, 2, "#000", "#fff");
			this.context.appendChild(this.drawText("cancel", 420, 285, "Cancel", null, "menu"));

			document.getElementById("cancelButton").onclick = function (ev)
			{
				me.removeTextBlock();
			};
			
			document.getElementById("cancelText").onclick = function (ev)
			{
				me.removeTextBlock();
			};
		}
		else
		{
			var box1 = okButton.getBBox();
			var box2 = okText.getBBox();

			okButton.style.transform = "translate(" + (398 - (box1.width / 2) - box1.x) + "px, " + 0 + "px)";
			okText.setAttributeNS(null, "x", 398 - (box2.width / 2));
		}
	}
	
	removeTextBlock()
	{
		var messageBox = document.getElementById("messageBox");
		
		if (messageBox)
		{
			var okButton = document.getElementById("okButton");
			var okText = document.getElementById("okText");
			var message1 = document.getElementById("message1Text");

			this.context.removeChild(messageBox);
			this.context.removeChild(okButton);
			this.context.removeChild(okText);
			this.context.removeChild(message1);

			var message2 = document.getElementById("message2Text");
			
			if (message2)
			{
				this.context.removeChild(message2);
			}

			var cancelButton = document.getElementById("cancelButton");
			
			if (cancelButton)
			{
				var cancelText = document.getElementById("cancelText");
				this.context.removeChild(cancelButton);
				this.context.removeChild(cancelText);
			}
		}
	}
	
	removeCredits()
	{
		var creditsBox = document.getElementById("creditsBox");
		
		if (creditsBox)
		{
			var okButton = document.getElementById("okButton");
			var okText = document.getElementById("okText");

			for (var i = 1; i < 5; i++)
			{
				this.context.removeChild(document.getElementById("credits" + i + "Text"));
			}
			
			this.context.removeChild(creditsBox);
			this.context.removeChild(okButton);
			this.context.removeChild(okText);
		}
	}
	
	removeInstructions()
	{
		var instructionsBox = document.getElementById("instructionsBox");
		
		if (instructionsBox)
		{
			var okButton = document.getElementById("okButton");
			var okText = document.getElementById("okText");

			for (var i = 1; i < 10; i++)
			{
				this.context.removeChild(document.getElementById("instructions" + i + "Text"));
			}
			
			this.context.removeChild(instructionsBox);
			this.context.removeChild(okButton);
			this.context.removeChild(okText);
		}
	}
	
	removeMenu()
	{
		var menuBox = document.getElementById("menuBox");
		
		if (menuBox)
		{
			var instructions = document.getElementById("instructionsText");
			var restartLevel = document.getElementById("restartLevelText");
			var restartGame = document.getElementById("restartGameText");
			var credits = document.getElementById("creditsText");
			
			this.context.removeChild(menuBox);
			this.context.removeChild(instructions);
			this.context.removeChild(restartLevel);
			this.context.removeChild(restartGame);
			this.context.removeChild(credits);
		}
	}
	
	addDisks(puckWidth)
	{
		var width = 75;
		var sizeDifferences = (puckWidth - 75) / this.disks;

		for (var i = this.disks - 1; i >= 0 ; i--)
		{
			var newPuck = new Puck(this.letters[i], this.colors[i], this.puckHeight, width + (i * sizeDifferences));
			this.pucks[newPuck.name] = newPuck;
			
			newPuck.pathElement = this.drawPath(newPuck.name, newPuck.path, newPuck.color);
			newPuck.textElement = this.drawText(newPuck.name, (newPuck.width / 2) + newPuck.transform.x, (newPuck.height / 2) + newPuck.transform.y, newPuck.name);
			
			this.context.appendChild(newPuck.pathElement);
			this.context.appendChild(newPuck.textElement);
			
			this.pegs[0].push(newPuck);
			
			this.addListeners(newPuck);
		}
		
		for (var i = 0; i < this.pegs[0].length; i++)
		{
			this.pegs[0][i].transform.x = this.pegLocations[0] - (this.pegs[0][i].width / 2);
			this.pegs[0][i].transform.y = this.platformTop - (this.puckHeight * (i + 1));
			
			this.transformPiece(this.pegs[0][i], this.pegs[0][i].transform.x, this.pegs[0][i].transform.y);
		}
	}
	
	addDragging()
	{
		var me = this;
		
		this.context.onmousemove = function (e) 
		{    
			// if there is an active element, move it around by updating its coordinates           
			if (me.selectedElement) 
			{
				var puck = me.pucks[me.selectedElement.id[0]];
				
				var dx = puck.transform.x + (e.clientX - me.currentX);
				var dy = puck.transform.y + (e.clientY - me.currentY);
				
				me.currentX = e.clientX;
				me.currentY = e.clientY;
				
				me.transformPiece(puck, dx, dy);
			}
		};		
	}
	
	setupLevel()
	{
		this.context.appendChild(this.drawText("levelText", 10, 15, "Level: ", null));
		this.context.appendChild(this.drawText("levelNumber", 60, 15, this.level + 1, null));
		this.context.appendChild(this.drawText("levelQuantity", 80, 15, "of 32", null));
	}
	
	updateLevel()
	{
		document.getElementById("levelNumberText").textContent = this.level + 1;
	}

	setupPlatform()
	{
		this.platform = new Puck("platform", "#D2B48C", this.puckHeight, this.maxWidth - 4);
		this.platform.pathElement = this.drawPath(this.platform.name, this.platform.path, this.platform.color);
		this.context.appendChild(this.platform.pathElement);
		this.transformPiece(this.platform, 2, this.platformTop);
		
		this.displayTargetPegs();
	}
	
	displayTargetPegs()
	{
		for (var i = 0; i < this.pegQuantity; i++)
		{
			var newPeg = new Peg();
			var targetPeg = this.targetPeg.indexOf(i);
			
			if (targetPeg > -1)
			{
				newPeg.name = targetPeg + 1;
				
				if (targetPeg > 0)
				{
					newPeg.className = "pegDisabled";
					this.disabledPegs.push(i);
				}
			}
			
			newPeg.textElement = this.drawText("pegNotation" + i, 0, 0, newPeg.name, null, newPeg.className);
			this.pegNotation.push(newPeg.textElement);
			
			this.context.appendChild(newPeg.textElement);
			
			var box = newPeg.textElement.getBBox();
			
			newPeg.height = box.height;
			newPeg.width = box.width;
			
			this.transformPiece(newPeg, this.pegLocations[i] - (newPeg.width / 2), this.platformTop + (this.puckHeight / 2) - (newPeg.height / 5));
		}
	}
	
	setupTargetPeg()
	{
		for (var i = 2; i < this.pegQuantity; i++)
		{
			this.targetPeg.push(i);
		}
		
		if (this.targetPeg.length > 3)
		{
			this.shuffle(this.targetPeg);
		}
	}

	shuffle(array) {
		var currentIndex = array.length;
		var temporaryValue= 0;
		var randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
	}
	
	drawRectangle(id, x, y, width, height, strokeWidth = 1, strokeColor = "#000", fill = "none")
	{
		var textPath = "M " + x + " " + y +
			" L " + (x + width) + " " + y +
			" L " + (x + width) + " " + (y + height) +
			" L " + x + " " + (y + height) +
			" L " + x + " " + y + "z";
		
		this.context.appendChild(this.drawPath(id, textPath,  fill, strokeWidth));
	}
	
	drawPeg(pegLocation, pegNumber)
	{
		var path = "M " + pegLocation + " " + this.platformTop + " L " + pegLocation + " " + (this.platformTop - (this.puckHeight * (this.disks + 0.5)));
		var className = "peg"

		if (this.targetPeg.indexOf(pegNumber) > 0)
		{
			className = "pegDisabled";
		}
		
		this.context.appendChild(this.drawPath("peg" + pegNumber, path, null, 6, className));
	}

	drawText(id, x, y, textValue, fill = "#8fa", className = null)
	{
		var newText = document.createElementNS(this.svgns, "text");
		newText.setAttributeNS(null, "id", id + "Text");  
		newText.setAttributeNS(null, "x", x);
		newText.setAttributeNS(null, "y", y);
		
		if (className)
		{
			newText.setAttributeNS(null, "class", className);
		}
		else
		{
			newText.setAttributeNS(null, "fill", fill);
		}
		
		newText.textContent = textValue;
		
		return newText;
	}
	
	drawPath(id, textPath, fill = "#fff", strokeWidth = 3, className = null)
	{
		var newpath = document.createElementNS(this.svgns, "path");  
		
		newpath.setAttributeNS(null, "id", id);  
		newpath.setAttributeNS(null, "d", textPath);  
		newpath.setAttributeNS(null, "stroke", "#000");  
		newpath.setAttributeNS(null, "stroke-width", strokeWidth);  
		newpath.setAttributeNS(null, "opacity", 1);  

		if (className)
		{
			newpath.setAttributeNS(null, "class", className);
		}
		else
		{
			newpath.setAttributeNS(null, "fill", fill);
		}
		
		return newpath;
	}
	
	transformPiece(puck, left, down)
	{
		if (puck)
		{
			puck.transform.x = left;
			puck.transform.y = down;
			
			if (puck.pathElement)
			{
				puck.pathElement.style.transform = "translate(" + puck.transform.x + "px, " + puck.transform.y + "px)";
			}
			
			if (puck.textElement)
			{
				var box = puck.textElement.getBBox();
				puck.textElement.setAttributeNS(null, "x", (puck.width / 2) - (box.width / 2) + puck.transform.x);  
				puck.textElement.setAttributeNS(null, "y", (puck.height / 2) + puck.transform.y);  
			}
		}
	}
	
	onMouseUp(e) 
	{
		var selectedPuck = this.pucks[e.target.id[0]];
		this.movePuck(selectedPuck, e.clientX)
	}

	movePuck(selectedPuck, clientX)
	{
		if (this.selectedElement)
		{
			var peg = this.pegs[selectedPuck.peg];
			var newPeg = this.findPeg(clientX);
			
			if ((selectedPuck.peg != newPeg) && (this.disabledPegs.indexOf(newPeg) == -1) && ((this.pegs[newPeg].length == 0) || (selectedPuck.width < this.pegs[newPeg][this.pegs[newPeg].length - 1].width)))
			{
				this.pegs[selectedPuck.peg].pop(selectedPuck);
				this.pegs[newPeg].push(selectedPuck);
				
				selectedPuck.peg = newPeg;
			}
			
			this.selectedElement = null;  
		}
		
		var index = this.pegs[selectedPuck.peg].indexOf(selectedPuck);
		
		selectedPuck.transform.x = this.pegLocations[selectedPuck.peg] - (selectedPuck.width / 2);
		selectedPuck.transform.y = this.platformTop - (this.puckHeight * (index + 1));
		
		this.transformPiece(selectedPuck, selectedPuck.transform.x, selectedPuck.transform.y);

		this.checkForWin();
	}
		
	onMouseDown(e) 
	{
		this.removeMenu();
		this.removeInstructions();
		this.removeCredits();
		this.removeTextBlock();

		if (this.selectedElement == null)
		{
			var selectedPuck = this.pucks[e.target.id[0]];
			var peg = this.pegs[selectedPuck.peg];
			
			if (selectedPuck && peg.indexOf(selectedPuck) == (peg.length - 1))
			{
				// save the original values when the user clicks on the element
				this.currentX = e.clientX;
				this.currentY = e.clientY;

				this.selectedElement = selectedPuck.pathElement;
				this.context.appendChild(selectedPuck.pathElement);
				this.context.appendChild(selectedPuck.textElement);
			}
		}
	}
		
	addListeners(puck)
	{
		puck.pathElement.onmousedown = this.onMouseDown.bind(this);
		puck.textElement.onmousedown = this.onMouseDown.bind(this);
		
		puck.pathElement.onmouseup = this.onMouseUp.bind(this);
		puck.textElement.onmouseup = this.onMouseUp.bind(this);
	}

	findPeg(x)
	{
		if (this.pegLocations[0] >= x)
		{
			return 0;
		}
		else if (this.pegLocations[this.pegLocations.length - 1] <= x)
		{
			return this.pegLocations.length - 1;
		}
		
		for (var i = 0; i < this.pegLocations.length - 1; i++)
		{
			if (x >= this.pegLocations[i] && x < this.pegLocations[i + 1])
			{
				var midpoint = (this.pegLocations[i] + this.pegLocations[i + 1]) / 2;
				
				if (x <= midpoint)
				{
					return i;
				}
				else
				{
					return i + 1;
				}
			}
		}
		
		return 0;
	}
	
	checkForWin()
	{
		if (this.pegs[this.targetPeg[0]].length == this.disks)
		{
			if (this.targetPeg.length == 1)
			{
				if (this.pegQuantity == this.maxPegs && this.disks == this.maxDisks)
				{
					this.textBlock("Level Complete!", "And you beat the game!", null, false);
				}	
				else
				{
					this.textBlock("Level Complete!", null, this.levelUp, false);
				}
			}
			else
			{
				this.updatePegs();
			}
		}
	}
	
	updatePegs()
	{
		document.getElementById("peg" + this.targetPeg[0]).setAttributeNS(null, "class", "pegSolved");
		document.getElementById("pegNotation" + this.targetPeg[0] + "Text").setAttributeNS(null, "class", "pegSolved");
		
		this.disablePegOrder.push(this.targetPeg[0]);
		
		this.targetPeg.splice(0, 1);

		this.disabledPegs.splice(this.disabledPegs.indexOf(this.targetPeg[0]), 1);
		
		document.getElementById("peg" + this.targetPeg[0]).setAttributeNS(null, "class", "peg");
		document.getElementById("pegNotation" + this.targetPeg[0] + "Text").setAttributeNS(null, "class", "peg");
		
		this.disabledPegs.push(this.disablePegOrder[0]);
		
		document.getElementById("peg" + this.disablePegOrder[0]).setAttributeNS(null, "class", "pegDisabled");
		document.getElementById("pegNotation" + this.disablePegOrder[0] + "Text").setAttributeNS(null, "class", "pegDisabled");
		
		this.disablePegOrder.splice(0, 1);
	}
	
	levelUp()
	{
		this.level++;
		this.resetBoard();
	}

	resetBoard()
	{
		var platform = document.getElementById("platform");
		this.context.removeChild(platform);

		for (var i = 0; i < this.pegLocations.length; i++)
		{
			var peg = document.getElementById("peg" + i);
			this.context.removeChild(peg);

			var pegNotation = document.getElementById("pegNotation" + i + "Text");
			this.context.removeChild(pegNotation);
		}
		
		var keys = Object.keys(this.pucks);
		
		for (var i = 0; i < keys.length; i++)
		{
			this.context.removeChild(this.pucks[keys[i]].pathElement);
			this.context.removeChild(this.pucks[keys[i]].textElement);
		}
		
		this.updateLevel();
		this.resetValues();
		this.DrawBoard();
	}
		
	setLevel()
	{
		switch (this.level)
		{
			case 0: 
				this.pegQuantity = 3;
				this.disks = 3;
				break;
			case 1: 
				this.pegQuantity = 3;
				this.disks = 4;
				break;
			case 2: 
				this.pegQuantity = 3;
				this.disks = 5;
				break;
			case 3: 
				this.pegQuantity = 4;
				this.disks = 3;
				break;
			case 4: 
				this.pegQuantity = 4;
				this.disks = 4;
				break;
			case 5: 
				this.pegQuantity = 4;
				this.disks = 5;
				break;
			case 6: 
				this.pegQuantity = 3;
				this.disks = 6;
				break;
			case 7: 
				this.pegQuantity = 3;
				this.disks = 7;
				break;
			case 8: 
				this.pegQuantity = 3;
				this.disks = 8;
				break;
			case 9: 
				this.pegQuantity = 4;
				this.disks = 6;
				break;
			case 10: 
				this.pegQuantity = 4;
				this.disks = 7;
				break;
			case 11: 
				this.pegQuantity = 4;
				this.disks = 8;
				break;
			case 12: 
				this.pegQuantity = 5;
				this.disks = 3;
				break;
			case 13: 
				this.pegQuantity = 5;
				this.disks = 4;
				break;
			case 14: 
				this.pegQuantity = 5;
				this.disks = 5;
				break;
			case 15: 
				this.pegQuantity = 6;
				this.disks = 3;
				break;
			case 16: 
				this.pegQuantity = 6;
				this.disks = 4;
				break;
			case 17: 
				this.pegQuantity = 6;
				this.disks = 5;
				break;
			case 18: 
				this.pegQuantity = 5;
				this.disks = 6;
				break;
			case 19: 
				this.pegQuantity = 5;
				this.disks = 7;
				break;
			case 20: 
				this.pegQuantity = 5;
				this.disks = 8;
				break;
			case 21: 
				this.pegQuantity = 6;
				this.disks = 6;
				break;
			case 22: 
				this.pegQuantity = 6;
				this.disks = 7;
				break;
			case 23: 
				this.pegQuantity = 6;
				this.disks = 8;
				break;
			case 24: 
				this.pegQuantity = 3;
				this.disks = 9;
				break;
			case 25: 
				this.pegQuantity = 3;
				this.disks = 10;
				break;
			case 26: 
				this.pegQuantity = 4;
				this.disks = 9;
				break;
			case 27: 
				this.pegQuantity = 4;
				this.disks = 10;
				break;
			case 28: 
				this.pegQuantity = 5;
				this.disks = 9;
				break;
			case 29: 
				this.pegQuantity = 5;
				this.disks = 10;
				break;
			case 30: 
				this.pegQuantity = 6;
				this.disks = 9;
				break;
			case 31: 
				this.pegQuantity = 6;
				this.disks = 10;
				break;
			default: 
				this.pegQuantity = 3;
				this.disks = 3;
				break;
		}
	}
	
	resetValues()
	{
		this.selectedElement = null;
		this.platform = null;
		this.platformTop = 0;

		this.pucks = [];
		this.pegLocations = [];
		this.pegs = [];
		this.targetPeg = [];
		this.disabledPegs = [];

		this.disablePegOrder = [0, 1];
	}
}
