chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({url: "../html/options.html"});
});