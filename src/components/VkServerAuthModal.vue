<script lang="babel">
import VK from '../vk.service';
// import Modal from './Modal.vue';

export default {
  // components: {Modal},
  methods: {
    vkServerAuth () { 
      VK.serverAuth(() => this.$dispatch('close'));
    },
  }
}
</script>
<template lang="jade">
.modal(@click="$dispatch('close')")
  button.modal-close ✖︎
  .modal-body(@click.stop="$noop")
    .modal-content To detect audio quality (bitrate) and listen from LastFM you should auth with VK account on our server.
    .modal-footer
      button.btn-auth(@click="vkServerAuth") Server Auth

</template>
<style lang="stylus">

