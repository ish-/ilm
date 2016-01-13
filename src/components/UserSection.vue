<script lang="babel">
import Vue from 'vue';
import {throttle} from '../utils';
import VK from '../vk.service';
import Audios from './AudioList.vue';
import Posts from './PostList.vue';
import Friends from './FriendList.vue';

// const DEFAULT_ENTITY = 'posts';

export default {
  components: { Audios, Posts, Friends },
  data () {
    return {items: [], id: 0, entity: '', user: {},}
  },
  route: {
    data (route) { 
      var req;
      var id = this.id = route.to.params.id;
      var entity = route.to.params.entity || 'posts';

      this.items = [];

      console.log(this);
      // this.getAudios()

      if(entity === 'posts') req = this.getWall(id);
      else if (entity === 'audios') req = this.getAudios(id);
      else if (entity === 'friends') req = this.getFriends(id);

      if(!req)
        return;
      this.entity = entity;

      return {items: req}
    },
  },
  methods: {
    getAudios: (id) => VK.getAudios(id),
    getWall: (id) => VK.getWall(id),
    getFriends: (id) => VK.getFriends(id),
    getUser: (id) => VK.getUsers(id),
    onEndClose: () => console.log('closeeee!'),
  },
  created () {
    this.getUser(this.$route.params.id).then(user => this.user = user)
  }
}

Vue.directive('detect-scroll', {
    params: ['onEndClose'],
    bind () {
      this.throttledOnScroll = throttle(this.onScroll, 500, this);
      this.el.addEventListener('scroll', this.throttledOnScroll);
    },
    onScroll (e) {
      var $el = this.el;
      if($el.scrollHeight - $el.offsetHeight - 500 < $el.scrollTop)
        this.params.onEndClose();
    },
    // update () {
    //   console.log(this.params);
    // },
    unbind () {

    }
});

</script>
<template lang="jade">

section.user-section(v-detect-scroll, :onEndClose="onEndClose")
  header 
    .user-name {{user.first_name}} {{user.last_name}}
    img.user-avatar(:src="user.photo_100")
  .user-entity
    button.user-entity-audios(v-link="{path: '/user/' + id + '/audios'}") Audios
    button.user-entity-posts(v-link="{path: '/user/' + id + '/posts'}") Posts
    button.user-entity-groups(v-link="{path: '/user/' + id + '/groups'}") Groups
    button.user-entity-friends(v-link="{path: '/user/' + id + '/friends'}") Friends
  .loading-beach(v-show="$loadingRouteData") ...loading beach
  div(v-if="items.length", transition="fade")    
    div(:is="entity", :items="items", transition="fade")
  //- post-list(:posts="items", v-if="entity === 'posts' && items.length", transition="fade")
  //- audio-list(:audios="items", v-if="entity === 'audios' && items.length", transition="fade")
  //- friend-list(:friends="items", v-if="entity === 'friends' && items.length", transition="fade")

</template>
<style lang="stylus">

.fade-transition
  transition: all .5s;
  opacity: 1
  transform: translateY(0px)
.fade
  &-enter, &-leave
    transform: translateY(-100px)
    opacity: 0

.user-section
  background: black
  // min-height: 100%

  .user-name
    display: inline-block

  .user-avatar
    absolute: right
    height: 100%

.user-entity 
  text-align: center
  button
    // border-radius: 2px
    opacity: .9
    transition: .2s width
    line-height: 108px
    color: white
    size: 20% 73px
    background: #4C4C4C
    font-size: 20px
    text-align: center
    border-right: 1px solid #616161

    &:hover, &:active
      opacity: 1
    // margin: 20px 10px 0

    &.v-link-active
      width: 40%
      text-align: right
      padding-right: 10px
      background: #616161
      // display: none
</style>