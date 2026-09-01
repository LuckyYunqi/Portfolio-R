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
        summary: 'Information Technology graduate focused on web development, mobile UI/UX, IT support, design, and creative digital work.',
        points: ['Web, Mobile UI/UX Designer & IT Specialist', 'Based in Digos City, Davao del Sur', 'HTML, CSS, JavaScript, React.js, React Native, Laravel, Figma, Photoshop, and Premiere Pro']
    },
    '#about': {
        kicker: 'About',
        title: 'About Reyniel',
        summary: 'I build clean, responsive interfaces and combine development, design, multimedia editing, and support skills.',
        points: ['Information Technology graduate', 'Practical experience with HTML, CSS, JavaScript, React.js, React Native, and Laravel', 'Creative, adaptable, and ready to contribute to a dynamic team']
    },
    '#experience': {
        kicker: 'Experience',
        title: 'Work Experience',
        summary: 'At MediaOne Software Solutions, I worked on web and mobile UI/UX, development support, multimedia content, and IT troubleshooting.',
        points: ['Web, Mobile UI/UX Designer & IT Specialist', 'March 3, 2026 - May 27, 2026', 'Designed interfaces, assisted development, edited media, and supported software troubleshooting']
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
        summary: 'My projects show growth across web interfaces, inventory workflows, full-stack systems, mobile app concepts, and creative presentation.',
        points: ['TaskMate task management system in progress', 'Hospital and inventory management UI experience', 'MobileLex React Native consultation app project']
    },
    '#skills': {
        kicker: 'Skills',
        title: 'Technical Skills',
        summary: 'My skills cover web development, mobile UI/UX, creative design, multimedia editing, communication, and IT support.',
        points: ['Development: HTML, CSS, JavaScript, React.js, React Native, Laravel', 'Design and editing: Figma, Photoshop, Premiere Pro, CapCut, After Effects, Luma, Kling', 'Professional: Effective communication, critical thinking, English fluency, and troubleshooting']
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
// DOWNLOAD CONFIRMATION
// ====================================
const downloadModal = document.getElementById('downloadModal');
const downloadTriggers = document.querySelectorAll('.download-confirm-trigger');
const downloadCloseTargets = document.querySelectorAll('[data-download-close]');
const downloadConfirmButton = document.getElementById('downloadConfirmButton');
const downloadTitle = document.getElementById('downloadTitle');
const downloadMessage = document.getElementById('downloadMessage');
let pendingDownload = null;

function openDownloadModal(trigger) {
    if (!downloadModal || !trigger) return;

    const label = trigger.dataset.downloadLabel || 'file';
    pendingDownload = {
        href: trigger.getAttribute('href'),
        filename: trigger.getAttribute('download') || ''
    };

    downloadTitle.textContent = `Download ${label}`;
    downloadMessage.textContent = `Do you want to download Reyniel Polancos' ${label} now?`;
    downloadModal.classList.add('active');
    downloadModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('download-open');
    setTimeout(() => downloadConfirmButton?.focus(), 120);
}

function closeDownloadModal() {
    if (!downloadModal) return;

    downloadModal.classList.remove('active');
    downloadModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('download-open');
    pendingDownload = null;
}

function startConfirmedDownload() {
    if (!pendingDownload?.href) return;

    const downloadLink = document.createElement('a');
    downloadLink.href = pendingDownload.href;
    downloadLink.download = pendingDownload.filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    closeDownloadModal();
}

downloadTriggers.forEach(trigger => {
    trigger.addEventListener('click', (event) => {
        event.preventDefault();
        openDownloadModal(trigger);
    });
});

downloadCloseTargets.forEach(target => {
    target.addEventListener('click', closeDownloadModal);
});

downloadConfirmButton?.addEventListener('click', startConfirmedDownload);

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
    if (event.key === 'Escape' && downloadModal?.classList.contains('active')) {
        closeDownloadModal();
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

const revealDirections = {
    '.service-card': ['left', 'right'],
    '.project-card': ['bounce'],
    '.skill-category-card': ['left', 'right'],
    '.cert-card': ['up'],
    '.education-item': ['left']
};

document.querySelectorAll(revealSelectors).forEach((item, index) => {
    item.classList.add('reveal-item');
    item.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 70}ms`);

    for (const [selector, directions] of Object.entries(revealDirections)) {
        if (item.matches(selector)) {
            item.setAttribute('data-reveal', directions[index % directions.length]);
            break;
        }
    }
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

let revealObserverFired = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            revealObserverFired = true;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.querySelectorAll('.reveal-item').forEach((item, index) => {
                item.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 45}ms`);
                item.classList.add('revealed');
            });
            if (entry.target.classList.contains('reveal-item')) {
                entry.target.classList.add('revealed');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections (the section is only the trigger — the per-card
// .reveal-item animation carries the motion, so the section itself isn't faded).
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Safety net: if the observer never fires (bfcache restore, a tab restored from
// the background, an unsupported environment) content must not stay hidden.
function revealSectionsInView() {
    const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < viewportBottom * 0.95 && rect.bottom > 0) {
            section.style.opacity = '1';
            section.style.transform = 'none';
            section.querySelectorAll('.reveal-item').forEach(item => item.classList.add('revealed'));
            if (section.classList.contains('reveal-item')) {
                section.classList.add('revealed');
            }
        }
    });
}

window.addEventListener('load', () => {
    window.setTimeout(() => {
        // Harmless if the observer already revealed these; essential if it didn't.
        revealSectionsInView();
        if (!revealObserverFired) {
            window.addEventListener('scroll', revealSectionsInView, { passive: true });
        }
    }, 1400);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !revealObserverFired) revealSectionsInView();
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) revealSectionsInView();
});

// ====================================
// IMAGE LOAD FADE-IN
// ====================================
document.querySelectorAll('.project-image img, .cert-thumbnail').forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
        img.classList.add('img-loaded');
    } else {
        img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
    }
});

// ====================================
// CURSOR-FOLLOW GLOW ON CARDS
// ====================================
(() => {
    const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    document.querySelectorAll('.service-card, .project-card, .skills-grid .skill-card, .cert-card').forEach(card => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
            card.style.setProperty('--my', `${event.clientY - rect.top}px`);
        });
    });
})();

// ====================================
// ACTIVE NAVIGATION LINK HIGHLIGHT
// ====================================
const navbar = document.querySelector('.navbar');

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

const scrollspySections = Array.from(document.querySelectorAll('section'));
let scrollTicking = false;

function updateOnScroll() {
    scrollTicking = false;

    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;

    if (navbar) {
        navbar.classList.toggle('navbar-scrolled', scrollTop > 24);
    }

    const scrollRange = doc.scrollHeight - doc.clientHeight;
    const progress = scrollRange > 0 ? Math.min(1, Math.max(0, scrollTop / scrollRange)) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;

    let current = '';
    for (const section of scrollspySections) {
        if (scrollTop >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    }

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
    });
}

function requestScrollUpdate() {
    if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateOnScroll);
    }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);

updateOnScroll();

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
    const isModalOpen = modal && modal.classList.contains('is-open');
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

    const countEl = document.getElementById('certModalCount');
    if (countEl) {
        countEl.textContent = (certCards.length > 1 && currentCertIndex >= 0)
            ? `${currentCertIndex + 1} / ${certCards.length}`
            : '';
    }

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
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    updateModalNavButtons();
}

function closeCertificate() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('is-open');
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
// CERTIFICATIONS ACCORDION GALLERY
// ====================================
(() => {
    const accordion = document.querySelector('.certifications-grid');
    if (!accordion) return;

    const panels = Array.from(accordion.querySelectorAll('.cert-card'));
    if (panels.length < 2) return;

    const DEFAULT_INDEX = 0;
    const expand = (index) => {
        panels.forEach((panel, i) => panel.classList.toggle('is-expanded', i === index));
    };

    expand(DEFAULT_INDEX);

    panels.forEach((panel, i) => {
        panel.setAttribute('tabindex', '0');
        panel.setAttribute('role', 'button');
        const title = panel.getAttribute('data-cert-title');
        if (title) panel.setAttribute('aria-label', `${title} — open certificate`);

        panel.addEventListener('mouseenter', () => expand(i));
        panel.addEventListener('focus', () => expand(i));
        panel.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openCertificate(panel);
            }
        });
    });

    accordion.addEventListener('mouseleave', () => expand(DEFAULT_INDEX));
})();

// ====================================
// SIDE SCROLL BUTTONS
// ====================================
(() => {
    const carousels = document.querySelectorAll('.services-carousel, .projects-carousel, .skills-carousel');

    carousels.forEach((carousel) => {
        const scroller = carousel.querySelector('.services-grid, .projects-grid, .skills-grid');
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
            const gap = Number.parseFloat(styles.gap) || 0;
            const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
            const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
            const cardWidth = firstCard.offsetWidth;
            const visibleWidth = scroller.clientWidth - paddingLeft - paddingRight;
            const visibleCards = Math.max(1, Math.floor((visibleWidth + gap) / (cardWidth + gap)));
            const lastIndex = Math.max(0, cards.length - visibleCards);
            const positions = cards
                .slice(0, lastIndex + 1)
                .map((card) => Math.max(0, Math.round(card.offsetLeft - paddingLeft)));

            const maxIndex = positions.length - 1;
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
            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            const atStart = scroller.scrollLeft <= 4 || currentIndex <= 0;
            const atEnd = scroller.scrollLeft >= maxScrollLeft - 4 || currentIndex >= maxIndex;

            prevBtn.disabled = atStart;
            nextBtn.disabled = atEnd;
        };

        const nudgeEnd = (direction) => {
            if (prefersReducedMotion) return;
            const cls = direction > 0 ? 'carousel-nudge-end' : 'carousel-nudge-start';
            scroller.classList.remove('carousel-nudge-end', 'carousel-nudge-start');
            // reflow so the animation restarts even on rapid clicks
            void scroller.offsetWidth;
            scroller.classList.add(cls);
            scroller.addEventListener('animationend', () => {
                scroller.classList.remove(cls);
            }, { once: true });
        };

        const scrollByStep = (direction) => {
            const { positions, currentIndex, maxIndex } = getCarouselMetrics();
            const nextIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
            if (nextIndex === currentIndex) {
                updateButtons();
                nudgeEnd(direction);
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

        // -------- Drag-to-scroll with momentum (mouse only) --------
        let dragging = false;
        let dragMoved = false;
        let dragStartX = 0;
        let dragStartScroll = 0;
        let lastX = 0;
        let lastT = 0;
        let velocity = 0;
        let momentumRaf = 0;

        const stopMomentum = () => {
            if (momentumRaf) {
                window.cancelAnimationFrame(momentumRaf);
                momentumRaf = 0;
            }
            scroller.classList.remove('is-gliding');
        };

        scroller.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            dragging = true;
            dragMoved = false;
            dragStartX = e.clientX;
            dragStartScroll = scroller.scrollLeft;
            lastX = e.clientX;
            lastT = e.timeStamp;
            velocity = 0;
            stopMomentum();
            try { scroller.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        });

        scroller.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - dragStartX;
            if (Math.abs(dx) > 4) {
                dragMoved = true;
                scroller.classList.add('is-dragging');
            }
            scroller.scrollLeft = dragStartScroll - dx;

            const dt = e.timeStamp - lastT || 16;
            velocity = (e.clientX - lastX) / dt;
            lastX = e.clientX;
            lastT = e.timeStamp;
        });

        const endDrag = (e) => {
            if (!dragging) return;
            dragging = false;
            scroller.classList.remove('is-dragging');
            try { scroller.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }

            if (prefersReducedMotion || Math.abs(velocity) < 0.05) {
                scroller.classList.remove('is-gliding');
                return;
            }

            let v = Math.max(-45, Math.min(45, velocity * 16));
            scroller.classList.add('is-gliding');
            const maxScroll = scroller.scrollWidth - scroller.clientWidth;
            const glide = () => {
                v *= 0.92;
                scroller.scrollLeft -= v;
                const atBound = scroller.scrollLeft <= 0 || scroller.scrollLeft >= maxScroll - 0.5;
                if (Math.abs(v) > 0.5 && !atBound) {
                    momentumRaf = window.requestAnimationFrame(glide);
                } else {
                    momentumRaf = 0;
                    scroller.classList.remove('is-gliding');
                }
            };
            glide();
        };

        scroller.addEventListener('pointerup', endDrag);
        scroller.addEventListener('pointercancel', endDrag);

        scroller.addEventListener('click', (e) => {
            // Suppress the click that ends a drag.
            if (dragMoved) {
                e.preventDefault();
                e.stopPropagation();
                dragMoved = false;
            }
        }, true);
    });
})();

// ====================================
// GRADUAL BLUR (bottom edge of the viewport)
// ====================================
(() => {
    const supported = (window.CSS && (CSS.supports('backdrop-filter', 'blur(2px)') ||
        CSS.supports('-webkit-backdrop-filter', 'blur(2px)')));
    if (!supported) return;

    const wrap = document.createElement('div');
    wrap.className = 'gradual-blur';
    wrap.setAttribute('aria-hidden', 'true');

    const LAYERS = 5;
    for (let i = 0; i < LAYERS; i += 1) {
        const layer = document.createElement('div');
        const blur = (0.6 * Math.pow(2, i)).toFixed(2); // 0.6 → ~9.6px
        const from = (i / LAYERS) * 100;
        const to = ((i + 2) / LAYERS) * 100;
        const maskGradient = `linear-gradient(to top, rgba(0,0,0,1) ${from}%, rgba(0,0,0,1) ${Math.min(to - 100 / LAYERS, 100)}%, rgba(0,0,0,0) ${Math.min(to, 100)}%)`;
        layer.style.backdropFilter = `blur(${blur}px)`;
        layer.style.webkitBackdropFilter = `blur(${blur}px)`;
        layer.style.maskImage = maskGradient;
        layer.style.webkitMaskImage = maskGradient;
        wrap.appendChild(layer);
    }

    document.body.appendChild(wrap);
})();

// ====================================
// TARGET CURSOR
// ====================================
(() => {
    const finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finePointer) return;

    let cursor;
    try {
        cursor = document.createElement('div');
        cursor.className = 'target-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.innerHTML =
            '<span class="target-cursor-dot"></span>' +
            '<span class="target-cursor-corner target-cursor-corner--tl"></span>' +
            '<span class="target-cursor-corner target-cursor-corner--tr"></span>' +
            '<span class="target-cursor-corner target-cursor-corner--br"></span>' +
            '<span class="target-cursor-corner target-cursor-corner--bl"></span>';
        document.body.appendChild(cursor);
    } catch (err) {
        return; // leave the native cursor alone if anything went wrong
    }

    document.documentElement.classList.add('has-target-cursor');

    const corners = Array.from(cursor.querySelectorAll('.target-cursor-corner'));
    const TARGET_SELECTOR = 'a[href], button, input, textarea, select, [role="button"], [tabindex="0"], .cta-button, .nav-link, .project-card, .service-card, .cert-card, .skill-card, .skill-category-card, .project-link';

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let activeTarget = null;
    let raf = 0;
    let looping = false;

    const setCorner = (i, ex, ey, size) => {
        let dx = ex;
        let dy = ey;
        if (i === 1) { dx = ex - size; }
        if (i === 2) { dx = ex - size; dy = ey - size; }
        if (i === 3) { dy = ey - size; }
        corners[i].style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const render = () => {
        raf = 0;

        if (activeTarget && document.contains(activeTarget)) {
            const r = activeTarget.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;

            const size = 16;
            const hw = r.width / 2 + 7;
            const hh = r.height / 2 + 7;
            setCorner(0, -hw, -hh, size);
            setCorner(1, hw, -hh, size);
            setCorner(2, hw, hh, size);
            setCorner(3, -hw, hh, size);

            looping = true;
            raf = window.requestAnimationFrame(render);
        } else {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            const size = 12;
            const d = 8;
            setCorner(0, -d, -d, size);
            setCorner(1, d, -d, size);
            setCorner(2, d, d, size);
            setCorner(3, -d, d, size);
            looping = false;
        }
    };

    const schedule = () => {
        if (!raf) raf = window.requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.remove('is-hidden');
        if (!looping) schedule();
    }, { passive: true });

    document.addEventListener('pointerover', (e) => {
        const target = e.target.closest && e.target.closest(TARGET_SELECTOR);
        if (target && target !== activeTarget) {
            activeTarget = target;
            cursor.classList.add('is-targeting');
            schedule();
        }
    });

    document.addEventListener('pointerout', (e) => {
        if (!activeTarget) return;
        const next = e.relatedTarget;
        if (next && activeTarget.contains(next)) return;
        activeTarget = null;
        cursor.classList.remove('is-targeting');
        schedule();
    });

    document.addEventListener('pointerleave', () => {
        cursor.classList.add('is-hidden');
    });

    window.addEventListener('blur', () => cursor.classList.add('is-hidden'));

    render();
})();
