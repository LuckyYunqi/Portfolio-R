# Reyniel Polancos - Modern Portfolio Website

A modern, responsive, and feature-rich portfolio website built with HTML5, CSS3, and vanilla JavaScript.

## 🎨 Features

### Core Features
- **Modern Dark Theme** - Professional dark background with vibrant accent colors
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Scroll animations and transitions throughout
- **Fixed Sidebar Navigation** - Easy navigation with active state indicators
- **Mobile-Friendly Menu** - Toggle menu for smaller screens

### Sections
1. **Hero Section** - Eye-catching introduction with animated text
2. **About Section** - Personal bio with information cards and profile image
3. **Skills Section** - Interactive skill cards with progress bars
4. **Resume Section** - Education and experience timeline
5. **Portfolio Section** - Filterable portfolio grid with lightbox preview
6. **Contact Section** - Contact form with validation and Google Maps integration

### Advanced Features
- ✅ Scroll-triggered animations (AOS effect)
- ✅ Smooth scrolling to sections
- ✅ Active navigation highlighting
- ✅ Responsive portfolio filtering
- ✅ Form validation
- ✅ Download resume functionality
- ✅ Social media links
- ✅ Contact form with email integration
- ✅ Mobile menu toggle
- ✅ Scroll-to-top button
- ✅ Parallax effects
- ✅ Hover animations

## 📁 File Structure

```
Portfolio/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── main.css       # Main stylesheet
│   ├── js/
│   │   └── main.js        # Main JavaScript
│   ├── img/
│   │   ├── favicon.png
│   │   ├── apple-touch-icon.png
│   │   ├── PortfolioImage.jpg
│   │   ├── BackgroundImage.jpg
│   │   ├── OJT.pdf        # Resume file
│   │   └── portfolio/     # Portfolio images
│   └── vendor/            # Third-party libraries
├── forms/
│   └── contact.php        # Contact form handler
└── README.md             # This file
```

## 🚀 Installation & Setup

### 1. Download Files
Clone or download all files to your XAMPP htdocs folder:
```
C:\xampp\htdocs\Portfolio
```

### 2. Add Assets
Place your images in the appropriate folders:
- **Profile Image**: `assets/img/PortfolioImage.jpg`
- **Background Image**: `assets/img/BackgroundImage.jpg`
- **Portfolio Images**: `assets/img/portfolio/`
- **Resume PDF**: `assets/OJT.pdf`

### 3. Configure Contact Form (Optional)
Edit the email address in `forms/contact.php`:
```php
$to = 'your-email@gmail.com'; // Change this
```

### 4. Update Social Links
In `index.html`, update the social media URLs:
```html
<a href="https://twitter.com/yourprofile" target="_blank" class="twitter">
```

### 5. Customize Content
Edit the following in `index.html`:
- Name and bio
- Skills and proficiency levels
- Education and experience
- Portfolio items
- Contact information

## 🎯 Customization Guide

### Change Colors
Edit the CSS variables in `index.html`:
```css
:root {
  --primary-color: #0066cc;      /* Main blue */
  --secondary-color: #ff6b6b;    /* Accent red */
  --accent-color: #4ecdc4;       /* Teal accent */
  --dark-bg: #0a0e27;            /* Dark background */
  --card-bg: #1a1f3a;            /* Card background */
  --text-light: #e0e0e0;         /* Text color */
}
```

### Add Portfolio Items
1. Upload image to `assets/img/portfolio/`
2. Add new portfolio item in the portfolio section:
```html
<div class="col-lg-4 col-md-6 portfolio-item filter-project">
  <div class="portfolio-image">
    <img src="assets/img/portfolio/your-image.jpg" alt="Project">
    <div class="portfolio-overlay">
      <a href="assets/img/portfolio/your-image.jpg" data-lightbox="portfolio">
        <i class="bi bi-zoom-in"></i>
      </a>
    </div>
  </div>
  <div class="portfolio-info">
    <h4>Project Title</h4>
    <p>Project description</p>
  </div>
</div>
```

### Update Skills
Modify skill cards in the Skills section:
```html
<div class="skill-card">
  <h4><i class="bi bi-film"></i> Skill Name</h4>
  <div class="progress-bar-custom">
    <div class="progress-fill" style="--width: 85%"></div>
  </div>
  <p>Skill description</p>
</div>
```

## 🔧 JavaScript Functions

### Download Resume
```javascript
downloadResume() // Automatically called from buttons
```

### Contact Form Submission
The contact form sends data to `forms/contact.php` for email handling.

### Smooth Scrolling
All anchor links automatically smooth scroll to their target sections.

### Portfolio Filtering
Click filter buttons to show/hide portfolio items by category.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔗 External Resources

- Bootstrap Icons: [bootstrap-icons.org](https://icons.getbootstrap.com/)
- Google Fonts: [fonts.google.com](https://fonts.google.com/)
- Font: Poppins, Roboto, Raleway

## 📧 Contact Form Configuration

### For Local Testing
The contact form will display a success message but won't send emails locally.

### For Production
1. Configure PHP mail on your server
2. Update email address in `forms/contact.php`
3. Test with valid SMTP settings

## ⚙️ Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This portfolio is personalized for Reyniel Polancos. Feel free to use as a template for your own portfolio.

## 🤝 Support

For questions or issues, contact: reynren11@gmail.com

---

**Last Updated**: January 13, 2026
**Version**: 2.0 - Modern Enhanced Edition
