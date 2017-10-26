const STORE_SIZE = 'qr-size';

var $qrcodeImg = document.querySelector('#qrcodeImg');
var qrcode = new QRCode( $qrcodeImg , {
	width : 300,
	height : 300
});

var $anyText = document.querySelector('#anyText');
$anyText.addEventListener('blur', function(e){
	genQrcode( this.value.trim() );
});
$anyText.addEventListener('keypress', function(e){
	e.which == 13 && genQrcode( this.value.trim() );
});

var saveSize = debounce(function(size){
	localStorage.setItem( STORE_SIZE, size);
}, 800);

var $sizeRange = document.querySelector('#sizeRange');
var $rangeResult = document.querySelector('#rangeResult');
$sizeRange.addEventListener('input', function(e){
	var size = e.target.value;
	saveSize( size );
	var x = e.pageX;
	var y = e.pageY;
	showSize( size , x, y);
});
showSize( getSize() );

function genQrcode( text ){
	qrcode.makeCode( text );
	$qrcodeImg.classList.toggle('rotate');
}

function getSize(){
	return localStorage.getItem(STORE_SIZE) || 300;
}

function debounce( fn, delay){
	var timer;
	return function(){
		clearTimeout( timer );
		var that = this;
		var args = arguments;
		timer = setTimeout( function(){
			fn.apply( that, args);
		}, delay);
	}
}

function prettySize( size ){
	return new Array(2).fill(`${size}px`).join(' x ');
}

function showSize( size, x ){
	$rangeResult.textContent = prettySize( size );
	$rangeResult.style.left = x;
}