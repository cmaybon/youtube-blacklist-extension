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

            insertAddToBlacklistButton(thumbnail);
        };
    }

    function insertAddToBlacklistButton(thumbnailElement) {
        var button = document.createElement("template");
        button.innerHTML = 
        `<div style="opacity:1">
            <svg viewbox="0 0 24 24" height="16" width="16">
                <polygon points="24 2.1 21.9 0 12 9.9 2.1 0 0 2.1 9.9 12 0 21.9 2.1 24 12 14.1 21.9 24 24 21.9 14.1 12"></polygon>
            </svg>
            <div>Block</div>
        </div>`
        thumbnailElement.appendChild(button.content.firstChild); 
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