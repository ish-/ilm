// import "babel-polyfill";

import Vue from 'vue'
Vue.config.debug = true;


////// SERVICES
import Router from 'vue-router'
import './main.styl'
import VK from './vk.service'
import LastFM from './lastfm.service'
// import { domain, fromNow } from './filters'

////// COMPONENTS
import App from './components/App.vue';
// import AudiosSection from './components/AudiosSection.vue';
import UserSection from './components/UserSection.vue';
import LfmArtist from './components/LfmArtist.vue';
import LfmTrackList from './components/LfmTrackList.vue';
import LfmAlbumList from './components/LfmAlbumList.vue';
import LfmAlbum from './components/LfmAlbum.vue';
import Search from './components/Search.vue';
import VkAudioList from './components/AudioList.vue';
import VkPostList from './components/PostList.vue';
import GroupSection from './components/GroupSection.vue';
// import ItemView from './components/ItemView.vue'
// import UserView from './components/UserView.vue'


///// MIXINS
import RouteDataVkEntityList from './components/mixins/RouteDataVkEntityList';

///// FILTERS
import './filters/audioDuration';

// install router
window.Vue = Vue;
Vue.use(Router)

// register filters globally
// Vue.filter('fromNow', fromNow)
// Vue.filter('domain', domain)

// routing
var router = new Router({history: true, saveScrollPosition: true});

router.map({
  '/user/:userId': {
    component: UserSection, name: 'user',
    subRoutes: {
      '/posts': { component: VkPostList, name: 'user-posts' },
      '/audios': { name: 'user-audios',
        component: VkAudioList.extend({mixins: [RouteDataVkEntityList]}) },
      // '/audios': { component: Audios, name: 'audios' },
    }
  },
  // '/user/:id/:entity': { component: UserSection, name: 'user'},
  '/club/:id/:entity': { component: GroupSection, name: 'group'},
  // '/artist/:artist/:album': { component: LfmArtist, name: 'lfm-artist-album'},
  '/artist/:artistName': {
    name: 'lfm-artist',
    component: LfmArtist,
    subRoutes: {
      '/tracks': { component: LfmTrackList, name: 'lfm-artist-tracks' },
      '/albums': { component: LfmAlbumList, name: 'lfm-artist-albums' },
      '/album/:albumName': { component: LfmAlbum, name: 'lfm-artist-album' },
    }
  },
  // '/artist/:artist/album/:album': { component: LfmArtist, name: 'lfm-artist-album'},
  // '/artist/:artist/:entity': { component: LfmArtist, name: 'lfm-artist'},
  // '/audios/': { component: AudiosSection, name: 'audios'}
  '/search': { component: SearchSection, name: 'search'}
})

router.beforeEach(function (trns) {
  console.dir(trns);
  trns.next();
});
// router.afterEach(function (transition) {
//   console.log(transition)
// })

document.addEventListener('click', (e) => {
  var $el = e.target;
  if($el.tagName === 'A') {
    if($el.hostname === location.hostname && !$el.hash && !$el.target) {
      e.preventDefault();
      router.go({path: $el.getAttribute('href')})
    }
  }
});
// console.log(VK.userId);
router.redirect({
  '/user/:id': '/user/:id/posts',
  '/user': '/user/' + VK.userId + '/posts',
  '/artist/:artist/': '/artist/:artist/tracks',
  '/club/:id': '/club/:id/posts',
  '*': '/search/'
})

router.start(App, '#app')