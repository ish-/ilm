import LastFM from '../lib/lastfm.api';
import {storage} from './utils';
// import LastFMCache from '../lib/lastfm.api.cache';
import MB from './musicbrainz.service';
import {arrFind} from './utils';
import alerts from './alerts.service';

// var cache = new LastFMCache();

const API_KEY = 'f21088bf9097b49ad4e7f487abab981e';
const API_SECRET = '7ccaec2093e33cded282ec7bc81c6fca';
const TOKEN_STORAGE_KEY = 'lfm-token';
const SESSION_KEY_STORAGE_KEY = 'lfm-session-key';
var SESSION_KEY;
var USER_TOKEN;

/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : API_KEY,
  apiSecret : API_SECRET,
  // cache     : cache
});

// /* Load some artist info. */
// lastfm.artist.getInfo({artist: 'The xx'}, {success: function(data){
//   console.log(data);
// }, error: function(code, message){
//   /* Show error message. */
// }});

console.log(location.search);
var cachedArtist = {};

function clearLfmTrack (track) {
  track.artist = track.artist.name;
  delete track.streamable;
  delete track.url;
  delete track['@attr'];
  return track;
}

function setLfmImage (artist) {
  var images = {};
  for(var i = 0, l = artist.image.length; i < l; i++) {
    var image = artist.image[i];
    if(!image.size || !image['#text'])
      continue;
    images[image.size] = image['#text'];
  }
  artist.image = images;
  return artist;
}

class _LastFM {
  constructor () {
    this.name = '';
    USER_TOKEN = storage.get(TOKEN_STORAGE_KEY) || this.checkRedirectLocation();
    this.authed = !!USER_TOKEN;
    SESSION_KEY = storage.get(SESSION_KEY_STORAGE_KEY);
    if(!SESSION_KEY && USER_TOKEN)
      this.setSession();
  }
  setSession () {
    lastfm.auth.getSession({token: USER_TOKEN}, {success: ({session}) => { 
      this.name = session.name;
      SESSION_KEY = session.key;
      this.authed = true;
      storage.set(SESSION_KEY_STORAGE_KEY, SESSION_KEY);
    }});
  }
  checkRedirectLocation () {
    var matched, token;
    var str = location.search;
    if(!str)
      return false;
    if(str && (matched = str.match(/token=([\w\d]+)/))) {
      storage.set(TOKEN_STORAGE_KEY, matched[1]);
      return matched[1];
    }
  }
  auth () {
    location.href = `http://www.last.fm/api/auth?api_key=${API_KEY}&cb=http://ilm.dev/`;
  }
  getArtist (artist) {
    if(cachedArtist.name === artist)
      return Promise.resolve(artist);
    return Promise.all([
      this.request('artist', 'getInfo', {artist}),
      this.request('artist', 'getTopTracks', {artist}),
    ]).then((d) => {
      if(d[0] === 6) {
        console.error('artist not found');
        return Promise.reject('artist not found');
      }
      return d;
    }).then(([
        {artist: artist}, 
        {toptracks: {track: tracks}}, 
      ]) => { 
      // console.log(artist);
      artist.bio = artist.bio.content;
      setLfmImage(artist);
      // artist.similars = artist.similar.artist;
      delete artist.similar;
      artist.tags = artist.tags.tag;
      tracks.forEach(clearLfmTrack);
      artist.tracks = tracks;
      artist.tracks.$maxListeners = +tracks[0].listeners
      cachedArtist = artist;
      return artist;
    });
  }

  getArtistSimilars (artist) {
    return this.request('artist', 'getSimilar', {artist, limit: 30})
      .then(d => d.similarartists.artist.map(setLfmImage));
  }

  searchArtist (artist) {
    return this.request('artist', 'search', {artist})
      .then(d => d.results.artistmatches.artist.map(setLfmImage));
  }

  scrobble (opts) {
    opts.sk = SESSION_KEY;
    return this.request('track', 'scrobble', opts);
  }

  getArtistAlbums (artist) {
    if(cachedArtist.name === artist && !!cachedArtist.albums)
      return Promise.resolve(cachedArtist.albums);
    return this.request('artist', 'getTopAlbums', {artist})
      .then(({topalbums: {album: albums}}) => {
        if(albums.length){
          albums.sort((a, b) => {
            return a.playcount > b.playcount ? -1 : 1;
          });
          albums.$maxPlaycount = albums[0].playcount;
          albums.forEach((album) => {
            album.tracks = null;
            setLfmImage(album);
            if(album.mbid) {
              album.date = '..loading';
              MB.getAlbum(album.mbid).then((d)=>{
                // console.log('mb ans', d)
                // album.tracks = d.tracks;
                album.date = d.date || 'error :(';
              });
            }
          });
          cachedArtist.albums = albums;
        }
        return albums;
      });
  }

  getAlbum (opts) { // {artist, album} || {mbid}
    return this.request('album', 'getInfo', opts).then(({album}) => {
      console.log(album);
      if(cachedArtist.name === album.artist) {
        delete album.wiki;
        album.tags = album.tags.tag;
        album.tracks = album.tracks.track;
        album.tracks.$maxListeners = 0;
        album.tracks.forEach((track) => {
          var cachedTrack = arrFind(cachedArtist.tracks, (_track) => _track.name === track.name);
          track.playcount = cachedTrack ? +cachedTrack.playcount : 0;
          album.tracks.$maxListeners = Math.max(album.tracks.$maxListeners, track.playcount);
          clearLfmTrack(track);
        })
      }
      return album;
    });
  }

  request (entity, method, query) {
    query.autocorrent = 1;
    return new Promise(function(resolve, reject){
      if(!lastfm[entity] || !lastfm[entity][method]) {
        console.error('LastFM: bad entity/method', entity, method);
        reject('LastFM: bad entity/method');
      }
      lastfm[entity][method](query, {success: resolve, error: (d) => {
        if(!d || isFinite(d)) {
          alerts.add({type: 'LastFM Service', text: 'Unexpected problems.'})
          return reject(null);
        }
      }});
    });
  }
}

var lfm = window._lfm = new _LastFM;
window._lfm._ = lastfm;

export default lfm;