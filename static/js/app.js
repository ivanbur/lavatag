// Initialize Firebase
var config = {
    apiKey: "AIzaSyBki3mFlSayHyQeql5-SEa7gXNg3nvVNsQ",
    authDomain: "murder-438bd.firebaseapp.com",
    databaseURL: "https://murder-438bd.firebaseio.com",
    projectId: "murder-438bd",
    storageBucket: "murder-438bd.appspot.com",
    messagingSenderId: "558094635149"
  };

firebase.initializeApp(config);
var database = firebase.database();
var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");
var playerID = 0;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var player = {
	color: "green",
	name: "alpha",
	group: "bystander",
	direction: 90,
	x: 50,
	y: 50,
	hasGun: true
}

var player2 = {
	color: "blue",
	name: "beta",
	group: "murderer",
	direction: 0,
	x: 150,
	y: 250,
	hasGun: false
}

$(document).ready(function() {
	database.ref("people/0").set(player);
	database.ref("people/1").set(player2);
});

function playGame() {
	database.ref("people/").once("value").then(function(snapshot) {
		playerID = snapshot.val().length;
	});
}

function draw() {
	database.ref("people/").once("value").then(function(snapshot) {
		for (var i = 0; i < snapshot.val().length; i++) {
			context.fillStyle = snapshot.val()[i].color;
			context.fillRect(snapshot.val()[i].x, snapshot.val()[i].y, 50, 50);
		}
	});
}

function setEventListeners() {
	addEventListener('keydown', function(event) {
		if (event.keyCode == 87) { // w keycode
			database.ref("people/" + playerID + "/y").once("value").then(function(snapshot) {
				database.ref("people/" + playerID + "/y").set(snapshot.val() - 10);
			});
		}
		if (event.keyCode == 65) { // a keycode
			database.ref("people/" + playerID + "/x").once("value").then(function(snapshot) {
				database.ref("people/" + playerID + "/x").set(snapshot.val() - 10);
			});
		}
		if (event.keyCode == 83) { // s keycode
			database.ref("people/" + playerID + "/y").once("value").then(function(snapshot) {
				database.ref("people/" + playerID + "/y").set(snapshot.val() + 10);
			});
		}
		if (event.keyCode == 68) { // d keycode
			database.ref("people/" + playerID + "/x").once("value").then(function(snapshot) {
				database.ref("people/" + playerID + "/x").set(snapshot.val() + 10);
			});
		}
	});
}


/* Example (this one happens one time):

database.ref("people/chara").once("value").then(function(snapshot) {
	Your code goes here
	to get the value it's snapshot.val()
});

*/



/* Example (this one runs every time the value changes of "peopleOnline"):

database.ref("peopleOnline").on("value", function(snapshot) {
	Your code goes here
	to get the value it's snapshot.val()
});

*/