"use strict";

$(document).ready(function($) {

// page loader	
	$(window).bind("load", function() {
		 $("#pageLoader").fadeOut("slow");
	});
	
	
	// humburger menubar
	$(".menu-bar").click(function () {
		$(this).hide();
		$(".navigation").toggle();
		$(".overlay").toggle();
	});
	
	$(".menu-bar.open").click(function () {
		$(".navigation").hide();
		$(".menu-bar").show();
	});
	$(".overlay").click(function () {
		$(".navigation").hide();
		$(".menu-bar").show();
		$(this).hide();
	});
	
	
 });