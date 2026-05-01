var firstWidget = false;

function curWidget() { //@retr active/visible widget body
    return $('.widgetBody:visible');
}

function formatAMPM() {
    var d = new Date(),

    seconds = d.getSeconds().toString().length == 1 ? '0'+d.getSeconds() : d.getSeconds(),
    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
    hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
    ampm = d.getHours() >= 12 ? 'pm' : 'am',
            hour = d.getHours() >= 12 ? parseInt(d.getHours()) - 12 : d.getHours(),
    months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
    days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+', '+hour+':'+minutes+':'+seconds+' '+ ampm;
}

function hideCurWidget() {
    var cur = curWidget()[0].id;
    var sub = $('.widgetSub:visible');
    if (sub.length > 0) {
        sub.hide();
    }
    $('#link_' + cur + '.active').attr('class', '');
    curWidget().hide();
}

function loadWidgetFromCrypto() { //Have var to store cryptokeys for when the .html of a widget does loadWidgetScript or somethin
    
}

function asyncinator(time, code) { //To prevent addPin calling before noticeboard is set up
    setTimeout(function(){
        eval(code);
    }, time);
}

function addWidget(name, longname, dtoggle, dclass) {
    var onClick = "loadWidget('" + name + "')";
    if (dtoggle == null) {
        dtoggle = 'pill';
    }
    else if (dtoggle == 'dropdown') {
        onClick = '';
    }
    if (dclass == null) {
        dclass = 'normal';
    }

    $('#widgetBody').append(
        $('<div>').attr('class', 'widgetBody')
                  .attr('id', name)
    );
    $('#' + name).load("widgets/" + name + ".html"); 
    $('#' + name).hide();
    //Now we add the link to it in the navbar
    $('.widget-table ul.nav').append(
        $('<li>').attr('id', 'link_' + name)
                 .append(
                    $('<a>').attr('class', dclass)
                    .attr('data-toggle', dtoggle)
                    .attr('onclick',onClick).append(
                        longname
                    ).append(
                        $('<span>').attr('class', 'badge')
                    )
                ).append(
                    $('<ul>').attr('id', 'sub_' + name)
                     .attr('class', 'dropdown-menu')
                )
    );
    if (firstWidget === false) {
        firstWidget = true;
        loadWidget(name, true);
    }
}

function addSubMenu(widget, name, dest) { //Make pms work kinda with existing widget system, so like loadWidget(privatemessage_b00mx0r) and privatemessage.js + the html support #widget_privatemessage_b00mx0r
    //privatemessage.js should have funcs for getting buddies 
    $('#sub_' + widget + '.dropdown-menu').append(
        $('<li>').append(
            $('<a>').attr('id', 'link_' + widget + '_' + dest)
                    .attr('onclick',"loadSubWidget('" + widget + "_" + dest + "', '" + widget + "')").append(
                        name
                    ).append(
                        $('<span>').attr('class', 'badge')
                    )
        )
    );
}

function loadWidget(name, first, keepUnread) {
    if (first !== true) {
        hideCurWidget();
    }
    $('#' + name).show();
    if (keepUnread !== true) {
        $('#link_' + name + ' span.badge').empty();
    }
}

function loadSubWidget(name, par) {
    loadWidget(par, false, true);
    $('#' + name).show();

    var curUnread = $('#link_' + name + ' span.badge')[0].innerHTML;
    curUnread = (curUnread.length === 0) ? 0 : parseInt(curUnread);
    $('#link_' + name + ' span.badge').empty();

    var totalUnread = $('#link_' + par + ' span.badge')[0].innerHTML;
    totalUnread = (totalUnread.length === 0) ? 0 : parseInt(totalUnread);

    $('#link_' + par + ' span.badge')[0].innerHTML = ((totalUnread - curUnread) === 0) ? '' : (totalUnread - curUnread);

    $('#link_' + par).attr('class', 'active');
}

function addUnread(name, override) {
    if (curWidget()[0].id === name && override !== true) {
        return;
    }
    var cur = $('#link_' + name + ' span.badge')[0].innerHTML;
    var unread = (cur.length === 0) ? 0 : parseInt(cur);
    ++unread;
    $('#link_' + name + ' span.badge')[0].innerHTML = unread;
}
