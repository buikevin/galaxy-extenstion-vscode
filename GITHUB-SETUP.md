# GitHub Setup cho Galaxy Code Extension

Có 2 cách để setup GitHub repository cho extension:

## Option 1: Tạo Repository riêng (RECOMMENDED) ⭐

### Tại sao nên dùng Option 1?
- ✅ Dễ quản lý issues/PRs riêng cho extension
- ✅ Cleaner commit history
- ✅ Dễ dàng cho contributors chỉ quan tâm extension
- ✅ Marketplace requirements về repository

### Các bước:

#### 1. Chạy script tự động (NHANH NHẤT)

```bash
cd apps/extension/vscode
./setup-github.sh
```

Script sẽ:
- ✓ Hỏi GitHub username của bạn
- ✓ Hướng dẫn tạo repo trên GitHub
- ✓ Update package.json với repository URLs
- ✓ Init git, commit, và push lên GitHub

#### 2. Hoặc làm thủ công:

**Bước 1: Tạo repository trên GitHub**
```
Repository name: galaxy-code-vscode
Description: AI-powered coding assistant extension for VSCode
Visibility: Public (bắt buộc cho VSCode Marketplace)
DO NOT initialize with README
```

**Bước 2: Setup Git**
```bash
cd apps/extension/vscode

# Initialize git
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/galaxy-code-vscode.git

# Add files
git add .

# Commit
git commit -m "Initial commit - Galaxy Code VSCode Extension"

# Push
git push -u origin main
```

**Bước 3: Update package.json**

Thay `YOUR_USERNAME` bằng GitHub username của bạn:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/galaxy-code-vscode.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/galaxy-code-vscode/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/galaxy-code-vscode#readme"
}
```

---

## Option 2: Sử dụng Monorepo hiện tại

Nếu bạn muốn giữ extension trong monorepo `person-work-project`:

### Bước 1: Update package.json

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/person-work-project.git",
    "directory": "apps/extension/vscode"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/person-work-project/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/person-work-project/tree/main/apps/extension/vscode#readme"
}
```

### Bước 2: Đảm bảo monorepo có README

Tạo `apps/extension/vscode/README.md` với đầy đủ thông tin (đã có rồi ✓)

### Bước 3: Push lên GitHub

```bash
# Từ root của monorepo
cd /Users/buitronghieu/Desktop/Project/person-work-project

# Add và commit
git add apps/extension/vscode
git commit -m "Add Galaxy Code VSCode extension"
git push
```

### Lưu ý với Option 2:
- ⚠️ Users sẽ thấy toàn bộ monorepo khi click vào repository
- ⚠️ Issues/PRs sẽ chung với các dự án khác
- ⚠️ Clone repo sẽ lớn hơn (có tất cả projects)

---

## So sánh 2 Options

| Feature | Option 1 (Repo riêng) | Option 2 (Monorepo) |
|---------|----------------------|---------------------|
| **Setup** | Đơn giản với script | Thêm directory field |
| **Quản lý Issues** | Riêng biệt ✓ | Chung với projects khác |
| **Repository Size** | Nhỏ gọn | Lớn |
| **Contributors** | Dễ tham gia | Phức tạp hơn |
| **Marketplace** | Perfect ✓ | Acceptable |
| **Recommended** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## Sau khi setup GitHub

### 1. Verify repository URLs

```bash
# Check package.json
cat package.json | grep -A 5 "repository"
```

### 2. Run checklist

```bash
./publish-checklist.sh
```

### 3. Update publisher name

Trong `package.json`:
```json
{
  "publisher": "your-publisher-name"  // Thay đổi từ "galaxy"
}
```

### 4. Ready to publish!

Follow [PUBLISHING.md](PUBLISHING.md) để publish lên VSCode Marketplace.

---

## Troubleshooting

### Git authentication

Nếu gặp lỗi authentication:

**macOS:**
```bash
# Dùng GitHub CLI
gh auth login

# Hoặc dùng SSH
# Thay https:// bằng git@github.com:
git remote set-url origin git@github.com:USERNAME/galaxy-code-vscode.git
```

### Repository visibility

Extension repository **PHẢI là PUBLIC** để publish lên Marketplace.

Kiểm tra:
1. Go to: `https://github.com/USERNAME/REPO/settings`
2. Scroll to "Danger Zone"
3. Ensure "Change repository visibility" shows "Public"

### Directory not found (Option 2)

Nếu dùng Option 2 và users gặp lỗi khi clone:

```bash
# Clone và navigate
git clone https://github.com/USERNAME/person-work-project
cd person-work-project/apps/extension/vscode
```

---

## Next Steps

1. ✅ Setup GitHub repository (Option 1 hoặc 2)
2. ✅ Update package.json với repository URLs
3. ✅ Update publisher name
4. ⏭️ Run `./publish-checklist.sh`
5. ⏭️ Follow [PUBLISHING.md](PUBLISHING.md)

---

**Recommendation**: Dùng **Option 1** với script `./setup-github.sh` để setup nhanh nhất! 🚀
