const fs = require('fs');
const path = require('path');

const layout = require('./components/layout');
const posts = require('./components/posts');

module.exports = (postsMeta) => {
    let template = fs.readFileSync(path.join(__dirname, 'index.html')).toString();
    let body = layout(true, posts(postsMeta));
    return template.replace('{{BODY}}', body).replace('{{TITLE}}', 'Примитивный блог');
}
