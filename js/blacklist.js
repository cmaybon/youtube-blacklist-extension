(function () {
    var blacklist = [];
    var videos = null;
    var currentUrl = window.location.toString();
    var targetElement = null;

    if (currentUrl.includes("/watch?v=")) {
        videos = document.getElementsByClassName("style-scope ytd-compact-video-renderer");
        targetElement = document.getElementById("related");
    } else {
        targetElement = document.getElementById("contents");
        videos = targetElement.children;
    }

    function removeVideos() {
        if (videos === null) {
            console.log("Failed to find videos");
        }
        
        for (let element of videos) {
            var thumbnail = element.querySelector("#thumbnail");
            if (thumbnail === null) {
                continue;
            }
        
            var videoWatchId = thumbnail.getAttribute("href").split("/watch?v=")[1]
            var videoInfo = element.querySelector("#text");
            if (videoInfo === null) {
                continue;
            }
            var channelName = videoInfo.textContent;
        
            if (blacklist.indexOf(channelName) >= 0) {
                console.log("blacklisted channel found '" + channelName + "', video id: " + videoWatchId)
                element.remove();
            }

            var existingButtons = thumbnail.getElementsByClassName("blacklist-add");
            if (existingButtons.length > 0) {
                console.log("video already has a blacklist add button, skipping");
                continue;
            }
            console.log("adding button...");
            insertAddToBlacklistButton(thumbnail);
        };
    }

    function insertAddToBlacklistButton(thumbnailElement) {
        var button = document.createElement("template");
        button.innerHTML = 
        `<div class="blacklist-add" background-color="red" width="20px" >
        </div>`
        thumbnailElement.appendChild(button.content.firstChild);
        console.log("button added");
    }

    function loadBlacklist() {
        chrome.storage.local.get("blacklist", function(result) {
            blacklist = result.blacklist;
            // Wait for blacklist to load before running main
            removeVideos();
        });
    }

    loadBlacklist();

    const observerConfig = {
        attributes: true,
        childList: true,
        subtree: true
    };
    const observer = new MutationObserver(removeVideos);
    observer.observe(targetElement, observerConfig);
} ());