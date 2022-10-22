const path = require("path");
const i18n = require('i18n');

i18n.configure({
    locales: ["US", "AM"],
    directory: path.join(__dirname, './languages'),
    register: global
});

function translate(p, l, ph) {
    return __({ phrase: p, locale: l }, ph);
}

module.exports = { translate };