# Cursor Rules for Eyebottle AI Assistant

## Overview

These Cursor Rules implement state-of-the-art prompt engineering principles to provide optimal AI assistance for the Eyebottle ophthalmology workflow automation project.

## Rule Files

### 1. `eyebottle-ai-assistant.mdc`
**Main AI Assistant Configuration**
- Role definition and project context
- Development guidelines and code standards
- **Systematic 3-Phase Development Process** (NEW)
  - Phase 1: Codebase Exploration & Analysis
  - Phase 2: Implementation Planning
  - Phase 3: Implementation Execution
- Medical domain specifics
- Critical constraints (DO's and DON'Ts)
- UI/UX patterns and design system

### 2. `technical-patterns.mdc`
**Technical Implementation Patterns**
- Advanced code patterns with examples
- WSL development environment setup
- Medical feature implementations
- Data management (LocalStorage → Supabase migration)
- Performance optimization techniques
- Security patterns

### 3. `workflow-and-troubleshooting.mdc`
**Development Workflows & Solutions**
- Feature development workflow
- Bug fix workflow with debugging strategies
- Common issues and solutions
- Deployment checklist
- Monitoring and analytics implementation

## How Cursor Uses These Rules

Cursor automatically loads all `.mdc` files from the `.cursor/rules` directory and uses them to:
- Understand project-specific context
- Apply consistent coding patterns
- Provide medical domain-aware suggestions
- Follow established development workflows
- Avoid common pitfalls

## Key Principles Applied

### 1. **Chain of Thought (CoT)**
Structured reasoning process for complex problem-solving

### 2. **Few-shot Learning**
Concrete code examples for each pattern

### 3. **Role-based Prompting**
Clear definition of AI assistant expertise

### 4. **Context Awareness**
Project-specific knowledge and constraints

### 5. **Output Formatting**
Structured responses with Korean language support

### 6. **Systematic 3-Phase Process** (NEW)
Enforces structured approach: Exploration → Planning → Implementation

## Usage Tips

1. **Medical Accuracy**: Always verify medical calculations and terminology
2. **Korean Support**: All UI text must be in Korean
3. **Type Safety**: Use TypeScript interfaces for all data structures
4. **Accessibility**: Follow WCAG 2.1 AA standards
5. **Performance**: Monitor component render times

## Project Constraints

⚠️ **CRITICAL**: 
- Use `npm` only (never `pnpm`) [[memory:4742929962836560937]]
- Hot reload requires special WSL configuration [[memory:2698088134171088322]]
- Email functionality uses Resend API [[memory:8891210216933124585]]

## Quick Reference

### Development Commands
```bash
# Start development with hot reload (WSL)
npm run dev:hot

# Build for production
npm run build

# Run type checking
npm run type-check
```

### File Naming Conventions
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `PascalCase.ts`

### Medical Data Validation Ranges
- Visual Acuity: 0.1 - 1.0 (decimal) or Snellen format
- Eye Pressure: 10-21 mmHg (normal range)
- Spherical Equivalent: -25D to +25D
- Axial Length: 20-35 mm

## Contributing to Rules

When updating these rules:
1. Maintain the existing structure
2. Add concrete examples for new patterns
3. Include Korean translations for UI elements
4. Document any new medical validations
5. Update the corresponding memory entries if needed

## Resources

- Project Repository: [GitHub](https://github.com/Eyebottle/eyebottle-ai-ophthalmology)
- Live Site: [eyebottle.kr](https://eyebottle.kr)
- Documentation: See `/docs` directory

---

*Last updated: January 2025*
*These rules reflect the latest prompt engineering best practices and project-specific requirements.*
*Added systematic 3-phase development process for structured task execution.* 