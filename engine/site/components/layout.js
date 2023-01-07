const TITLE = 'Примитивный блог'; // TODO

module.exports = (homePage, content) => `
<header>
    <h2>${TITLE}</h2>
    <nav class="menu">
        <a class="${homePage ? 'active' : ''}" href="/">Посты</a>
        <a href="https://github.com/primitive0">GitHub</a>
    </nav>
</header>
<main>${content}</main>
`
