/* CPPS.me JS Functions 0.0.1 */
function getFlashMovieObject() {
    return window.document.gameEmbed ? window.document.gameEmbed : navigator.appName.indexOf("Microsoft Internet") != -1 ? document.getElementById("gameEmbed") : document.embeds && document.embeds.gameEmbed ? document.embeds.gameEmbed : void 0
}
function sendMessage(e) {
    getFlashMovieObject().wmessage(e)
}