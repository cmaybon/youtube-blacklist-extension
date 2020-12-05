var blacklistTextArea = document.getElementById("blacklist-json");

function loadOptions() {
    var blacklist = [];
    try {
        chrome.storage.local.get(
            "blacklist", function(result) {
                blacklist = result.blacklist;
                console.log(blacklist)
                blacklistTextArea.value = JSON.stringify(blacklist, undefined, 4);
            }
        );
    }
    catch(e) {
        console.warn("Failed to get blacklist from chrome storage, creating");
        console.debug(e);
        blacklistTextArea.value = [];
    }
}

function saveOptions() {
    var blacklistRaw = blacklistTextArea.value;
    try {
        var parsed = JSON.parse(blacklistRaw);
        chrome.storage.local.set({
            "blacklist": parsed
        }, function () {
            console.log("blacklist value set: " + parsed)
        });
    } 
    catch(e) {
        console.log(e);
        alert("Invalid json");
    }
}

loadOptions();
document.getElementById("save-options").addEventListener("click", saveOptions, true);
