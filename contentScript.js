(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId,  } = obj;

        if(type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if(type === "PLAY") {
            youtubePlayer.currentTime = value;
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get([currentVideo], (obj) => resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []));
        })
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        if(!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmarks current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler)
        }
    };

    const addNewBookmarkEventHandler = async () => {
        currentVideoBookmarks = await fetchBookmarks();
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTimeInYoutubeFormat(currentTime),
        };
        console.log("New Bookmark:: ", newBookmark)
        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)),
        })
    };

    newVideoLoaded();
})();

const getTimeInYoutubeFormat = t => {
    const date = new Date(0);
    date.setSeconds(t);
    console.log("Date ai hai::", date.toISOString().substr(11, 8))
    return date.toISOString().substr(11, 8);
}