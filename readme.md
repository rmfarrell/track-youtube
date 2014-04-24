#Class that allows you to add callbacks for common YouTube tasks

##Useful for tracking

###Look at main.js for a demo.

1. Instantiate the class passing in one parameter: an options hash. Options are as follows:*

	a. start: function to be called after the player starts

	b. end: function to be called after the player has ended.

	c. replayed: function to be called after the player has restarted
	
	d. stop: function to be called after the player has paused

	e. milestones: object that takes percentages as integers as their key and callbacks as their values (e.g {'25': function(){}, '50': function(){}, etc...})

	Each passed callback receives the unique tracking ID specified and the YouTube player object itself as an argument

2. Attach the tracking object to the player after it's been instantiated passing the YouTube player ID and unique identifier (string)*

Dependencies: JQuery
