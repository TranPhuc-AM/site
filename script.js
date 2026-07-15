document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });

    // 2. Fetch Data & Render
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderHero(data.hero);
            renderAbout(data.about);
            renderSkills(data.skills);
            renderExperience(data.experience);
            renderEducation(data.education);
            renderProjects(data.projects);
            renderCertificates(data.certificates);
            renderAchievements(data.achievements);
            renderSocials(data.socials);
            document.getElementById('footer-text').innerHTML = `&copy; ${new Date().getFullYear()} ${data.hero.name}. All Rights Reserved.`;
            
            // Re-initialize Observers after DOM is populated
            initObservers();
        })
        .catch(error => console.error('Error loading data:', error));

    // Render Functions
    function renderHero(hero) {
        document.getElementById('hero-name').textContent = hero.name;
        document.getElementById('hero-desc').textContent = hero.description;
        initTyping(hero.titles);
    }

    function renderAbout(about) {
        document.getElementById('about-desc').textContent = about.description;
        document.getElementById('about-goal').textContent = about.careerGoal;
        
        // const infoHtml = `
        //     <ul>
        //         <li><i class="fas fa-envelope"></i> ${about.email}</li>
        //         <li><i class="fas fa-phone"></i> ${about.phone}</li>
        //         <li><i class="fas fa-map-marker-alt"></i> ${about.address}</li>
        //         <li><i class="fas fa-calendar-alt"></i> ${about.dob}</li>
        //         <li><i class="fas fa-globe"></i> ${about.website}</li>
        //     </ul>
        // `;

        const infoHtml = `
             <ul>
                 <li><i class="fas fa-envelope"></i> ${about.email}</li>
                 <li><i class="fas fa-phone"></i> ${about.phone}</li>
                 <li><i class="fas fa-map-marker-alt"></i> ${about.address}</li>
                 <li><i class="fas fa-calendar-alt"></i> ${about.dob}</li>
             </ul>
         `;
         
        document.getElementById('about-info').innerHTML = infoHtml;
    }

    function renderSkills(skills) {
        const container = document.getElementById('skills-container');
        container.innerHTML = skills.map(skill => `
            <div class="skill-item">
                <div class="skill-info">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" data-width="${skill.level}%"></div>
                </div>
            </div>
        `).join('');
    }

    function renderExperience(exp) {
        const container = document.getElementById('experience-container');
        if (!container) return;
            container.innerHTML = exp.map(item => `
                <div class="timeline-item">
                    <div class="timeline-date">${item.period}</div>
                    <h3 class="timeline-title">${item.role}</h3>
                    <h4 class="timeline-subtitle">${item.company}</h4>
                    <p class="timeline-desc">${item.description}</p>
                    <p class="timeline-desc"><strong>Thành tựu:</strong> ${item.achievements}</p>
                </div>
            `).join('');
    }

    function renderEducation(edu) {
        const container = document.getElementById('education-container');
        if (!container) return;
            container.innerHTML = edu.map(item => `
                <div class="timeline-item">
                    <div class="timeline-date">${item.period}</div>
                    <h3 class="timeline-title">${item.major}</h3>
                    <h4 class="timeline-subtitle">${item.school}</h4>
                    <p class="timeline-subtitle"><strong>Thesis title:</strong> ${item.thesis}</p>
                    <p class="timeline-desc"><strong>Knowledge:</strong> ${item.knowledge}</p>
                    <p class="timeline-desc"><strong>GPA:</strong> ${item.gpa}</p>
                </div>
            `).join('');
    }

    function renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;
        container.innerHTML = projects.map(proj => `
            <div class="project-card">
                <div class="project-img">
                    <img src="${proj.image}" alt="${proj.name}" loading="lazy">
                </div>
                <div class="project-info">
                    <h3 class="project-title">${proj.name}</h3>
                    <p class="project-desc">${proj.description}</p>
                    <div class="project-tech">
                        ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${proj.demo}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>
                        <a href="${proj.github}" target="_blank" title="Source Code"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderCertificates(certs) {
        const container = document.getElementById('certificates-container');
        if (!container) return;
        container.innerHTML = certs.map(cert => `
            <div class="award-card">
                <i class="fas fa-certificate award-icon"></i>
                <div class="award-info">
                    <h4>${cert.name}</h4>
                    <p>${cert.issuer} | ${cert.year}</p>
                </div>
            </div>
        `).join('');
    }

    function renderAchievements(achieve) {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        container.innerHTML = achieve.map(item => `
            <div class="award-card">
                <i class="fas fa-trophy award-icon"></i>
                <div class="award-info">
                    <h4>${item.title}</h4>
                    <p>${item.competition} - ${item.year}</p>
                </div>
            </div>
        `).join('');
    }

    function renderSocials(socials) {
        const container = document.getElementById('social-container');
        container.innerHTML = `
            <a href="${socials.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="${socials.github}" target="_blank"><i class="fab fa-github"></i></a>
            <a href="${socials.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            <a href="${socials.email}"><i class="fas fa-envelope"></i></a>
            <a href="${socials.phone}"><i class="fas fa-phone"></i></a>
        `;
    }

    // 3. Typing Effect Logic
    function initTyping(titles) {
        const typedTextSpan = document.querySelector(".typing-text");
        let textArrayIndex = 0;
        let charIndex = 0;
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;

        function type() {
            if (charIndex < titles[textArrayIndex].length) {
                typedTextSpan.textContent += titles[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = titles[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= titles.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }
        
        if(titles.length) setTimeout(type, newTextDelay);
    }

    // 4. Scroll Features (Sticky Nav, Progress Bar, Active Menu, Reveal)
    const header = document.getElementById('header');
    const backToTop = document.getElementById('back-to-top');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header & Back to top
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            backToTop.classList.add('show');
        } else {
            header.classList.remove('sticky');
            backToTop.classList.remove('show');
        }

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Active Menu Item via ScrollSpy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
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

    // 5. Intersection Observer for Animations (Fade In/Slide Up & Skill Bars)
    function initObservers() {
        const revealElements = document.querySelectorAll('.reveal');
        const progressBars = document.querySelectorAll('.progress');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Animate skill bars if they exist inside the revealed section
                    const bars = entry.target.querySelectorAll('.progress');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width');
                    });
                    
                    observer.unobserve(entry.target); // Run once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // 6. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navUl = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navUl.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navUl.classList.remove('active');
        });
    });

    // 7. Form Submit Prevent Default (Demo)
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Đã gửi thành công';
            btn.style.background = '#10B981'; // Success color
            this.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = ''; // Reset to CSS defined
            }, 3000);
        }, 1500);
    });
});