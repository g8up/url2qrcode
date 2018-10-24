
const getImageDataByUrl = (url) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = function() {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      try {
        const data = canvas.toDataURL();
        resolve( data );
      } catch(e) {
        // Handle errors here
        alert(e);
      }
    };
    img.src = url;
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {
    action,
    imageUrl,
  } = request;
  switch(action){
    case 'get-base64data':
      getImageDataByUrl( imageUrl ).then( data=>{
        sendResponse(data);
      });
      return true;
      break;
    default: break;
  }
});