const app = {};

app.apiUrl = 'https://api.spotify.com/v1/search';

// Allow the user to enter some names
app.events = function() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    let artists = $('input[type=search]').val();
    artists = artists.split(','); // Create array
    let search = artists.map((artistName) => app.searchArtist(artistName));

    $.when(...search)
      .then((...results) => {
        results = results.map(res => res[0].artists.items[0].id);
        console.log(results);
      });

  });
};

// Get the artists from Spotify
app.searchArtist = (artistName) => $.ajax({
  url: `${app.apiUrl}/search`,
  method: 'GET',
  dtaType: 'json',
  data: {
    q: artistName,
    type: 'artist'
  }
});

// Get albums by id
/* app.getArtistAlbums = (artistId) => $.ajax({
  url: 'GET',
  dataType: 'json',
  data: {
    album_type: 'album'
  }
});*/

// Get tracks

// Build playlist

app.init = function() {
  app.events();
};

$(app.init);
