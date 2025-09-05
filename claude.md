# Frontend Repository

## Repository Overview

This repository contains the frontend application for the OnEmployment platform, providing the user interface and client-side functionality for job seekers and employers.

- React.js or Next.js for component-based UI development
- TypeScript for type safety and better developer experience
- Modern CSS frameworks (Tailwind CSS, styled-components, or CSS modules)
- State management solutions (Redux, Zustand, or React Query)
- Build tools (Vite, Webpack, or Next.js built-in)
- Testing frameworks (Jest, React Testing Library)

## Patterns

### SOLID Principles

- **Single Responsibility Principle**: Each component and function should have a single, well-defined purpose
- **Open/Closed Principle**: Components should be open for extension but closed for modification
- **Liskov Substitution Principle**: Derived components should be substitutable for their base components
- **Interface Segregation Principle**: Create specific interfaces rather than large, general-purpose ones
- **Dependency Inversion Principle**: Depend on abstractions, not concretions

### Additional Patterns

- **Component Composition**: Favor composition over inheritance for React components
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Container/Presentational Pattern**: Separate data logic from presentation logic
- **Error Boundaries**: Implement error boundaries for graceful error handling
- **Lazy Loading**: Implement code splitting and lazy loading for performance
- **Consistent File Structure**: Follow established folder structure and naming conventions

## Commit Message Rules

### Format

```
<imperative title>

- <concise bullet point describing important change and brief why>
- <concise bullet point describing important change and brief why>
- <concise bullet point describing important change and brief why>
```

### Guidelines

- Commit title should be imperative and concise (50 characters or less)
- Use bullet points in description to list important changes
- Explain what changed and briefly why
- No emojis, Claude collaboration lines, or extra text
- Keep bullet points concise and focused

### Example

```
Add user authentication flow

- Implement login/logout functionality to secure user access
- Add JWT token management for session handling
- Create protected route wrapper for authenticated pages
- Add form validation to prevent invalid submissions
```

## Commit Workflow

When preparing to commit changes, follow this standardized workflow:

1. **Review commit template**: Reference the commit message rules above
2. **Analyze local changes**: Compare current branch changes with the remote branch to understand what has been modified
3. **Prepare commit message**: Create a commit message following the Commit Template Rules with:
   - Concise imperative title summarizing the change
   - Bullet points detailing specific modifications made
4. **Execute commit and push**: Stage all changes, commit with the exact prepared message, and push to the current branch's remote

**Important**: Always use direct git access for committing code (git add, git commit, git push) rather than GitHub API operations for better control over git history and commit management.

## Issue Template

### What

Describe what needs to be done or what problem needs to be solved.

### Why

Explain the business value, user need, or technical necessity behind this issue.

### How

Outline the general approach or solution strategy for addressing this issue.

### Implementation Plan

- [ ] Specific task 1
- [ ] Specific task 2
- [ ] Specific task 3
- [ ] Testing and validation
- [ ] Documentation updates

### AI Agent Prompt

**[Context]**
Provide relevant background information about the codebase, current state, and any related systems or dependencies.

**[Task]**
Clearly define the specific work that needs to be completed.

**[Expectation]**
Describe the expected outcomes, deliverables, and success criteria.

**[Constraints]**
List any limitations, requirements, or restrictions that must be considered.

**[Validation]**
Define how the completed work should be tested and verified as successful.
