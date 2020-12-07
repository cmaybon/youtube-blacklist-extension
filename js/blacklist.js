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
            var videoRemoved = addVideoToBlacklist(element);
            if (videoRemoved) {
                continue;
            }

            // TODO cleanup getting thumbnail here and in addVideoToBlacklist()
            var thumbnail = element.querySelector("#thumbnail");
            if (thumbnail === null) {
                continue;
            }

            var existingButtons = element.getElementsByClassName("blacklist-add-button");
            if (existingButtons.length > 0) {
                continue;
            }
            insertAddToBlacklistButton(thumbnail);
        };
    }

    function insertAddToBlacklistButton(thumbnailElement) {
        var button = document.createElement("template");
        button.innerHTML = 
        `<div class="blacklist-add-button" width="20px" height="20px">+Blacklist</div>`
        // button.onclick = addVideoToBlacklist(thumbnailElement);
        button.onmouseup = function () {
            alert("reached");
        };
        thumbnailElement.parentElement.appendChild(button.content.firstChild);
        console.log("Add to blacklist Button added");
    }

    function addVideoToBlacklist(videoElement) {
        var thumbnail = videoElement.querySelector("#thumbnail");
        if (thumbnail === null) {
            return false;
        }

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