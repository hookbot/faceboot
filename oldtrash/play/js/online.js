(function () {
    var refresh = function () {
        var script = document.getElementById('setonlinejs');
        if (script) {
            document.getElementsByTagName("head")[0].removeChild(script);
        }
        script = document.createElement("script");
        script.id = 'setonlinejs';
        script.type = 'text/javascript';
        script.src = "//stats.cpps.me/users.js?" + new Date().getTime();
        script.onload = function () {
            if (stats && stats.total) {
                var now = Math.round(+new Date() / 1000);
                var userstats = document.getElementById("userstats");
                if (userstats) {
                    var txt = "";
                    txt += "Stats generated: <b>" + Math.round((now - stats.when) / 8640) / 10 + "</b> (Days ago)<br>\n";
                    txt += "Total users: <b>" + stats.total + "</b><br>\n";
                    txt += "Active users: <b>" + stats.active + "</b> (Login within past 30 days)<br>\n";
                    txt += "Users Online: <b>" + stats.online + "</b> (Right now)<br>\n";
                    txt += "Most Online: <b>" + stats.max_online + "</b> (MAX Simultaneous Users)<br>\n";
                    txt += "Max Reached: <b>" + Math.round((now - stats.max_when) / 8640) / 10 + "</b> (Days ago)<br>\n";
                    txt += "DB Lag: <b>" + Math.round((now - (stats.when - stats.stale)) / 8640) / 10 + "</b> (Days ago)<br>\n";
                    txt += "<div style='border: solid 4px;'>\n";
                    txt += "<table>\n";
                    txt += "<tr><th style='padding: 5px;'>World</th><th style='padding: 5px;'>Lang</th><th align=right style='padding: 5px;'>Online</th></tr>\n";
                    for (var i = 0; i < stats.servers.length; i++) {
                        var s = stats.servers[i];
                        if (s.a - stats.stale > 3600) s.p = '?';
                        txt += "<tr><td style='padding: 5px;'>" + s.name + "</td><td style='padding: 5px;'>" + s.l + "</td><td style='padding: 5px;' align=right>" + s.p + "</td></tr>\n";
                    }
                    txt += "</table>\n</div>\n";
                    userstats.innerHTML = txt;
                }
                var online = document.getElementById("online");
                if (online) {
                    var txt = "";
                    txt += '<a href="//www.cpps.me/stats.html" target="_top">Users Online: <b>' + stats.online + '</b></a>';
                    online.innerHTML = txt;
                }
            }
        };
        script.onreadystatechange = function () {
            if (this.readyState != "complete") return;
            this.onload();
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    refresh();
    setInterval(refresh, 60000);
})();