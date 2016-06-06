<script lang="babel">

import Vue from 'vue';
import Post from './Post.vue';
import VK from '../vk.service';
import Alerts from '../alerts.service';

import RouteDataVkEntityList from './mixins/RouteDataVkEntityList';

export default {
  mixins: [RouteDataVkEntityList],
  components: {Post},
  name: 'PostList',
  props: {
    items: {
      type: Array,
      default: [],
    },
    group: false,
  },
  created () {
    this.$on('scroll-end-close', this.getEntity);
  },
  methods: {
    getEntity () {
      return VK.getWall((this.group ? '-' : '') + this.userId, this.items);
    },
  },
}

</script>
<template lang="jade">

ul.post-collection
  li.post(is="post", :post="post", v-for='post in items', track-by="id")

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
  // position: relative;
  max-width: 600px;
  margin: 0 auto 11px;
  font-family: Tahoma;
}


.post-counts 
  text-align: right

  > *
    position: relative
    height: 24px
    padding-left: 28px
    padding-right: 10px
    line-height: 24px
    color: white
    font-size: 14px
    border-radius: 3px
    background: #c3c3c3
    margin-left: 5px

    &.active
      background: #333

    .icon
      background-size: cover
      size: 24px
      line-height: 24px
      absolute: top  left 2px


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
  margin-top: 3px
}

.post .post-image-container {
  text-align: left;
  margin: 15px 0;
  /*max-height: 500px;*/
}

.post-text
  user-select: initial
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