// chrome://flags/#enable-experimental-web-platform-features
const scanQrcode = ({
  srcUrl,
}) => {
  console.log('图片 src：', srcUrl);

  var barcodeDetector = new BarcodeDetector();
  const img = new Image();
  img.src = srcUrl;

  barcodeDetector.detect(img).then(barcodes => {
    barcodes.forEach(barcode => {
      const { rawValue : val } = barcode;
      console.log('识别的二维码：', val);
      alert(val);
    });
  }, () => {}).catch(err => console.error(err));

};

chrome.contextMenus.create({
  title: '识别二维码',
  contexts: ["image"],
  documentUrlPatterns: ['<all_urls>'],
  onclick: scanQrcode,
});