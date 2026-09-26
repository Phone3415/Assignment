# Front-end Style Rules

This document outlines the core styling conventions, typography rules, and design patterns used in this project.

## 1. Typography

The project utilizes two main font families to establish a clear visual hierarchy and maintain readability, especially for Thai characters.

### Font Families
- **Prompt (`font-[Prompt]`)**: Used for short, high-impact text.
  - Examples: Titles, Headers, Heroes, Button text, Badges, Dropdown options.
- **Sarabun (`font-[Sarabun]`)**: Used for longer, smaller text.
  - Examples: Paragraphs, Descriptions, Body content, Search Inputs.

### Sizing & Legibility
- **Base Size**: Because Thai characters have complex ascenders and descenders, avoid using `text-sm` (14px) for primary readable content. Use **`text-base`** (16px) as the standard minimum for body text, inputs, and table content to ensure readability.
- **Line Height**: Use `leading-relaxed` for multi-line Thai text (like descriptions and paragraphs) to prevent lines from feeling cramped.
- **Contrast**: Use `text-slate-800` or `text-slate-900` for primary text. Avoid `text-slate-500` or `text-slate-600` for core readable content, reserving them only for secondary/meta information (e.g., dates, hints).

## 2. Action Buttons & UI Cleanliness

- **Icon-Only Actions**: For repetitive actions in lists, tables, or headers (e.g., Edit, Delete, Logout, Public/Private Notes), prefer icon-only buttons to reduce visual clutter.
  - Structure: `p-2 rounded-xl flex items-center justify-center transition-all`
  - Accessibility: Always include a `title` and `aria-label` attribute when hiding text.
- **Primary Actions**: Actions like "Create Class" or "Add Assignment" may keep text to remain prominent, but should still follow the standard `rounded-xl` and `font-[Prompt]` (or `font-[Sarabun]` depending on length) conventions.

## 3. General Aesthetics (Glassmorphism & Colors)
- Use subtle backgrounds with `backdrop-blur-sm` or `backdrop-blur-md` for floating elements (modals, headers, tiles).
- Rely on modern, soft shadows (`shadow-sm`, `shadow-md`) and avoid harsh borders where possible. 
- Colors should indicate status clearly without overwhelming the user (e.g., Emerald for success/submit, Amber for warnings/undo, Indigo for primary actions).
