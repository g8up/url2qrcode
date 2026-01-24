// chrome.contextMenus.create(
//   {
//     id: 'scan-qrcode', // 添加ID避免重复创建
//     title: `TEST`,
//     contexts: ['image'],
//     documentUrlPatterns: ['<all_urls>'],
//     onclick: () => {
//       alert(/hi/)
//     }
//   },
//   () => {
//     // 检查是否有错误发生
//     if (chrome.runtime.lastError) {
//       console.error('创建context menu失败:', chrome.runtime.lastError)
//     } else {
//       console.log('context menu创建成功')
//     }
//   }
// )

  chrome.contextMenus.create({
    title: 'checkbox',
    type: 'checkbox',
//     contexts: ['image'],
    id: 'checkbox'
  });