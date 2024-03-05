function makeCode(qrcode, text) {
  if (typeof text === 'undefined') {
    return;
  }
  qrcode.makeCode(text);
}

function getSize() {
  return localStorage.getItem('qr-size') || 300;
}

chrome.tabs.query(
  {
    active: true,
  },
  function ([tab]) {
    var $qrcode = document.querySelector('#qrcode');
    var text = tab.url;
    var size = parseInt(getSize(), 10);
    var qrcode = new QRCode($qrcode, {
      width: size,
      height: size,
    });
    makeCode(qrcode, text);
  }
);

const openOptionPage = () => {
  chrome.tabs.create({
    url: './assets/option.html',
  });
};

document.querySelector('.option').addEventListener('click', openOptionPage);
