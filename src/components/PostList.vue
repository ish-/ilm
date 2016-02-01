<script lang="babel">

import Vue from 'vue';

import AudioList from './AudioList.vue';
import VK from '../vk.service';

import '../directives/postTextSpoiler';

import '../filters/slice';
import '../filters/postText';

import RouteDataVkEntityList from './mixins/RouteDataVkEntityList';

export default {
  mixins: [RouteDataVkEntityList],
  name: 'PostList',
  props: {
    items: {
      type: Array,
      default: [],
    },
    group: false,
    // per: {
    //   type: Number,
    //   default: 10,
    // }
  },
  route: {
    // data (trns) {
    //   console.log('PostList route.data()', trns.to.params);
    //   var userId = trns.to.params.userId;
    //   if(this.userId === userId)
    //     return trns.next();
    //   this.userId = userId;
    //   this.items.length = 0;

    //   return {items: VK.getWall(this.userId, this.items)};
    // },
    // activate () {
    //   this.$on('scroll-end-close', ::this.getMore);
    // }
  },
  created () {
    this.$on('scroll-end-close', this.getEntity);
  },
  methods: {
    getEntity () {
      return VK.getWall((this.group ? '-' : '') + this.userId, this.items);
    },
    getName (owner) {
      return owner.name ? owner.name : owner.first_name + ' ' + owner.last_name;
    },
    getLink (owner) {
      return owner.name ? ('/club/' + owner.id) : ('/user/' + owner.id);
    }
  },
  components: {AudioList},
}

</script>
<template lang="jade">

ul.post-collection
  li.post(v-for='post in items', track-by="id")
    div
      .post-info
        a(href="{{* getLink(post.$owner)}}")
          img.post-owner-image(:src='post.$owner.photo_50')
          .post-owner {{* getName(post.$owner)}}
          .post-date {{* post.date}}
    p.post-text(v-post-text-spoiler="post.text | postText")
    .post-image-container
      img.post-image(v-if='post.$photos', :src='post.$photos[0].photo_604')
    audio-list(:items="post.$audios", v-if="post.$audios")
    div
    div(v-if='!!post.copy_history')
      .post-info
        a(href="{{* getLink(post.copy_history[0].$owner)}}")
          img.post-owner-image(:src='post.copy_history[0].$owner.photo_50')
          .post-owner {{getName(post.copy_history[0].$owner)}}
          .post-date {{post.copy_history[0].date}}
      p.post-text(v-post-text-spoiler="post.copy_history[0].text | postText")
      .post-image-container
        img.post-image(v-if='post.copy_history[0].$photos', :src='post.copy_history[0].$photos[0].photo_604')
      audio-list(:items="post.copy_history[0].$audios")
      //- .audio-collection
      //-   .ilm-audio.audio(*ngfor='#audio of post.copy_history[0].$audios; #i = index', [audio]='audio', (play)='player.play($event, collection)')


</template>
<style lang="stylus">

.post-collection {
  padding: 13px;
  background: white;
}

.post {
  border: 1px solid #E8E8E8;
  border-radius: 2px;
  padding: 15px;
  color: black;
  font-size: 12px;
  position: relative;
  max-width: 600px;
  margin: 0 auto 11px;
  font-family: Tahoma;

  a > * {
    pointer-events: none
  }
}

.post .post-owner-image {
  width: 30px;
  height: 30px;
  float: left
  margin-right: 20px
}

.post .post-info {
  vertical-align: top;
  position: relative;
  display: block;
  max-width: 60%;
  // padding-left: 65px;
  margin-bottom: 15px;
}

.post .post-image {
  margin: 0 auto;
}

.post .post-info .post-owner {
  font-family: Tahoma;
}

.post .post-info .post-date {
  font-family: Tahoma;
  color: #949191;
}

.post .post-image-container {
  text-align: left;
  margin: 15px 0;
  /*max-height: 500px;*/
}

.post-text
  font-size: 12px
  overflow: hidden
  position: relative
  line-height: 16px

  &.post-text-spoiler-hide 
    max-height: 200px

    &:after
      absolute: bottom left right
      content: ''
      box-shadow: 0 0 26px 18px #fff
    // &:before
    //  absolute: bottom left right
    //  content: 'show'

.post-text a
  background: #C3EBFD
  padding: 2px 5px
  /* line-height: 20px */
  display: inline-block
  border-radius: 5px
  box-shadow: 0 0 0px 0 grey inset
  color: black

.post-text h3 {
  margin-rightgin: 0;
}

.post .post-image-container img {
  max-height: 100%;
  max-width: 100%;
}

.post .audio {
  min-height: 54px;
}

.post .audio-container {
  /*position: absolute;*/
  margin-left: -30px;
  margin-right: -30px;
  padding: 12px 33px;
  // white-space: nowrap;

  &:after {
    left: 30px
    right: 30px
  }
}

</style>