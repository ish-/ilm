<script lang="babel">

import Vue from 'vue';

import AudioList from './AudioList.vue';

import '../directives/postTextSpoiler';

import '../filters/slice';
import '../filters/postText';

export default {
  props: {
    items: Array,
    per: {
      type: Number,
      default: 10,
    }
  },
  methods: {
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

.post-collection
  .post(v-for='post in items', track-by="id")
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
}

.post .post-owner-image {
  width: 30px;
  height: 30px;
  position: absolute;
  left: 0;
}

.post .post-info {
  vertical-align: top;
  position: relative;
  display: inline-block;
  max-width: 60%;
  padding-left: 65px;
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

  &.post-text-spoiler-hide 
    max-height: 200px

    &:after
      absolute: bottom left right
      content: ''
      box-shadow: 0 0 10px 10px white
    // &:before
    //  absolute: bottom left right
    //  content: 'show'

.post-text h3 {
  margin: 0;
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
  padding-left: 33px;
  // white-space: nowrap;
}

</style>