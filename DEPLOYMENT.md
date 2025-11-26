# 🚀 Deployment Guide - Leader Pulse

## ✅ Current Status

**Smart Contract:**
- ✅ Deployed to Solana Devnet
- ✅ Program ID: `As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr`
- ✅ All tests passing (6/6)
- ✅ Contest initialized on devnet

**Frontend:**
- ✅ Built successfully
- ✅ Environment variables configured
- ✅ Ready for Vercel deployment

---

## 📋 Deployment Information

### Smart Contract Details
- **Program ID**: `As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr`
- **Network**: Solana Devnet
- **Authority Wallet**: `Awx1ouo1h4svLsLRP2KvKYmfYGm6HamYcqyKuY4B9Uye`
- **RPC URL**: `https://api.devnet.solana.com`

### Frontend Environment Variables
```
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr
NEXT_PUBLIC_CONTEST_AUTHORITY=Awx1ouo1h4svLsLRP2KvKYmfYGm6HamYcqyKuY4B9Uye
```

---

## 🌐 Deploy to Vercel (Step-by-Step)

### Step 1: Prepare Your Repository
1. Make sure all changes are committed to Git
2. Push to GitHub/GitLab/Bitbucket (if not already done)

### Step 2: Deploy on Vercel

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket

2. **Create New Project**
   - Click "Add New Project" or "Import Project"
   - Select your repository
   - **IMPORTANT**: Set the **Root Directory** to `frontend`
     - In project settings, go to "Settings" → "General"
     - Under "Root Directory", click "Edit"
     - Set to: `frontend`
     - Click "Save"

3. **Configure Build Settings**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add these three variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_RPC_URL` | `https://api.devnet.solana.com` |
   | `NEXT_PUBLIC_PROGRAM_ID` | `As3b2ezRdvuFhQKH6C8FNJNm7s9YsqGhpyJE9LdF4Sr` |
   | `NEXT_PUBLIC_CONTEST_AUTHORITY` | `Awx1ouo1h4svLsLRP2KvKYmfYGm6HamYcqyKuY4B9Uye` |

   - Make sure all are set for **Production**, **Preview**, and **Development**
   - Click "Save"

5. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete (usually 2-3 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

---

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd frontend
npm install
npm run build
# Then upload the .next folder to your hosting provider
```

---

## 🧪 Verify Deployment

After deployment, verify:

1. **Frontend loads** - Visit your Vercel URL
2. **Wallet connects** - Connect with Phantom/Solflare wallet (set to Devnet)
3. **Contest displays** - You should see 5 candidates
4. **Can submit reviews** - Try rating a candidate

---

## 🔄 Re-initialize Contest (If Needed)

If the contest needs to be re-initialized on devnet:

```bash
cd anchor_project
anchor run initialize
```

Or use the frontend UI:
1. Connect the authority wallet (`Awx1ouo1h4svLsLRP2KvKYmfYGm6HamYcqyKuY4B9Uye`)
2. Click the "Initialize Contest" button in the UI

---

## 📝 Project Submission Checklist

- [x] Smart contract deployed to devnet
- [x] All tests passing
- [x] Frontend builds successfully
- [x] Environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL added to PROJECT_DESCRIPTION.md
- [ ] Tested on live Vercel deployment

---

## 🆘 Troubleshooting

### Frontend shows "Program not found"
- Verify `NEXT_PUBLIC_PROGRAM_ID` matches the deployed program ID
- Check that wallet is connected to Devnet (not Mainnet)

### "Contest not initialized"
- Connect the authority wallet and click "Initialize Contest"
- Or run: `cd anchor_project && anchor run initialize`

### Build fails on Vercel
- Check that Root Directory is set to `frontend`
- Verify all environment variables are set
- Check build logs in Vercel dashboard

### RPC rate limits
- If you hit rate limits, consider using a dedicated RPC provider:
  - Alchemy: `https://solana-devnet.g.alchemy.com/v2/YOUR_API_KEY`
  - QuickNode: `https://YOUR_ENDPOINT.solana-devnet.quiknode.pro/YOUR_TOKEN/`

---

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure wallet is connected to Devnet

---

**Last Updated**: Deployment ready - Smart contract live on devnet ✅

