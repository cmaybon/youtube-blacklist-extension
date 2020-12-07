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

    function loadBlacklist() {
        chrome.storage.local.get("blacklist", function(result) {
            blacklist = result.blacklist;
            // Wait for blacklist to load before running main
            removeVideos();
        });
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

            // TODO cleanup getting thumbnail here and in addVideoToBlacklist()
            var videoRemoved = removeVideo(element);
            if (videoRemoved) {
                continue;
            }

            var existingButtons = element.getElementsByClassName("blacklist-add-button");
            if (existingButtons.length > 0) {
                continue;
            }
            insertAddToBlacklistButton(thumbnail, element);
        };
    }

    function removeVideo(videoElement) {
        var thumbnail = videoElement.querySelector("#thumbnail");
        var videoWatchId = thumbnail.getAttribute("href").split("/watch?v=")[1]
        var videoInfo = videoElement.querySelector("#text");
        if (videoInfo === null) {
            return false;
        }
        var channelName = videoInfo.textContent;
    
        if (blacklist.indexOf(channelName) >= 0) {
            console.log(`Blacklisted channel found "${channelName}", video id "${videoWatchId}", removing video element`)
            videoElement.remove();
            return true;
        }
        return false;
    }

    function insertAddToBlacklistButton(thumbnail, element) {
        var button = document.createElement("div");
        button.className = "blacklist-add-button";
        button.textContent = "+Blacklist";
        button.addEventListener("click", function () {
            var videoInfo = this.parentElement.parentElement.querySelector("#text");
            if (videoInfo === null) {
                console.error("Failed to find channel name element when adding to blacklist");
                return;
            }

            var channelName = videoInfo.textContent;
            blacklist.push(channelName);
            console.log(`"${channelName}" added to blacklist`);
            saveBlacklist();

            removeVideos();
        });
        thumbnail.parentElement.appendChild(button);
    }

    function saveBlacklist() {
        chrome.storage.local.set({
            "blacklist": blacklist
        }, function () {
            console.debug("Blacklist saved");
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