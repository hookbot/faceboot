var buddies = {};
var curPM;
var username = 'Me';
var helpSession = false;

function pmInitListeners() {
	getFlashMovieObject().waddpacket('bon', 'pmOnBuddy');
	getFlashMovieObject().waddpacket('ba', 'pmOnBuddy'); //The 'ba' includes a third parameter (the buddy name), but not worth creating a third func. for
	getFlashMovieObject().waddpacket('bof', 'pmOffBuddy');
	getFlashMovieObject().waddpacket('rb', 'pmOffBuddy'); //See note for the 'ba' listener

	getFlashMovieObject().waddpacket('pm', 'recvPM');
	getFlashMovieObject().waddpacket('wai', 'recvWhoAmI');
	getFlashMovieObject().wsendpacket('m#sm',[-1, '!whoami']);

	if (typeof modNewHelpSession === 'function') {
		getFlashMovieObject().waddpacket('ihr', 'modNewHelpSession');
		getFlashMovieObject().waddpacket('dhr', 'modEndHelpSession');
		getFlashMovieObject().waddpacket('mhr', 'modRecvHelpSession');
	}
	else {
		getFlashMovieObject().waddpacket('ihr', 'newHelpSession');
		getFlashMovieObject().waddpacket('dhr', 'endHelpSession');
	}
}

$(function() {
	pmInitListeners();
	getBuddies();
	$.each(buddies, function(id, info) {
		pmAddBuddy(info['name'], id);
	});
});

function newHelpSession(params) {
	if (helpSession === true) {
		return;
	}
	buddies[-1] = {name: '<u>.me Staff</u>', hpm: 0};
	pmAddBuddy('<u>.me Staff</u>', -1);
	helpSession = true;
	loadSubWidget('privatemessage_-1', 'privatemessage');
}

function endHelpSession(params) {
	helpSession = false;
	pmOffBuddy([-1, -1]);
}

function recvWhoAmI(params) {
	username = params[0];
}

function getBuddies() {
	var flashBuddies = getFlashMovieObject().wbuddies();
	$.each(flashBuddies, function(i, buddy) { //TODO: how to handle name changes? what happens for a name change or !nick when buddy has sent a PM then relogs to a new name but same ID?
		buddy[1] = jQuery('<div />').text(buddy[1]).html();
		buddies[buddy[0]] = {name: buddy[1], hpm: 0}; //Note that this doesn't remove buddies in the object before no long here.
	});
}

function pmAddBuddy(name, id) { //TODO: support off buddy coming back on, add <hr/> between old convo and new convo but make sure not to dupe create the submenu
	addSubMenu('privatemessage', name, id);
	var pmWindow = $('<div>').attr('class', 'widgetSub')
							 .attr('id', 'privatemessage_' + id)
							 .append(
							 	$('<h3>').attr('id', 'pmRecipient')
							 			 .append(
							 			 	'PM -> ' + name
							 			 )
							 			 .append(
							 			 	$('<button>').attr('type', 'button')
    													 .attr('class', 'btn btn-danger btn-xs')
														 .attr('data-toggle', 'tooltip')
														 .attr('data-placement', 'right')
														 .attr('title', 'Click here to delete this conversation.')
														 .attr('onclick', 'pmDelConvo("' + id + '")')
														 .append(
															'X'	
    													 )
							 			 )
							 )
							 .append(
								$('<textarea>').attr('id', 'sendPm_' + id)
											   .attr('placeholder', 'Enter your PM and press Enter!')
											   .attr('style', 'width:95%;height:25px;margin:1px;bottom:0px;')
							 )
							 .append(
							 	$('<table>').attr('class', 'table')
							 				.attr('id', 'pmTable')
							 				.append(
							 					$('<thead>').append(
							 									$('<tr>').append(
							 												$('<th>').attr('style', 'width:35%;')
							 														 .append(
							 															'Name'
							 														)
							 											).append(
							 												$('<th>').append(
							 															'Message'
							 														)
							 											)
							 								)
							 				)
							 				.append(
							 					$('<tbody>').attr('id', 'pmArea')
							 								.attr('style', 'overflow-y:scroll;height:95%;')
							 				)
							);
	pmWindow.appendTo($('#privatemessage.widgetBody')).hide();
	$('#sendPm_' + id).on('keypress', function (e) {
         if(e.which === 13){
         	e.preventDefault();
         	var PM = $(this).val();
         	sendPM(id, PM);
         	$(this).val(null);
         }
   });
}

function sendPM(id, msg) {
	getFlashMovieObject().wprivmsg(id, msg);
	addPM('#FFA500', id, username, msg);
}

function pmOnBuddy(params) {
	buddyid = parseInt(params[1]);
	if (typeof(buddies[buddyid]) !== 'undefined' && buddies[buddyid] !== null) {
		$('#sendPm_' + buddyid).removeAttr('disabled');
		$('#sendPm_' + buddyid).attr('placeholder', 'Enter your PM and press Enter!');
	}
	else { //New submenu
		getBuddies(); //Reload buddies object so we now have the name
		buddy = buddies[buddyid];
		pmAddBuddy(buddy['name'], buddyid);
	}
}

function pmOffBuddy(params) {
	buddyid = parseInt(params[1]);
	var buddy = buddies[buddyid];
	if (buddy['hpm'] > 0) { //We have messages logged with this buddy, so don't prevent us from reading the convo
		$('#sendPm_' + buddyid).attr('disabled', 'disabled');
		$('#sendPm_' + buddyid).attr('placeholder', buddy["name"] + ' is offline!');
	}
	else { //We never PM'd this buddy in the first place, so just kill our ability to see the convo pane
		pmDelConvo(buddyid);
	}
}

function pmDelConvo(buddyid) {
	if (buddyid == -1 && helpSession === true) {
		//buddies[-1]['hpm'] = 0; //If they used the del button on a help convo delete it instantly instead of just ending it
		getFlashMovieObject().wprivmsg(-1, '!end');
		return;
	}
	$('#link_privatemessage_' + buddyid).closest('li').remove();
	$('#privatemessage_' + buddyid).remove();
	if (typeof(buddies[buddyid]) !== 'undefined' && buddies[buddyid] !== null) {
		delete buddies[buddyid];
	}
}

function recvPM(params) {
	var sender = parseInt(params[1]);
	if (typeof(buddies[sender]) === 'undefined' || buddies[sender] === null) { //nope.avi
		buddies[sender] = {name: params[2], hpm: 0};
		pmAddBuddy(params[2], params[1]); // :/
	}
	var section = sender;
	sender = buddies[sender]['name'];
	var msg = params[3];
	addPM('#0000cc', section, sender, msg);
	++buddies[section]['hpm'];
    return buddies[section]['hpm'];
}

function addPM(col, section, sender, msg) { //TODO: reorder list by who sent last PM?
    msg = jQuery('<div />').text(msg).html();
    var addition = $('<tr>').attr('class', 'privmsg')
    						.attr('style', 'color:' + col + ';')
    						.append(
    							$('<td>').attr('style', 'font-weight:bold;width:35%;')
    									 .append(
    											sender + ' '
    									 ).append(
    											$('<button>').attr('type', 'button')
    										 				 .attr('class', 'btn btn-secondary btn-xs')
    										 				 .attr('data-toggle', 'tooltip')
    										 				 .attr('data-placement', 'right')
    										 				 .attr('title', formatAMPM())
    										 				 .append(
																 '?'	
    														 )
    									)
    						)
    						.append(
    							$('<td>').append(
    										msg
    							)
    						)
    ;
    // class="normalNotice" style="display:none;color:' + col + ';"><td><input type="button" class="btn btn-danger btn-xs" value="X" onclick="delNotice(this.parentNode.parentNode)" data-toggle="tooltip" data-placement="right" title="Click here to dismiss the notification." /><button type="button" class="btn btn-secondary btn-xs" data-toggle="tooltip" data-placement="right" title="Received at ' + formatAMPM(new Date()) + '">?</button></td><td style="padding:10px;font-weight:bold;">' + send + '</td><td>' + act + '</td></tr>');
    addition.prependTo($('#privatemessage_' + section + ' table#pmTable #pmArea')).hide().fadeIn('fast');
    $('[data-toggle="tooltip"]').tooltip();
    if ($('#privatemessage_' + section + ':visible').length === 0 || $('#privatemessage_' + section + ':visible')[0].id !== 'privatemessage_' + section) { //Only addUnread if we're not in this PM
    	addUnread('privatemessage_' + section);
    	addUnread('privatemessage', true);
    }
}
