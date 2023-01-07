const fs = require('fs');
const path = require('path');
const meta = require('./meta');
const pageBuilder = require('./builder');

const OUT_DIR = path.join(process.cwd(), 'dist');

function mkdir(path, options) {
	try {
        fs.mkdirSync(path, options);
    } catch (err) {
		if (err.code == 'EEXIST') {
            return;
        }
        throw err;
	}
}

function writeTo(relativePath, data) {
    let parts = relativePath.split('/').filter(v => v != '');
    parts.pop();
    if (parts.length != 0) {
        mkdir(path.join(OUT_DIR, parts.join('/')));
    }
    fs.writeFileSync(path.join(OUT_DIR, relativePath), data);
}

function copy(src, dst) {
	if (fs.statSync(src).isDirectory()) {
		mkdir(dst);
		for (const name of fs.readdirSync(src)) {
			copy(path.join(src, name), path.join(dst, name));
		}
	} else {
		fs.copyFileSync(src, dst);
	}
}

// TODO: config
const POSTS_DIRECTORY = path.join(process.cwd(), 'posts');
const POST_URL = (dirName) => `/post/${dirName}`;

mkdir(OUT_DIR);
writeTo('index.html', pageBuilder.buildIndex(POSTS_DIRECTORY, POST_URL));

for (let postInfo of meta.grapPostsInfo(POSTS_DIRECTORY)) {
    writeTo(`/post/${postInfo.dirName}.html`, pageBuilder.buildPost(POSTS_DIRECTORY, postInfo.dirName));
}

copy(path.join(process.cwd(), 'static'), OUT_DIR);
