var blacklist = [
    "Northernlion",
    "Frisson",
    "Unlike Pluto",
    "Apashe",
    "xQcOW",
    "OfflineTV",
    "Linus Tech Tips",
    "jackfrags",
    "PewDiePie",
    "Kitchen Nightmares",
    "Disguised Toast",
    "jacksepticeye",
    "xKito Music",
    "Sound Cloudx",
    "Gordon Ramsay",
    "First We Feast",
    "Welyn",
    "CloudKid",
    "Everything Pokelawls",
    "JxmyHighroller",
    "SahaKit",
    "Ghrey",
    "ABC News In-depth",
    "kliksphilip"
]

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