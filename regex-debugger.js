// Regex Debugger Utility Functions

// Predefined regex patterns and test data for randomization
const RANDOM_PATTERNS = [
    { pattern: '\d+', description: 'Match one or more digits' },
    { pattern: '[a-zA-Z]+', description: 'Match one or more letters' },
    { pattern: '\w+@\w+\.\w+', description: 'Simple email pattern' },
    { pattern: '^[A-Z][a-z]+$', description: 'Capitalized word' },
    { pattern: '\b\w{3,5}\b', description: 'Words between 3-5 characters' }
];

const RANDOM_TEST_STRINGS = [
    'Hello world 123',
    'Contact me at user@example.com',
    'The quick brown fox jumps over the lazy dog',
    '42 is the answer to everything',
    'JavaScript is awesome in 2023',
    'Testing regex can be fun!',
    'Phone: 555-1234, Email: test@domain.com'
];

function generateRandomRegexAndTestString() {
    const randomPatternIndex = Math.floor(Math.random() * RANDOM_PATTERNS.length);
    const randomStringIndex = Math.floor(Math.random() * RANDOM_TEST_STRINGS.length);
    
    const selectedPattern = RANDOM_PATTERNS[randomPatternIndex];
    const selectedString = RANDOM_TEST_STRINGS[randomStringIndex];
    
    return {
        pattern: selectedPattern.pattern,
        testString: selectedString,
        description: selectedPattern.description
    };
}

function analyzeRegex(pattern, testString) {
    try {
        const regex = new RegExp(pattern, 'g');
        const matches = [];
        let match;
        
        while ((match = regex.exec(testString)) !== null) {
            matches.push({
                match: match[0],
                index: match.index,
                groups: match.slice(1)
            });
        }
        
        return { matches };
    } catch (error) {
        return { error: error.message };
    }
}

function generateRegexExplanation(pattern) {
    const explanations = {
        // Basic patterns
        '.': 'Matches any single character except newline',
        '\\d': 'Matches any digit (0-9)',
        '\\D': 'Matches any non-digit character',
        '\\w': 'Matches any word character (alphanumeric + underscore)',
        '\\W': 'Matches any non-word character',
        '\\s': 'Matches any whitespace character (spaces, tabs, line breaks)',
        '\\S': 'Matches any non-whitespace character',
        '\\b': 'Word boundary',
        '\\B': 'Non-word boundary',
        '^': 'Start of string or line',
        '$': 'End of string or line',
        
        // Quantifiers
        '*': 'Matches 0 or more of the preceding token',
        '+': 'Matches 1 or more of the preceding token',
        '?': 'Matches 0 or 1 of the preceding token (makes it optional)',
        '{n}': 'Matches exactly n occurrences of the preceding token',
        '{n,}': 'Matches n or more occurrences of the preceding token',
        '{n,m}': 'Matches between n and m occurrences of the preceding token',
        
        // Character sets
        '[abc]': 'Matches any character in the set (a, b, or c)',
        '[^abc]': 'Matches any character not in the set',
        '[a-z]': 'Matches any character in the range (a through z)',
        '[A-Z]': 'Matches any uppercase letter',
        '[0-9]': 'Matches any digit',
    };
    
    // Parse the pattern into tokens
    const tokens = pattern.match(/([\[\]\(\)\{\}\*\+\?\.\^\$\\]|\\[dDwWsSbB]|\{\d+,?\d*\}|\[\^?[^\]]*\]|[^\[\]\(\)\{\}\*\+\?\.\^\$\\]+)/g) || [];
    
    let explanation = 'Regex Pattern Breakdown:\n';
    
    tokens.forEach(token => {
        if (explanations[token]) {
            explanation += `- ${token}: ${explanations[token]}\n`;
        } else if (token.startsWith('{') && token.endsWith('}')) {
            explanation += `- ${token}: Quantifier specifying repetition\n`;
            if (token.includes(',')) {
                const [min, max] = token.slice(1, -1).split(',');
                if (max) {
                    explanation += `- ${token}: Repeat between ${min} and ${max} times\n`;
                } else {
                    explanation += `- ${token}: Repeat at least ${min} times\n`;
                }
            } else {
                const count = token.slice(1, -1);
                explanation += `- ${token}: Repeat exactly ${count} times\n`;
            }
        } else if (token.startsWith('[') && token.endsWith(']')) {
            explanation += `- ${token}: Character set - matches any one character from the set\n`;
        } else if (token.startsWith('\\')) {
            explanation += `- ${token}: Escaped special character\n`;
        } else {
            explanation += `- ${token}: Literal text to match\n`;
        }
    });
    
    if (tokens.length === 0) {
        explanation += '- Empty pattern: Matches empty string\n';
    }
    
    return explanation;
}

// History Management
class RegexHistory {
    constructor(storage = localStorage) {
        this.storage = storage;
        this.history = JSON.parse(this.storage.getItem('regexHistory') || '[]');
    }
    
    addEntry(pattern, testString, matches, explanation) {
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
        return this.history;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const regexPatternInput = document.getElementById('regex-pattern');
    const testStringInput = document.getElementById('test-string');
    const testRegexBtn = document.getElementById('test-regex-btn');
    const clearBtn = document.getElementById('clear-btn');
    const randomizeBtn = document.getElementById('randomize-btn');
    const matchesOutput = document.getElementById('matches-output');
    const explanationOutput = document.getElementById('explanation-output');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    // Function to render history
    function renderHistory() {
        const history = new RegexHistory();
        const historyEntries = history.getHistory();
        
        historyList.innerHTML = '';
        historyEntries.forEach(entry => {
            const historyEntryDiv = document.createElement('div');
            historyEntryDiv.classList.add('history-entry');
            historyEntryDiv.innerHTML = `
                <p>Pattern: ${entry.pattern}</p>
                <p>Test String: ${entry.testString}</p>
                <button class="load-history-btn" data-id="${entry.id}">Load</button>
                <button class="delete-history-btn" data-id="${entry.id}">Delete</button>
            `;
            
            const loadBtn = historyEntryDiv.querySelector('.load-history-btn');
            const deleteBtn = historyEntryDiv.querySelector('.delete-history-btn');
            
            loadBtn.addEventListener('click', () => {
                regexPatternInput.value = entry.pattern;
                testStringInput.value = entry.testString;
            });
            
            deleteBtn.addEventListener('click', () => {
                history.removeEntry(entry.id);
                renderHistory();
            });
            
            historyList.appendChild(historyEntryDiv);
        });
    }
    
    // Initial history render
    renderHistory();
    
    // Test regex function
    function performRegexTest() {
        const pattern = regexPatternInput.value;
        const testString = testStringInput.value;
        
        if (!pattern) {
            matchesOutput.innerHTML = '<p>Please enter a regex pattern</p>';
            return;
        }
        
        try {
            const result = analyzeRegex(pattern, testString);
            const explanation = generateRegexExplanation(pattern);
            
            // Save to history
            const history = new RegexHistory();
            history.addEntry(pattern, testString, result.matches, explanation);
            
            // Clear previous outputs
            matchesOutput.innerHTML = '<h3>Matches:</h3>';
            explanationOutput.innerHTML = '<h3>Explanation:</h3>';
            
            // Display matches
            if (result.error) {
                matchesOutput.innerHTML += `<p class="error">Error: ${result.error}</p>`;
            } else if (result.matches.length > 0) {
                const matchesContainer = document.createElement('div');
                matchesContainer.classList.add('matches-container');
                
                result.matches.forEach(match => {
                    const matchDiv = document.createElement('div');
                    matchDiv.classList.add('match');
                    
                    // Create a highlighted version of the test string with the match highlighted
                    const highlightedMatch = testString.substring(0, match.index) + 
                        `<span class="highlight">${match.match}</span>` + 
                        testString.substring(match.index + match.match.length);
                    
                    matchDiv.innerHTML = `
                        <p>Match: <strong>${match.match}</strong></p>
                        <p>Index: <span class="index-badge">${match.index}</span></p>
                        <div class="context">
                            <p>Context: <code>${highlightedMatch}</code></p>
                        </div>
                    `;
                    
                    // Add groups if any
                    if (match.groups && match.groups.length > 0) {
                        const groupsDiv = document.createElement('div');
                        groupsDiv.classList.add('groups');
                        groupsDiv.innerHTML = '<p><strong>Capture Groups:</strong></p>';
                        
                        match.groups.forEach((group, index) => {
                            if (group) { // Only show non-empty groups
                                const groupItem = document.createElement('div');
                                groupItem.classList.add('group-item');
                                groupItem.innerHTML = `<p>Group ${index + 1}: <code>${group}</code></p>`;
                                groupsDiv.appendChild(groupItem);
                            }
                        });
                        
                        if (groupsDiv.querySelectorAll('.group-item').length > 0) {
                            matchDiv.appendChild(groupsDiv);
                        }
                    }
                    
                    matchesContainer.appendChild(matchDiv);
                });
                
                matchesOutput.appendChild(matchesContainer);
            } else {
                matchesOutput.innerHTML += '<p class="no-matches">No matches found</p>';
            }
            
            // Display explanation
            const formattedExplanation = explanation.replace(/\n/g, '<br>').replace(/- ([^:]+):/g, '<strong>$1:</strong>');
            explanationOutput.innerHTML += `<div class="explanation-content">${formattedExplanation}</div>`;
            
            // Update history display
            renderHistory();
            
        } catch (error) {
            matchesOutput.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }
    
    // Event listeners
    testRegexBtn.addEventListener('click', performRegexTest);
    
    clearBtn.addEventListener('click', () => {
        regexPatternInput.value = '';
        testStringInput.value = '';
        matchesOutput.innerHTML = '';
        explanationOutput.innerHTML = '';
    });
    
    randomizeBtn.addEventListener('click', () => {
        const randomData = generateRandomRegexAndTestString();
        regexPatternInput.value = randomData.pattern;
        testStringInput.value = randomData.testString;
        
        // Show description with animation
        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('random-description');
        descriptionDiv.innerHTML = `
            <div class="random-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z"></path>
                    <polyline points="8 10 12 14 16 10"></polyline>
                </svg>
                <strong>Random Pattern</strong>
            </div>
            <p>${randomData.description}</p>
            <p class="pattern-preview"><code>${randomData.pattern}</code></p>
        `;
        
        // Clear previous outputs with a smooth transition
        matchesOutput.innerHTML = '';
        explanationOutput.innerHTML = '';
        matchesOutput.appendChild(descriptionDiv);
        
        // Add a small delay for better UX
        setTimeout(() => {
            // Automatically test the regex
            performRegexTest();
        }, 300);
    });
    
    clearHistoryBtn.addEventListener('click', () => {
        const history = new RegexHistory();
        history.clearHistory();
        renderHistory();
    });
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeRegex,
        generateRegexExplanation,
        RegexHistory,
        generateRandomRegexAndTestString
    };
}
