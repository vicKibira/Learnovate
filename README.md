# 🚀 Learnovate CRM & Training System

An ultra-modern, high-end CRM and Training Management System built with React, TypeScript, and Vite.

## 📦 Vercel Deployment

Follow these steps to deploy this application to Vercel:

### 1. Push to GitHub
Ensure all your project files are pushed to a GitHub repository.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New...** -> **Project**.
3. Import your **LearnovateCRM** repository.

### 3. Configure Build Settings
Vercel should detect the settings automatically, but verify they are:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Setup Environment Variables
If you use the AI features, add this in the **Environment Variables** section:
- **Key**: `GEMINI_API_KEY`
- **Value**: `[Your Google AI Studio Key]`

### 5. Deploy
Click **Deploy**. Your site will be live in seconds!

---
*Built for Learnovate Technologies*