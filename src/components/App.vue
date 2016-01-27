<script lang="babel">
import Vue from 'vue';
import Player from './Player.vue'
import Alerts from './Alerts.vue'
import MenuLeft from './MenuLeft.vue'
// import ModalComponent from './Modal.vue'
import LfmArtist from './LfmArtist.vue';
import VK from '../vk.service';
import LastFM from '../lastfm.service';
import player from '../player.service';

Vue.directive('audio-current', {
  bind () {
    this.vm.$route.router.afterEach(this.onRouterAfterEach.bind(this));
    this.vm.$on('player:current-audio-is-on-page', () => {this.update(this.lastAudioId)})
  },
  onRouterAfterEach (transition) {
    setTimeout(() => {this.update(this.lastAudioId)}, 1000);
  },
  update (curAudioId, oldAudioId) {
    console.log('current audio id:', curAudioId)
    var $old, $now;
    if(!this.el)
      return;
    if(oldAudioId && ($old = this.el.querySelector('.aid-'+oldAudioId)))
      $old.classList.remove('playing');
    this.lastAudioId = curAudioId;
    if(curAudioId && ($now = this.el.querySelector('.aid-'+curAudioId))) {
      $now.classList.add('playing');
      console.log('audio-current found: ', $now)
    }
  }
});

export default {
  name: 'App',
  replace: false,
  components: {Alerts, Player, MenuLeft, LfmArtist},
  data () {
    return { 
      authed: VK.authed, 
      currentAudio: player.audioInfo,
      menuLeftToggled: false,
      lfmData: null,
    }
  },
  methods: {
    vkAuth: VK.auth,
    lfmAuth: LastFM.auth,
  },
  computed: {
    isAuthed () {
      return VK.authed;
    }
  },
  created () {
    this.$route.router.beforeEach(()=>{
      this.menuLeftToggled = false;
    });
    this.$on('lfm:show', (d) => {
      this.lfmData = d;
    });
    window.App = this;
  }
}

</script>
<template lang="jade">

menu-left
#wrapper(:class="{'menu-left-toggled': menuLeftToggled}")
  button.menu-left-toggle(@click="menuLeftToggled = !menuLeftToggled") menu-left
  .splash-start(v-show="!isAuthed")
    button(@click="vkAuth") vk auth
    button(@click="lfmAuth") lastfm auth
  router-view(v-audio-current="currentAudio.id", keep-alive)
  player
  alerts


</template>
<style lang="stylus">

#wrapper
  absolute: left right bottom top
  // overflow: hidden
  transition: .2s transform
  z-index: 10

// section > ul
//   absolute: top left right bottom
//   overflow-y: auto
//   background: white
//   padding: 56px 0

section
  // background: #46454D
  background: white
  color: #333
  //background-color: rgb(77,77,77)
  padding-top: 55px
  padding-bottom: 120px
  absolute: top left right bottom
  overflow-y: auto
  overflow-x: hidden

  header
    top: 0;
    min-height: 56px;
    font-size: 19px;
    opacity: .92;
    position: fixed;
    width: 100%;
    // padding-left: 50px;
    background: rgba(255,255,255, .85)
    z-index: 200;

    transform: translateY(0px);
    transition: .2s transform;
    
    box-shadow: 0 9px 6px -10px

.header-search, .header-profile
  padding-left: 72px
  line-height: 59px

//  header.scrolled-down
//    transform: translateY(-70px);

  input.search
    display: block
    margin: 0 auto 20px
    width: 300px
    padding: 9px
    border: 1px solid #eee
    position: relative
    top: 20px
    font-size: 20px

.splash-start
  absolute: top left right bottom
  background: #606060
  line-height: 100%
  text-align: center
  padding-top: 45%
  z-index: 500

  button
    height: 46px
    font-size: 19px
    color: #DCDCDC
    padding: 0 24px
    line-height: 46px
    border-radius: 3px
    background: #00A2EA

.menu-left-toggle
  absolute: left -40px top 20px
  z-index: 230
  padding: 10px
  background: white

.menu-left-toggled
  transform: translateX(288px)

//@media screen and (min-width: 900px)
//  #wrapper
//    // padding-left: 320px
//    margin-left: 320px

</style>