const dateUtil = require('../../util/date');

module.exports = (postsMeta) => {
    let generated = `<section><ul class="post-list">`;
    for (let post of postsMeta) {
        let pubDate = dateUtil.date2string(post.pubDate);
        generated += `<li><time datetime="">${pubDate}</time><a href="${post.url}">${post.title}</a></li>`; // TODO: добавить генерацию datetime
    }
    generated += `</ul></section>`;

    return generated;
}
