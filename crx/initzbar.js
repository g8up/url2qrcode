// 在 import 之前定义
const wasmUrl = chrome.runtime.getURL('./libs/zbar.wasm') // 在 content script 中替换为 chrome.runtime.getURL('zbar.wasm')

// 优先设置 global Module.locateFile（若模块使用全局 Module）
window.Module = window.Module || {}
window.Module.locateFile =
  window.Module.locateFile ||
  (filename => {
    if (filename.endsWith('zbar.wasm')) return wasmUrl
    return filename
  })

// 回退：拦截 fetch 请求指向 zbar.wasm
const _fetch = window.fetch.bind(window)
window.fetch = function (input, init) {
  const url = typeof input === 'string' ? input : input && input.url
  if (url && url.endsWith('zbar.wasm')) {
    return _fetch(wasmUrl, init)
  }
  return _fetch(input, init)
}
