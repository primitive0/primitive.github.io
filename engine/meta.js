const fs = require('fs');
const path = require('path');

function parseMeta(data) {
	let lines = data.split('\n');
	let meta = {};
	for (let line of lines) {
		if (line == '') {
			continue;
		}

		let [key, value] = line.split(':');
		key = key.trim();
		value = value.trim();
		meta[key] = value;
	}
	return meta;
}

function parseDate(string) {
    return new Date(string.split('-').reverse().join('-'));
}

function loadPostInfo(postDirectory) {
    let contents = fs.readFileSync(path.join(postDirectory, 'meta')).toString();
    let meta = parseMeta(contents);
    return {
        title: meta.title,
        pubDate: parseDate(meta['pub-date']),
        hide: meta.hide,
    };
}

function grapPostsInfo(postsDirectory) {
    let infos = [];
    for (let postDirectoryName of fs.readdirSync(postsDirectory)) {
        let pathToPost = path.join(postsDirectory, postDirectoryName);
        if (!fs.statSync(pathToPost).isDirectory()) {
            console.log(`warn: не могу прочитать файл "${pathToPost}"`);
            continue;
        }
        let info = loadPostInfo(pathToPost);
        info.dirName = postDirectoryName;
        infos.push(info);
    }
    return infos;
}

module.exports = { loadPostInfo, grapPostsInfo }
