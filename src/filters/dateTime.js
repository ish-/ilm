import Vue from 'vue';
function z(n) { return (n < 10 ? '0' : '') + n; }

var MONTH = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
]

Vue.filter('dateTime', (d) => {
  d = new Date(d*1000);
  return `${d.getHours()}:${z(d.getMinutes())}  ${d.getDate()} ${MONTH[d.getMonth()]} ${d.getFullYear()}`;
});