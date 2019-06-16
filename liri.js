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
var getArtistNames = function (artist) {
  return artist.name;
};

function song() {
  var songName = "";
  if (value) {
    songName = nodeArgs.slice(3).join("+");
  } else if(!value) {
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
      var songs = data.tracks.items;
logIt()
      for (var i = 0; i < songs.length; i++) {

        console.log("************Your Songs*************")
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
        
      }
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
    }
  );
}
//Concert 
function concert(band) {
  var band = "";
  if (value) {
    band = nodeArgs.slice(3).join(" ");
  } else {
    console.log('No results found for ' + value);
    return;
  }
  axios.get("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp").then(
    function (response) {
      const jsonData = response.data;

      for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

        // If a concert doesn't have a region, display the country instead
        console.log("The concert will be in " + show.venue.city + "," +
          (show.venue.region || show.venue.country) + " at " + show.venue.name + " " +
          moment(show.datetime).format("MM/DD/YYYY")
        )
      }
    })
};

//reads the file random.txt and executes the command in that file
function doIt() {
  if (command === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {
      //console.log(data);
      var dataArr = data.split(",");
      console.log(dataArr)
    
      if (dataArr[0] === "spotify-this-song"){ 
        song(dataArr[1]);
    }
    });
  }
}
