[ English ](./README.md) | [ 简体中文 ](./README-CN.md)

# NotebookLM Fixer (修复专家)


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



**NotebookLM Fixer** 是一款专为修复 [NotebookLM](https://notebooklm.google.com/) 生成的 PDF 文档而设计的智能工具。它利用 Google 最新的 **Gemini 3.0 Pro** 多模态模型，解决文档中常见的文字模糊、伪影和分辨率过低问题，实现像素级的画质重塑，并支持导出为高清晰度的 PDF 或 PPTX 演示文稿。

![App Screenshot](./assets/png1.png)
![App Screenshot](./assets/png2.png)


## ✨ 核心特性

> **🔥 New in v1.1**
> - **文字修复增强**：大幅提升了中文汉字（尤其是模糊字体）的识别与修复成功率。
> - **语境感知**：引入上下文联想修复，智能纠正"形近字"错误。

- **🖼️ 智能超清重绘**：基于 `gemini-3-pro-image-preview` 模型，智能识别并重绘文档内容，非单纯滤镜增强。

- **🔍 像素级修复**：提供 **2K (标准)** 与 **4K (极致)** 两种分辨率选项，满足不同场景需求。
- **📝 文字精准还原**：修复文字边缘锯齿与模糊，同时保持原有排版布局不变（*注：仅修复画质，不篡改内容*）。
- **📊 多格式导出**：
  - **PDF**: 重新生成的清晰文档。
  - **PPTX**: 亦可导出PPTX格式，注意该格式的文件依然不支持编辑内容。
- **🌗 现代化交互体验**：
  - 支持 **深色/浅色模式** 切换。
  - 支持 **中/英双语** 界面。
  - **实时对比**：长按或点击即可查看修复前后的画质差异。
  - **鼠标跟随动效**：沉浸式的视觉体验。

## 🛠️ 技术栈

本项目基于现代 Web 技术构建：

- **App Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (Gemini)
- **PDF Core**: [PDF.js](https://mozilla.github.io/pdf.js/) (Rendering) & [jsPDF](https://github.com/parallax/jsPDF) (Export)
- **Presentation**: [PptxGenJS](https://gitbrent.github.io/PptxGenJS/)

## 🚀 立即使用 (Online Usage)
 
无需安装，点击下方链接即可直接使用：
 
**👉 [点击打开: notebooklmfix.vercel.app](https://notebooklmfix.vercel.app/)**
 
### 🔑 配置 API Key
首次打开时，点击右上角的 **"选择 API Key"** 按钮，输入您的 Gemini API Key 即可。
> **隐私承诺**：您的 Key 仅保存在您自己的浏览器本地 (LocalStorage)，绝不会上传至任何服务器。
 
---
 
## 🛠️ 本地开发 (Developers Only)
如果您是开发者，希望在本地运行或修改代码：
 
### 1. 克隆与安装
```bash
git clone https://github.com/JaffryGao/notebooklm-fixer.git
cd notebooklm-fixer
npm install
npm run dev
```
 
### 2. 或者一键部署您自己的版本
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJaffryGao%2Fnotebooklm-fixer)


## 📖 使用指南


1.  **上传**: 将 NotebookLM 生成的 PDF 文件拖入上传区域。
2.  **预览**: 应用会自动提取 PDF 页面。
3.  **配置**: 
    - 选择画质 (2K/4K)。
    - 确认 API Key 状态。
4.  **修复**: 点击 "开始增强 (Start Restoration)"。
5.  **导出**: 修复完成后，点击底部的 PDF 或 PPTX 按钮下载文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。
