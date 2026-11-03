# ✅ DEPLOYMENT CHECKLIST - Hugging Face Spaces

## Pre-Deployment ✓
- [x] Lazy-loaded embeddings (no startup blocking)
- [x] Lightweight model (TinyLM - 20MB)
- [x] Dockerfile ready
- [x] Config handles environment variables
- [x] .gitignore prevents secrets from committing

## Deployment Steps

### Step 1: Create HF Space
```
Go to: https://huggingface.co/spaces/create
Settings:
- Space name: resume-talk-backend
- Owner: Your username
- License: OpenRAIL
- Space SDK: Docker
Click "Create Space"
```

### Step 2A: EASY WAY - Push existing repo
```powershell
cd e:\resume_talk

# Add new files
git add Dockerfile .env.example DEPLOY_HF_SPACES.md HF_QUICK_START.md backend/cache_models.py

git commit -m "Add HF Spaces deployment files"

# Add HF Spaces remote (change YOUR_USERNAME)
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend

# Push to HF
git push hf master
```

### Step 2B: OR Clone from HF
```powershell
# If you want fresh start from HF side
git clone https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend
cd resume-talk-backend
# Copy your code files here
```

### Step 3: Set Environment Variables on HF
1. Go to your Space: `https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend`
2. Click **Settings** (gear icon, top right)
3. Scroll to **Repository secrets**
4. Add these secrets exactly:
   ```
   GOOGLE_API_KEY = your-actual-key
   GROQ_API_KEY = your-actual-key
   RAPID_API_KEY = your-actual-key
   DEBUG = false
   ```
5. Click "Save"

### Step 4: Wait for Build ⏳
HF Spaces will automatically:
- Build Docker container
- Download models (pre-cached, takes ~2 min)
- Deploy the app
- Give you a public URL

### Step 5: Test ✓
Once deployed, your API is at:
```
https://YOUR_USERNAME-resume-talk-backend.hf.space/api/v1
```

Test health endpoint:
```bash
curl https://YOUR_USERNAME-resume-talk-backend.hf.space/health
# Should return: {"status": "healthy"}
```

---

## 🐛 If Deployment Fails

### Check Logs
1. Go to Space dashboard
2. Click **Logs** tab at bottom
3. Look for errors

### Common Issues

**"No open ports detected"**
- HF Spaces detected app is listening ✓ (this is good, ignore)

**"Model download timeout"**
- Pre-caching during build should handle this
- If repeated: increase Dockerfile timeout or skip pre-cache

**"Import error: GOOGLE_API_KEY not found"**
- Make sure secrets are set in Space Settings
- They're injected as env vars at runtime

**"Port already in use"**
- Kill any local uvicorn: `netstat -ano | findstr 7860`

---

## 🔄 After Successful Deploy

### Make Updates
```powershell
# Make your changes
git add .
git commit -m "Update: description of changes"
git push hf master
# HF auto-rebuilds and redeploys!
```

### Monitor
- Check Logs tab for errors
- Monitor performance in Space settings

### Frontend Integration
Update your React app to call:
```javascript
const API_URL = "https://YOUR_USERNAME-resume-talk-backend.hf.space/api/v1"

fetch(`${API_URL}/analyze`, {
  method: "POST",
  body: formData
})
```

---

## 📊 HF Spaces vs Render

| Feature | HF Spaces | Render |
|---------|-----------|--------|
| **Free Tier CPU** | 2 cores | 0.5 cores ❌ |
| **Free Tier RAM** | 16GB | 512MB ❌ |
| **Cold Start** | ~1s ✓ | ~30s ❌ |
| **Model Cache** | Persistent ✓ | Lost on restart ❌ |
| **Auto Build** | Yes ✓ | Yes |
| **Custom Domain** | Pro only | Pro only |

**HF Spaces is better for your use case!** ✅

---

## Troubleshooting Commands

```bash
# Check your Space logs in browser
# https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend

# Test local Docker build
docker build -t resume-talk .
docker run -p 7860:7860 resume-talk

# Check HF token
cat ~/.huggingface/token

# Push to debug
git status
git log --oneline -5
```

---

Questions? Check:
- [HF Spaces Docs](https://huggingface.co/docs/hub/spaces)
- [Docker Docs](https://docs.docker.com/)
- Space Logs tab (most helpful!)
