# Developer Portfolio

A clean, modern portfolio website to showcase your backend development skills and projects.

## 🚀 Quick Start

### Customize Your Portfolio (10 minutes)

1. **Edit `index.html`** - Replace the following:
   - Line 7: Change "Your Name" to your actual name
   - Line 15: Update nav-brand with your name or initials
   - Line 29-31: Update hero section with your name and title
   - Lines 50-60: Write your own about section (3 paragraphs)
   - Lines 75-100: Update skills based on your tech stack
   - Lines 112-250: Update projects with your own work (see guide below)
   - Lines 265-275: Add your email, LinkedIn, and GitHub links

2. **Edit `style.css` (Optional)** - Customize colors:
   - Line 12: `--primary-color` (default: #0066cc)
   - Line 13: `--secondary-color` (default: #4d94ff)

3. **Test locally**:
   - Open `index.html` in your browser
   - Check all sections and links work

## 📝 How to Add Your Projects

Since your projects are in private company repos, here's how to present them:

### Project Template

```html
<div class="project-card">
    <div class="project-header">
        <h3>Your Project Title</h3>
        <span class="project-role">Your Role</span>
    </div>
    <div class="project-tech">
        <span class="tech-tag">Go</span>
        <span class="tech-tag">RabbitMQ</span>
        <!-- Add more tech tags -->
    </div>
    <p class="project-description">
        Brief description of what the project does and your contribution.
        Focus on the problem solved and technologies used.
    </p>
    <div class="project-highlights">
        <h4>Key Achievements:</h4>
        <ul>
            <li>Quantifiable result (e.g., "Reduced latency by 80%")</li>
            <li>Performance metrics (e.g., "Handled 10K requests/sec")</li>
            <li>Technical implementation (e.g., "Implemented retry pattern")</li>
        </ul>
    </div>
    <div class="project-challenges">
        <h4>Technical Challenges Solved:</h4>
        <ul>
            <li>Specific technical problem you solved</li>
            <li>How you approached complex issues</li>
        </ul>
    </div>
</div>
```

### What to Include (No Code Needed!)

For each project, describe:

1. **Title & Role**: What you built and your position
2. **Technologies**: All tech stack components
3. **Description**: What problem it solves (2-3 sentences)
4. **Key Achievements**: Use numbers! (latency, throughput, scale)
5. **Technical Challenges**: Show problem-solving skills

### Example (Your RabbitMQ/Kafka Work)

```
Title: "Real-time Event Processing System"
Role: "Backend Developer"
Tech: Go, RabbitMQ, PostgreSQL, Docker

Description:
"Built a distributed message processing system handling vehicle tracking 
events. Implemented reliable message routing with RabbitMQ for high-throughput 
real-time processing."

Achievements:
- Processed 10,000+ messages per minute
- Achieved 99.9% delivery reliability
- Reduced alert latency from 5s to 200ms
- Implemented idempotent processing pattern

Challenges:
- Preventing duplicate message processing across consumers
- Handling broker restarts gracefully
- Designing optimal routing key patterns
```

## 🌐 Deploy Your Portfolio (5 minutes)

### Option 1: GitHub Pages (Recommended)

1. Create a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io
   git push -u origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Scroll to "Pages"
   - Source: Deploy from branch "main"
   - Save

3. Your site will be live at: `https://yourusername.github.io`

### Option 2: Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your portfolio folder
3. Done! You get a URL like `yourname.netlify.app`

### Option 3: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically

## 📋 Checklist Before Publishing

- [ ] Replace all "Your Name" placeholders
- [ ] Update email, LinkedIn, GitHub links
- [ ] Add at least 2-3 projects
- [ ] Check all links work
- [ ] Test on mobile (resize browser)
- [ ] Proofread all text for typos
- [ ] Add your own skills/technologies
- [ ] Remove any placeholder text

## 🎨 Customization Tips

### Colors

Edit in `style.css` (lines 11-18):
```css
:root {
    --primary-color: #0066cc;      /* Main brand color */
    --secondary-color: #4d94ff;    /* Accent color */
}
```

Popular color schemes:
- **Blue**: #0066cc (professional, tech-focused)
- **Green**: #00a86b (growth, innovation)
- **Purple**: #6a4c93 (creative, modern)
- **Orange**: #ff6b35 (energetic, bold)

### Add More Sections

Want to add a blog, certifications, or education?

1. Copy any `<section>` block
2. Give it a new `id` (e.g., `id="certifications"`)
3. Add navigation link in navbar
4. Customize content

## 📱 Mobile Responsive

The portfolio is already mobile-friendly! Test by:
1. Resize your browser window
2. Use Chrome DevTools (F12 → Toggle Device Toolbar)
3. Check on your phone

## ❓ FAQ

**Q: Can I show projects from private repos?**
A: Yes! You don't need to share code. Just describe what you built, technologies used, and impact.

**Q: I don't have 3 projects yet**
A: That's fine! Start with 1-2 and add more later. Quality > quantity.

**Q: Should I include personal projects?**
A: Absolutely! Especially if they demonstrate relevant skills.

**Q: Can I add a blog section?**
A: Yes! Copy the projects section structure and modify for blog posts.

**Q: How do I add images?**
A: Create an `images/` folder and use `<img src="images/yourimage.png">`

## 🔧 Troubleshooting

**Links not working?**
- Check that section IDs match href values (e.g., `href="#about"` → `id="about"`)

**Styling looks off?**
- Make sure `style.css` is in the same folder as `index.html`
- Clear browser cache (Ctrl+Shift+R)

**Can't deploy?**
- Ensure all files are committed to git
- Check GitHub Pages settings

## 📚 Next Steps

Once your portfolio is live:

1. **Share it**:
   - Add to LinkedIn profile
   - Include in resume
   - Share on Twitter/X
   - Add to GitHub bio

2. **Get feedback**:
   - Ask colleagues to review
   - Post in developer communities
   - Iterate based on feedback

3. **Keep it updated**:
   - Add new projects every few months
   - Update skills as you learn
   - Refresh content regularly

## 🆘 Need Help?

If you run into issues:
1. Check that all files are in the same directory
2. Make sure file names match exactly (case-sensitive)
3. Test locally before deploying
4. Check browser console for errors (F12)

Good luck with your portfolio! 🚀
