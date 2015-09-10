function makeCode ( qrcode, text ) {

	if ( typeof text === 'undefined' ) {
		return;
	}
	qrcode.makeCode( text );
}

chrome.tabs.getSelected( null , function ( tab ){
	var qrcode = document.querySelector('#qrcode');
	var text = ( tab.url );
	var qrcode = new QRCode( qrcode , {
		width : 300,
		height : 300
	});
	makeCode( qrcode, text );
});