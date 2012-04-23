images = {
    "BadGuy": "img/BadGuy.png",
    "BillyHappy": "img/BillyHappy.png",
    "Billy": "img/Billy.png",
    "RoomBackground": "img/RoomBackground.png",
    "RoomLong": "img/RoomLong.png",
    "BeginningRoom": "img/BeginningRoom.png",
    "Monster": "img/Monster.png",
    "Door": "img/Door.png"
};

(function() {
    var loadCount = 0;

    function imageLoaded() {
        var n = Object.keys(images).length;
        loadCount++;

        document.getElementById("loadingPercent").innerText = " (" + (loadCount/n * 100)+"%" + ")";

        if (loadCount == n) {
            var loadingElem = document.getElementById("loading");
            loadingElem.parentNode.removeChild(loadingElem);
            Game.start();
        }
    }

    for (var name in images) {
        var url = images[name];
        images[name] = new Image();
        images[name].src = url;
        images[name].onload = imageLoaded;
    }
})();
