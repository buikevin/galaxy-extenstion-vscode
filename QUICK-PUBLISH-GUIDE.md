# Quick Publish Guide - 15 phút đưa extension lên VSCode Marketplace

## TL;DR - Quick Commands

```bash
# 1. Setup GitHub (3 phút)
./setup-github.sh

# 2. Update publisher name trong package.json (1 phút)
# Sửa "publisher": "your-name"

# 3. Run checklist (1 phút)
./publish-checklist.sh

# 4. Install vsce (1 phút)
npm install -g @vscode/vsce

# 5. Create publisher account & PAT (5 phút)
# https://marketplace.visualstudio.com/manage
# https://dev.azure.com → Personal Access Tokens

# 6. Publish (2 phút)
vsce login your-publisher-name
vsce publish
```

---

## Chi tiết từng bước

### ⏱️ Phút 1-3: Setup GitHub Repository

**Cách 1 - Tự động (KHUYẾN NGHỊ):**
```bash
cd apps/extension/vscode
./setup-github.sh
```

**Cách 2 - Thủ công:**
1. Tạo repo: https://github.com/new
   - Name: `galaxy-code-vscode`
   - Public
   - No README
2. Follow hướng dẫn trong [GITHUB-SETUP.md](GITHUB-SETUP.md)

### ⏱️ Phút 4: Update Publisher Name

Mở `package.json`, tìm và sửa:
```json
{
  "publisher": "galaxy"  // ← Thay bằng tên của bạn
}
```

### ⏱️ Phút 5: Verify Setup

```bash
./publish-checklist.sh
```

Fix mọi issues nếu có.

### ⏱️ Phút 6-10: Tạo Publisher Account

#### 1. Azure DevOps (2 phút)
- Truy cập: https://dev.azure.com
- Login với Microsoft account
- Tạo organization (bất kỳ tên nào)

#### 2. Personal Access Token (3 phút)
- Click icon user → Personal Access Tokens
- New Token:
  - Name: `VSCode Marketplace`
  - Expiration: 1 year
  - Scopes: **Marketplace → Manage** ✓
- **COPY TOKEN VÀ LƯU LẠI!**

#### 3. Create Publisher (2 phút)
- Truy cập: https://marketplace.visualstudio.com/manage
- Login (same Microsoft account)
- Create publisher:
  - Name: Display name của bạn
  - ID: Publisher ID (phải unique, lowercase, no spaces)
  - Email: Your email
- **NHỚ PUBLISHER ID!**

### ⏱️ Phút 11: Install vsce

```bash
npm install -g @vscode/vsce
```

### ⏱️ Phút 12-13: Login

```bash
vsce login your-publisher-id
# Paste PAT token khi được hỏi
```

### ⏱️ Phút 14-15: Publish!

```bash
vsce publish
```

✨ **DONE!** Extension sẽ xuất hiện trên Marketplace trong vài phút.

---

## Verify Publication

### 1. Check Marketplace (2-5 phút sau khi publish)

```
https://marketplace.visualstudio.com/items?itemName=PUBLISHER.galaxy-code-vscode
```

Thay `PUBLISHER` bằng publisher ID của bạn.

### 2. Test Installation

Trong VSCode:
1. `Cmd+Shift+X` - Mở Extensions
2. Search: "Galaxy Code"
3. Click Install
4. Test extension

---

## Troubleshooting Fast Fixes

### ❌ "Publisher not found"
```bash
# Verify publisher exists
# https://marketplace.visualstudio.com/manage

# Update package.json với correct publisher ID
```

### ❌ "Personal Access Token verification failed"
```bash
# Token expired or wrong scope
# Create new token with Marketplace → Manage scope
# Login again: vsce login your-publisher
```

### ❌ "Missing repository"
```bash
# Run setup script
./setup-github.sh

# Or update package.json manually
```

### ❌ Build errors
```bash
# Clean rebuild
rm -rf dist webview-dist node_modules
bun install
bun run build
```

---

## Update Extension (Sau này)

```bash
# 1. Make changes
# 2. Update CHANGELOG.md
# 3. Commit to GitHub

git add .
git commit -m "Update: description"
git push

# 4. Publish new version
vsce publish patch   # 0.1.0 → 0.1.1
vsce publish minor   # 0.1.0 → 0.2.0
vsce publish major   # 0.1.0 → 1.0.0
```

---

## Checklist ✓

Trước khi chạy `vsce publish`:

- [ ] GitHub repository đã setup (public)
- [ ] `package.json` có repository URLs
- [ ] Publisher name đã update
- [ ] Icon exists: `resources/icon.png`
- [ ] LICENSE file exists
- [ ] CHANGELOG.md exists
- [ ] README.md đầy đủ
- [ ] Build successful: `bun run build`
- [ ] Checklist pass: `./publish-checklist.sh`
- [ ] Publisher account created
- [ ] Personal Access Token saved
- [ ] Logged in: `vsce login`

---

## Resources

- **Detailed Guide**: [PUBLISHING.md](PUBLISHING.md)
- **GitHub Setup**: [GITHUB-SETUP.md](GITHUB-SETUP.md)
- **Dev Guide**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)

---

## Need Help?

### Common issues
- All troubleshooting in [PUBLISHING.md](PUBLISHING.md)

### Links
- Marketplace Management: https://marketplace.visualstudio.com/manage
- Azure DevOps: https://dev.azure.com
- VSCode Publishing Docs: https://code.visualstudio.com/api/working-with-extensions/publishing-extension

---

**Good luck! 🚀**

Sau khi publish, extension của bạn sẽ có ở:
```
https://marketplace.visualstudio.com/items?itemName=YOUR-PUBLISHER.galaxy-code-vscode
```
