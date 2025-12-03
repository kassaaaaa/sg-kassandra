import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Project Structure', () => {
  const appRoot = path.resolve(__dirname, '..');

  it('should have specific dependencies in package.json', () => {
    const packageJsonPath = path.join(appRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    expect(allDeps).toHaveProperty('typescript');
    expect(allDeps).toHaveProperty('tailwindcss');
    expect(allDeps).toHaveProperty('eslint');
  });

  it('should have configuration files', () => {
    const eslintConfig = path.join(appRoot, 'eslint.config.mjs');
    expect(fs.existsSync(eslintConfig)).toBe(true);

    // Check for Tailwind config (v4 style)
    // Either postcss.config.mjs or direct css import
    const postcssConfig = path.join(appRoot, 'postcss.config.mjs');
    const globalCss = path.join(appRoot, 'app', 'globals.css');
    
    const hasPostCss = fs.existsSync(postcssConfig);
    let hasTailwindInCss = false;
    
    if (fs.existsSync(globalCss)) {
      const cssContent = fs.readFileSync(globalCss, 'utf-8');
      if (cssContent.includes('@import "tailwindcss"')) {
        hasTailwindInCss = true;
      }
    }

    expect(hasPostCss || hasTailwindInCss).toBe(true);
  });
});
