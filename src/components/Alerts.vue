<script lang="babel">
import '../filters/slice';
const ALERT_TIMEOUT = 2000;

export var alerts = [];

export default {
  data () {
    return {alerts};
  },
  created () {
    this.$root.$on('alert', (alert) => {
      this.alerts.push(alert);
      setTimeout(()=>{
        this.alerts.$remove(alert);
      }, ALERT_TIMEOUT * this.alerts.length);
    });
  }
}
</script>
<template lang="jade">
.alerts
  .alert(v-for="alert in alerts | slice 2", transition="translateX") {{alert}}
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