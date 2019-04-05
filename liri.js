//required modules 
require("dotenv").config();

var fs = require("fs");
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
//arguments
var nodeArgs = process.argv;
var command = process.argv[2];
var value = process.argv[3];

// switch cases for commands

switch (command) {

  case "spotify-this-song":
    song();
    break;

  case "movie-this":
    movie();
    break;

  case "concert-this":
    concert();
    break;

  case "do-what-it-says":
    doIt();
    break;

  default:
    console.log("\nThat command does not exist!\n");
    console.log("The available commands are: " + "concert-this " + ", " + "spotify-this-song " + "," + " movie-this " + "and" + " do-what-it-says")
}

//spotify
function song(songs) {
  var songName = "";
  if (value) {
    songName = nodeArgs.slice(3).join("+");
  } else {
    songName = 'The Sign';
  }
  spotify.search({
      type: 'track',
      query: songName
    },
    function (err, data) {
      if (err) {
        console.log('Error occurred: ' + err);
        return;
      }

      var songInfo = data.tracks.items[0];
      // if there are multiple artists on song
      var artistName = data.tracks.items[0].artists[0].name;
      for (i = 1; i < songInfo.artists.length; i++) {
        if (songInfo.artists.length > 1) {
          if (data.tracks.items[0].artists.length > 1) {
            artistName = artistName + ", " + data.tracks.items[0].artists[i].name;
          }

        }
      }
      console.log("---------Your Song--------------");
      console.log("Artist(s): " + artistName);
      console.log("Song Name: " + songInfo.name);
      console.log("Preview Link: " + songInfo.preview_url);
      console.log("Album: " + songInfo.album.name);
      logIt();
    });
}

//OMBd
function movie() {
  var movieName = "";
  if (value) {
    movieName = nodeArgs.slice(3).join("+")
  } else {
    movieName = 'mr nobody';
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!")
    console.log("---------Your Movie--------------");
  }

  axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy&tomatoes=true").then(
    function (response) {
      // console.log(response);
      console.log("---------Your Movie--------------");
      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.tomatoRating);
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
      logIt();
    }
  );
}
//Concert 
function concert() {
  var band = "";
  if (value) {
    band = nodeArgs.slice(3).join(" ");
  } else {
    console.log('Error');
  }
  axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(
    function (response) {
      console.log("---------Your Concert--------------");
      console.log("Venue:  " + response.data[0].venue.name);
      console.log("Date & Time: " + moment(response.data[2].datetime).format("MM/DD/YYYY, h:mm a"));
      console.log("City: " + response.data[0].venue.city);
      console.log("State: " + response.data[0].venue.region);
      console.log("Country: " + response.data[0].venue.country);
      logIt();
    }
  )
}

//reads the file random.txt and executes the command in that file
function doIt() {
  if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var dataArr = data.split(",");

      }

      //logIt();
    })
  }
}


//saves command and user query to log.txt 
function logIt() {
  var log = (command + ": " + value + ", " + "\n")
  fs.appendFile("log.txt", log, function (err) {
    if (err) {
      console.log(err);
    } else {}
  })
}