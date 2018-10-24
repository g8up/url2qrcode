// chrome://flags/#enable-experimental-web-platform-features
const detect = ( img )=> {
  const barcodeDetector = new BarcodeDetector();

  return barcodeDetector.detect(img).then(barcodes => {
    return barcodes.map(barcode => {
        const { rawValue : val } = barcode;
        console.log('识别的二维码：', val);
        return val;
      });
  }, () => {}).catch(err => console.error(err));
};

const getImageDataByFile = ( imageFile )=>{
  return new Promise((resolve, reject) => {
    var reader = new FileReader();

    reader.onload = function (e) {
      var base64Data = e.target.result;
      resolve( base64Data );
    };

    reader.readAsDataURL(imageFile);
  });
};

const createImage = ( url )=>{
  const img = new Image();
  img.src = url;
  return img;
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
    detect( img ).then( vals =>{
      if( vals && vals.length ){
        alert(vals.join(','));
      }
      else{
        console.log( '空');
      }
    });
  });
};

chrome.contextMenus.create({
  title: '识别二维码',
  contexts: ["image"],
  documentUrlPatterns: ['<all_urls>'],
  onclick: scanQrcode,
});

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