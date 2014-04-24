var tag = document.createElement('script');
               
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	
var tracker = TrackYT({
	
	start : function(trackingID, player) {
		
		//Callback function with tracking ID specified in 'attachTracking' method below
		console.log(trackingID + ' has started');
		
		//Callbacks have access to YouTube video instance as 2nd argument
		console.log('This video is ' + player.getDuration() + ' seconds long');
	},
	
	end : function(t, p) {
		
		console.log(t + ' has ended');
	},
	
	replayed : function(t, p) {
		
		console.log(t + ' was replayed');
	},
	
	stop : function(t, p) {
		
		console.log(t + ' was paused');
	},
	
	milestones : {
		
		25 : function(trackingID, player) {
		
			console.log(trackingID + ' was 25% watched');
		},
		
		50 : function(t, p) {
		
			console.log(t + ' was 50% watched');
		},
		
		75 : function(t, p) {
		
			console.log(t + ' was 75% watched');			
		}
	}
});
	
function onYouTubeIframeAPIReady() {
	
	var player1  = new YT.Player('video-container-1', {
			
		videoId: '2aaubVlhNK4',
		height: '410',
		width: '750',
		playerVars: {
			wmode: 'transparent',
			rel : 0
		}
	});
	
	//Attach the tracking instance to this instance of the YouTube player
	//takes 2 parameters: YouTube instance name & tracking ID
	tracker.init(player1, 'track-me');
	
	var player2  = new YT.Player('video-container-2', {
			
		videoId: 'lrI7mHVHlEc',
		height: '410',
		width: '750',
		playerVars: {
			wmode: 'transparent',
			rel : 0
		}
	});
	
	tracker.init(player2, 'me-too');
}