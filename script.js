const app = {};

app.apiUrl = 'https://api.spotify.com/v1/';

// Allow the user to enter some names
app.events = function() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    $('.loader').toggleClass('show');
    let artists = $('input[type=search]').val();
    artists = artists.split(','); // Create array
    let search = artists.map((artistName) => app.searchArtist(artistName));

    app.retrieveArtistInfo(search);

  });
};

// Get the artists from Spotify
app.searchArtist = (artistName) => $.ajax({
  url: `${app.apiUrl}/search`,
  method: 'GET',
  dtaType: 'json',
  data: {
    type: 'artist',
    q: artistName
  }
});

// Get albums by id
app.getArtistAlbums = (artistId) => $.ajax({
  url: `${app.apiUrl}/artists/${artistId}/albums`,
  method: 'GET',
  dataType: 'json',
  data: {
    album_type: 'album'
  }
});

// Get tracks
app.getArtistTracks = (id) => $.ajax({
  url: `${app.apiUrl}/albums/${id}/tracks`,
  method: 'GET',
  dataType: 'json'
});

// Build playlist
app.buildPlayList = function(tracks) {
  $.when(...tracks)
    .then((...tracksResults) => {
      tracksResults = tracksResults.map(getFirstElement)
        .map(item => item.items)
        .reduce(flatten, [])
        .map(item => item.id);

      const randomTracks = [];
      for (let i = 0; i < 30; i++) {
        randomTracks.push(getRandomTrack(tracksResults));
      }
      const baseUrl = `https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:${randomTracks.join()}`;

      $('.loader').toggleClass('show');
      $('.playlist').html(`<iframe src="${baseUrl}" height="400"></iframe>`);

    });
};

app.retrieveArtistInfo = function(search) {
  $.when(...search)
      .then((...results) => {
        results = results.map(getFirstElement)
          .map(res => res.artists.item[0].id)
          .map(id => app.getArtistAlbums(id));

        app.retrieveArtistTracks(results);
      });
};

app.retrieveArtistTracks = function(artistAlbums) {
  $.when(...artistAlbums)
    .then((...albums) => {
      let albumIds = albums.map(getFirstElement)
        .map(res => res.items)
        .reduce(flatten, [])
        .map(album => album.id)
        .map(ids => app.getArtistTracks(ids));
      app.buildPlayList(albumIds);
    });
};

const getFirstElement = (item) => item[0];

const flatten = (prev, curr) => [...prev, ...curr];

const getRandomTrack = (trackArray) => {
  const randomNum = Math.floor(Math.random() * trackArray.length);
  return trackArray[randomNum];
};

app.init = function() {
  app.events();
};

$(app.init);
