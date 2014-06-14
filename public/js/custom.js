// SoundManager2 Settings
soundManager.setup({
	url: '/swf',
	flashVersion: 9,
	debugMode: true,
    preferFlash: false, // prefer 100% HTML5 mode, where both supported
    onready: function() {
    	console.log('SM2 ready!');
    },
    ontimeout: function() {
    	console.log('SM2 init failed!');
    },
    defaultOptions: {
        // set global default volume for all sound objects
        volume: 70
    }
});
this.config = {
    flashVersion: 9, // version of Flash to tell SoundManager to use - either 8 or 9.
    allowRightClick: false, // let users right-click MP3 links ("save as...", etc.) or discourage (can't prevent.)
    useThrottling: false, // try to rate-limit potentially-expensive calls (eg. dragging position around)
    autoStart: false, // begin playing first sound when page loads
    playNext: true, // stop after one sound, or play through list until end
    updatePageTitle: true, // change the page title while playing sounds
    emptyTime: '-:--' // null/undefined timer values (before data is available)
}
// Loading APIs
$(document).ready(function() {
    // Soundcloud Settings
    SC.initialize({
    	client_id: "a4206f816a58710e5c84ab6af01f346f"
    });
    // Done Loading APIs
});
// Player Controls
$(document).ready(function() {
    // Searching songs on soundcloud
    $(".search").on('click', function(event) {
    	event.preventDefault();
    	var searchterm = $(".soundcloud-search").val();
        // console.log(searchterm);
        $(".soundcloud-search").focus();
        $(".search-results").click();
        SC.get('/tracks', {
        	q: searchterm,
        	license: 'cc-by'
        }, function(tracks) {
            // console.log(tracks);
            $.each(tracks, function(index, track) {
                // console.log(track);
                var trackinfo = $('<li class="track-item" data-track-id="' + track.id + '" data-track-url="' + track.stream_url + '" data-track-title="' + track.title + '"><div class="searched-track-title">' + track.title + '</div><div class="searched-track-controls"><i class="fa fa-plus add"></i>&nbsp;&nbsp;<i class="fa fa-heart fav"></i></div></li>');
                $(".track-results").append(trackinfo);
            });
        });
    });
    // Enter key emulation on search
    $('input[type=text]').on('keyup', function(e) {
    	if (e.which == 13) {
    		e.preventDefault();
    		$(".soundcloud-search").focus();
    		$(".search-results").click();
    		$(".search").click();
    		if ($(".track-results").length != 0) {
    			console.log("has some stuff");
    			$(".track-results").empty();
    		};
    	}
    });
    // Player functions
    $('.playlist-main').on('click', 'li', function() {
        // Create a track variable, grab the data from it, and find out if it's already playing *(set to active)*
        // console.log("Declared Variables");
        var $track = $(this),
        id = $track.attr("data-track-id"),
        playing = $track.hasClass('active');
        // console.log($track);
        if (playing) {
            // If it is playing: pause it.
            soundManager.pause(id);
            $(".play").removeClass("hide");
            $(".pause").addClass("hide");            
            console.log("list lo pause chesa");
        } else {
            // If it's not playing: stop all other sounds that might be playing and play the clicked sound.
            if ($track.siblings('li').hasClass('active')) {
            	soundManager.stopAll();
            }
            soundManager.play(id);
            $(".play").addClass("hide");
            $(".pause").removeClass("hide");            
            console.log("list lo nunchi play chesa");
        }
        // Finally, toggle the *active* state of the clicked li and remove *active* from and other tracks.
        $track.toggleClass('active').siblings('li').removeClass('active');
        // console.log(id);
    });
    // Bind a click event to the play / pause button.
    // $('.play').on('click', function() {
    	var playorpause = function() {
        // console.log(playingat);
        if ($('.playlist-main li').length) {
        	if ($('.playlist-main li').hasClass('active') == true) {
        		var $track = $('.playlist-main li.active'),
        		songid = $track.attr('data-track-id'),
        		playing = $track.is('.active');
                // If a track is active, play or pause it depending on current state.
                if (playing) {
                	soundManager.togglePause(songid);
                	console.log("button tho pause chesa");
                }
            } else {
                // If no tracks are active, just play the first one.
                $('.playlist-main li:first').click();
                $('.playlist-main li:first').addClass("active");
                console.log("going to play the only song");
            };
        } else {
        	console.log("ikkada nothing");
            // alert("ikkada nothing");
        };
    }
    var nextTrack = function() {
        // Stop all sounds
        soundManager.stopAll();
        // Click the next list item after the current active one. 
        // If it does not exist *(there is no next track)*, click the first list item.
        console.log("came here for next tracks");
        if ($('.playlist-main li.active').next().click().length == 0) {
        	$('.playlist-main li:first').click();
        }
    }
    // **Previous Track**
    var prevTrack = function() {
        // Stop all sounds
        soundManager.stopAll();
        // Click the previous list item after the current active one. 
        // If it does not exist *(there is no previous track)*, click the last list item.
        console.log("came here for previous tracks");
        if ($('.playlist-main li.active').prev().click().length == 0) {
        	$('.playlist-main li:last').click();
        }
    }
    // Previous button click handler
    $(".prev").on('click', function() {
    	console.log("clicked for previous song");
    	prevTrack();
    });
    // Play button click handler
    $(".play, .pause").on('click', function() {
    	console.log("play something");
    	playorpause();
    });
    // Next button click handler
    $(".next").on('click', function() {
    	console.log("clicked for next song");
    	nextTrack();
    });
    // From search-results to playlist
    $(document).on('click', '.add', function() {
        // console.log("adding this song to playlist");
        var sctrack = $(this).parent().parent();
        // console.log(sctrack.attr('data-track-id'));
        var trackid = 'track_' + sctrack.attr('data-track-id');
        var trackurl = sctrack.attr('data-track-url') + "?client_id=a4206f816a58710e5c84ab6af01f346f";
        var tracktitle = sctrack.attr('data-track-title');
        var playlistitem = $('<li class="playlist-item" data-track-id="' + trackid + '" data-track-url="' + trackurl + '"><div class="playlist-song-title">' + tracktitle + '</div><div class="playlist-song-type"><img class="watermark" src="images/soundcloud-watermark.png"></div></li>');
        $(".playlist-main").append(playlistitem);
        // while adding add this at the end "?client_id=a4206f816a58710e5c84ab6af01f346f"
        // <li class="playlist-item"><div class="playlist-song-title">Wiz Khalifa - Paperbond</div><div class="playlist-song-type"><img class="watermark" src="images/soundcloud-watermark.png"></div></li>
        soundManager.createSound({
        	id: trackid,
        	url: trackurl,
        	onplay: function() {
        		$('.track-title').text(tracktitle);
        	},
        	onresume: function() {
            	$(".play").addClass("hide");
            	$(".pause").removeClass("hide");        		
        	},
            // On pause, remove the *playing* class from the main player div.
            onpause: function() {
            	$(".play").removeClass("hide");
            	$(".pause").addClass("hide");
            },
            whileplaying: function() {
            	$(".track-progress-bar").css('width', ((this.position / this.duration) * 100) + '%');
            	$(".track-time .current").html(Math.round((this.position / 1000) / 60) + ":" + Math.round((this.position / 1000) % 60));
            	$(".track-time .total").html(Math.round((this.duration / 1000) / 60) + ":" + Math.round((this.duration / 1000) % 60));
            },
            // When a track finished, call the Next Track function. (Declared at the bottom of this file).
            onfinish: function() {
            	$(".progress-bar").css('width', '0');
            	$('.track-title').text("---");
            	$(".track-time .current").html("--");
            	$(".track-time .total").html("--");
            	nextTrack();
            }
        });
soundManager.load(trackid);
});
    // From search-results to favorites
    $(document).on('click', '.fav', function() {
    	console.log("bookmarking this song for future");
    });
});