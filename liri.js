// Various requires for the commands
require("dotenv").config();
// Require for reading random.txt
var fs = require("fs");
// Require for twitter
var Twitter = require('twitter');
// Require for Spotify
var Spotify = require('node-spotify-api');
// Require for request node
var request = require('request');
// Code required to import the keys.js file
var keys = require('./keys.js');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Take in user input and save it to a variable
var command = process.argv[2];
// Stores all elements in an array
var nodeArgs = process.argv
// Creates a blank variable to save the user request
var userRequest = "";
// Loop through all the words in the node argument

for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    userRequest = userRequest + "+" + nodeArgs[i];
  } else {
    userRequest += nodeArgs[i];
  }
}

// Create a function if the user types in my-tweets
function myTweets(){
	console.log("My Tweets")
	var params = {screen_name: 'mycodingbootcam'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
 		if (!error) {
    		for (var i=0; i<20; i++){
        		console.log("Tweet Body: " + tweets[i].text)
        		console.log("Created at :" + tweets[i].created_at + "\n")
			};
		};
	});
};

// Create a function if the user types movie-this
function movieThis(movieInput){
	console.log("Movie Request");
	if (movieInput === "") {
		var queryUrl = "http://www.omdbapi.com/?i=tt3896198&apikey=trilogy&t=Mr.+Nobody";
	}else{
		var queryUrl = "http://www.omdbapi.com/?i=tt3896198&apikey=trilogy&t=" + movieInput;
	};
	var movieStuff = request(queryUrl, function(error, response, body){;
		console.log("Title: " + JSON.parse(body).Title);
		console.log("Year: " + JSON.parse(body).Year);
		console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		var ratingsArray = JSON.parse(body).Rating
		console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value)
		console.log("Country it was made in: " + JSON.parse(body).Country);
		console.log("Languages it's available in: " + JSON.parse(body).Language);
		console.log("Plot: " + JSON.parse(body).Plot);
		console.log("Actors: " + JSON.parse(body).Actors);
		console.log(userRequest)
});
}
// Create a function to spotify songs
function spotifyThis(songInput){
	if (songInput === "") {
  		songInput = "the+sign";
  	}
	spotify.search({ type: 'track', query: songInput, limit: 1 }, function(err, data) {
  	if (err) {
    return console.log('Error occurred: ' + err);
  	}

// Log the data from spotify in the terminal
	console.log(data.tracks.items[0].artists[0].name);
	console.log(data.tracks.items[0].name);
	console.log(data.tracks.items[0].preview_url);
	console.log(data.tracks.items[0].album.name);
	});
};
// Create a function to read what is written in the random.
function doWhatItSays(){
	// Reads the random.txt file
	fs.readFile("random.txt", "utf8", function(err, data){
		if (err) {
			return console.log(err);
		};
		// Takes the data from the random.txt file and creates an array
		data = data.split(", ");
		command = data[0];
		if (data[1]===false) {
			userRequest = ""
		}else{
		userRequest = data[1];
		}	
		userCommand();
	});
};
// Creates a function to read what the user command is and then executes the correct function
function userCommand(){
	if (command === "my-tweets") {
		myTweets();
	}else if(command === "movie-this"){
		movieThis(userRequest);
	}else if(command === "spotify-this-song"){
		spotifyThis(userRequest);
	}else if(command === "do-what-it-says"){
		doWhatItSays();
	};
};
// Runs userCommand function in order to start the file.
userCommand();