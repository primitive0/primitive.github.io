const dateUtil = require('../../util/date');

module.exports = (postsMeta) => {
    const BEGIN = '<section><ul>';
    const END = '</ul></section>';

    let generated = BEGIN;
    for (let post of postsMeta) {
        let pubDate = dateUtil.date2string(post.pubDate);
        generated += `<li><time datetime="">${pubDate}</time><a href="${post.url}">${post.title}</a></li>`; // TODO: добавить генерацию datetime
    }
    generated += END;

    return generated;
}
