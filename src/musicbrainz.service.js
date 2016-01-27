import {$http} from './utils';
// http://musicbrainz.org/ws/2/release/db6705c1-7e7c-4497-ae08-12b7d22ab4e2?fmt=json&inc=recordings
class MB {
  _request (opts) {
    opts.search && opts.search.push('fmt=json');
    opts.url = 'http://musicbrainz.org/ws/2/' + opts.url;
    return $http(opts).catch(this.onError);
  }
  getAlbum (mbid) {
    return this._request({url: 'release/' + mbid, search: ['inc=recordings']}).then((d) => {
      var _d = {};
      if(d['release-events'])
        _d.date = d['release-events'][0].date;
      // if(d.media) {
      //   _d.tracks = [];
      //   d.media.forEach((m) => {
      //     _d.tracks.push.apply(_d.tracks, m.tracks);
      //   });
      // }
      return _d;
    })
  }
  onError (d) {
    console.error(':: musicbrainz error: ', d);
    return d;
  }
}

export default new MB;