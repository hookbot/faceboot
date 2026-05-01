<?php
// (C) B00mX0r 2016
// for CPPS.me
// Function: to encrypt widgets so the server sends the decryption key to the client
// This prevents non-mods from simply doing view-source on widgets/mod.html to gain confidential info
if (!isset($argv)) {
	die('This script must be run from the command line.');
}


