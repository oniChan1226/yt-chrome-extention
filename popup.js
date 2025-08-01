import { getCurrentTab } from "./utils.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    controlElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-" + bookmark.time;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);

    setBookmarkAttributes("play", onPlay, controlElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlElement);
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
    if (currentBookmarks.length > 0) {
        for (let bookmark of currentBookmarks) {
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = `<i class="row">Ustad add kr pehly bookmarks</i>`;
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getCurrentTab();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime,
    })
};

const onDelete = e => { };

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = `assets/${src}.png`;
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Executed")

    const activeTab = await getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameter = new URLSearchParams(queryParameters);

    const currentVideo = urlParameter.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

            viewBookmarks(currentVideoBookmarks);
        })
    } else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = `<div class="title">youtube py ja pai!</div>`;
    }
});
