const getImageDataByUrl = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    // SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    img.crossOrigin = "anonymous";

    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      try {
        const data = canvas.toDataURL();
        resolve(data);
      } catch (e) {
        // Handle errors here
        alert(e);
      }
    };

    img.onerror = () => {
      reject(`图片无法被提取。`)
    };

    img.src = url;
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {
    action,
    imageUrl,
  } = request;
  switch (action) {
    case 'get-base64data':
      getImageDataByUrl(imageUrl).then(data => {
          sendResponse(data);
        })
        .catch(e => {
          alert(e);
        });
      return true;
      break;
    default:
      break;
  }
});