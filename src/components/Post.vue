<script lang="babel">
import Vue from 'vue';
import AudioList from './AudioList.vue';

import '../directives/postTextSpoiler';

import '../filters/dateTime';
import '../filters/slice';
import '../filters/postText';

var Post = Vue.extend({
  props: ['post'],
  replace: false,
  name: 'Post',
  methods: {
    getName (owner) {
      return owner.name ? owner.name : owner.first_name + ' ' + owner.last_name;
    },
    getLink (owner) {
      return owner.name ? ('/club/' + owner.id) : ('/user/' + owner.id);
    },
    setLike (post) {
      VK.setLike('post', post.owner_id, post.id).catch((d) => {
        post.likes.count--;
        post.likes.liked = false;  
        Alerts.add({type: 'Set like', text: 'Something went wrong'});
      });
      post.likes.count++;
      post.likes.liked = true;
    },
    repost (post) {
      VK.repost(`wall${this.group ? '-' : ''}${post.id}`).catch((d) => {
        post.reposts.count--;
        post.reposts.reposted = false;  
        Alerts.add({type: 'Repost', text: 'Something went wrong'});
      });
      post.reposts.count++;
      post.reposts.reposted = true;
    },
  },
  components: {AudioList},
});

export default Post;

</script>
<template lang="jade">

div
  .post-info
    a(href="{{* getLink(post.$owner)}}")
      img.post-owner-image(:src='post.$owner.photo_50')
      .post-owner {{* getName(post.$owner)}}
      .post-date {{* post.date | dateTime}}
p.post-text(v-post-text-spoiler="post | postText")
.post-image-container
  img.post-image(v-if='post.$photos', :src='post.$photos[0].photo_604')
audio-list(:items="post.$audios", v-if="post.$audios")
div
post(v-if='!!post.copy_history', :post="post.copy_history[0]")
  //- .post-info
  //-   a(href="{{* getLink(post.copy_history[0].$owner)}}")
  //-     img.post-owner-image(:src='post.copy_history[0].$owner.photo_50')
  //-     .post-owner {{getName(post.copy_history[0].$owner)}}
  //-     .post-date {{post.copy_history[0].date | dateTime}}
  //- p.post-text(v-post-text-spoiler="post.copy_history[0].text | postText")
  //- .post-image-container
  //-   img.post-image(v-if='post.copy_history[0].$photos', :src='post.copy_history[0].$photos[0].photo_604')
  //- audio-list(:items="post.copy_history[0].$audios")
.post-counts(v-if="post.likes")
  button(@click="repost(post)")
    .icon._repost(:class="{active: post.reposts.reposted}")
    | {{ post.reposts.count}}
  button(@click="setLike(post)")
    .icon._like(:class="{active: post.likes.liked}")
    | {{ post.likes.count}}
  //- .audio-collection
  //-   .ilm-audio.audio(*ngfor='#audio of post.copy_history[0].$audios; #i = index', [audio]='audio', (play)='player.play($event, collection)')

</template>
<style lang="stylus">

</style>