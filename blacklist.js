var blacklist = [
    "Northernlion"
]
var videos = document.getElementsByClassName("style-scope ytd-compact-video-renderer");
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
    console.log(channelName);

    if (blacklist.indexOf(channelName) >= 0) {
        console.log("blacklisted channel found '" + channelName + "', video id: " + videoWatchId)
    }
};