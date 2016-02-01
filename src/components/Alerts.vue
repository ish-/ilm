<script lang="babel">
import '../filters/slice';
import alerts from '../alerts.service';

export default {
  data () {
    return {alerts};
  },
  created () {
    this.$root.$on('alert', (alert) => {
      this.alerts.add(alert);
    });
  }
}
</script>
<template lang="jade">
.alerts
  .alert(v-for="alert in alerts | slice 2", transition="translateX") 
    h2(v-if="alert.type") {{alert.type}}
    p {{alert.text}}
</template>
<style lang="stylus">

.alerts
  fixed: top left right
  padding: 20px
  z-index: 800
  pointer-events: none

  .alert
    pointer-events: all
    border-radius: 3px
    background-color: #FF5A5A
    border: 1px solid #FFB072
    color: white
    font-size: 16px
    padding: 15px
    margin-bottom: 16px

</style>