$(document).ready(function() {
	window.fbAsyncInit = function() {
		FB.init({
			appId: '341228219356022',
			status: true, // check login status
			cookie: true, // enable cookies to allow the server to access the session
			xfbml: true // parse XFBML
		});

		FB.Event.subscribe('auth.authResponseChange', function(response) {
			if (response.status === 'connected') {
				$('.container').removeClass("hide");
				$("#facebook").addClass("hide");
				profile();
				window.uid = response.authResponse.userID;
				// getFrnds();
				// subFb(response.authResponse.userID);
				// $(".facebook").remove();
			} else if (response.status === 'not_authorized') {
				// $('body').append('<div class="row facebook"><img src="images/facebook.png" onclick="FB.login()"></div>');
			} else {
				// $('body').append('<div class="row facebook"><img src="images/facebook.png" onclick="FB.login()"></div>');
			}
		});
	};

	(function(d) {
		var js, id = 'facebook-jssdk',
			ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement('script');
		js.id = id;
		js.async = true;
		js.src = "http://connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));

	function profile() {
		FB.api('/me', function(response) {
			$(".name h1").html(response.name);
			window.username = response.first_name;
		});
		FB.api('/me/picture?redirect=0&height=350&type=normal&width=350', function(response) {
			$(".dp").html('<img src="' + response.data.url + '" class="img-responsive" alt="Responsive image">');
		});
	}

	function subFb(uid) {
		pubnub.subscribe({
			channel: uid,
			message: function(m) {
				// Subscribing to the refered channel
				pubnub.subscribe({
					channel: m,
					message: function(n) {
						console.log(n)
					},
					callback: console.log("Subscribed to new db-channel " + m)
				});
				// Subscribing to listen for songs
				subsongs = m + "songs";
				pubnub.subscribe({
					channel: subsongs,
					message: function(n) {
						$(".playlist").append('<li><a href="' + n[0] + '">' + n[1] + '</a></li>');
					},
					callback: console.log("listening to the songs on " + subsongs)
				});
				// Subscribing to the play event
				subplay = m + "play";
				pubnub.subscribe({
					channel: subplay,
					message: function(o) {
						console.log("trying to play a song " + o);
						var song = soundManager.getSoundById(o);
						if (song.paused) {
							soundManager.resume(o);
							console.log("remote controller success");
						} else {
							console.log("create the sound first asshole");
						}
					},
					callback: console.log("listening to the play events on " + subplay)
				});
				// Subscribing to the pause event
				subpause = m + "pause";
				pubnub.subscribe({
					channel: subpause,
					message: function(p) {
						console.log("pausing " + p);
						soundManager.pause(p);
					},
					callback: console.log("listening to the pause events on " + subpause)
				});
				// Subscribing to the seek event
				subseek = m + "seek";
				pubnub.subscribe({
					channel: subseek,
					message: function(q) {
						// console.log("setting the positing of this song to "+q);
						var seekingsong = soundManager.getSoundById(q[1]);
						seekingsong.setPosition(q[0]);
					},
					callback: console.log("listening to the seek events on " + subseek)
				});
			},
			callback: console.log("Subscribed to personal channel " + uid)
		});
	}

	// For Autocomplete in select2
	function getFrnds() {
		FB.api('/me/friends', function(response) {
			var container = document.getElementById('e1');
			var mfsForm = document.createElement('optgroup');
			mfsForm.label = 'Friends on Facebook';
			for (var i = 0; i < response.data.length; i++) {
				var item = document.createElement('option');
				item.value = response.data[i].id;
				item.innerHTML = response.data[i].name;
				mfsForm.appendChild(item);
			}
			container.appendChild(mfsForm);
		});
	}

	// For Buttons in select2
	function showFrnds() {
		FB.api('/me/friends', function(response) {
			var container = document.getElementById('pool');
			var fpool = document.createElement('div');
			fpool.id = 'fpool'
			for (var i = 0; i < response.data.length; i++) {
				var item = document.createElement('button');
				// item.value = response.data[i].id;
				item.class = "button";
				item.innerHTML = response.data[i].name;
				fpool.appendChild(item);
			}
			container.appendChild(fpool);
		});
	}

	function renderMFS() {

		FB.api('/me/friends', function(response) {
			var container = document.getElementById('mfs');
			var mfsForm = document.createElement('form');
			mfsForm.id = 'mfsForm';


			for (var i = 0; i < Math.min(response.data.length, 10); i++) {
				var friendItem = document.createElement('div');
				friendItem.id = 'friend_' + response.data[i].id;
				friendItem.innerHTML = '<input type="checkbox" name="friends" value="' + response.data[i].id + '" />' + response.data[i].name;
				mfsForm.appendChild(friendItem);
			}
			container.appendChild(mfsForm);


			var sendButton = document.createElement('input');
			sendButton.type = 'button';
			sendButton.value = 'Send Request';
			sendButton.onclick = sendRequest;
			mfsForm.appendChild(sendButton);
		});
	}

	function sendRequest() {

		var sendUIDs = '';
		var mfsForm = document.getElementById('mfsForm');
		for (var i = 0; i < mfsForm.friends.length; i++) {
			if (mfsForm.friends[i].checked) {
				sendUIDs += mfsForm.friends[i].value + ',';
			}
		}

		FB.ui({
			method: 'apprequests',
			to: sendUIDs,
			title: 'My Great Invite',
			message: 'Check out this Awesome App!',
		}, callback);
	}

	function callback(response) {
		console.log(response);
	}
});