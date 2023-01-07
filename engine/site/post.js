const fs = require('fs');
const path = require('path');

const layout = require('./components/layout');

module.exports = (name, date, content) => {
    let template = fs.readFileSync(path.join(__dirname, 'index.html')).toString();
    let header = `<div class="post-title"><h1>${name}</h1><time datetime="">${date}</time></div>`;
    content = `<section>${header}</section><hr><section>${content}</section>`;
    let body = layout(false, content);
    return template.replace('{{BODY}}', body).replace('{{TITLE}}', 'Примитивный блог');
}
