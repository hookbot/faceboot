function modAddPin(uid) {
    buttonArea = $('#' + uid + ' td.buttons');
    buttonArea.append(
        $('<button>').attr('type', 'button')
                     .attr('class', 'btn btn-warning btn-xs')
                     .attr('onclick', 'delPin(this.parentNode.parentNode)')
                     .attr('data-toggle', 'tooltip')
                     .attr('data-placement', 'right')
                     .attr('title', 'Click here to unpin the notification.')
                     .append(
                        'U'
        )
    );
}

function delPin(row) {
    var uid = row.id;
    getFlashMovieObject().wsendpacket('m#sm',[-1, '!NBUNPIN ' + uid]);
}

function addModRequest(uid, col, send, act) {
    $('table #pinArea').prepend('<tr id="' + uid + '" style="color:' + col + ';"><td><input id="btn_' + uid + '" type="button" class="btn btn-success btn-xs" value="✓" onclick="resolveModRequest(this.parentNode.parentNode)" data-toggle="tooltip" data-placement="right" title="Click here to signal to other mods that you will handle this request." /><button type="button" class="btn btn-secondary btn-xs" data-toggle="tooltip" data-placement="right" title="Received at ' + formatAMPM() + '">?</button></td><td style="padding:10px;font-weight:bold;width:30%;">' + send + '</td><td>' + act + '</td></tr>');
    $('[data-toggle="tooltip"]').tooltip();
}

function resolveModRequest(row) {
    var uid = row.id;
    getFlashMovieObject().wsendpacket('m#sm',[-1, '!NBMODRES ' + uid]);
    button = document.getElementById('btn_' + uid);
    button.value = "X";
    button.className = "btn btn-danger btn-xs";
    button.title = "Click here to dismiss the notification.";
    button.onclick = function() { if (button.value == "X") { delNotice(row); } };
}

function modNewHelpSession(params) {
    var uID = parseInt(params[1]);
    uID = 0 - uID;
    var uName = '[H] ' + params[2];
    if (typeof(buddies[uID]) !== 'undefined' && buddies[uID] !== null) {
        pmOnBuddy([-1, uID]);
    } else {
        buddies[uID] = {name: uName, hpm: 0};
        pmAddBuddy(uName, uID);
    }
    addUnread('privatemessage_' + uID);
    addUnread('privatemessage', true);
}

function modEndHelpSession(params) {
    var snd = parseInt(params[1]);
    if (typeof(buddies[snd]) === 'undefined' || buddies[snd] === null) {
        return; //someone's trying to meme
    }
    pmOffBuddy([-1, params[1]]);
}

function modRecvHelpSession(params) {
    addPM('#FF0000', parseInt(params[1]), params[2], params[3]);
}
