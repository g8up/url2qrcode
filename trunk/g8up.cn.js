chrome.tabs.getSelected(null, function (tab){
	var url = "http://chart.googleapis.com/chart?cht=qr&chs=200x200&choe=UTF-8&chld=L|4&chl=" + tab.url;
	// document.write('<img src="' + url + '">');
	document.querySelector('#qrcode').src = url;
});