import Vue from 'vue';

var VK_ENTITES = {
  club: 'group',
}

Vue.filter('postText', (html) => {
  // console.log(html)
  if(!html) return '';
  var s = html.split(/\n/);
  if(s.length > 1) {
    s[0] = '<h3>' + s[0] + '</h3>';
    html = s.join("\n");
  }
  return html.replace(/\[([\w\d]+)\|([\w\d\s]+)]/g, function (f, o, t) { // vk entities
    var matched = o.match(/([^\d]+)([\d]+)/);
    var entity = VK_ENTITES[matched[1]] || matched[1];
    return '<a href="/'+matched[1]+'/'+matched[2]+'">'+t+'</a>';
  }).replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g, function (f) {
    return '<a href="'+f+'" target="_blank">'+f+'</a>';
  }).replace(/\n/g, '<br/>');
});