$(function () {
    setTimeout(getPlayers(), 300000);
    getPlayers();
    bootCpps();

});

window.getQueryParameters = function(str) {
    return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n=n.split("="),this[n[0]]=n[1],this;}.bind({}))[0];
};

function getPlayers(){
    $.ajax({
        type: 'GET',
        async: true,
        dataType: 'script',
        url: "https://stats.cpps.me/users.js",
        success: function () {
            $("#onlineusers").text(stats.online + " Online");
            $("#totalusers").text(nFormatter(stats.total, 2) + " Registered");
        }
    });
}

function nFormatter(num, digits) {
    var si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "k"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "G"},
        {value: 1E12, symbol: "T"},
        {value: 1E15, symbol: "P"},
        {value: 1E18, symbol: "E"}
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function getFlashMovieObject() {
    return window.document.gameEmbed ? window.document.gameEmbed : navigator.appName.indexOf("Microsoft Internet") !== -1 ? document.getElementById("gameEmbed") : document.embeds && document.embeds.gameEmbed ? document.embeds.gameEmbed : void 0
}

function sendMessage(a) {
    getFlashMovieObject().wmessage(a)
}

function getParams() {
    var search = getQueryParameters();
    if (search.lang == null) {
        search.lang = window.navigator.language.substr(0, 2);
    }
    return search;
}

function ignKey() {
    return "okay"
}

function bootCpps() {
    var params = {
        allowScriptAccess: "always",
        base: ("https:" === document.location.protocol ? "https" : "http") + "://media.cpps.me/play/"
    };
    var flashvars = getParams();
    var attrs = {
        id: "gameEmbed",
        name: "gameEmbed"
    };
    swfobject.embedSWF("//media.cpps.me/play/loader_r24_2018.swf", "gameEmbed", "100%", "100%", "10.0.0", "expressInstall.swf", flashvars, params, attrs, null);
}