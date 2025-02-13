# Contributing Guide

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

## Code Style
- Use TypeScript for all new code
- Follow the existing code style
- Use ESLint and Prettier for formatting
- Write meaningful commit messages

## Testing
- Write tests for all new features
- Maintain minimum 80% test coverage
- Run tests before submitting PR:
```bash
npm run test
```

## Pull Request Process
1. Create a feature branch
2. Write clear commit messages
3. Update documentation
4. Add tests
5. Submit PR with description

## Code Review Guidelines
- Review for security issues
- Check for performance impacts
- Verify test coverage
- Ensure documentation is updated