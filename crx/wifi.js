const $ = ( selector, doc = document) => doc.querySelector( selector );

$('#genWifiQrCode').addEventListener('click', (e)=>{
  const ssid = $('#ssid').value.trim();
  const pass = $('#pass').value.trim();

  if(ssid && pass) {
    qrcode.makeCode(`WIFI:T:WPA;S:${ssid};P:${pass};;`);
  }
});