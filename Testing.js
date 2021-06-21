class Testing
{
	towers = null;
	pegLocations = null;
	
	BeginTesting()
	{
		this.towers = new Hanoi();
		
		this.setupTestingConditions();
		this.towers.DrawBoard();
	
		var levelComplete = false;
		
		//for (var i = 0; i < 32; i++)
		{
			var transferPeg = this.GetTransferPeg(0, this.towers.targetPeg[0]);
			
			this.MoveTower(0, transferPeg, this.towers.targetPeg[0], 0);
		}
	}
	
	setupTestingConditions()
	{
		this.towers.context.appendChild(this.towers.drawText("testingBanner", 200, 40, "Testing In Progress", null, "testingBanner"));
		this.towers.addListeners = function() {};
		this.towers.level = 1;
	}
	
	copyPeg(peg, startPosition)
	{
		if (peg && peg.length >= startPosition)
		{
			var newPeg = [];
			
			for (var i = startPosition; i < peg.length; i++)
			{
				if (peg[i])
				{
					newPeg.push(peg[i]);
				}
			}
			
			return newPeg;
		}
	}
	
	MoveTower(startPeg, transferPeg, targetPeg, startTransfer)
	{
		var peg = this.copyPeg(this.towers.pegs[startPeg], startTransfer);
		
		if (peg)
		{
			if (peg.length == 0)
			{
				return;
			}
			else if (peg.length == 1)
			{
				console.log("moved puck " + peg[peg.length - 1].name + " from " + startPeg + " to " + targetPeg);

				this.towers.selectedElement = peg[peg.length - 1].pathElement;
				this.towers.movePuck(peg[peg.length - 1], this.towers.pegLocations[targetPeg]);
			}
			else
			{
				if (peg.length % 2 == 0)
				{
					this.MoveTower(startPeg, targetPeg, transferPeg, startTransfer + 1);

					if (peg.length == 2)
					{
						if (this.towers.disks % 2 == 0)
						{
							this.MoveTower(targetPeg, transferPeg, startPeg, 0);
							this.MoveTower(transferPeg, startPeg, targetPeg, startTransfer);
						}
						else
						{
							this.MoveTower(startPeg, transferPeg, targetPeg, startTransfer);
							this.MoveTower(transferPeg, startPeg, targetPeg, 0);
						}
					}
				}
				else
				{
					this.MoveTower(startPeg, targetPeg, transferPeg, startTransfer + 1);
					this.MoveTower(startPeg, transferPeg, targetPeg, startTransfer);
					this.MoveTower(transferPeg, startPeg, targetPeg, startTransfer);
				}
			}
		}
	}
	
	GetTransferPeg(startPeg, targetPeg)
	{
		for (var i = 0; i < this.towers.pegs.length; i ++)
		{
			if (this.towers.disabledPegs.indexOf(this.towers.pegs[i]) == -1 &&
				i != startPeg &&
				i != targetPeg)
			{
				return i;
			}
		}
	}
}