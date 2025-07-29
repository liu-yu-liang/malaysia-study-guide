// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景
    initParticles();
    
    // 初始化标签页切换
    initTabs();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化3D效果
    init3DEffects();
    
    // 初始化图片懒加载
    initLazyLoading();
    
    // 初始化按钮点击效果
    initButtonEffects();
    
    // 初始化深色模式切换
    initDarkModeToggle();
});

// 粒子背景初始化
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // 创建粒子
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
        particle.style.position = 'absolute';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px rgba(255, 165, 0, 0.5)';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.transition = 'opacity 0.5s ease';
        
        particlesContainer.appendChild(particle);
        particles.push({
            element: particle,
            x: parseFloat(particle.style.left),
            y: parseFloat(particle.style.top),
            speedX: Math.random() * 0.2 - 0.1,
            speedY: Math.random() * 0.2 - 0.1
        });
    }
    
    // 动画粒子
    function animateParticles() {
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检查
            if (particle.x > 100) particle.x = 0;
            if (particle.x < 0) particle.x = 100;
            if (particle.y > 100) particle.y = 0;
            if (particle.y < 0) particle.y = 100;
            
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// 标签页切换功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // 滚动监听
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // 检测当前可见的部分
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 高亮导航链接
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // 添加动画效果
                section.classList.add('animate');
            }
        });
        
        // 视差滚动效果
        const parallaxElements = document.querySelectorAll('.glass-card');
        parallaxElements.forEach(element => {
            const speed = 0.05;
            const yPos = -(scrollPosition * speed);
            element.style.backgroundPosition = `center ${yPos}px`;
        });
    });
    
    // 初始触发一次滚动事件
    window.dispatchEvent(new Event('scroll'));
}

// 3D效果
function init3DEffects() {
    // 为卡片添加3D悬停效果
    const cards = document.querySelectorAll('.glass-card, .university-card, .expense-card, .advantage-item, .field-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠标在元素内的X坐标
            const y = e.clientY - rect.top;  // 鼠标在元素内的Y坐标
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 20; // 水平旋转角度
            const angleX = (centerY - y) / 20; // 垂直旋转角度
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // 动态光影效果
            const percentX = x / rect.width * 100;
            const percentY = y / rect.height * 100;
            this.style.background = `
                rgba(255, 255, 255, 0.1) 
                radial-gradient(
                    circle at ${percentX}% ${percentY}%, 
                    rgba(255, 165, 0, 0.15), 
                    transparent 80%
                )
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.background = '';
        });
    });
    
    // 为按钮添加脉冲效果
    const buttons = document.querySelectorAll('.cta-button, .tab-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
        });
    });
}

// 图片懒加载
function initLazyLoading() {
    // 检查浏览器是否支持IntersectionObserver
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 回退方案
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// 按钮点击效果
function initButtonEffects() {
    const buttons = document.querySelectorAll('button, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建脉冲效果
            const pulse = document.createElement('span');
            pulse.className = 'button-pulse';
            
            // 设置脉冲位置
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            pulse.style.top = `${y}px`;
            pulse.style.left = `${x}px`;
            
            // 添加到按钮
            this.appendChild(pulse);
            
            // 动画结束后移除
            setTimeout(() => {
                pulse.remove();
            }, 500);
        });
    });
    
    // 添加脉冲样式
    const style = document.createElement('style');
    style.textContent = `
        .button-pulse {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 165, 0, 0.4);
            transform: scale(0);
            animation: pulse-animation 0.5s forwards;
            pointer-events: none;
        }
        
        @keyframes pulse-animation {
            0% {
                transform: scale(0);
                width: 0;
                height: 0;
                opacity: 0.5;
            }
            100% {
                transform: scale(4);
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加深色模式切换
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// 检查用户偏好的颜色模式
function checkDarkModePreference() {
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
        document.body.classList.add('dark-mode');
    } else if (darkModePreference === null) {
        // 如果没有保存的偏好，检查系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        }
    }
}

// 初始化深色模式切换按钮
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            toggleDarkMode();
            
            // 添加按钮点击动画
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    }
    
    // 添加深色模式切换按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode-toggle.clicked {
            animation: toggle-pulse 0.3s forwards;
        }
        
        @keyframes toggle-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// 初始检查深色模式偏好
checkDarkModePreference();