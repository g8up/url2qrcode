// import "./barcode-detector.umd.js";

const I18N = (() => {
  const ui = Object.create(null);
  [
    'contextMenu',
    'redirectConfirm',
    'redirectError',
    'notFound',
  ].forEach(key => {
    const message = chrome.i18n.getMessage(key);
    ui[key] = message;
  });
  return ui;
})();

// const detect = (img) => {
//   const barcodeDetector = new BarcodeDetector({
//     formats: ["qr_code"]
//   });
//   return barcodeDetector.detect(img).then(barcodes => {
//     const errMsg = `${I18N.notFound}`
//     if (!barcodes.length) {
//       throw new Error(errMsg);
//     }
//     return barcodes.map(barcode => {
//       const {
//         rawValue: val,
//       } = barcode;
//       console.log('识别的二维码：', val);
//       if (val && val.length) {
//         return val;
//       } else {
//         throw new Error(errMsg);
//       }
//     });
//   });
// };

/** 多次重试 */
// const loopDetect = (img, loopCount) => {
//   console.log(`探测中：${loopCount}`);
//   return detect(img)
//     .catch(e => {
//       if (loopCount > 0) {
//         return loopDetect(img, loopCount - 1);
//       } else {
//         console.log('loopDetect error:', e);
//         throw e;
//       }
//     });
// };

// const scanQrcode = ({
//   srcUrl,
// }, tab) => {
//   console.log('图片 src：', srcUrl);
//   chrome.tabs.sendMessage(tab.id, {
//     action: 'get-base64data',
//     imageUrl: srcUrl,
//   }, (base64data) => {
//     // console.log(base64data);
//     const img = createImage(base64data);
//     // console.log( img );

//     // 不知道为什么，需要两次重试才成功 Mac Book
//     loopDetect(img, 3).then(vals => {
//       echo(vals.join(','));
//     }).catch(e => {
//       alert(e);
//     });
//   });
// };

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
        alert(`${I18N.redirectError}\n${e.stack}`);
      }
    }
  } else {
    alert(text);
  }
};

if (!window.BarcodeDetector && BarcodeDetectorPolyfill) { // windows polyfill
  BarcodeDetector = BarcodeDetectorPolyfill;
}

// 创建context menu的辅助函数
const createContextMenus = () => {
  // 移除已存在的菜单项，防止重复创建
  chrome.contextMenus.removeAll(() => {
    // 检查是否已经存在相同的菜单项
    chrome.contextMenus.create({
      id: 'scan-qrcode', // 添加ID避免重复创建
      title: `${I18N.contextMenu}`,
      contexts: ["image"],
      documentUrlPatterns: ['<all_urls>'],
      onclick: scanQrcode,
    }, () => {
      // 检查是否有错误发生
      if (chrome.runtime.lastError) {
        console.error("创建context menu失败:", chrome.runtime.lastError);
      } else {
        console.log("context menu创建成功");
      }
    });
  });
};

// 在安装或更新时创建context menu
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed/updated:', details.reason);
  createContextMenus();
});

// 在service worker启动时也尝试创建菜单
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started, creating context menu');
  createContextMenus();
});

// 监听所有活动标签页，当页面激活时确保菜单存在
chrome.tabs.onActivated.addListener(() => {
  chrome.contextMenus.getAll(() => {
    if(chrome.runtime.lastError || !chrome.contextMenus.onClicked.hasListener(scanQrcode)) {
      setTimeout(createContextMenus, 100); // 延迟创建以确保环境就绪
    }
  });
});

// 监听页面更新，确保菜单存在
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.contextMenus.getAll(() => {
      if(chrome.runtime.lastError || !chrome.contextMenus.onClicked.hasListener(scanQrcode)) {
        setTimeout(createContextMenus, 100); // 延迟创建以确保环境就绪
      }
    });
  }
});

// 检查菜单是否存在，如果不存在则创建
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {
    imageBase64Data,
    type, // base64
  } = request;

  // 检查菜单是否还存在，如果不存在则重新创建
  chrome.contextMenus.getAll((menus) => {
    if(chrome.runtime.lastError || !menus || menus.length === 0) {
      setTimeout(createContextMenus, 100);
    }
  });

  switch (type) {
    case 'base64':
      // scanQrcode(imageBase64Data);
      break;
    default:
      break;
  }
});

// 如果不是在onInstalled时创建，则在这里创建
// 注意：在MV3的service worker中，通常只依赖onInstalled事件