```markdown
# storely Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides a comprehensive guide to the development patterns used in the `storely` repository, a TypeScript project built with the Next.js framework. It covers coding conventions, commit patterns, file organization, and testing approaches to ensure consistency and maintainability across the codebase.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `orderList.tsx`

### Import Style
- Use **alias imports** for modules and components.
  - Example:
    ```typescript
    import Button from '@/components/Button';
    import { fetchData } from '@/utils/api';
    ```

### Export Style
- Use **default exports** for modules and components.
  - Example:
    ```typescript
    // components/Button.tsx
    const Button = () => { /* ... */ };
    export default Button;
    ```

### Commit Patterns
- Use **Conventional Commits** with the `feat` prefix for new features.
- Commit messages average 103 characters.
  - Example:
    ```
    feat: add user authentication flow with JWT and session persistence
    ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Test File Pattern:** Test files follow the `*.test.*` naming convention.
  - Example: `userProfile.test.ts`, `apiHandler.test.tsx`
- **Testing Framework:** Not explicitly detected; follow the standard Next.js/TypeScript testing stack (e.g., Jest, React Testing Library) unless otherwise specified.
- **Test Structure Example:**
  ```typescript
  // userProfile.test.ts
  import { render, screen } from '@testing-library/react';
  import UserProfile from '@/components/userProfile';

  test('renders user name', () => {
    render(<UserProfile name="Alice" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
  ```

## Commands
| Command | Purpose |
|---------|---------|
| /commit-convention | Show commit message guidelines |
| /file-naming       | Show file naming conventions   |
| /import-style      | Show import style guidelines   |
| /export-style      | Show export style guidelines   |
| /test-pattern      | Show test file and structure conventions |
```
