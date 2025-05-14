// Import functions to test
const { analyzeRegex, generateRegexExplanation } = require('./regex-debugger');

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => (key in store ? store[key] : '[]')),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

// Mock RegexHistory class
class RegexHistory {
    constructor(storage = localStorageMock) {
        this.storage = storage;
        this._syncFromStorage();
    }

    _syncFromStorage() {
        this.history = JSON.parse(this.storage.getItem('regexHistory'));
    }

    addEntry(pattern, testString, matches, explanation) {
        this._syncFromStorage();
        const entry = {
            id: Date.now() + Math.floor(Math.random() * 100000),
            pattern,
            testString,
            matches,
            explanation,
            timestamp: new Date().toLocaleString()
        };
        this.history.push(entry);
        this.saveHistory();
        return entry;
    }

    removeEntry(id) {
        this._syncFromStorage();
        this.history = this.history.filter(entry => entry.id !== id);
        this.saveHistory();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    saveHistory() {
        this.storage.setItem('regexHistory', JSON.stringify(this.history));
    }

    getHistory() {
        this._syncFromStorage();
        return this.history;
    }
}

describe('Regex Utility Functions', () => {
    describe('analyzeRegex', () => {
        test('finds multiple matches', () => {
            const result = analyzeRegex('\\d+', 'I have 42 apples and 7 oranges');
            expect(result.matches).toHaveLength(2);
            expect(result.matches[0].match).toBe('42');
            expect(result.matches[1].match).toBe('7');
        });

        test('handles no matches', () => {
            const result = analyzeRegex('\\d+', 'No numbers here');
            expect(result.matches).toHaveLength(0);
        });

        test('handles invalid regex', () => {
            const result = analyzeRegex('[', 'Test string');
            expect(result.error).toBeTruthy();
        });

        test('works with complex regex', () => {
            // Pattern updated to match full email (including dot in username)
            const result = analyzeRegex('([\\w\\.]+)@(\\w+\\.\\w+)', 'Contact me at user.name@example.com');
            expect(result.matches[0].match).toBe('user.name@example.com');
            expect(result.matches[0].groups).toHaveLength(2);
            expect(result.matches[0].groups[0]).toBe('user.name');
            expect(result.matches[0].groups[1]).toBe('example.com');
        });
    });

    describe('generateRegexExplanation', () => {
        test('explains basic patterns', () => {
            const explanation = generateRegexExplanation('\\d+');
            expect(explanation).toContain('\\d: Any digit (0-9)');
            expect(explanation).toContain('+: One or more of the preceding character');
        });

        test('explains character sets', () => {
            const explanation = generateRegexExplanation('[a-z]+');
            expect(explanation).toContain('Character set matching a-z');
        });

        test('handles multiple pattern elements', () => {
            const explanation = generateRegexExplanation('^\\w+@\\w+\\.\\w+$');
            expect(explanation).toContain('^: Start of the string');
            expect(explanation).toContain('$: End of the string');
        });

        test('handles unknown patterns', () => {
            const explanation = generateRegexExplanation('xyz');
            expect(explanation).toBe('Regex Pattern Breakdown:\nNo specific pattern details found.');
        });

        test('explains complex regex patterns', () => {
            const explanation = generateRegexExplanation('^\\w+@\\w+\\.\\w+$');
            expect(explanation).toContain('Start of the string');
            expect(explanation).toContain('End of the string');
            expect(explanation).toContain('Any word character (a-z, A-Z, 0-9, _)');
        });

        test('provides detailed character set explanations', () => {
            const explanation = generateRegexExplanation('[a-zA-Z0-9]+');
            expect(explanation).toContain('Character set matching a-zA-Z0-9');
        });

        test('explains quantifiers precisely', () => {
            const explanation = generateRegexExplanation('a{2,4}');
            expect(explanation).toContain('Repeat between 2 and 4 times');
        });
    });

    describe('RegexHistory', () => {
        let regexHistory;

        beforeEach(() => {
            localStorageMock.clear();
            regexHistory = new RegexHistory();
        });

        test('initializes empty history', () => {
            expect(regexHistory.getHistory()).toHaveLength(0);
        });

        test('adds entry to history', () => {
            const matches = [{ match: '42', index: 10 }];
            regexHistory.addEntry('\\d+', 'Test 42', matches, 'Matches digits');
            
            const history = regexHistory.getHistory();
            expect(history).toHaveLength(1);
            expect(history[0].pattern).toBe('\\d+');
            expect(history[0].testString).toBe('Test 42');
        });

        test('removes specific history entry', () => {
            const entry1 = regexHistory.addEntry('\\d+', 'Test 42', [], 'Matches digits');
            const entry2 = regexHistory.addEntry('\\w+', 'Hello', [], 'Matches words');
            
            regexHistory.removeEntry(entry1.id);
            
            const history = regexHistory.getHistory();
            expect(history).toHaveLength(1);
            expect(history[0].pattern).toBe('\\w+');
        });

        test('clears entire history', () => {
            regexHistory.addEntry('\\d+', 'Test 42', [], 'Matches digits');
            regexHistory.addEntry('\\w+', 'Hello', [], 'Matches words');
            
            regexHistory.clearHistory();
            
            expect(regexHistory.getHistory()).toHaveLength(0);
        });

        test('persists history between instances', () => {
            regexHistory.addEntry('\\d+', 'Test 42', [], 'Matches digits');
            
            // Create a new instance to simulate page reload
            const newHistory = new RegexHistory();
            expect(newHistory.getHistory()).toHaveLength(1);
        });
    });
});
