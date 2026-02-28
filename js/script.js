// ====================================
// MOBILE MENU TOGGLE
// ====================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ====================================
// CONTACT FORM HANDLING
// ====================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const CONTACT_EMAIL = 'reynren11@gmail.com';
const CONTACT_PHONE = '+639276060676';
const CONTACT_WHATSAPP = '639276060676';

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate form
    if (!name || !email || !subject || !message) {
        showFormNote('Please fill in all fields', 'error');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormNote('Please enter a valid email address', 'error');
        return;
    }

    showFormNote('Sending message...', 'success');

    // Ensure the email subject includes the visitor's subject
    const subjectInput = document.getElementById('formEmailSubject');
    if (subjectInput) {
        subjectInput.value = `Portfolio message: ${subject}`;
    }


    const whatsappText = `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`;
    const whatsappLink = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(whatsappText)}`;

    const smsText = `From: ${name} (${email})\nSubject: ${subject}\nMessage: ${message}`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const smsSeparator = isIOS ? '&' : '?';
    const smsLink = `sms:${CONTACT_PHONE}${smsSeparator}body=${encodeURIComponent(smsText)}`;

    // Send via FormSubmit AJAX so we can detect failures on-page.
    sendViaFormSubmit(contactForm)
        .then(() => {
            showDeliveredAndPhoneOptions(whatsappLink, smsLink);
            setTimeout(() => {
                contactForm.reset();
            }, 600);
        })
        .catch((err) => {
            console.error(err);
            showFormNote('Email sending failed. Please try again, or use WhatsApp/SMS buttons.', 'error');
            showPhoneOnlyOptions(whatsappLink, smsLink);

            // Fallback: try normal form submit (hidden iframe) in case fetch/CORS blocks.
            try {
                contactForm.submit();
            } catch (submitErr) {
                console.error(submitErr);
            }
        });
});

function showFormNote(message, type) {
    formNote.textContent = '';
    formNote.className = `form-note ${type}`;

    const text = document.createElement('div');
    text.textContent = message;
    formNote.append(text);
}

function showDeliveredAndPhoneOptions(whatsappLink, smsLink) {
    formNote.className = 'form-note success';
    formNote.textContent = '';

    const delivered = document.createElement('div');
    delivered.textContent = `Request sent to ${CONTACT_EMAIL}. If this is the first time using FormSubmit, check your inbox/spam for a confirmation email and activate it.`;

    const label = document.createElement('div');
    label.textContent = 'Also send to my phone via:';

    const links = document.createElement('div');
    links.className = 'send-links';

    const whatsappAnchor = document.createElement('a');
    whatsappAnchor.href = whatsappLink;
    whatsappAnchor.textContent = 'WhatsApp';
    whatsappAnchor.className = 'send-link';
    whatsappAnchor.target = '_blank';
    whatsappAnchor.rel = 'noopener noreferrer';

    const smsAnchor = document.createElement('a');
    smsAnchor.href = smsLink;
    smsAnchor.textContent = 'SMS';
    smsAnchor.className = 'send-link';

    links.append(whatsappAnchor, smsAnchor);
    formNote.append(delivered, label, links);
}

function showPhoneOnlyOptions(whatsappLink, smsLink) {
    formNote.className = 'form-note error';
    formNote.textContent = '';

    const hint = document.createElement('div');
    hint.textContent = 'Tip: Check your inbox/spam for a FormSubmit confirmation email (first-time setup), then try again.';

    const label = document.createElement('div');
    label.textContent = 'Send to my phone via:';

    const links = document.createElement('div');
    links.className = 'send-links';

    const whatsappAnchor = document.createElement('a');
    whatsappAnchor.href = whatsappLink;
    whatsappAnchor.textContent = 'WhatsApp';
    whatsappAnchor.className = 'send-link';
    whatsappAnchor.target = '_blank';
    whatsappAnchor.rel = 'noopener noreferrer';

    const smsAnchor = document.createElement('a');
    smsAnchor.href = smsLink;
    smsAnchor.textContent = 'SMS';
    smsAnchor.className = 'send-link';

    links.append(whatsappAnchor, smsAnchor);
    formNote.append(hint, label, links);
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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
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
window.addEventListener('scroll', () => {
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
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        closeCertificate();
    }
});

// ====================================
// CERTIFICATE MODAL FUNCTIONS
// ====================================
function openCertificate(cardElement) {
    const modal = document.getElementById('certificateModal');
    const title = cardElement.getAttribute('data-cert-title');
    const issuer = cardElement.getAttribute('data-cert-issuer');
    const certSrc = cardElement.getAttribute('data-cert-src');
    
    document.getElementById('certModalTitle').textContent = title;
    document.getElementById('certModalIssuer').textContent = issuer;

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

        modalImage.alt = `${title} certificate`;
        modalImage.src = certSrc;

        // In case the image is cached and already complete
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
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCertificate() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

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
