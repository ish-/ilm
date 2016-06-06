import Vue from 'vue';

var VK_ENTITES = {
  club: 'group',
}

Vue.filter('postText', (post) => {
  var html = post.text;
  if(!html) return '';
  var s = html.split(/\n/);
  if(s.length > 1) {
    post.$audios.$name = s[0];
    s[0] = '<h3>' + s[0] + "</h3>";
    html = s.join("\n");
  }
  return html.replace(/\[([^\|]{0,32})\|([^\]]{0,32})\]/g, function (f, o, t) { // vk entities
    var matched = o.match(/([^\d]+)([\d]+)/);
    var entity = VK_ENTITES[matched[1]] || matched[1];
    return '<a href="/'+matched[1]+'/'+matched[2]+'">'+t+'</a>';
  }).replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g, function (f) {
    return '<a href="'+f+'" target="_blank">'+f+'</a>';
  }).replace(/\n/g, '<br/>');
});