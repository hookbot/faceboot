from urlparse import urlparse
import json
import os

import requests
import concurrent.futures

itemURLs = []

itemPaths = [
	'paper',
	'sprites',
	'icons',
	'photos'
]

typeMapping = [
	itemPaths[2],
	itemPaths[:-1],
	itemPaths[:-1],
	itemPaths[:-1],
	itemPaths[:-1],
	itemPaths[:-1],
	itemPaths[:-1],
	itemPaths[2],
	itemPaths[2:],
	itemPaths[2]
]

def downloadFile(url):
	r = requests.get(url)
	content = r.content

	parsedUrl = urlparse(url)
	splitPath = parsedUrl.path.split('/')

	fileDirectory = splitPath[6]
	fileName = splitPath[7]

	filePath = '{0}/{1}'.format(fileDirectory, fileName)

	# Just in case I fucked up somewhere else
	if os.path.exists(filePath):
		print 'Skipping {0} because it already exists..'.format(filePath)
	else:
		with open(filePath, 'wb') as fileResource:
			fileResource.write(content)
	
	return r.content

paperItems = requests.get('http://cdn.clubpenguin.com/play/en/web_service/game_configs/paper_items.json').text
items = json.loads(paperItems)

for item in items:
	itemId = int(item['paper_item_id'])
	itemType = int(item['type'])

	for path in itemPaths:
		if not os.path.exists(path):
			os.makedirs(path)

		filePath = '{0}/{1}.swf'.format(path, itemId)

		if os.path.exists(filePath):
			print 'Skipping {0} because it already exists...'.format(filePath)

			continue

		if path in typeMapping[itemType - 1]:
			itemURLs.append('http://cdn.clubpenguin.com/play/v2/content/global/clothing/{0}/{1}.swf'.format(path, itemId))

# We can use a with statement to ensure threads are cleaned up promptly
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
	# Start the load operations and mark each future with its URL
	future_to_url = {executor.submit(downloadFile, url): url for url in itemURLs}
	for future in concurrent.futures.as_completed(future_to_url):
		url = future_to_url[future]
		try:
			data = future.result()
		except Exception as exc:
			print('%r generated an exception: %s' % (url, exc))
		else:
			print('%r page is %d bytes' % (url, len(data)))
