# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Essential Commands

### Development
```bash
# Start development server (WSL2 optimized)
./dev.sh

# Or manually with hot reload optimization
export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Lint code
npm run lint
```

### Testing
```bash
# Run Playwright tests
npx playwright test

# Run specific test
npx playwright test tests/printing-bug.spec.ts

# Open Playwright UI
npx playwright test --ui
```

## 🏗️ High-Level Architecture

### Project Overview
**Eyebottle** is an AI-powered ophthalmology practice automation platform that helps Korean eye clinics reduce repetitive tasks by 3x. Built with Next.js 15 App Router, it provides medical-grade tools with Korean language support throughout.

### Core Technology Stack
- **Frontend**: Next.js 15.3.3 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + Shadcn/ui + Glassmorphism design
- **State Management**: LocalStorage (migrating to Supabase)
- **Email**: Resend API
- **Data Visualization**: Recharts
- **PDF Generation**: React PDF Renderer
- **Deployment**: Vercel (eyebottle.kr)
- **Development Environment**: WSL2 Ubuntu 24.04.2 LTS + Node.js v22.17.0

### Key Architectural Patterns

#### 1. **Feature-Based Module Structure**
```
src/app/
├── myocare/          # Complete myopia care system
├── exam-results/     # Examination result management
├── api/send-email/   # Email API endpoint
└── (shared pages)    # Landing, about, etc.
```

#### 2. **Medical Data Flow**
1. **Input Layer**: Forms with Korean labels and medical validation
2. **Processing Layer**: Type-safe calculations in `lib/calculations.ts`
3. **Storage Layer**: LocalStorage with TypeScript wrappers in `lib/storage.ts`
4. **Presentation Layer**: Real-time preview with print optimization

#### 3. **Component Architecture**
- **UI Components**: Shadcn/ui base components in `components/ui/`
- **Feature Components**: Domain-specific in `components/[feature]/`
- **Common Components**: Shared utilities in `components/common/`

### Critical Medical Calculations
Located in `lib/calculations.ts`:
- **Spherical Equivalent (SE)**: `sphere + (cylinder / 2)`
- **Risk Level Assessment**: Based on SE ≤ -6.0D or AL ≥ 26.0mm
- **Progression Rate**: Annual change in SE/AL with threshold alerts

### Data Validation Ranges
From `constants/index.ts`:
```typescript
MYOCARE_LIMITS = {
  sphere: { min: -25, max: 25 },
  cylinder: { min: -10, max: 0 },
  axis: { min: 0, max: 180 },
  axialLength: { min: 20, max: 35 }
}
```

## ⚠️ Critical Constraints

### Package Management
- **MUST use npm** - Never use pnpm (causes Next.js SWC/Turbopack crashes)
- **Install packages one by one** - Avoid bulk installations
- **Test after each package** - Run `npm run dev` to verify

### Development Rules
1. **Korean UI Required** - All user-facing text must be in Korean
2. **Medical Accuracy** - Validate all medical calculations and ranges
3. **Accessibility** - WCAG 2.1 AA compliance required
4. **No Arbitrary Tailwind** - Use only default scale values
5. **Print Optimization** - A4 format with proper Korean fonts
6. **WSL2 Environment** - Project runs in WSL2 at ~/projects/eyebottle

### Security Considerations
- Never log patient data in errors
- Sanitize all medical inputs
- Use environment variables for API keys
- Implement rate limiting on API endpoints

## 🔄 Development Workflow

### WSL2 Development Setup
1. **Project Location**: `~/projects/eyebottle`
2. **Node Version**: v22.17.0 (managed by nvm)
3. **Hot Reload**: Requires WATCHPACK_POLLING environment variables
4. **VS Code**: Use Remote-WSL extension for best experience

### Three-Phase Process (MANDATORY)
1. **Phase 1: Codebase Analysis**
   - Search for related files and patterns
   - Identify conventions and styles
   - Review medical validation logic

2. **Phase 2: Implementation Planning**
   - Create detailed task breakdown
   - Define acceptance criteria
   - Include medical accuracy checks

3. **Phase 3: Implementation**
   - Follow identified conventions
   - Validate against acceptance criteria
   - Test Korean language support

### Medical Feature Development
When implementing medical features:
1. Review Korean medical terminology in types
2. Implement proper validation ranges
3. Add auto-fill based on risk levels
4. Test print layout with A4 format
5. Verify calculations with test cases

## 📋 Common Tasks

### Adding New Examination Type
1. Create types in `types/[exam-name].ts`
2. Add validation in `lib/validation/[exam-name].ts`
3. Create form component with Korean labels
4. Implement preview with print styles
5. Add to exam-results page router

### Debugging Print Issues
1. Check `@media print` styles in `globals.css`
2. Verify A4 page sizing: `@page { size: A4; margin: 15mm; }`
3. Test with Chrome/Edge print preview
4. Ensure Korean fonts: `font-family: 'Malgun Gothic', sans-serif`

### Email Integration
1. Set `RESEND_API_KEY` in `.env.local`
2. Use dynamic import for Resend: `const { Resend } = await import('resend')`
3. Implement rate limiting
4. Test with Korean content encoding

## 🏥 Medical Domain Context

### Examination Types
1. **당뇨망막병증 (Diabetic Retinopathy)**: 5-stage classification
2. **고혈압망막병증 (Hypertensive Retinopathy)**: 4-stage grading
3. **근시진행 (Myopia Progression)**: SE and AL tracking
4. **눈종합검진 (Comprehensive Exam)**: Multi-factor assessment

### Risk Level Colors
- **정상 (Normal)**: Green indicators
- **경미한 (Mild)**: Yellow warnings
- **중등도 (Moderate)**: Amber alerts
- **심각한 (Severe)**: Red critical

### Korean Medical Terms
Key terms are defined throughout the codebase with English abbreviations:
- 안축장 (Axial Length) - AL
- 구면대응치 (Spherical Equivalent) - SE
- 안압 (Intraocular Pressure) - IOP
- 시력 (Visual Acuity) - VA

## 🚨 Troubleshooting

### Common Issues
1. **Module not found errors**: Run `npm ci` to clean install
2. **Korean text encoding**: Ensure UTF-8 file encoding
3. **Print layout breaks**: Check print-specific CSS classes
4. **LocalStorage quota**: Implement cleanup for old data
5. **Email not sending**: Verify Resend API key and domain
6. **Hot reload not working**: Check WATCHPACK_POLLING env vars

### Emergency Rollback
```bash
git checkout .
git clean -fd
npm ci
./dev.sh
```

### WSL2 Specific Issues
1. **Line ending problems**: Use .gitattributes for normalization
2. **File permissions**: May need to chmod +x for scripts
3. **Path issues**: Always use Unix-style paths in WSL2

Remember: This is a medical application. Prioritize accuracy, safety, and Korean language support in every decision.