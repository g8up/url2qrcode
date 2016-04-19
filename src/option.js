var $qrcodeImg = document.querySelector('#qrcodeImg');
var qrcode = new QRCode( $qrcodeImg , {
	width : 300,
	height : 300
});

function genQrcode( text ){
	qrcode.makeCode( text );
}

var $anyText = document.querySelector('#anyText');
$anyText.addEventListener('blur', function(e){
	genQrcode( this.value.trim() );
});
$anyText.addEventListener('keypress', function(e){
	e.which == 13 && genQrcode( this.value.trim() );
});
