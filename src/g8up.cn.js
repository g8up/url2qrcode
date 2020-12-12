function makeCode(qrcode, text) {
  if (typeof text === 'undefined') {
    return;
  }
  qrcode.makeCode(text);
}

function getSize(){
  return localStorage.getItem('qr-size') || 300;
}

chrome.tabs.getSelected(null, function (tab) {
  var $qrcode = document.querySelector('#qrcode');
  var text = (tab.url);
  var size = parseInt( getSize(), 10);
  var qrcode = new QRCode($qrcode, {
    width: size,
    height: size
  });
  makeCode(qrcode, text);
});