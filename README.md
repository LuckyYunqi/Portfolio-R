# Reyniel Polancos - IT Student Portfolio

A professional, modern, and fully responsive portfolio website for an IT student preparing for OJT.

## 📋 Features

✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices  
✅ **Modern UI** - Clean, professional gradient design with smooth animations  
✅ **Mobile Optimized** - Hamburger menu for mobile navigation  
✅ **Contact Form** - Integrated email contact form  
✅ **Skills Showcase** - Visual skill progression bars  
✅ **Education Timeline** - Complete educational background  
✅ **Smooth Animations** - Page load and scroll animations  
✅ **Fast Performance** - Lightweight and optimized  

## 📁 Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling
├── js/
│   └── script.js       # Interactivity and form handling
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Local File (Easiest)
1. Download/extract the portfolio folder
2. Double-click `index.html` to open in your browser
3. Done! The website is ready to use

### Option 2: Using Live Server (Recommended for Development)
1. Install VS Code extension "Live Server" by Ritwick Dey
2. Right-click on `index.html` and select "Open with Live Server"
3. The website opens with auto-reload on file changes

### Option 3: Using Python (Simple Server)
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 769px - 1199px
- **Mobile**: 480px - 768px
- **Small Mobile**: Below 480px

## ✉️ Contact Form

The contact form opens the user's default email client with pre-filled fields:
- Uses `mailto:` protocol
- Works on all devices
- Validates all required fields
- Validates email format

**Email Recipient**: reynren11@gmail.com

## 🎨 Color Scheme

```css
Primary Color: #6366f1 (Indigo)
Secondary Color: #ec4899 (Pink)
Dark Background: #0f172a
Light Background: #f8fafc
Text Dark: #1e293b
Text Light: #64748b
```

## 🛠️ How to Customize

### Change Contact Email
Open `js/script.js` and find:
```javascript
window.location.href = `mailto:reynren11@gmail.com?subject=...`
```
Replace with your email.

### Update Personal Information
Edit `index.html` sections:
- **Hero Section** (lines 30-36)
- **About Section** (lines 44-60)
- **Contact Section** (lines 174-195)

### Modify Skills
Edit skill cards in `index.html` (around lines 145-165):
```html
<div class="skill-card">
    <div class="skill-icon">💻</div>
    <h3>Skill Name</h3>
    <div class="skill-bar">
        <div class="skill-fill" style="width: 65%"></div>
    </div>
    <p class="skill-percentage">65%</p>
</div>
```

### Change Colors
Edit `:root` variables in `css/style.css` (lines 1-9):
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #ec4899;
    /* ... */
}
```

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Create GitHub account and repository
2. Upload portfolio files
3. Enable GitHub Pages in repository settings
4. Access via: `yourusername.github.io/portfolio`

### Netlify (Free)
1. Go to netlify.com
2. Drag and drop the portfolio folder
3. Get live URL immediately

### Firebase Hosting (Free)
1. Go to firebase.google.com
2. Create project
3. Deploy via Firebase CLI
4. Get custom domain

### Traditional Web Hosting
1. Purchase domain and hosting
2. Upload files via FTP
3. Access via your domain

## 📧 Contact Information

- **Email**: reynren11@gmail.com
- **Phone**: +63 927 606 0676
- **Location**: Acaciahan St. Datoc Compound, Digos City, Davao Del Sur
- **Status**: 4th Year IT Student (Preparing for OJT)

## 🎓 Education

- **University of Mindanao** - College (4th Year, Current)
- **University of Mindanao** - Senior High School
- **Holy Cross Academy of Digos** - Junior High School
- **Ramon Magsaysay Elementary School** - Elementary

## 💻 Skills

- HTML (65%)
- CSS (60%)
- Adobe Photoshop (62%)
- Adobe Premiere Pro (58%)
- Adobe After Effects (55%)
- WordPress (50%)

**Overall Proficiency**: 50-65%

## 🔧 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This portfolio is for personal use. Feel free to customize for your needs.

## 🎯 Tips for OJT Preparation

1. **Update Projects**: Add your projects once they're complete
2. **Regular Updates**: Keep portfolio current with new skills
3. **Mobile First**: Always test on mobile before deployment
4. **Professional Photos**: Consider adding profile picture
5. **Blog Section**: Add a blog or projects section for future updates
6. **Analytics**: Add Google Analytics to track visitors
7. **SEO**: Optimize meta tags for search engines

## 📞 Support

For questions or improvements, refer to the inline code comments in:
- `css/style.css` - Style sections marked with comments
- `js/script.js` - JavaScript functionality explanations
- `index.html` - HTML structure notes

---

**Student Name**: Reyniel Polancos  
**Created**: February 2026  
**Status**: Production Ready  
**Version**: 1.0  

Good luck with your OJT! 🚀
