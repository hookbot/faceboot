function addNotice(col, send, act, pin) { //TODO: add pin notice subclass cs
    send = jQuery('<div />').text(send).html(); //this is a hacky way of getting a jq selector so we can escape entities
    act = jQuery('<div />').text(act).html();
    var addition = $('<tr class="normalNotice" style="color:' + col + ';"><td><input type="button" class="btn btn-danger btn-xs" value="X" onclick="delNotice(this.parentNode.parentNode)" data-toggle="tooltip" data-placement="right" title="Click here to dismiss the notification." /><button type="button" class="btn btn-secondary btn-xs" data-toggle="tooltip" data-placement="right" title="Received at ' + formatAMPM(new Date()) + '">?</button></td><td style="padding:10px;font-weight:bold;width:30%;">' + send + '</td><td>' + act + '</td></tr>');
    addition.prependTo('table #normalArea').hide().fadeIn('slow');
    //if mod then modAddNotice or something like that to add special buttons???
    if (typeof modAddNotice === 'function') {
        modAddNotice(col, send, act, pin);
    }
    $('[data-toggle="tooltip"]').tooltip();
    addUnread('noticeboard');
}

function addPin(msg, uid) {
    var addition = $('<tr id="' + uid +'" style="color:#AA5555;background-color:#CFEBFD;"><td class="buttons"><button type="button" class="btn btn-danger btn-xs" onclick="delNotice(this.parentNode.parentNode)" data-toggle="tooltip" data-placement="right" title="Click here to dismiss the notification.">X</button></td><td colspan="2">' + msg + '</td></tr>');
    addition.prependTo('table #pinArea').hide().fadeIn('slow');
    if (typeof modAddPin === 'function') {
        modAddPin(uid);
    }
    $('[data-toggle="tooltip"]').tooltip();
    addUnread('noticeboard');
}

function delNotice(row) {
	var index = row.rowIndex;
	$(row)
            .children('td, th')
            .animate({
            padding: 0
        })
            .wrapInner('<div />')
            .children()
            .slideUp(function () {
            $(this).closest('tr').remove();
        });
}

function delNoticeByID(id) { //use for pins too
    row = document.getElementById(id);
    delNotice(row);
}
