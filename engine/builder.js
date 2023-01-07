const fs = require('fs');
const path = require('path');
const katex = require('katex');
const marked = require('marked');
const meta = require('./meta');
const dateUtil = require('./util/date');

const indexPage = require('./site/index');
const postPage = require('./site/post');

const LATEX_BLOCK_REGEX = /\$\$\s*(.+?)\s*\$\$/sg;
const LATEX_INLINE_REGEX = /\$(.+?)\$/g;

function latexReplacer(isBlock) {
    return (match, latex) => {
        return katex.renderToString(latex, { displayMode: isBlock, throwOnError: true });
    };
}

function buildIndex(postsDirectory, makePostUrl) {
    let postsInfo = meta.grapPostsInfo(postsDirectory);
    for (const postInfo of postsInfo) {
        postInfo.url = makePostUrl(postInfo.dirName);
    }

    return indexPage(postsInfo);
}

function buildPost(postsDirectory, postName) {
    let info = meta.loadPostInfo(path.join(postsDirectory, postName));
    let pageRaw = fs.readFileSync(path.join(postsDirectory, postName, 'page.md')).toString();

    let transformed = pageRaw
        .replace(LATEX_BLOCK_REGEX, latexReplacer(true))
        .replace(LATEX_INLINE_REGEX, latexReplacer(false));
    transformed = marked.parse(transformed);
    return postPage(info.title, dateUtil.date2string(info.pubDate), transformed);
}

module.exports = { buildIndex, buildPost };
