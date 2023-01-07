const http = require('http');
const fs = require('fs');
const path = require('path');
const pageBuilder = require('./builder');

const PORT = 3000;

const POSTS_DIRECTORY = path.join(process.cwd(), 'posts');
const POST_URL = (dirName) => `/post/${dirName}`;

const app = http.createServer((req, res) => {
	let url = decodeURIComponent(req.url);

	if (url == '' || url == '/') {
		let content = pageBuilder.buildIndex(POSTS_DIRECTORY, POST_URL);

		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.end(content);
	} else if (url.startsWith('/post')) {
		let postName = url.split('/').reverse()[0]; // TODO: better url parsing

		let content = pageBuilder.buildPost(POSTS_DIRECTORY, postName);

		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.end(content);
	} else { // TODO: refactor
		const STATIC_DIRS = ['static'];

		function tryStatic (path_) {
			path_ = path.join(process.cwd(), path_);
			try {
				const result = { data: fs.readFileSync(path_) };
				const ext = path.extname(path_).substring(1);
				switch (ext) {
					case 'svg':
						result.type = 'image/svg+xml';
						break;
						case 'png':
					case 'webp':
						case 'jpg':
						result.type = 'image/' + ext;
						break;
					case 'html':
					case 'css':
						result.type = 'text/' + ext;
						break;
					case 'json':
						result.type = 'application/json';
						break;
					default:
						result.type = 'application/octet-stream';
						break;
				}
		
				return result;
			} catch (err) {
				switch (err.code) {
					case 'EACCES': return { code: 403, error: 'Forbidden' };
					case 'EISDIR': return { code: 400, error: 'Directory requested' };
					case 'EINVAL': return { code: 400, error: 'Invalid entity requested' };
					case 'ENOENT': return { code: 404, error: 'File not found' };
				}
			}
		}

		let fileRead;
		for (const baseDir of STATIC_DIRS) {
			fileRead = tryStatic(baseDir + url);
			if (fileRead.error) {
				if (fileRead.code != 404) break;
			} else {
				res.setHeader('content-length', fileRead.data.byteLength);
				res.setHeader('content-type', fileRead.type);
				res.end(fileRead.data);
				return;
			}
		}

		if (fileRead.error) {
			res.setHeader('content-type', 'text/plain');
			res.writeHead(fileRead.code);
			res.end(fileRead.error);
		}
	}
})

app.listen(PORT, () => {
	console.log('Server started on http://localhost:' + PORT);
});
