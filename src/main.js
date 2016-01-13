// import "babel-polyfill";

import Vue from 'vue'
Vue.config.debug = true;

import Router from 'vue-router'
import './main.styl'
import VK from './vk.service'
// import { domain, fromNow } from './filters'
import App from './components/App.vue'
import AudiosSection from './components/AudiosSection.vue'
import UserSection from './components/UserSection.vue'
import GroupSection from './components/GroupSection.vue'
// import ItemView from './components/ItemView.vue'
// import UserView from './components/UserView.vue'

// install router
window.Vue = Vue;
Vue.use(Router)

// register filters globally
// Vue.filter('fromNow', fromNow)
// Vue.filter('domain', domain)

// routing
var router = new Router({history: true});

router.map({
  '/user/:id/:entity': { component: UserSection},
  '/club/:id/:entity': { component: GroupSection},
  '/audios/': { component: AudiosSection}
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

document.addEventListener('click', (e) => {
  var $el = e.target;
  if($el.tagName === 'A') {
    if($el.hostname === location.hostname && !$el.hash && !$el.target) {
      e.preventDefault();
      router.go({path: $el.getAttribute('href')})
    }
  }
});

router.redirect({
  '/user/:id': '/user/:id/posts',
  '/club/:id': '/club/:id/posts',
  '/user': '/user/' + VK.userId,
  // '*': '/audios/'
})

router.start(App, '#app')