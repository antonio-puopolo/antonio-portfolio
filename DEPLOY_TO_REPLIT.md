# Deploy to Replit - Step by Step Guide

## Quick Deploy (Easiest Method)

### Option 1: Import from GitHub (Recommended)

1. **Push this code to GitHub first:**
   ```bash
   cd /home/antonio-ubuntu/.openclaw/workspace/antonio-portfolio
   git init
   git add .
   git commit -m "Initial commit: Antonio Puopolo Portfolio"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/antonio-portfolio.git
   git push -u origin main
   ```

2. **Import to Replit:**
   - Go to https://replit.com
   - Click "+ Create Repl"
   - Select "Import from GitHub"
   - Paste your repo URL
   - Click "Import from GitHub"

3. **Replit will auto-detect the project and install dependencies**

4. **Click "Run" - the site will start**

5. **Get your public URL:**
   - Click the "Open in new tab" button
   - Copy the URL (format: `https://YOUR-PROJECT.YOUR-USERNAME.repl.co`)

### Option 2: Manual Upload

1. **Go to Replit:**
   - Visit https://replit.com
   - Click "+ Create Repl"
   - Select "Node.js" or "React" template
   - Name it "antonio-puopolo-portfolio"

2. **Upload all files:**
   - Delete the default files
   - Upload ALL files from the `antonio-portfolio` directory
   - Make sure the folder structure matches exactly

3. **Install dependencies:**
   - Replit should auto-detect package.json
   - Click "Run" or manually run: `npm install`

4. **Start the dev server:**
   - Run: `npm run dev`
   - Or just click "Run" button

5. **Access your site:**
   - Click "Open in new tab"
   - Your portfolio is now live!

## Files Checklist

Make sure you have all these files:

```
antonio-portfolio/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .replit
├── README.md
├── src/
│   ├── main.jsx
│   ├── index.css
│   └── App.jsx
```

## After Deployment

### View Captured Leads

Open browser console on your deployed site and run:
```javascript
JSON.parse(localStorage.getItem('leads'))
```

### Customize Content

Edit `src/App.jsx`:
- Replace Unsplash image URLs with actual property photos
- Update property details (addresses, prices)
- Modify testimonials with real client feedback
- Adjust colors in `tailwind.config.js`

### Make It Production-Ready

1. **Add real property images** (upload to Cloudinary/ImgBB or use Replit storage)
2. **Update meta tags** in `index.html` for SEO
3. **Set up real backend** for lead capture (integrate with email/CRM)
4. **Add Google Analytics** tracking code
5. **Custom domain** (available in Replit paid plans)

## Troubleshooting

**If the site doesn't load:**
- Check that all files are uploaded
- Run `npm install` in the Shell
- Make sure port 5173 is configured in .replit file

**If styling looks broken:**
- Clear browser cache
- Check that Tailwind is installed: `npm list tailwindcss`

**Need help?**
Check the console for errors or reach out!

---

## Your Live Site

Once deployed, share this URL with clients:
`https://YOUR-PROJECT.YOUR-USERNAME.repl.co`

Example: `https://antonio-puopolo-portfolio.antonio-p.repl.co`
