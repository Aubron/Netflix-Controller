chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    	chrome.tabs.remove(tabs[0].id);
	});
  });