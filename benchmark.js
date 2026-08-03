class MockElement {
    constructor() {
        this.listeners = [];
    }
    addEventListener(type, fn) {
        this.listeners.push({ type, fn });
    }
    removeEventListener(type, fn) {
        this.listeners = this.listeners.filter(l => !(l.type === type && l.fn === fn));
    }
}

const mockDoc = {
    querySelectorAll: () => [new MockElement(), new MockElement(), new MockElement()]
};

function runLeak() {
    const el = new MockElement();
    const interactables = [el];

    // simulate mutation observer loop
    for (let i = 0; i < 10000; i++) {
        interactables.forEach(el => {
            el.removeEventListener('mouseenter', () => {}); // new anonymous function
            el.removeEventListener('mouseleave', () => {}); // new anonymous function
            el.addEventListener('mouseenter', () => {}); // new anonymous function
            el.addEventListener('mouseleave', () => {}); // new anonymous function
        });
    }
    return el.listeners.length;
}

function runFixed() {
    const el = new MockElement();
    const interactables = [el];

    const handleEnter = () => {};
    const handleLeave = () => {};

    // simulate mutation observer loop
    for (let i = 0; i < 10000; i++) {
        interactables.forEach(el => {
            el.removeEventListener('mouseenter', handleEnter);
            el.removeEventListener('mouseleave', handleLeave);
            el.addEventListener('mouseenter', handleEnter);
            el.addEventListener('mouseleave', handleLeave);
        });
    }
    return el.listeners.length;
}

const beforeStart = process.memoryUsage().heapUsed;
const beforeListeners = runLeak();
const beforeEnd = process.memoryUsage().heapUsed;
const leakMem = beforeEnd - beforeStart;

console.log(`Leaking benchmark: ${beforeListeners} listeners, ~${leakMem} bytes memory used`);

const afterStart = process.memoryUsage().heapUsed;
const afterListeners = runFixed();
const afterEnd = process.memoryUsage().heapUsed;
const fixMem = afterEnd - afterStart;

console.log(`Fixed benchmark: ${afterListeners} listeners, ~${fixMem} bytes memory used`);
