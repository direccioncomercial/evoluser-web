const { JSDOM } = require('jsdom');
const { performance } = require('perf_hooks');

const html = `
<ul id="chat-box"></ul>
`;

function benchmarkInnerHTML() {
    const dom = new JSDOM(html);
    const chatBox = dom.window.document.getElementById('chat-box');
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
        chatBox.innerHTML += `<li>Message ${i}</li>`;
    }
    return performance.now() - start;
}

function benchmarkInsertAdjacentHTML() {
    const dom = new JSDOM(html);
    const chatBox = dom.window.document.getElementById('chat-box');
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
        chatBox.insertAdjacentHTML('beforeend', `<li>Message ${i}</li>`);
    }
    return performance.now() - start;
}

console.log('innerHTML +=: ' + benchmarkInnerHTML() + ' ms');
console.log('insertAdjacentHTML: ' + benchmarkInsertAdjacentHTML() + ' ms');
