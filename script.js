let currentLang = localStorage.getItem('cv_lang') || 'en';
let globalData = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
    });

    // 2. Fetch Data & Render Initial Language
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            globalData = data;
            renderAll(currentLang);
            initObservers();
        })
        .catch(error => console.error('Error loading data:', error));

    // 3. Form Submit Prevent Default
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
                btn.style.background = '#10B981';
                this.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }, 1200);
        });
    }
});

// Switch Language Global Function
function switchLanguage(lang) {
    if (!globalData || currentLang === lang) return;
    currentLang = lang;
    localStorage.setItem('cv_lang', lang);
    renderAll(lang);
}

// Master Render Function
function renderAll(lang) {
    const langData = globalData[lang];
    if (!langData) return;

    // Update Language Switcher UI
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Render Navigation
    renderNav(langData.nav);
    
    // Render Sections
    renderHero(langData.hero);
    renderAbout(langData.about);
    renderEducation(langData.education);
    renderResearch(langData.research); // Sửa lại đúng tên hàm
    renderSkills(langData.skills);
    renderProjects(langData.projects);
    renderCertificates(langData.certificates);
    renderContact(langData.contact, globalData.socials);

    // Render Footer
    document.getElementById('footer-text').innerHTML = 
        `<code>&copy; ${new Date().getFullYear()} ${langData.hero.name}. Quantitative Portfolio.</code>`;
}

function renderNav(nav) {
    document.getElementById('nav-home').textContent = nav.home;
    document.getElementById('nav-about').textContent = nav.about;
    document.getElementById('nav-education').textContent = nav.education;
    document.getElementById('nav-research').textContent = nav.research || 'Research';
    document.getElementById('nav-skills').textContent = nav.skills;
    document.getElementById('nav-projects').textContent = nav.projects;
    document.getElementById('nav-certificates').textContent = nav.certificates;
    document.getElementById('nav-contact').textContent = nav.contact;
}

function renderHero(hero) {
    document.getElementById('hero-name').textContent = hero.name;
    document.getElementById('hero-desc').textContent = hero.description;
    document.getElementById('hero-cv-btn').textContent = hero.downloadCv;
    document.getElementById('hero-contact-btn').textContent = hero.contactBtn;
    initTyping(hero.titles);
}

function renderAbout(about) {
    document.getElementById('about-title').innerHTML = `${about.title} <span>${about.titleSpan}</span>`;
    document.getElementById('about-desc').textContent = about.description;
    document.getElementById('about-goal-label').textContent = about.careerGoalLabel;
    document.getElementById('about-goal').textContent = about.careerGoal;
    
    const infoHtml = `
         <ul>
             <li><i class="fas fa-envelope"></i> <code>${about.email}</code></li>
             <li><i class="fas fa-phone"></i> <code>${about.phone}</code></li>
             <li><i class="fas fa-map-marker-alt"></i> ${about.address}</li>
             <li><i class="fas fa-calendar-alt"></i> <code>${about.dob}</code></li>
             <li><i class="fab fa-orcid"></i> <a href="https://orcid.org/${about.orcid}" target="_blank"><code>${about.orcid}</code></a></li>
         </ul>
     `;
    document.getElementById('about-info').innerHTML = infoHtml;
}

function renderSkills(skills) {
    document.getElementById('skills-title').innerHTML = `${skills.title} <span>${skills.titleSpan}</span>`;
    const container = document.getElementById('skills-container');
    container.innerHTML = skills.categories.map(group => `
        <div class="skill-card glass-card">
            <h3 class="skill-category-title">${group.category}</h3>
            <div class="skill-tags">
                ${group.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function renderEducation(edu) {
    document.getElementById('education-title').innerHTML = `${edu.title} <span>${edu.titleSpan}</span>`;
    const labels = edu.labels || { thesis: "Thesis", focus: "Focus", gpa: "GPA" };
    const container = document.getElementById('education-container');
    container.innerHTML = edu.items.map(item => `
        <div class="timeline-item">
            <div class="timeline-date"><code>${item.period}</code></div>
            <h3 class="timeline-title">${item.major}</h3>
            <h4 class="timeline-subtitle">${item.school}</h4>
            <p class="timeline-desc"><strong>${labels.thesis}:</strong> <em>${item.thesis}</em></p>
            <p class="timeline-desc"><strong>${labels.focus}:</strong> ${item.knowledge}</p>
            <p class="timeline-desc"><strong>${labels.gpa}:</strong> <code>${item.gpa}</code></p>
        </div>
    `).join('');
}

function renderResearch(research) {
    document.getElementById('research-title').innerHTML = `${research.title} <span>${research.titleSpan}</span>`;
    const labels = research.labels || { journal: "Journal", abstract: "Abstract", keyword: "Keyword" };
    const container = document.getElementById('research-container');
    container.innerHTML = research.items.map(rese => `
        <div class="timeline-item">
            <div class="timeline-date"><code>${rese.status}</code></div>
            <h3 class="timeline-title">${rese.name}</h3>
            <h4 class="timeline-subtitle"><strong>${labels.journal}:</strong> ${rese.journal}</h4>
            <p class="timeline-desc"><strong>${labels.abstract}:</strong> <em>${rese.asbtracs}</em></p>
            <div class="project-tech" style="margin-top: 8px;">
                <strong>${labels.keyword}:</strong>
                ${rese.key ? rese.key.map(t => `<span class="tech-tag"><code>${t}</code></span>`).join('') : ''}
            </div>
            <div class="project-links" style="margin-top: 10px;">
                <a href="${rese.view}" target="_blank" title="Demo / View"><i class="fas fa-external-link-alt"></i></a>
            </div>
        </div>
    `).join('');
}

function renderProjects(projects) {
    document.getElementById('projects-title').innerHTML = `${projects.title}<span>${projects.titleSpan}</span>`;
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.items.map(proj => `
        <div class="project-card">
            <div class="project-img">
                <img src="${proj.image}" alt="${proj.name}" loading="lazy">
            </div>
            <div class="project-info">
                <h3 class="project-title">${proj.name}</h3>
                <p class="project-desc">${proj.description}</p>
                <div class="project-tech">
                    ${proj.tech.map(t => `<span class="tech-tag"><code>${t}</code></span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${proj.demo}" target="_blank" title="Demo / View"><i class="fas fa-external-link-alt"></i></a>
                    <a href="${proj.github}" target="_blank" title="Repository"><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCertificates(certs) {
    document.getElementById('certificates-title').innerHTML = `${certs.title} <span>${certs.titleSpan}</span>`;
    const container = document.getElementById('certificates-container');
    
    container.innerHTML = certs.items.map(cert => `
        <div class="timeline-item">
            <div class="timeline-date"><code>${cert.period}</code></div>
            <h3 class="timeline-title">${cert.name}</h3>
            <h4 class="timeline-subtitle">${cert.issuer}</h4>
            <p class="timeline-desc"><strong>Credential:</strong> <code>${cert.credentialId}</code></p>
            <p class="timeline-desc">${cert.details}</p>
        </div>
    `).join('');
}

function renderContact(contact, socials) {
    document.getElementById('contact-title').innerHTML = `${contact.title} <span>${contact.titleSpan}</span>`;
    document.getElementById('contact-subtitle').textContent = contact.subtitle;
    document.getElementById('input-name').placeholder = contact.namePlaceholder;
    document.getElementById('input-email').placeholder = contact.emailPlaceholder;
    document.getElementById('input-subject').placeholder = contact.subjectPlaceholder;
    document.getElementById('input-message').placeholder = contact.messagePlaceholder;
    document.getElementById('contact-submit-btn').innerHTML = `${contact.sendBtn} <i class="fas fa-paper-plane"></i>`;

    const container = document.getElementById('social-container');
    container.innerHTML = `
        <a href="${socials.github}" target="_blank"><i class="fab fa-github"></i></a>
        <a href="${socials.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
        <a href="${socials.email}"><i class="fas fa-envelope"></i></a>
        <a href="${socials.phone}"><i class="fas fa-phone"></i></a>
    `;
}

// Typing Effect
let typingTimer = null;
function initTyping(titles) {
    const typedTextSpan = document.querySelector(".typing-text");
    if (!typedTextSpan) return;
    
    if (typingTimer) clearTimeout(typingTimer);
    typedTextSpan.textContent = '';
    
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < titles[textArrayIndex].length) {
            typedTextSpan.textContent += titles[textArrayIndex].charAt(charIndex);
            charIndex++;
            typingTimer = setTimeout(type, 80);
        } else {
            typingTimer = setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = titles[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            typingTimer = setTimeout(erase, 40);
        } else {
            textArrayIndex = (textArrayIndex + 1) % titles.length;
            typingTimer = setTimeout(type, 800);
        }
    }
    
    if (titles.length) type();
}

// Scroll & Navigation Observer
function initObservers() {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            backToTop.classList.add('show');
        } else {
            header.classList.remove('sticky');
            backToTop.classList.remove('show');
        }

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navUl = document.querySelector('.nav-links');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }
}