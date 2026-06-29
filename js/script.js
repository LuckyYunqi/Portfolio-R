// ====================================
// MOBILE MENU TOGGLE
// ====================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navPreview = document.getElementById('navPreview');
const navPreviewKicker = document.getElementById('navPreviewKicker');
const navPreviewTitle = document.getElementById('navPreviewTitle');
const navPreviewSummary = document.getElementById('navPreviewSummary');
const navPreviewList = document.getElementById('navPreviewList');
const navPreviewAction = document.getElementById('navPreviewAction');
const navPreviewCloseTargets = document.querySelectorAll('[data-nav-preview-close]');
let activePreviewTarget = '';

const navPreviewContent = {
    '#home': {
        kicker: 'Profile',
        title: 'Reyniel Polancos',
        summary: 'Fresh IT graduate focused on frontend development, mobile app foundations, and practical React-based projects for entry-level opportunities.',
        points: ['Available for junior developer roles', 'Based in Digos City, Davao del Sur', 'Frontend, mobile UI, and practical web setup']
    },
    '#about': {
        kicker: 'About',
        title: 'About Reyniel',
        summary: 'I build clean, responsive interfaces and keep improving through hands-on web and mobile app projects.',
        points: ['Fresh IT graduate', 'Practical experience with HTML, CSS, React JS, and React Native', 'Looking to contribute, learn real workflows, and grow with a development team']
    },
    '#education': {
        kicker: 'Education',
        title: 'Academic Background',
        summary: 'My education built the discipline, foundation, and learning habits I bring into development work.',
        points: ['College Graduate from University of Mindanao', 'Digos City, Davao del Sur', 'Focused on steady growth, problem solving, and practical skill building']
    },
    '#certifications': {
        kicker: 'Credentials',
        title: 'Certifications',
        summary: 'Certifications show my effort to strengthen core IT, web, and technical foundations.',
        points: ['TESDA computer systems and networking certificates', 'Introduction to CSS credential', 'IT Specialist: HTML and CSS certification']
    },
    '#projects': {
        kicker: 'Work',
        title: 'Projects',
        summary: 'My projects show growth across frontend interfaces, inventory workflows, mobile app concepts, and portfolio presentation.',
        points: ['TaskMate task management system in progress', 'Hospital and inventory management UI experience', 'MobileLex React Native consultation app project']
    },
    '#skills': {
        kicker: 'Skills',
        title: 'Technical Skills',
        summary: 'I am actively improving practical frontend, mobile, design, and local development skills.',
        points: ['Frontend: HTML, CSS, React JS', 'Mobile: React Native screens and navigation concepts', 'Tools: GitHub, VS Code, XAMPP, Photoshop, Premiere Pro, After Effects']
    }
};

function setMobileMenuState(isOpen) {
    navMenu.classList.toggle('active', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

hamburger.addEventListener('click', () => {
    setMobileMenuState(!navMenu.classList.contains('active'));
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        const target = link.getAttribute('href');
        if (navPreviewContent[target]) {
            event.preventDefault();
            openNavPreview(target);
        }
        setMobileMenuState(false);
    });
});

function openNavPreview(target) {
    const content = navPreviewContent[target];
    if (!navPreview || !content) return;

    activePreviewTarget = target;
    navPreviewKicker.textContent = content.kicker;
    navPreviewTitle.textContent = content.title;
    navPreviewSummary.textContent = content.summary;
    navPreviewList.innerHTML = content.points.map(point => `<li>${point}</li>`).join('');
    navPreviewAction.dataset.target = target;
    navPreview.classList.add('active');
    navPreview.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-preview-open');
    setTimeout(() => navPreviewAction?.focus(), 120);
}

function closeNavPreview() {
    if (!navPreview) return;

    navPreview.classList.remove('active');
    navPreview.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-preview-open');
}

function openPreviewTargetSection() {
    const targetSelector = navPreviewAction?.dataset.target || activePreviewTarget;
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    closeNavPreview();

    if (target) {
        window.requestAnimationFrame(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

navPreviewCloseTargets.forEach(target => {
    target.addEventListener('click', closeNavPreview);
});

navPreviewAction?.addEventListener('click', openPreviewTargetSection);

// ====================================
// EMAIL COMPOSE MODAL
// ====================================
const composeModal = document.getElementById('composeModal');
const composeTriggers = document.querySelectorAll('.email-compose-trigger');
const composeCloseTargets = document.querySelectorAll('[data-compose-close]');

function openComposeModal() {
    if (!composeModal) return;

    composeModal.classList.add('active');
    composeModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('compose-open');
    clearComposeNote();

    const firstField = composeModal.querySelector('#name');
    setTimeout(() => firstField?.focus(), 180);
}

function closeComposeModal() {
    if (!composeModal) return;

    composeModal.classList.remove('active');
    composeModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('compose-open');
    clearComposeNote();
    closeComposePanels();
}

function clearComposeNote() {
    const note = document.getElementById('formNote');
    if (!note) return;

    note.textContent = '';
    note.className = 'form-note';
}

composeTriggers.forEach(trigger => {
    trigger.addEventListener('click', openComposeModal);
});

composeCloseTargets.forEach(target => {
    target.addEventListener('click', closeComposeModal);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && composeModal?.classList.contains('active')) {
        closeComposeModal();
    }
});

// ====================================
// AVATAR HOVER TILT
// ====================================
(() => {
    const profileFrame = document.querySelector('.profile-frame');
    const canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!profileFrame || !canHover || reduceMotion) return;

    profileFrame.addEventListener('mousemove', (e) => {
        const rect = profileFrame.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        profileFrame.style.setProperty('--avatar-tilt-x', `${(-y * 9).toFixed(2)}deg`);
        profileFrame.style.setProperty('--avatar-tilt-y', `${(x * 11).toFixed(2)}deg`);
    });

    profileFrame.addEventListener('mouseleave', () => {
        profileFrame.style.setProperty('--avatar-tilt-x', '0deg');
        profileFrame.style.setProperty('--avatar-tilt-y', '0deg');
    });
})();

// ====================================
// CONTACT FORM HANDLING
// ====================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const CONTACT_EMAIL = 'reynren11@gmail.com';
const messageField = document.getElementById('message');
const composeToolbar = document.querySelector('.compose-toolbar');
const composeTrash = document.querySelector('.compose-trash');
const composeFormatPanel = document.getElementById('composeFormatPanel');
const composeEmojiPanel = document.getElementById('composeEmojiPanel');
const composeAttachment = document.getElementById('composeAttachment');
const composeImage = document.getElementById('composeImage');

function insertIntoMessage(text, selectOffset = 0) {
    if (!messageField) return;

    const start = messageField.selectionStart ?? messageField.value.length;
    const end = messageField.selectionEnd ?? messageField.value.length;
    messageField.setRangeText(text, start, end, 'end');
    messageField.focus();

    if (selectOffset > 0) {
        const cursor = start + selectOffset;
        messageField.setSelectionRange(cursor, cursor);
    }
}

function wrapMessageSelection(before, after = before) {
    if (!messageField) return;

    const start = messageField.selectionStart ?? 0;
    const end = messageField.selectionEnd ?? 0;
    const selected = messageField.value.slice(start, end) || 'text';
    const nextText = `${before}${selected}${after}`;

    messageField.setRangeText(nextText, start, end, 'select');
    messageField.focus();
    messageField.setSelectionRange(start + before.length, start + before.length + selected.length);
}

function toggleComposePanel(panel, action) {
    if (!panel) return;

    const isActive = panel.classList.toggle('active');
    panel.setAttribute('aria-hidden', String(!isActive));
    document.querySelector(`[data-compose-action="${action}"]`)?.classList.toggle('active', isActive);
}

function closeComposePanels() {
    [composeFormatPanel, composeEmojiPanel].forEach(panel => {
        panel?.classList.remove('active');
        panel?.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.compose-toolbar button.active').forEach(button => button.classList.remove('active'));
}

composeToolbar?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-compose-action]');
    if (!button) return;

    const action = button.dataset.composeAction;

    if (action !== 'format') {
        composeFormatPanel?.classList.remove('active');
        document.querySelector('[data-compose-action="format"]')?.classList.remove('active');
    }
    if (action !== 'emoji') {
        composeEmojiPanel?.classList.remove('active');
        document.querySelector('[data-compose-action="emoji"]')?.classList.remove('active');
    }

    switch (action) {
        case 'format':
            toggleComposePanel(composeFormatPanel, 'format');
            break;
        case 'attach':
            composeAttachment?.click();
            break;
        case 'link': {
            const url = window.prompt('Paste the link URL:');
            if (url) {
                const start = messageField?.selectionStart ?? 0;
                const end = messageField?.selectionEnd ?? 0;
                const selected = messageField?.value.slice(start, end) || 'link';
                messageField?.setRangeText(`[${selected}](${url})`, start, end, 'end');
                messageField?.focus();
            }
            break;
        }
        case 'emoji':
            toggleComposePanel(composeEmojiPanel, 'emoji');
            break;
        case 'drive':
            insertIntoMessage('\n\nGoogle Drive link: ');
            break;
        case 'image':
            composeImage?.click();
            break;
        case 'confidential':
            insertIntoMessage('\n\nNote: Please treat this message as confidential.');
            showFormNote('Confidential note added', '', 'success');
            break;
        case 'signature':
            insertIntoMessage('\n\nBest regards,\nReyniel Polancos');
            break;
        case 'more':
            showFormNote('More options', 'Use attach, image, link, emoji, signature, or confidential note.', 'success');
            break;
        case 'discard':
            contactForm?.reset();
            clearComposeNote();
            closeComposePanels();
            closeComposeModal();
            break;
        default:
            break;
    }
});

composeTrash?.addEventListener('click', () => {
    contactForm?.reset();
    clearComposeNote();
    closeComposePanels();
    closeComposeModal();
});

composeFormatPanel?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-compose-action]');
    if (!button) return;

    const action = button.dataset.composeAction;
    if (action === 'bold') wrapMessageSelection('**');
    if (action === 'italic') wrapMessageSelection('*');
    if (action === 'underline') wrapMessageSelection('<u>', '</u>');
});

composeEmojiPanel?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-emoji]');
    if (!button) return;

    insertIntoMessage(button.dataset.emoji);
});

composeAttachment?.addEventListener('change', () => {
    const fileName = composeAttachment.files?.[0]?.name;
    if (fileName) showFormNote('File attached', fileName, 'success');
});

composeImage?.addEventListener('change', () => {
    const fileName = composeImage.files?.[0]?.name;
    if (fileName) showFormNote('Image selected', fileName, 'success');
});

messageField?.addEventListener('input', () => {
    if (formNote?.classList.contains('success')) {
        clearComposeNote();
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInputField = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInputField.value.trim();
    const message = messageInput.value.trim();

    // Validate form
    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    if (!name || !email || !message) {
        showFormNote('Missing details', 'Please fill in all fields before sending.', 'error');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormNote('Invalid email', 'Please enter a valid email address.', 'error');
        return;
    }

    showFormNote('Sending message...', 'Your email is being delivered to my inbox.', 'sending');

    // Ensure the email subject includes the visitor's subject
    const subjectInput = document.getElementById('formEmailSubject');
    if (subjectInput) {
        subjectInput.value = subject ? `Portfolio message: ${subject}` : 'New message from your portfolio';
    }

    const submittedSubjectInput = document.getElementById('formSubmittedSubject');
    if (submittedSubjectInput) {
        submittedSubjectInput.value = subject;
        submittedSubjectInput.disabled = !subject;
    }

    const replyToInput = document.getElementById('formReplyTo');
    if (replyToInput) {
        replyToInput.value = email;
    }

    // Send via FormSubmit AJAX so we can detect failures on-page.
    sendViaFormSubmit(contactForm)
        .then(() => {
            showDeliveredMessage();
            setTimeout(() => {
                contactForm.reset();
                if (submittedSubjectInput) {
                    submittedSubjectInput.disabled = true;
                }
            }, 600);
        })
        .catch((err) => {
            console.error(err);
            showGmailConfirmationMessage();

            // Fallback: try normal form submit (hidden iframe) in case fetch/CORS blocks.
            try {
                contactForm.submit();
            } catch (submitErr) {
                console.error(submitErr);
            }
        });
});

function showFormNote(message, detail = '', type = 'success') {
    formNote.textContent = '';
    formNote.className = `form-note form-note--card ${type}`;

    const icon = document.createElement('span');
    icon.className = 'form-note-icon';
    icon.textContent = type === 'error' ? '!' : type === 'sending' ? '...' : '✓';

    const content = document.createElement('span');
    content.className = 'form-note-content';

    const title = document.createElement('strong');
    title.textContent = message;
    content.append(title);

    if (detail) {
        const text = document.createElement('span');
        text.textContent = detail;
        content.append(text);
    }

    formNote.append(icon, content);
}

function showDeliveredMessage() {
    formNote.className = 'form-note form-note--card success';
    formNote.textContent = '';

    const icon = document.createElement('span');
    icon.className = 'form-note-icon';
    icon.textContent = '✓';

    const content = document.createElement('span');
    content.className = 'form-note-content';

    const delivered = document.createElement('strong');
    delivered.textContent = 'Message sent to email';

    const detail = document.createElement('span');
    detail.textContent = `Sent to ${CONTACT_EMAIL}. If this is the first message, confirm FormSubmit in your inbox or spam folder.`;

    content.append(delivered, detail);
    formNote.append(icon, content);
}

function showGmailConfirmationMessage() {
    formNote.className = 'form-note form-note--card error';
    formNote.textContent = '';

    const icon = document.createElement('span');
    icon.className = 'form-note-icon';
    icon.textContent = '!';

    const content = document.createElement('span');
    content.className = 'form-note-content';

    const title = document.createElement('strong');
    title.textContent = 'Gmail confirmation needed';

    const hint = document.createElement('span');
    hint.textContent = `This form sends only to ${CONTACT_EMAIL}. Please confirm the first FormSubmit email in my Gmail inbox or spam folder, then try sending again.`;

    content.append(title, hint);
    formNote.append(icon, content);
}

async function sendViaFormSubmit(formElement) {
    const action = formElement.getAttribute('action') || '';
    const ajaxAction = action.includes('formsubmit.co/ajax/')
        ? action
        : action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

    if (!ajaxAction.includes('formsubmit.co/ajax/')) {
        throw new Error('FormSubmit action URL is not configured.');
    }

    const formData = new FormData(formElement);
    const response = await fetch(ajaxAction, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
            const data = await response.json();
            if (data && data.message) message = data.message;
        } catch {
            // ignore
        }
        throw new Error(`FormSubmit failed: ${message}`);
    }

    const data = await response.json().catch(() => null);
    if (data && data.success === false) {
        throw new Error(data.message || 'FormSubmit reported failure.');
    }
}

// ====================================
// SMOOTH SCROLL ENHANCEMENT
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (e.defaultPrevented) return;

        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ====================================
// SCROLL ANIMATION ON PAGE LOAD
// ====================================
const revealSelectors = [
    '.section-title',
    '.section-subtitle',
    '.objective-content',
    '.about-text > p',
    '.info-item',
    '.service-card',
    '.education-item',
    '.cert-card',
    '.project-card',
    '.skill-category-card',
    '.contact-form'
].join(', ');

document.querySelectorAll(revealSelectors).forEach((item, index) => {
    item.classList.add('reveal-item');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 70}ms`);
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.querySelectorAll('.reveal-item').forEach((item, index) => {
                item.style.setProperty('--reveal-delay', `${index * 80}ms`);
                item.classList.add('revealed');
            });
            if (entry.target.classList.contains('reveal-item')) {
                entry.target.classList.add('revealed');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ====================================
// ACTIVE NAVIGATION LINK HIGHLIGHT
// ====================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('navbar-scrolled', window.scrollY > 24);
    }

    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

window.dispatchEvent(new Event('scroll'));

// ====================================
// PAGE LOAD ANIMATIONS
// ====================================
window.addEventListener('load', () => {
    // Trigger skill bars animation
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'slideIn 0.6s ease forwards';
        }, index * 100);
    });
});

// ====================================
// RESPONSIVE ADJUSTMENTS
// ====================================
function adjustForMobile() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Mobile optimizations
        document.documentElement.style.fontSize = '14px';
    } else {
        document.documentElement.style.fontSize = '16px';
    }
}

window.addEventListener('resize', adjustForMobile);
window.addEventListener('load', adjustForMobile);

// ====================================
// KEYBOARD NAVIGATION
// ====================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        setMobileMenuState(false);
        closeNavPreview();
        closeCertificate();
        return;
    }

    const modal = document.getElementById('certificateModal');
    const isModalOpen = modal && modal.style.display === 'block';
    if (!isModalOpen) return;

    if (e.key === 'ArrowLeft') {
        navigateCertificate(-1);
    }

    if (e.key === 'ArrowRight') {
        navigateCertificate(1);
    }
});

// ====================================
// CERTIFICATE MODAL FUNCTIONS
// ====================================
let certCards = [];
let currentCertIndex = -1;

function initializeCertificateNavigation() {
    certCards = Array.from(document.querySelectorAll('#certifications .cert-card'));

    const prevBtn = document.getElementById('certModalPrev');
    const nextBtn = document.getElementById('certModalNext');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateCertificate(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigateCertificate(1);
        });
    }
}

function updateModalNavButtons() {
    const prevBtn = document.getElementById('certModalPrev');
    const nextBtn = document.getElementById('certModalNext');
    if (!prevBtn || !nextBtn) return;

    const hasMultiple = certCards.length > 1;
    prevBtn.hidden = !hasMultiple;
    nextBtn.hidden = !hasMultiple;

    if (!hasMultiple) return;

    prevBtn.disabled = currentCertIndex <= 0;
    nextBtn.disabled = currentCertIndex >= certCards.length - 1;
}

function setCertificateModalContent(cardElement) {
    if (!cardElement) return;

    const title = cardElement.getAttribute('data-cert-title');
    const issuer = cardElement.getAttribute('data-cert-issuer');
    const certSrc = cardElement.getAttribute('data-cert-src');

    document.getElementById('certModalTitle').textContent = title || 'Certificate';
    document.getElementById('certModalIssuer').textContent = issuer || '';

    const modalImage = document.getElementById('certModalImage');
    const modalPlaceholder = document.getElementById('certModalPlaceholder');

    if (modalImage && modalPlaceholder && certSrc) {
        modalImage.onerror = () => {
            modalImage.style.display = 'none';
            modalPlaceholder.style.display = 'block';
        };

        modalImage.onload = () => {
            modalPlaceholder.style.display = 'none';
            modalImage.style.display = 'block';
        };

        modalImage.alt = title ? `${title} certificate` : 'Certificate';
        modalImage.src = certSrc;

        if (modalImage.complete && modalImage.naturalWidth > 0) {
            modalPlaceholder.style.display = 'none';
            modalImage.style.display = 'block';
        }
    } else if (modalImage && modalPlaceholder) {
        modalImage.style.display = 'none';
        modalPlaceholder.style.display = 'block';
        modalImage.removeAttribute('src');
        modalImage.alt = '';
    }
}

function navigateCertificate(direction) {
    if (!Array.isArray(certCards) || certCards.length === 0) return;
    if (currentCertIndex < 0) return;

    const nextIndex = currentCertIndex + direction;
    if (nextIndex < 0 || nextIndex >= certCards.length) return;

    currentCertIndex = nextIndex;
    setCertificateModalContent(certCards[currentCertIndex]);
    updateModalNavButtons();
}

function openCertificate(cardElement) {
    const modal = document.getElementById('certificateModal');

    if (!certCards.length) {
        certCards = Array.from(document.querySelectorAll('#certifications .cert-card'));
    }
    currentCertIndex = certCards.indexOf(cardElement);
    if (currentCertIndex < 0) currentCertIndex = 0;

    setCertificateModalContent(cardElement);
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    updateModalNavButtons();
}

function closeCertificate() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    currentCertIndex = -1;
    updateModalNavButtons();

    const modalImage = document.getElementById('certModalImage');
    const modalPlaceholder = document.getElementById('certModalPlaceholder');
    if (modalImage) {
        modalImage.onerror = null;
        modalImage.onload = null;
        modalImage.removeAttribute('src');
        modalImage.alt = '';
        modalImage.style.display = 'none';
    }
    if (modalPlaceholder) {
        modalPlaceholder.style.display = 'block';
    }
}

// ====================================
// CERTIFICATE THUMBNAIL ENHANCEMENT
// ====================================
document.querySelectorAll('.cert-image-container').forEach((container) => {
    const img = container.querySelector('.cert-thumbnail');
    if (!img) return;

    const markLoaded = () => {
        img.style.display = 'block';
        container.classList.add('has-image');
    };
    const markErrored = () => {
        img.style.display = 'none';
        container.classList.remove('has-image');
    };

    img.addEventListener('load', markLoaded);
    img.addEventListener('error', markErrored);

    if (img.complete && img.naturalWidth > 0) {
        markLoaded();
    }
});

initializeCertificateNavigation();

// ====================================
// SIDE SCROLL BUTTONS
// ====================================
(() => {
    const carousels = document.querySelectorAll('.certifications-carousel, .projects-carousel, .skills-carousel');

    carousels.forEach((carousel) => {
        const scroller = carousel.querySelector('.certifications-grid, .projects-grid, .skills-grid');
        const prevBtn = carousel.querySelector('.cert-scroll-btn--left');
        const nextBtn = carousel.querySelector('.cert-scroll-btn--right');

        if (!scroller || !prevBtn || !nextBtn) return;

        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

        const getCarouselMetrics = () => {
            const cards = Array.from(scroller.children);
            const firstCard = cards[0];
            if (!firstCard) {
                return {
                    positions: [0],
                    currentIndex: 0,
                    maxIndex: 0
                };
            }

            const styles = getComputedStyle(scroller);
            const gapValue = getComputedStyle(scroller).gap || '0px';
            const gap = Number.parseFloat(gapValue) || 0;
            const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
            const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const visibleWidth = scroller.clientWidth - paddingLeft - paddingRight;
            const visibleCards = Math.max(1, Math.floor((visibleWidth + gap) / (cardWidth + gap)));
            const maxIndex = Math.max(0, cards.length - visibleCards);
            const positions = cards
                .slice(0, maxIndex + 1)
                .map((card) => Math.max(0, Math.round(card.offsetLeft - paddingLeft)));
            const currentIndex = positions.reduce((closestIndex, position, index) => {
                const closestDistance = Math.abs(positions[closestIndex] - scroller.scrollLeft);
                const currentDistance = Math.abs(position - scroller.scrollLeft);
                return currentDistance < closestDistance ? index : closestIndex;
            }, 0);

            return { positions, currentIndex, maxIndex };
        };

        const updateButtons = () => {
            const isOverflowing = scroller.scrollWidth > scroller.clientWidth + 2;
            prevBtn.hidden = !isOverflowing;
            nextBtn.hidden = !isOverflowing;

            if (!isOverflowing) return;

            const { currentIndex, maxIndex } = getCarouselMetrics();
            const firstCard = scroller.firstElementChild;
            const lastCard = scroller.lastElementChild;
            const scrollerRect = scroller.getBoundingClientRect();
            const firstRect = firstCard ? firstCard.getBoundingClientRect() : null;
            const lastRect = lastCard ? lastCard.getBoundingClientRect() : null;
            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            const atStart = currentIndex <= 0 || scroller.scrollLeft <= 4 || (firstRect && firstRect.left >= scrollerRect.left - 4);
            const atEnd = currentIndex >= maxIndex || scroller.scrollLeft >= maxScrollLeft - 4 || (lastRect && lastRect.right <= scrollerRect.right + 4);

            prevBtn.disabled = atStart;
            nextBtn.disabled = atEnd;
        };

        const scrollByStep = (direction) => {
            const { positions, currentIndex, maxIndex } = getCarouselMetrics();
            const nextIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
            if (nextIndex === currentIndex) {
                updateButtons();
                return;
            }

            const nextScrollLeft = positions[nextIndex] || 0;
            scroller.scrollTo({ left: nextScrollLeft, behavior: scrollBehavior });
        };

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollByStep(-1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollByStep(1);
        });

        scroller.addEventListener('scroll', updateButtons, { passive: true });
        window.addEventListener('resize', updateButtons);

        scroller.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollByStep(-1);
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollByStep(1);
            }
        });

        updateButtons();
    });
})();
