<script lang="babel">
import '../filters/slice';

export default {
  // name: 'AudioList',
  props: {
    items: Array,
    per: {
      type: Number,
      default: 300,
    },
  },
  data () {
    return {}
  },
  methods: {
    goToFriend (friend) {
      this.$route.router.go({path: '/user/' + friend.id});
    }
  }
}

</script>
<template lang="jade">

.friend-collection
  .friend(v-for="friend in items | slice per", track-by="id", @click="goToFriend(friend)")
    .friend-container
      img.friend-avatar(:src="friend.photo_100")
      .friend-lname {{* friend.last_name}}
      .friend-fname {{* friend.first_name}}

</template>
<style lang="stylus">
.friend-collection
  text-align: center
  background: white
.friend
  padding: 5px
  background: #4c4c4c
  font-size: 16px
  display: inline-block
  width: 100px;
  margin: 20px 2% 0;
  border-radius: 2px

.friend-avatar
  size: 100px
  background: #4c4c4c
  border-radius: 3px
  border: 1px solid #616161

</style>