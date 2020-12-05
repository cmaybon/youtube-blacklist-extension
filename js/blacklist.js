function main() {
    var blacklist = [];

    function removeVideos() {
        var videos = document.getElementsByClassName("style-scope ytd-compact-video-renderer");
        if (videos === null || videos.length === 0) {
            console.log("Using rich-grid");
            videos = document.getElementById("contents").childNodes;
        }
        
        for (let element of videos) {
            var thumbnail = element.querySelector("#thumbnail");
            if (thumbnail === null) {
                continue;
            }
        
            var videoWatchId = thumbnail.getAttribute("href").split("/watch?v=")[1]
            var videoInfo = element.querySelector("#text");
            
            var channelName = videoInfo.textContent;
        
            if (blacklist.indexOf(channelName) >= 0) {
                console.log("blacklisted channel found '" + channelName + "', video id: " + videoWatchId)
                element.remove();
            }
        };
    }

    chrome.storage.local.get("blacklist", function(result) {
        blacklist = result.blacklist;
        // Wait for blacklist to load before running main
        removeVideos();
    });
}

main();
