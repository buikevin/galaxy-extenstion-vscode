#!/bin/bash

# Setup GitHub repository for Galaxy Code VSCode Extension

echo "🚀 Galaxy Code - GitHub Repository Setup"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will help you setup a GitHub repository for the extension.${NC}"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "GitHub username is required!"
    exit 1
fi

# Repository name
REPO_NAME="galaxy-code-vscode"

echo ""
echo -e "${BLUE}Repository Details:${NC}"
echo "  Name: $REPO_NAME"
echo "  URL: https://github.com/$GITHUB_USER/$REPO_NAME"
echo ""

# Confirm
read -p "Continue with this setup? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Step 1: Creating repository on GitHub..."
echo "----------------------------------------"
echo -e "${YELLOW}Please create a new repository on GitHub:${NC}"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: $REPO_NAME"
echo "3. Description: AI-powered coding assistant extension for VSCode"
echo "4. Make it Public (required for VSCode Marketplace)"
echo "5. DO NOT initialize with README (we already have one)"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter when you've created the repository..."

echo ""
echo "Step 2: Initializing Git repository..."
echo "--------------------------------------"

# Check if already a git repo
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠ Git repository already exists. Skipping git init.${NC}"
else
    git init
    echo -e "${GREEN}✓${NC} Git initialized"
fi

echo ""
echo "Step 3: Updating package.json with repository info..."
echo "------------------------------------------------------"

# Update package.json
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME"

# Use node to update package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.repository = {
    type: 'git',
    url: '$REPO_URL.git'
};

pkg.bugs = {
    url: '$REPO_URL/issues'
};

pkg.homepage = '$REPO_URL#readme';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✓ package.json updated');
"

echo ""
echo "Step 4: Adding files to Git..."
echo "-------------------------------"

git add .
echo -e "${GREEN}✓${NC} Files staged"

echo ""
echo "Step 5: Creating initial commit..."
echo "-----------------------------------"

git commit -m "Initial commit - Galaxy Code VSCode Extension

- Chat interface for AI coding assistant
- Support for Gemini, Claude, and Ollama
- Command Palette integration
- Keyboard shortcuts
- Markdown rendering with syntax highlighting
- Workspace context awareness
"

echo -e "${GREEN}✓${NC} Initial commit created"

echo ""
echo "Step 6: Adding remote and pushing..."
echo "-------------------------------------"

# Check if remote exists
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠ Remote 'origin' already exists. Updating URL...${NC}"
    git remote set-url origin "$REPO_URL.git"
else
    git remote add origin "$REPO_URL.git"
fi

echo -e "${GREEN}✓${NC} Remote added: $REPO_URL.git"

# Get default branch name
DEFAULT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null || echo "main")

echo ""
echo "Pushing to GitHub..."
git push -u origin $DEFAULT_BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo -e "${GREEN}✅ Repository setup complete!${NC}"
    echo "========================================="
    echo ""
    echo "Repository URL: $REPO_URL"
    echo ""
    echo "Next steps:"
    echo "1. Update your publisher name in package.json"
    echo "2. Run ./publish-checklist.sh to verify everything"
    echo "3. Follow PUBLISHING.md to publish to Marketplace"
    echo ""
else
    echo ""
    echo -e "${YELLOW}⚠ Push failed. You may need to authenticate.${NC}"
    echo ""
    echo "Try pushing manually:"
    echo "  git push -u origin $DEFAULT_BRANCH"
    echo ""
fi
