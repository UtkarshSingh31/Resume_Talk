# 🚀 HF Spaces Deployment - Quick Steps

## 1️⃣ Create Space on Hugging Face
```
https://huggingface.co/spaces → Create new Space
- Name: resume-talk-backend
- SDK: Docker
```

## 2️⃣ Clone the Space Locally
```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/resume-talk-backend
cd resume-talk-backend
```

## 3️⃣ Copy Your Code
```bash
# From your resume_talk folder
cp -r . ../resume-talk-backend/
cd ../resume-talk-backend
```

## 4️⃣ Push to HF
```bash
git add .
git commit -m "Initial deploy"
git push
```

## 5️⃣ Set Secrets
Go to Space Settings → Repository secrets → Add:
- GOOGLE_API_KEY
- GROQ_API_KEY  
- RAPID_API_KEY
- DEBUG=false

## 6️⃣ Done! ✅
HF builds automatically. Your API URL:
```
https://YOUR_USERNAME-resume-talk-backend.hf.space
```

Test health endpoint:
```bash
curl https://YOUR_USERNAME-resume-talk-backend.hf.space/health
```

---

## 📝 Useful Links
- Bearer token: https://huggingface.co/settings/tokens
- My Spaces: https://huggingface.co/spaces
- Logs: Space dashboard → "Logs" tab
