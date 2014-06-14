$(document).ready(function(){
	// Menu operations
	$(".main-menu").on('click', '.menu-item', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});
	// Menu content
	$(".search-results").on('click', function() {
		$(".search-results-view").removeClass('hide').siblings().addClass('hide');
	});
	$(".history").on('click', function() {
		$(".history-view").removeClass('hide').siblings().addClass('hide');
	});
	$(".bookmarks").on('click', function() {
		$(".bookmarks-view").removeClass('hide').siblings().addClass('hide');
	});
	$(".chat").on('click', function() {
		$(".chat-view").removeClass('hide').siblings().addClass('hide');
	});
	$(".profile").on('click', function() {
		$(".profile-view").removeClass('hide').siblings().addClass('hide');
	});

	// Defualt view
	$(".profile").click();
});
window.onresize = function(){
	// The resize logic
	// console.log("changing window size width = "+window.innerWidth+" height = "+window.innerHeight);
}