# AYT Books — বাংলা বইয়ের ডিজিটাল লাইব্রেরি

জ্ঞানের পথে একটি ছোট্ট উদ্যোগ। React + Vite + Tailwind দিয়ে তৈরি স্ট্যাটিক ওয়েবসাইট।

## GitHub Pages-এ Publish করার নিয়ম

1. GitHub-এ নতুন repository বানান (যেমন `ayt-books`)।
2. এই ফোল্ডারের সব ফাইল `main` branch-এ push করুন।
3. GitHub-এ repo খুলে **Settings → Pages → Source** এ গিয়ে **GitHub Actions** সিলেক্ট করুন।
4. এরপর থেকে `main` branch-এ যতবার push করবেন, সাইট নিজে নিজেই আপডেট হবে।
5. সাইটের লিংক: `https://<আপনার-username>.github.io/<repo-নাম>/`

## নিজের কম্পিউটারে চালাতে

```bash
npm install
npm run dev      # ডেভেলপমেন্ট: http://localhost:3000
npm run build    # ফাইনাল বিল্ড (dist ফোল্ডারে)
npm run preview  # বিল্ড করা সাইট দেখুন
```
