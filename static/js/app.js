// Initialize Firebase
 var config = {
    apiKey: "AIzaSyCDZyk63nSUkkt9Z6m7SSqOsgzZXvjTs3M",
    authDomain: "lava-tag.firebaseapp.com",
    databaseURL: "https://lava-tag.firebaseio.com",
    projectId: "lava-tag",
    storageBucket: "",
    messagingSenderId: "852530320107"
};

firebase.initializeApp(config);
var database = firebase.database();
var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");
var playerID = "";
var collided = false;
var canTag = false;
const START_SPEED = 5;

canvas.height = 920;
canvas.width = 1920;


class GenericPlayer {
	constructor(playerColor, playerName, initx, inity, it) {
		this.color = playerColor;
		this.name = playerName;
		this.x = initx;
		this.y = inity;
		this.it = it;
		this.direction = 90;
	}
}

var player;
var timeUntilFire = 2;
var keys = { 
	length: 0 
}
var sprinting = false;
var stepsMoved = 0;

var names = {
	"Alpha": true,
	"Bravo": true,
	"Charlie": true,
	"Delta": true,
	"Echo": true,
	"Foxtrot": true,
	"Golf": true,
	"Hotel": true,
	"India": true,
	"Julliet": true,
	"Kilo": true,
	"Lima": true,
	"Miko": true,
	"Matt": true,
	"November": true,
	"Oscar": true,
	"Papa": true,
	"Quebec": true,
	"Romeo": true,
	"Sierra": true,
	"Tango": true,
	"Uniform": true,
	"Victor": true,
	"Whiskey": true,
	"X-ray": true,
	"Yankee": true,
	"Zulu": true
}

$(document).ready(function() {
	//database.ref("people/0").set(player);
	//database.ref("people/1").set(player2);
	//database.ref("names/").set(names);
	//$("#header").show();
	//$("#theButton").show();
	$("#Canvas").hide();
});

function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function playGame() {
	$("#header").hide();
	$("#theButton").hide();
	$("#Canvas").show();
	
	
	database.ref("names/").once("value").then(function(snapshot) {
		var playersOnline = 0;
		for (var i in snapshot.val()) {
			if (!snapshot.val()[i]) {
				playersOnline++;
			}
		}
		if (playersOnline == 3) {
			player = new GenericPlayer("red", "default", 50, 50, true);
		} else {
			player = new GenericPlayer("green", "default", 50, 50, false);
		}
		var property = pickRandomProperty(snapshot.val());
		while (!snapshot.val()[property]) {
			property = pickRandomProperty(snapshot.val());
		}
		playerID = property;
		player.name = playerID;
		
		let obj = snapshot.val();
		obj[playerID] = false;
		database.ref("names/").set(obj);
		try {
			console.log("PLAYERID - " + playerID);
			database.ref("people/" + playerID).set(player);
		}
		catch(e) {
			console.log("bad things happened");
			console.log(e);
		}
		
	});
}

document.onkeydown = function(event) {
	if (!keys[event.keyCode]) {
		keys[event.keyCode] = true;
		keys.length++;
	}

	if (keys[87] && keys.length == 1) { // w keycode
		database.ref("people/" + playerID + "/y").once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(90);
			if (snapshot.val() + 60 - (START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.height && snapshot.val() - (START_SPEED*Math.pow(1.02, stepsMoved)) > 0) {
				database.ref("people/" + playerID + "/y").set(snapshot.val() - (START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
		
	}
	if (keys[65] && keys.length == 1) { // a keycode
		database.ref("people/" + playerID + "/x").once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(180);
			if (snapshot.val() + 60 - (START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.width && snapshot.val() - (START_SPEED*Math.pow(1.02, stepsMoved)) > 0) {
				database.ref("people/" + playerID + "/x").set(snapshot.val() - (START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}
	if (keys[83] && keys.length == 1) { // s keycode
		database.ref("people/" + playerID + "/y").once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(270); 
			if (snapshot.val() + 60 + (START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.height && snapshot.val() + (START_SPEED*Math.pow(1.02, stepsMoved)) > 0) {
				database.ref("people/" + playerID + "/y").set(snapshot.val() + (START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}
	if (keys[68] && keys.length == 1) { // d keycode
		database.ref("people/" + playerID + "/x").once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(0);
			if (snapshot.val() + 60 + (START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.width && snapshot.val() + (START_SPEED*Math.pow(1.02, stepsMoved)) > 0) {
				database.ref("people/" + playerID + "/x").set(snapshot.val() + (START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}

	if (keys[87] && keys[68] && keys.length == 2) { // w + d
		database.ref("people/" + playerID).once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(45);
			if ((snapshot.val().x + 50 + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.width && snapshot.val().x + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0) && (snapshot.val().y + 50 - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.height && snapshot.val().y - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0)) {
				database.ref("people/" + playerID + "/x").set(snapshot.val().x + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
				database.ref("people/" + playerID + "/y").set(snapshot.val().y - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}

	if (keys[87] && keys[65] && keys.length == 2) { // w + a
		database.ref("people/" + playerID).once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(135);
			if ((snapshot.val().x +50 - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.width && snapshot.val().x - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0) && (snapshot.val().y + 50 - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.height && snapshot.val().y - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0)) {
				database.ref("people/" + playerID + "/x").set(snapshot.val().x - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
				database.ref("people/" + playerID + "/y").set(snapshot.val().y - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}

	if (keys[83] && keys[68] && keys.length == 2) { // s + d
		database.ref("people/" + playerID).once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(315);
			if ((snapshot.val().x +50 + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.width && snapshot.val().x + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0) && (snapshot.val().y + 50 + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.height && snapshot.val().y + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0)) {
				database.ref("people/" + playerID + "/x").set(snapshot.val().x + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
				database.ref("people/" + playerID + "/y").set(snapshot.val().y + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}

	if (keys[83] && keys[65] && keys.length == 2) { // s + a
		database.ref("people/" + playerID).once("value").then(function(snapshot) {
			database.ref("people/" + playerID + "/direction").set(225);
			if ((snapshot.val().x +50 - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.width && snapshot.val().x - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0) && (snapshot.val().y + 50 + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) < canvas.height && snapshot.val().y + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)) > 0)) {
				database.ref("people/" + playerID + "/x").set(snapshot.val().x - (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
				database.ref("people/" + playerID + "/y").set(snapshot.val().y + (Math.sqrt(2)/2)*(START_SPEED*Math.pow(1.02, stepsMoved)));
			} else {
				stepsMoved = 0;
			}
		});
	}
	
	stepsMoved++;
}

document.onkeyup = function(event) {
	if (keys[event.keyCode]) {
		keys[event.keyCode] = false;
		keys.length--;
	}
	stepsMoved = 0;
}

database.ref("names/").on("value", function(snapshot) {
	context.fillStyle = "white";
	context.clearRect(0, 0, canvas.width, canvas.height);
	database.ref("people/").once("value", function(snapshot) {
		for (var i in snapshot.val()) {
			context.fillStyle = snapshot.val()[i].color;
			context.fillRect(snapshot.val()[i].x, snapshot.val()[i].y, 50, 50);
		}
	});
});

database.ref("people/").on("value", function(snapshot) { // where collisions check + draws everything

	context.fillStyle = "white";
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var n in snapshot.val()) {
		context.fillStyle = snapshot.val()[n].color;
		context.fillRect(snapshot.val()[n].x, snapshot.val()[n].y, 50, 50);
		if (player != undefined && snapshot.val()[n].name == player.name) {
			context.fillStyle = "yellow";
			context.fillRect(snapshot.val()[n].x + 25, snapshot.val()[n].y + 25, 5, 5);
		}
		for (var i in snapshot.val()) {
			if ((Math.abs(snapshot.val()[n].x - snapshot.val()[i].x) <= 50) && (Math.abs(snapshot.val()[n].y - snapshot.val()[i].y) <= 50) && n !== i) {
				collided = true;
				if (snapshot.val()[n].it || snapshot.val()[i].it) {
					if (!collided) {
						snapshot.val()[n].it = !snapshot.val()[n].it;
						snapshot.val()[i].it = !snapshot.val()[i].it;
						canTag = true; 
					}
				}
				
			} else {
				collided = false;
			}
			if (collided && (snapshot.val()[n].it || snapshot.val()[i].it)) {
				console.log("Collided: " + collided + " - " + snapshot.val()[n].name + " & " + snapshot.val()[i].name);
				database.ref("people/" + snapshot.val()[n].name + "/it").set(true);
				database.ref("people/" + snapshot.val()[n].name + "/color").set("red");
				database.ref("people/" + snapshot.val()[i].name + "/it").set(true);
				database.ref("people/" + snapshot.val()[i].name + "/color").set("red");
				var everybodyTagged = true;
				for (var x in snapshot.val()) {
					if (!snapshot.val()[x].it) {
						everybodyTagged = false;
					}
				}

				if (everybodyTagged) {
					context.fillStyle = "black";
					context.font = "20px Times New Roman";
					context.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
					setTimeout(function() {
						database.ref("people/" + playerID).remove();
						database.ref("names/" + playerID).set(true);
						$("#Canvas").hide();
						$("#theButton").show();
						$("#header").show();
					}, 5000);
					
				}
			}
			
		}
	}
	

});

window.addEventListener("beforeunload", function(e) {
	if (playerID != "") {
		database.ref("names/" + playerID).set(true);
	}
	
	database.ref("people/" + playerID).remove();
});


/*

setInterval(function() {    
    document.body.innerHTML = "You are pressing ".concat(keys.length, " keys at the same time");
}, 500);




Example (this one happens one time):

database.ref("people/chara").once("value").then(function(snapshot) {
	Your code goes here
	to get the value it's snapshot.val()
});








Example (this one runs every time the value changes of "peopleOnline"):

database.ref("peopleOnline").on("value", function(snapshot) {
	Your code goes here
	to get the value it's snapshot.val()
});

*/
