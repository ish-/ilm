import Vue from 'vue';
function z(n) { return (n < 10 ? '0' : '') + n; }

Vue.filter('audioDuration', (input) => {
  var seconds = input % 60;
  var minutes = Math.floor(input % 3600 / 60);
  var hours = Math.floor(input / 3600);
  if(isNaN(minutes) || isNaN(seconds))
    return '';
  return (hours ? (z(hours) + ':') : '') + z(minutes) + ':' + z(seconds);
});