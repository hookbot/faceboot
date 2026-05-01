<?php

$File = fopen('rooms_replace.txt', 'r');
print "\n";
while($Line = fgets($File)) {
	$Parts = explode(': ', $Line);
	list($RoomName, $SWFLocation) = $Parts;
	$RoomName = strtolower($RoomName);
	$SWFLocation = trim($SWFLocation);
	if (empty($SWFLocation)) continue;
	$FName = $RoomName . '.swf';
	print "Retrieving " . $FName . "...\n";
	$SWF = file_get_contents($SWFLocation);
	file_put_contents($FName, $SWF);
}
print "\n";
