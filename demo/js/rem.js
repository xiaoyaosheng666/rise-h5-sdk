/* eslint-disable */
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      var clientHeight = docEl.clientHeight;
      if (!clientWidth) return;
      if (clientWidth >= 1920) {
        clientWidth = 1920;
        docEl.style.fontSize = '100px';
      } else {
        if (clientWidth < clientHeight) {
          docEl.style.fontSize = 100 * (clientHeight / 1920) + 'px';
        } else {
          docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
        }
      }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);