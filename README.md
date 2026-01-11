# 🚀 Deploying Learnovate CRM to Vercel

This guide provides step-by-step instructions to deploy the **Learnovate Technologies CRM** to Vercel. This application is built with React, TypeScript, and Tailwind CSS, utilizing a modern ESM-based architecture.

## 📋 Prerequisites

Before you begin, ensure you have:
1.  A [Vercel Account](https://vercel.com/signup).
2.  The project files pushed to a Git repository (GitHub, GitLab, or Bitbucket).
3.  An **API Key** (if you plan to integrate Gemini AI features later).

---

## 🛠️ Option 1: Deployment via Vercel Dashboard (Recommended)

This is the easiest method and enables automatic deployments whenever you push code to your repository.

1.  **Import Project**: 
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** and then **"Project"**.
    *   Select your Git provider and import the `learnovate-crm` repository.

2.  **Configure Project Settings**:
    *   **Framework Preset**: Select **"Other"** (Since this is a custom ESM structure).
    *   **Root Directory**: Leave as `./` (the default).
    *   **Build Command**: `npm run build` (or `vite build` if using Vite).
    *   **Output Directory**: `dist` (or `build`).

3.  **Environment Variables**:
    *   If your application uses the Gemini API, expand the **Environment Variables** section.
    *   **Key**: `API_KEY`
    *   **Value**: *[Your Google AI Studio API Key]*
    *   Click **Add**.

4.  **Deploy**: 
    *   Click **"Deploy"**. Vercel will build the project and provide you with a production URL (e.g., `learnovate-crm.vercel.app`).

---

## 💻 Option 2: Deployment via Vercel CLI

If you prefer the command line, follow these steps:

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Initialize & Deploy**:
    Navigate to your project folder and run:
    ```bash
    vercel
    ```
    *   Set up and deploy? **Yes**
    *   Which scope? **[Your Scope]**
    *   Link to existing project? **No**
    *   What's your project's name? **learnovate-crm**
    *   In which directory is your code located? **./**

4.  **Set Environment Variables via CLI**:
    ```bash
    vercel env add API_KEY
    ```

5.  **Deploy to Production**:
    ```bash
    vercel --prod
    ```

---

## ⚙️ Build Settings Reference

For a standard setup, use these settings in the Vercel Project Settings:

| Setting | Value |
| :--- | :--- |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 🧪 Troubleshooting

### 1. "Module Not Found" Errors
Ensure all dependencies (like `framer-motion` and `lucide-react`) are listed in your `package.json`. If you are using the `importmap` provided in `index.html`, Vercel will serve these as static assets, but local TSX compilation still requires type definitions.

### 2. White Screen on Load
Check the browser console. If you see "process is not defined," ensure you are not referencing `process.env` directly in client-side code without a bundler (like Vite) that handles environment variable injection.

### 3. API Key Not Working
If using Gemini AI features, ensure the `API_KEY` environment variable is added to the **Production**, **Preview**, and **Development** environments in the Vercel Dashboard.

---

## 🔒 Security Note
Never commit your `API_KEY` directly into the source code. Always use `process.env.API_KEY` and manage the value through Vercel's encrypted Environment Variables interface.

---
*Built by Learnovate Technologies Operations Hub*