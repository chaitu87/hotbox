$(document).ready(function() {
    // Bind a click event to each list item we created above.
    $('.playlist-main').on('click', 'li', function() {
        // Create a track variable, grab the data from it, and find out if it's already playing *(set to active)*
        // console.log("Declared Variables");
        var $track = $(this),
            data = $track.attr('data-track'),
            id = $track.attr("data-id"),
            playing = $track.hasClass('active');
        // console.log($track);
        if (playing) {
            // If it is playing: pause it.
            soundManager.pause(id);
            console.log("list lo pause chesa");
        } else {
            // If it's not playing: stop all other sounds that might be playing and play the clicked sound.
            if ($track.siblings('li').hasClass('active')) {
                soundManager.stopAll();
            }
            soundManager.play(id);
            console.log("list lo nunchi play chesa");
        }
        // Finally, toggle the *active* state of the clicked li and remove *active* from and other tracks.
        $track.toggleClass('active').siblings('li').removeClass('active');
        // console.log(id);
    });
    // Bind a click event to the play / pause button.
    // $('.play').on('click', function() {
    var playorpause = function(futuretime) {
        var wait = Math.abs(futuretime - now())/1000;
        setTimeout(function() {
            // console.log(playingat);
            if ($('.playlist-main li').length) {
                if ($('.playlist-main li').hasClass('active') == true) {
                    var $track = $('.playlist-main li.active'),
                        songid = $track.attr('data-id'),
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
                if ($(".play").is(":visible")) {
                    console.log("i can see pause button");
                    $(".play").addClass("hide");
                    $(".pause").removeClass("hide");
                } else {
                    console.log("i can see play button");
                    $(".play").removeClass("hide");
                    $(".pause").addClass("hide");
                };
            } else {
                console.log("ikkada nothing");
                // alert("ikkada nothing");
            };
        }, wait);
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
    
    pubnub.subscribe({
        channel: 'playlist-soundcloud',
        message: function(data) {
            var trackid = 'track_' + data[0];
            var trackurl = data[2] + "?client_id=a4206f816a58710e5c84ab6af01f346f"
            $(".playlist-main").append('<li data-id="' + trackid + '" data-track="' + trackurl + '">' + data[1] + ' <img class="watermark" src="images/soundcloud-watermark.png"></li>');
            $(".add-to-playlist").button('reset'); // reset the button back
            $("#soundcloud-url-input").val(""); // clear the input form
            // console.log(data);
            soundManager.createSound({
                id: trackid,
                url: trackurl,
                onplay: function() {
                    $('.track-title').text(data[1]);
                },
                onresume: function() {},
                // On pause, remove the *playing* class from the main player div.
                onpause: function() {},
                whileplaying: function() {
                    $(".progress-bar").css('width', ((this.position / this.duration) * 100) + '%');
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
        }
    });
    pubnub.subscribe({
        channel: 'playlist-upload',
        message: function(data) {
            var trackid = 'track_' + data[0];
            var trackurl = data[2];
            $(".playlist-main").append('<li data-id="' + trackid + '" data-track="' + trackurl + '">' + data[1] + ' <i class="fa fa-laptop white"></i></li>');
            $(".add-to-playlist").button('reset'); // reset the button back
            $("#soundcloud-url-input").val(""); // clear the input form
            // console.log(data);
            soundManager.createSound({
                id: trackid,
                url: trackurl,
                onplay: function() {
                    $('.player').addClass('playing');
                    $('.track-title').text(data[1]);
                },
                onresume: function() {
                    $('.player').addClass('playing');
                },
                // On pause, remove the *playing* class from the main player div.
                onpause: function() {
                    $('.player').removeClass('playing');
                },
                whileplaying: function() {
                    $(".progress-bar").css('width', ((this.position / this.duration) * 100) + '%');
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
        }
    });
});