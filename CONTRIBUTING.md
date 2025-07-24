# Contributing to TikTok Creator Monetization Calculator

Thank you for your interest in contributing to the TikTok Creator Monetization Calculator! We welcome contributions from the community and are grateful for your support.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- A GitHub account
- Basic knowledge of TypeScript, React, and Next.js

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/tiktok-money-calculator.git
   cd tiktok-money-calculator
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/tiktok-money-calculator.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
6. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📋 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node.js version)
- **Error messages** or console logs

Use the bug report template when available.

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

- **Check existing feature requests** first
- **Provide a clear description** of the enhancement
- **Explain the use case** and benefits
- **Consider implementation complexity**
- **Include mockups** if applicable

### Pull Requests

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Add tests** for new functionality

4. **Run the test suite**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

5. **Commit your changes** using conventional commits:
   ```bash
   git commit -m "feat: add new calculator feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript

- Use **strict mode** TypeScript
- Provide **explicit types** for function parameters and return values
- Use **interfaces** for object shapes
- Prefer **type unions** over enums when appropriate

### React Components

- Use **functional components** with hooks
- Follow the **single responsibility principle**
- Use **TypeScript interfaces** for props
- Implement **proper error boundaries**

### Code Style

- Follow **ESLint** and **Prettier** configurations
- Use **meaningful variable names**
- Write **self-documenting code**
- Add **JSDoc comments** for complex functions

### File Organization

- Use **kebab-case** for file names
- Group related files in **appropriate directories**
- Keep components **small and focused**
- Separate **business logic** from UI components

## 🧪 Testing

### Writing Tests

- Write **unit tests** for utility functions
- Write **component tests** for React components
- Write **integration tests** for API endpoints
- Aim for **70%+ code coverage**

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interactions', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🌍 Internationalization

### Adding Translations

1. **Add new keys** to translation files in `src/translations/`
2. **Run i18n sync** to update types:
   ```bash
   npm run i18n:sync
   ```
3. **Test translations** in different locales

### Translation Guidelines

- Use **descriptive keys** (e.g., `calculator.form.followers.label`)
- Keep **text concise** but clear
- Consider **cultural context** for different regions
- Use **placeholders** for dynamic content

## 🔄 Git Workflow

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## 📚 Documentation

### Code Documentation

- Add **JSDoc comments** for public APIs
- Document **complex algorithms** and business logic
- Include **usage examples** where helpful
- Keep documentation **up to date** with code changes

### README Updates

- Update **feature lists** when adding new functionality
- Add **configuration options** for new environment variables
- Update **installation instructions** if needed

## 🎯 Areas for Contribution

### High Priority

- **Calculator accuracy improvements**
- **New platform integrations**
- **Performance optimizations**
- **Accessibility enhancements**
- **Mobile responsiveness**

### Medium Priority

- **Additional export formats**
- **Advanced analytics features**
- **UI/UX improvements**
- **Translation additions**
- **Documentation improvements**

### Good First Issues

Look for issues labeled `good first issue` or `help wanted` for beginner-friendly contributions.

## 🤝 Community Guidelines

### Code of Conduct

- Be **respectful** and **inclusive**
- **Help others** learn and grow
- **Give constructive feedback**
- **Focus on the code**, not the person

### Communication

- Use **clear and concise** language
- **Ask questions** when unsure
- **Share knowledge** and resources
- **Be patient** with newcomers

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

## 📞 Getting Help

If you need help:

- **Check the documentation** first
- **Search existing issues** and discussions
- **Ask in GitHub Discussions**
- **Join our community** channels

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the TikTok Creator Monetization Calculator! 🎉
