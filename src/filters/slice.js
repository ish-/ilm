import Vue from 'vue';

Vue.filter('slice', (v, i) => {
  return v.slice(0, i)
});