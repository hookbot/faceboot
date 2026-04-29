<?php
$prefix = 'http://cdn.clubpenguin.com/play/v2/games/card/icons/';
$suffix = '.swf';
function remoteFileExists($File) {
	$Handle = curl_init($File);

	curl_setopt($Handle, CURLOPT_NOBODY, true);
	curl_exec($Handle);
	$Status = curl_getinfo($Handle, CURLINFO_HTTP_CODE);
	curl_close($Handle);

	return ($Status <= 400);
}

for($i = 0; $i < 1000; ++$i) {
	if (remoteFileExists($prefix . $i . $suffix)) {
		$Contents = file_get_contents($prefix . $i . $suffix);
		file_put_contents($i . $suffix, $Contents);
		print 'Fetched card ' . $i . "!\n";
	}
}
