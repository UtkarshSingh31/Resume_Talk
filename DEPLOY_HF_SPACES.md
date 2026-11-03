# Deploy to Hugging Face Spaces

## ✅ Quick Setup (5 minutes)

### Step 1: Create a Hugging Face Account
1. Go to https://huggingface.co/
2. Sign up (free)
3. Go to Settings → Access Tokens → Create new token (read/write)
4. Copy the token

### Step 2: Create a New Space
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. **Space name:** `resume-talk-backend`
4. **Owner:** Your username
5. **License:** Pick any
6. **Space SDK:** Docker
7. Click "Create Space"

### Step 3: Push Code to HF Spaces

Open terminal and run:
```bash
cd e:\resume_talk
git init
git add .
git commit -m "Initial commit"
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend
git push -u origin main
```

When prompted for password, use your HF token.

### Step 4: Set Environment Variables
1. Go to your Space: https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend
2. Click **Settings** (top right)
3. Scroll to **Repository secrets**
4. Add these secrets:
   - `GOOGLE_API_KEY` = your key
   - `GROQ_API_KEY` = your key
   - `RAPID_API_KEY` = your key
   - `DEBUG` = false

### Step 5: Done! ✅
Hugging Face will automatically:
- Build the Docker container
- Deploy the app
- Give you a public URL like: `https://yourname-resume-talk-backend.hf.space`

Your API will be at: `https://yourname-resume-talk-backend.hf.space/api/v1`

---

## Troubleshooting

### Model download timeout
The Dockerfile pre-caches the embedding model. If it still times out:
```bash
# In local terminal
python backend/cache_models.py  
# Then commit and push
```

### HF Space crashes
Check the Logs tab in Space settings for errors.

### Can't authenticate
Make sure your `.env` file is NOT committed (add to `.gitignore`)

---

## Commands

```bash
# First time setup
git init
git config user.email "your@email.com"
git config user.name "Your Name"
git add .
git commit -m "Initial"
git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend
git push -u origin main

# Later updates
git add .
git commit -m "Update: description"
git push

# Clone an existing space
git clone https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend
```

---

## Testing Your API

Once deployed, test with:
```bash
curl https://yourname-resume-talk-backend.hf.space/health
# Returns: {"status": "healthy"}
```

---

## FAQ

**Q: Will the free tier work?**
A: Yes! HF Spaces free tier is 2 CPUs + 16GB RAM (better than Render)

**Q: Where do I get API keys?**
- GOOGLE_API_KEY: https://console.cloud.google.com/
- GROQ_API_KEY: https://console.groq.com/
- RAPID_API_KEY: https://rapidapi.com/

**Q: Can I use a custom domain?**
A: Yes, but that requires HF Pro ($9/mo). The default space URL is free.

**Q: Does it auto-update?**
A: Yes, any git push rebuilds and redeploys automatically.
