# Publishing Galaxy Code to VSCode Marketplace

## Bước 1: Chuẩn bị Extension

### 1.1. Cập nhật thông tin cần thiết

Mở `package.json` và cập nhật các thông tin sau:

```json
{
  "publisher": "your-publisher-name",  // Tên publisher của bạn
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-repo.git"  // Repo GitHub của bạn
  },
  "bugs": {
    "url": "https://github.com/your-username/your-repo/issues"
  },
  "homepage": "https://github.com/your-username/your-repo#readme"
}
```

### 1.2. Tạo LICENSE file

```bash
# Tạo file LICENSE (MIT License)
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

### 1.3. Tạo CHANGELOG.md

```bash
cat > CHANGELOG.md << 'EOF'
# Change Log

## [0.1.0] - 2025-11-02

### Added
- Initial release
- Chat interface for AI coding assistant
- Support for Gemini, Claude, and Ollama
- Command Palette integration
- Keyboard shortcuts (Cmd+Shift+G)
- Markdown rendering with syntax highlighting
- Code execution from chat
- File navigation
- Workspace context awareness
EOF
```

### 1.4. Build extension

```bash
bun run build
```

## Bước 2: Tạo Publisher Account

### 2.1. Tạo Azure DevOps Organization

1. Truy cập: https://dev.azure.com
2. Đăng nhập bằng Microsoft account (hoặc tạo mới)
3. Tạo organization mới:
   - Click **New organization**
   - Đặt tên organization (ví dụ: "galaxy-code")
   - Chọn region gần nhất

### 2.2. Tạo Personal Access Token (PAT)

1. Trong Azure DevOps, click vào icon user (góc phải)
2. Chọn **Personal Access Tokens**
3. Click **New Token**
4. Cấu hình:
   - **Name**: VSCode Marketplace
   - **Organization**: All accessible organizations
   - **Expiration**: Custom defined (chọn thời gian dài, ví dụ: 1 năm)
   - **Scopes**:
     - Click **Show all scopes**
     - Tìm và check: **Marketplace → Manage**
5. Click **Create**
6. **LƯU LẠI TOKEN** - bạn chỉ thấy nó một lần!

### 2.3. Tạo Publisher trên VSCode Marketplace

1. Truy cập: https://marketplace.visualstudio.com/manage
2. Đăng nhập bằng tài khoản Microsoft (cùng với Azure DevOps)
3. Click **Create publisher**
4. Điền thông tin:
   - **Name**: Tên hiển thị (ví dụ: "Galaxy Code Team")
   - **ID**: Tên publisher (ví dụ: "galaxy-code") - phải unique
   - **Email**: Email của bạn
5. Click **Create**

## Bước 3: Install vsce (VSCode Extension Manager)

```bash
# Install globally
npm install -g @vscode/vsce

# Hoặc dùng bun
bun add -g @vscode/vsce
```

## Bước 4: Package Extension

### 4.1. Test package locally trước

```bash
cd apps/extension/vscode

# Package thành .vsix file
vsce package
```

Nếu có lỗi, fix chúng. File `.vsix` sẽ được tạo ra: `galaxy-code-vscode-0.1.0.vsix`

### 4.2. Test local installation

```bash
# Install extension từ .vsix file
code --install-extension galaxy-code-vscode-0.1.0.vsix

# Test trong VSCode
# Sau đó uninstall nếu ok:
code --uninstall-extension galaxy.galaxy-code-vscode
```

## Bước 5: Publish lên Marketplace

### 5.1. Login vào publisher

```bash
vsce login your-publisher-name
```

Nhập Personal Access Token (PAT) đã tạo ở bước 2.2

### 5.2. Publish extension

```bash
# Publish
vsce publish
```

Lệnh này sẽ:
1. Build extension
2. Package thành .vsix
3. Upload lên Marketplace
4. Validate extension

### 5.3. Hoặc publish version cụ thể

```bash
# Publish và tăng version (patch: 0.1.0 -> 0.1.1)
vsce publish patch

# Tăng minor version (0.1.0 -> 0.2.0)
vsce publish minor

# Tăng major version (0.1.0 -> 1.0.0)
vsce publish major

# Publish version cụ thể
vsce publish 1.0.0
```

## Bước 6: Verify Extension

### 6.1. Kiểm tra trên Marketplace

1. Truy cập: https://marketplace.visualstudio.com/publishers/your-publisher-name
2. Hoặc tìm extension: https://marketplace.visualstudio.com/search?term=galaxy%20code
3. Kiểm tra:
   - Icon hiển thị đúng
   - Screenshots (nếu có)
   - README render đúng
   - Install button hoạt động

### 6.2. Test install từ Marketplace

Trong VSCode:
1. Mở Extensions view (`Cmd+Shift+X`)
2. Tìm "Galaxy Code"
3. Click Install
4. Test extension

## Bước 7: Update Extension (sau này)

### 7.1. Cập nhật code

1. Sửa code
2. Update version trong `package.json`
3. Update `CHANGELOG.md`
4. Build: `bun run build`

### 7.2. Publish update

```bash
# Login (nếu chưa login)
vsce login your-publisher-name

# Publish với version mới
vsce publish
```

## Checklist trước khi Publish

- [ ] `package.json` có đầy đủ thông tin:
  - [ ] name, displayName, description
  - [ ] version
  - [ ] publisher
  - [ ] icon
  - [ ] repository, bugs, homepage
  - [ ] license
  - [ ] engines.vscode
  - [ ] categories
  - [ ] keywords
- [ ] README.md đầy đủ, dễ hiểu
- [ ] CHANGELOG.md được cập nhật
- [ ] LICENSE file tồn tại
- [ ] Icon đẹp (128x128 hoặc lớn hơn)
- [ ] Screenshots (optional nhưng nên có)
- [ ] Extension test kỹ, không có bug nghiêm trọng
- [ ] Build thành công: `bun run build`
- [ ] Package thành công: `vsce package`
- [ ] Test local install: `code --install-extension *.vsix`

## Thêm Screenshots (Optional nhưng recommended)

### Tạo thư mục images

```bash
mkdir -p images
```

### Chụp screenshots

1. Mở extension trong VSCode
2. Chụp màn hình chat interface
3. Lưu vào `images/screenshot-1.png`, `images/screenshot-2.png`...

### Thêm vào README.md

```markdown
## Screenshots

![Chat Interface](images/screenshot-1.png)
![Code Generation](images/screenshot-2.png)
```

### Cập nhật package.json (optional)

```json
{
  "galleryBanner": {
    "color": "#667eea",
    "theme": "dark"
  }
}
```

## Troubleshooting

### Error: "Publisher not found"

- Kiểm tra đã tạo publisher trên https://marketplace.visualstudio.com/manage
- Đảm bảo publisher name trong `package.json` khớp với publisher ID

### Error: "Personal Access Token verification failed"

- Token đã expire → Tạo token mới
- Token không có quyền Marketplace → Recreate với scope đúng
- Login lại: `vsce login your-publisher-name`

### Error: Missing required fields

- Kiểm tra `package.json` có đầy đủ: name, version, engines, publisher
- Thêm repository, license nếu thiếu

### Extension không hiển thị trên Marketplace

- Đợi vài phút (thường < 5 phút)
- Clear browser cache
- Kiểm tra status: https://marketplace.visualstudio.com/manage/publishers/your-publisher-name

### Icon không hiển thị

- Kiểm tra file icon tồn tại: `resources/icon.png`
- Icon phải >= 128x128 pixels
- Format: PNG
- Đường dẫn trong package.json: `"icon": "resources/icon.png"`

## Best Practices

1. **Versioning**: Tuân thủ Semantic Versioning (MAJOR.MINOR.PATCH)
   - MAJOR: Breaking changes
   - MINOR: New features (backward compatible)
   - PATCH: Bug fixes

2. **CHANGELOG**: Luôn cập nhật changelog với mỗi version

3. **Testing**: Test kỹ trên nhiều OS (Mac, Windows, Linux)

4. **Documentation**: README phải rõ ràng, có examples

5. **Keywords**: Chọn keywords phù hợp để dễ search

6. **Support**: Trả lời issues/reviews nhanh chóng

## Scripts hữu ích

Thêm vào `package.json`:

```json
{
  "scripts": {
    "vscode:prepublish": "bun run build",
    "build": "bun run compile && bun run build:webview",
    "compile": "tsc -p ./",
    "build:webview": "vite build",
    "package": "vsce package",
    "publish": "vsce publish",
    "publish:patch": "vsce publish patch",
    "publish:minor": "vsce publish minor",
    "publish:major": "vsce publish major"
  }
}
```

Sử dụng:

```bash
# Package
bun run package

# Publish
bun run publish

# Publish với version bump
bun run publish:patch
```

## Resources

- VSCode Publishing: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- Marketplace Management: https://marketplace.visualstudio.com/manage
- vsce Documentation: https://github.com/microsoft/vscode-vsce
- Extension Guidelines: https://code.visualstudio.com/api/references/extension-guidelines

---

**Lưu ý quan trọng:**
- Personal Access Token phải được bảo mật, không commit lên Git
- Publisher name phải unique trên toàn Marketplace
- Extension name phải unique trong publisher của bạn
- Version mới phải > version cũ

**Good luck with your extension! 🚀**
