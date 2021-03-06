const I18N = (()=>{
  const ui = Object.create(null);
  [
    'contextMenu',
    'redirectConfirm',
    'redirectError',
  ].forEach( key => {
    const message = chrome.i18n.getMessage( key );
    ui[key] = message;
  });
  return ui;
})();

// chrome://flags/#enable-experimental-web-platform-features
let barcodeDetector = null;

const detect = (img) => {
  return barcodeDetector.detect(img).then(barcodes => {
    return barcodes.map(barcode => {
      const {
        rawValue: val,
      } = barcode;
      console.log('识别的二维码：', val);
      return val;
    });
  }).catch(err => alert(err));
};

const getImageDataByFile = (imageFile) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    reader.onload = function (e) {
      var base64Data = e.target.result;
      resolve(base64Data);
    };

    reader.readAsDataURL(imageFile);
  });
};

const createImage = (url) => {
  const img = new Image();
  img.src = url;
  return img;
};

const echo = (text) => {
  if (text.startsWith('http')) {
    if (confirm(`${I18N.redirectConfirm}\n${text}`)) {
      try {
        window.open(text);
      } catch (e) {
        alert(`${redirectError}\n${e.stack}`);
      }
    }
  } else {
    alert(text);
  }
};

const scanQrcode = ({
  srcUrl,
}, tab) => {
  console.log('图片 src：', srcUrl);
  chrome.tabs.sendMessage(tab.id, {
    action: 'get-base64data',
    imageUrl: srcUrl,
  }, (base64data) => {
    // console.log(base64data);
    const img = createImage(base64data);
    // console.log( img );
    detect(img).then(vals => {
      if (vals && vals.length) {
        echo(vals.join(','));
      } else {
        // console.log('空');
        // 不知道为什么，需要两次重试才成功 Mac Book
        detect(img).then(vals => {
          if (vals && vals.length) {
            echo(vals.join(','));
          } else {
            console.log('空');
          }
        });
      }
    });
  });
};

if (window.BarcodeDetector) {
  barcodeDetector = new BarcodeDetector();

  // https://developer.chrome.com/extensions/contextMenus
  chrome.contextMenus.create({
    title: `${I18N.contextMenu}`,
    contexts: ["image"],
    documentUrlPatterns: ['<all_urls>'],
    onclick: scanQrcode,
  });
}
else{
  console.warn('[debug] BarcodeDetector 未定义');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {
    imageBase64Data,
    type, // base64
  } = request;
  switch (type) {
    case 'base64':
      scanQrcode(imageBase64Data);
      break;
    default:
      break;
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  // details: {previousVersion: "1.0.2.3", reason: "update"}
  chrome.tabs.create({
    url: 'option.html'
  });
});