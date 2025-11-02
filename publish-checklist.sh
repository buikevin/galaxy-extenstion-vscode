#!/bin/bash

# Galaxy Code VSCode Extension - Pre-Publish Checklist
# Run this before publishing to VSCode Marketplace

echo "🚀 Galaxy Code - Pre-Publish Checklist"
echo "======================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ISSUES=$((ISSUES + 1))
        return 1
    fi
}

# Function to check field in package.json
check_package_field() {
    FIELD=$1
    NAME=$2
    VALUE=$(node -p "require('./package.json').$FIELD" 2>/dev/null)

    if [ "$VALUE" != "undefined" ] && [ ! -z "$VALUE" ]; then
        echo -e "${GREEN}✓${NC} $NAME: $VALUE"
        return 0
    else
        echo -e "${RED}✗${NC} $NAME is missing"
        ISSUES=$((ISSUES + 1))
        return 1
    fi
}

echo "📋 Checking required files..."
echo "----------------------------"
check_file "package.json" "package.json exists"
check_file "README.md" "README.md exists"
check_file "LICENSE" "LICENSE exists"
check_file "CHANGELOG.md" "CHANGELOG.md exists"
check_file "resources/icon.png" "Icon file exists"
echo ""

echo "📦 Checking package.json fields..."
echo "-----------------------------------"
check_package_field "name" "Name"
check_package_field "displayName" "Display Name"
check_package_field "description" "Description"
check_package_field "version" "Version"
check_package_field "publisher" "Publisher"
check_package_field "license" "License"
check_package_field "icon" "Icon"
check_package_field "repository.url" "Repository URL"
check_package_field "engines.vscode" "VSCode Engine"
echo ""

echo "🔨 Checking build files..."
echo "--------------------------"
check_file "dist/extension.js" "Extension compiled (dist/extension.js)"
check_file "webview-dist/index.js" "Webview built (webview-dist/index.js)"
check_file "webview-dist/index.css" "Webview styles (webview-dist/index.css)"
echo ""

echo "📝 Checking documentation..."
echo "----------------------------"
if grep -q "your-username" package.json; then
    echo -e "${YELLOW}⚠${NC} Update repository URLs in package.json"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓${NC} Repository URLs updated"
fi

if grep -q "galaxy" package.json | grep -q "publisher"; then
    echo -e "${YELLOW}⚠${NC} Update publisher name from 'galaxy' to your publisher ID"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓${NC} Publisher name looks good"
fi
echo ""

echo "🧪 Running build test..."
echo "------------------------"
if bun run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed - run 'bun run build' to see errors"
    ISSUES=$((ISSUES + 1))
fi
echo ""

echo "📦 Testing package creation..."
echo "------------------------------"
if npx vsce package --allow-missing-repository > /dev/null 2>&1; then
    VSIX_FILE=$(ls *.vsix 2>/dev/null | head -n 1)
    if [ ! -z "$VSIX_FILE" ]; then
        echo -e "${GREEN}✓${NC} Package created: $VSIX_FILE"
        SIZE=$(ls -lh "$VSIX_FILE" | awk '{print $5}')
        echo -e "  Size: $SIZE"
    else
        echo -e "${RED}✗${NC} Package file not found"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo -e "${RED}✗${NC} Package creation failed"
    ISSUES=$((ISSUES + 1))
fi
echo ""

# Summary
echo "======================================="
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "You're ready to publish. Next steps:"
    echo "1. vsce login your-publisher-name"
    echo "2. vsce publish"
    echo ""
    echo "Or read PUBLISHING.md for detailed instructions."
else
    echo -e "${RED}❌ Found $ISSUES issue(s)${NC}"
    echo ""
    echo "Please fix the issues above before publishing."
    echo "See PUBLISHING.md for more information."
fi
echo "======================================="

exit $ISSUES
