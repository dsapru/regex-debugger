# Regex Debugger

A modern, interactive web tool to test, analyze, and learn regular expressions with a clean, intuitive interface.

![Regex Debugger](https://i.imgur.com/placeholder.png)

## Features

### Core Functionality
- **Powerful Regex Analysis**: Test any regular expression against a string with accurate match/group extraction and detailed context visualization
- **Intelligent Explanation**: Get comprehensive, token-by-token explanations of regex patterns with syntax highlighting
- **Smart Randomization**: Generate random regex patterns and test strings with one click to explore and learn regex concepts
- **Persistent History**: Save, load, and manage your regex tests with localStorage-based history tracking

### User Experience
- **Modern UI**: Clean, Material Design-inspired interface with intuitive controls
- **Visual Context**: See matches highlighted within the original test string for better understanding
- **Capture Group Display**: Clearly view and understand capture groups with dedicated formatting
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **Comprehensive Test Coverage**: All core features validated by automated Jest test suite
- **Robust Error Handling**: Clear feedback for invalid regex patterns
- **Performance Optimized**: Fast, responsive interface even with complex patterns
- **Well-Documented Code**: Clean, maintainable JavaScript with clear organization

## How to Use

### Basic Testing
1. Enter a regular expression in the "Regular Expression" input field
2. Enter a test string in the "Test String" input field
3. Click "Test Regex" to see matches and explanations
4. View highlighted matches and detailed explanations below

### Learning with Randomization
1. Click "Randomize" to generate a random regex pattern and test string
2. See the pattern description explaining what the regex does
3. Observe the matches and how they work with the provided test string
4. Modify the pattern or test string to experiment further

### Managing History
1. Every test is automatically saved to your history
2. Click "Load" on any history entry to restore that test
3. Click "Delete" to remove specific entries
4. Use "Clear History" to remove all saved tests

## Example Use Cases

### For Developers
- Test and debug regex patterns before implementing them in code
- Visualize exactly how your patterns match against real data
- Save common patterns for reuse across projects
- Understand capture groups and their contents

### For Learners
- Explore regex concepts through the randomize feature
- See visual explanations of how different regex components work
- Experiment with patterns in a friendly environment
- Build understanding through practical examples

### For Data Analysts
- Quickly validate extraction patterns for data processing
- Test patterns against sample data sets
- Refine patterns with immediate visual feedback
- Save patterns for documentation and knowledge sharing

## Supported Regex Features

### Pattern Matching
- **Basic Literals**: Match exact characters and strings
- **Character Classes**: `[abc]`, `[^abc]`, `[a-z]`, etc.
- **Predefined Classes**: `\d`, `\w`, `\s`, `\D`, `\W`, `\S`
- **Anchors**: `^` (start), `$` (end), `\b` (word boundary)

### Quantifiers
- **Basic**: `*` (0 or more), `+` (1 or more), `?` (0 or 1)
- **Specific**: `{n}` (exactly n), `{n,}` (n or more), `{n,m}` (between n and m)

### Advanced Features
- **Capture Groups**: Extract specific parts of matches
- **Context Visualization**: See where matches occur in the original string
- **Detailed Explanations**: Get comprehensive breakdowns of complex patterns

## Technologies Used

### Frontend
- **HTML5**: Semantic markup for structure
- **CSS3**: Modern styling with animations and responsive design
- **Vanilla JavaScript**: Pure JS with no dependencies for core functionality

### Storage
- **localStorage API**: Browser-based persistent storage for history management

### Testing
- **Jest**: Comprehensive test suite for all core functionality
- **Automated Testing**: CI-ready tests for regex analysis, explanation, and history management

### Development
- **Modern ES6+**: Using latest JavaScript features
- **Material Design Principles**: Clean, intuitive user interface
- **Responsive Design**: Works on all device sizes

## Installation and Setup

### Quick Start
```bash
# Clone the repository
git clone https://github.com/dsapru/regex-debugger.git

# Navigate to the project directory
cd regex-debugger

# Open in browser
open index.html
```

### Development
```bash
# Install dependencies for testing
npm install

# Run tests
npm test

# Start a local development server
npx http-server
```

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

MIT License - feel free to use and modify for your own projects.

---

Built with ❤️ for regex enthusiasts everywhere
