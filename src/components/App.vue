<script lang="babel">
import Vue from 'vue';
import Player from './Player.vue'
import Alerts from './Alerts.vue'
import MenuLeft from './MenuLeft.vue'
// import ModalComponent from './Modal.vue'
// import Modal from './Modal.vue';
import ModalsContainer from './ModalsContainer.vue';
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
  getAudioId (audio) {
    return (audio && audio.$playable && audio.$playable.id) || audio || 0;
  },
  update (curAudio, oldAudio) {
    var curAudioId = this.getAudioId(curAudio),
        oldAudioId = this.getAudioId(oldAudio);
    if(!curAudio)
      return;
    console.log('current audio id:', curAudioId)
    var $old, $now;
    if(!this.el)
      return;
    if(oldAudioId && ($old = this.el.querySelectorAll('.aid-'+oldAudioId)) && $old.length)
      Array.prototype.forEach.call($old, ($el) => $el.classList.remove('playing'));
    this.lastAudioId = curAudioId;
    if(curAudioId && ($now = this.el.querySelectorAll('.aid-'+curAudioId)) && $now.length) {
      Array.prototype.forEach.call($now, ($el) => $el.classList.add('playing'));
      console.log($now);
    }
  }
});

export default {
  name: 'App',
  replace: false,
  components: {Alerts, Player, MenuLeft, LfmArtist, ModalsContainer},
  data () {
    return { 
      vk: VK, 
      player: player,
      menuLeftToggled: false,
    }
  },
  methods: {
    vkAuth: VK.auth,
    lfmAuth: LastFM.auth,
  },
  created () {
    this.$route.router.beforeEach(()=>{
      this.menuLeftToggled = false;
    });
    window.App = this;
  }
}

</script>
<template lang="jade">

menu-left(v-show="menuLeftToggled")
//- #vk_api_transport
.splash-start(v-show="!vk.authed")
  button.btn-auth(@click="vkAuth") Auth with VK.com
#wrapper(
    :class="{'menu-left-toggled': menuLeftToggled}", 
    v-if="vk.authed", 
    v-audio-current="player.audioInfo")
  button.menu-left-toggle(@click="menuLeftToggled = !menuLeftToggled") menu-left
  router-view(v-if="vk.authed", keep-alive, transition="translateX")
  player
  alerts
modals-container
  //- modal(v-if="showLfmTracksModal")


</template>
<style lang="stylus">

#wrapper
  absolute: left right bottom top
  transition: .2s transform
  z-index: 10

section
  background: white
  color: #333
  size: 100%

  header
    min-height: 56px
    font-size: 19px
    fixed: top left right
    width: 100%
    background: rgba(76,76,76,.92)
    z-index: 200
    color: white

    transform: translateY(0px)
    transition: .2s transform
    
    box-shadow: 0 0 3px 0 black

  .scrollable-y
    padding: 62px 0 92px

.header-search, .header-profile
  padding-left: 72px
  height: 56px

.header-profile
  display: flex
  align-items: center

  .full-width
    flex-grow: 1

//  header.scrolled-down
//    transform: translateY(-70px)

  input.search
    // display: block
    // margin: 0 auto 20px
    min-width: 300px
    padding: 9px
    border-radius: 3px
    // border: 1px solid #eee
    // position: relative
    // top: 20px
    font-size: 20px

.splash-start
  absolute: top left right bottom
  background: #606060
  line-height: 100%
  text-align: center
  padding-top: 45%
  z-index: 500

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