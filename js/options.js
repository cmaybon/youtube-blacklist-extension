var blacklistTextArea = document.getElementById("blacklist-json");

function loadOptions() {
    chrome.storage.local.get({
        "blacklist": function(result) {
            blacklistTextArea.value = JSON.stringify(result);
        }
    });
}

function saveOptions() {
    var blacklistRaw = blacklistTextArea.value;
    try {
        var parsed = JSON.parse(blacklistRaw);
        chrome.storage.local.set({
            "blacklist": parsed
        });
        console.log("blacklist saved");
    } 
    catch(e) {
        console.log(e);
    }
}