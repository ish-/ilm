<script lang="babel">
import Vue from 'vue';
import VK from '../vk.service';
// import Audios from './AudioList.vue';
// import Posts from './PostList.vue';
// import Friends from './FriendList.vue';

import '../directives/detectScroll';

// const DEFAULT_ENTITY = 'posts';

export default {
  // components: { Audios, Posts, Friends },
  name: 'UserSection',
  data () {
    return {userId: false, entity: '', user: {}}
  },
  // route: {
  //   data (transition) { 
  //     this.id = transition.to.params.id;

  //     this.saveScroll();

  //     var entity = transition.to.params.entity || 'posts';
  //     if(entity === this.entity && this.items.length)
  //       return transition.next();
  //     this.entity = entity;
  //     this.loadScroll();
  //     this.items.length = 0;
  //     // return {items: this.getEntityMethod()};
  //     return {items: this.getEntityMethod()};
  //   },
  //   activate () { this.loadScroll() },
  //   deactivate () { this.saveScroll() },
  // },
  route: {
    data (trns) {
      // console.log('UserSection route.data()', trns.to);
      var userId = trns.to.params.userId;
      var routeName = trns.to.name;
      if(this.userId === userId) {
        this.loadScroll(routeName);
        return trns.next();
      }
      this.routeName = routeName;
      this.userId = userId;
      this.scrollTop = {};
      this.user = {};

      return {user: VK.getUsers(this.userId)};
    },
    deactivate () {
      this.scrollTop[this.routeName] = this.$el.scrollTop;
    }
  },
  methods: {
    loadScroll (routeName) {
      this.scrollTop[this.routeName] = this.$el.scrollTop;
      this.routeName = routeName;
      this.$nextTick(() => {
        console.log(this.$el.scrollHeight, routeName, this.scrollTop[routeName]);
        this.$log();
        this.$el.scrollTop = this.scrollTop[routeName] || 0;
      });
    },
    alert () {
      this.$dispatch('alert', (Math.random() * 500)|0)
    }
    // saveScroll () {
    //   if(this.entity)
    //     this.scrollTop[this.entity] = this.$el.scrollTop;
    // },
    // getMore () {
    //   console.dir(this, this.$refs.entity);
    //   this.$nextTick(() => {
    //     this.$refs.entity.getMore();
    //   });
    //   // this.$refs.entity.getMore();
    // }
  },
  created () {
    this.scrollTop = {};
    // this.$on('scroll-end-close', ::this.getMore);
    // this.$watch('$loadingRouteData', (v) => {
    //   if(!v)
    //     return
    //   console.log('watch', this.$el.scrollHeight);
    //   this.$nextTick(() => {
    //     console.log('watch nexttick', this.$el.scrollHeight);
    //   });
    // })
    // this.getUser(this.$route.params.id).then(user => this.user = user)
  },
}

</script>
<template lang="jade">

section.user-section(v-detect-scroll)
  header.header-profile(@click="alert")
    .user-name {{user.first_name}} {{user.last_name}}
    img.user-avatar(:src="user.photo_100")
  .entity
    button.entity-audios(v-link="{name: 'user-audios', params: {userId: userId}}") Audios
    button.entity-posts(v-link="{name: 'user-posts', params: {userId: userId}}") Posts
    //- button.entity-groups(v-link="{name: 'user', params: {id: id, entity: 'groups'}}") Groups
    //- button.entity-friends(v-link="{name: 'user', params: {id: id, entity: 'friends'}}") Friends
  .loading-beach(v-show="$loadingRouteData") ...loading beach
  router-view(v-ref:entity, keep-alive)
  //- div(v-if="items.length", transition="fade")    
  //-   div(:is="entity", :items="items", transition="fade")
  //- post-list(:posts="items", v-if="entity === 'posts' && items.length", transition="fade")
  //- audio-list(:audios="items", v-if="entity === 'audios' && items.length", transition="fade")
  //- friend-list(:friends="items", v-if="entity === 'friends' && items.length", transition="fade")

</template>
<style lang="stylus">

.translateX
  &-transition
    transition: all .5s;
    opacity: 1
    transform: translateX(0px)
  &-enter
    transform: translateX(100px)
    opacity: 0
  &-leave
    opacity: 0;
    transform: translateX(-100px)


.fade-transition
  transition: all .5s;
  opacity: 1
  transform: translateY(0px)
.fade
  &-enter, &-leave
    transform: translateY(-100px)
    opacity: 0

.user-section
  // background: black
  // min-height: 100%

  .user-name
    display: inline-block
    font-size: 21px
    font-family: Tahoma
    padding-right: 70px
    float: right

  .user-avatar
    absolute: right
    height: 100%

.entity 
  text-align: center
  button
    // border-radius: 2px
    opacity: .92
    transition: .2s width
    line-height: 56px
    color: #333
    size: 20% 56px
    background: white
    font-size: 18px
    text-align: center

    &:hover, &:active
      opacity: 1
    // margin: 20px 10px 0

    &.v-link-active
      opacity: 1
      width: 40%
      text-align: right
      padding-right: 10px
      border-bottom: 5px solid #15EAA2;
      // display: none
</style>