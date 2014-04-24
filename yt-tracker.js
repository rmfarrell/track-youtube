TrackYT = function(options) {
	
	//Public callbacks for tracking scripts
	//Set these in the trackYT intstantiation.
	var settings = {
		
		start : function(){},
		end : function(){},
		replayed : function(){},
		stop : function(){},
		milestones : {}
	};
	
	var milestonesPlaceholder = [];
	
	/* Object attached to YouTube Player object
	
	mbVars = {
		
		isPlayed : false, //Flags whether video has been played
		isWatched : false, //Flags whether video has been watched
		id : '', //tracking ID
		progress : '', // percentage of video viewed
		playerInterval : null //interval that records time progress every second
		milestones : []; //Derived from settings; placeholder attached to video
	}
	* * * * * */
	
	function _eventRouter (state, player, trackingID) {
		
		//End of Video
        if (state === 0 && player.mbVars.isWatched !== true) {

        	player.mbVars.isWatched = true;
        	
			clearInterval(player.mbVars.playerInterval);
        	
        	return settings.end.call(this, trackingID, player);
		
		//Video was stopped
		} else if (state === 2) {
			
			return _stop(player, trackingID);
			
		//Video was replayed
        } else if (state === 1 && player.mbVars.isWatched === true) {

        	return settings.replayed.call(this, trackingID, player);
        
		//Video was played initially
        } else if (state === 1 && player.mbVars.isPlayed !== true) {
			
			player.mbVars.isPlayed = true;//Set has-played flag
			
			player.mbVars.progress = 0;//Set progress variable
			
			_play(player);
			
			return settings.start.call(this, trackingID, player);
        
		//Played from a paused state
        } else if (state === 1) {
			
			return _play(player);
			
		} else { 
			
			return;
		}
	};
	
	function _play(player) {
		
		if ($.isEmptyObject(settings.milestones)) return;
		
			else return _trackTimeElapsed(player);
	}
	
	function _fireMilestoneCallback(index, player) {
		
		return settings.milestones[index].call(this, player.mbVars.id, player);
	}
	
	function _mergeOptions() {
		
		return $.extend(settings, options);
	};
	
	function _validate(player) {
		
		if (typeof yt === 'undefined') {
			
			console.log('YouTube not instantiated. Make sure your YouTube evocation is wrapped in a "onYouTubeIframeAPIReady" and the API is present.');
			
			return false;
		
		} else if (typeof player.i === 'undefined') {
			
			console.log(player + 'is not a YouTube object.');
		
			return false;
			
		} else {
		
			return true;
		}
	};
	
	function _recordProgress(progress, player) {
		
		var m = player.mbVars.milestones;
		
		//If progress is further than lowest milestone in the players reference array, fire the 
		//milestone callback function & remove the milestone from the array.
		if (progress < m[0] || m.length === 0) {
			
			return;
			
		} else {
			
			_fireMilestoneCallback(m[0], player);
			
			return m.splice(0,1);
		}
	};
	
	function _checkPlayer(player) {
		
		var tm = player.getCurrentTime(); //get video position
		var dur = player.getDuration(); //get video duration
		var c = Math.round(tm/dur*100); //calculate % complete
		
		if (player.mbVars.progress && c <= player.mbVars.progress) {
			
			return false;
			
		} else {
			
			player.mbVars.progress = c;
			
			_recordProgress(c, player);
		}
	};
	
	function _stop (player, trackingID) {
		
		clearInterval(player.mbVars.playerInterval);
		
		return settings.stop.call(this, trackingID, player);
	};
	
	function _attachMileStoneTracker (m, player) {
		
		var milestones = [];
			
		$.each(m, function(i) {
			
			milestones.push(parseInt(i));
		});
		
		milestones = milestones.sort();
		
		return milestones;
	}
	
	function _trackTimeElapsed (player) {
		
		//Attach interval to player that checks video progress every second
		player.mbVars.playerInterval = setInterval(function() {
			_checkPlayer(player)
		}, 1000);
	};
		
	
	return {
		
		init : function(player, trackingID) {
			
			//Pass ptions into settings
			_mergeOptions();
			
			//Check for errors
			if (!_validate(player)) return false;
			
			//initialize custom obj
			player.mbVars = {};
			
			//attach tracking id to player
			player.mbVars.id = trackingID;
			
			//attach milestone indices to player
			player.mbVars.milestones = _attachMileStoneTracker(settings.milestones, player);
			
			return player.addEventListener('onStateChange', function(e) {
				
				_eventRouter(e.data, e.target, trackingID);
			});
		}
	}
};