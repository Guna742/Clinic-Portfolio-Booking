document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // FAQ Accordion Logic
    // ==========================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
                accItem.querySelector('.accordion-content').style.maxHeight = null;
            });

            // If it wasn't active before, open it
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // Dynamic Booking Calendar & Time Selection Popup
    // ==========================================
    const calendarDaysContainer = document.getElementById('calendar-days-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectDateBtn = document.getElementById('select-date-btn');
    
    // Quick Time Selection Modal Elements
    const quickBookingModal = document.getElementById('quick-booking-modal');
    const closeQuickBookingBtn = document.getElementById('close-quick-booking-modal');
    const modalDateDisplay = document.getElementById('modal-date-display');
    const modalTimeSlotsContainer = document.getElementById('modal-time-slots-container');
    const modalMobileInput = document.getElementById('modal-mobile-input');
    const modalConfirmBtn = document.getElementById('modal-confirm-booking-btn');
    
    // Success Modal Elements
    const successModal = document.getElementById('success-modal');
    const successDetails = document.getElementById('success-details');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    let selectedTime = null;
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Exact list of 17 time slots requested
    const times = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
        "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
        "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", 
        "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"
    ];
    
    function formatLongDate(dateObj) {
        if (!dateObj) return '';
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function parseTimeStringToDate(timeStr, baseDate) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const result = new Date(baseDate);
        result.setHours(hours, parseInt(minutes, 10), 0, 0);
        return result;
    }

    function openQuickBookingModal() {
        if (!quickBookingModal || !selectedDate) return;
        if (modalDateDisplay) {
            modalDateDisplay.textContent = formatLongDate(selectedDate);
        }
        renderTimeSlots();
        if (modalMobileInput) modalMobileInput.value = '';
        selectedTime = null;
        checkFormValid();
        
        quickBookingModal.style.display = 'flex';
        requestAnimationFrame(() => {
            quickBookingModal.classList.add('active');
        });
    }

    function closeQuickBookingModal() {
        if (!quickBookingModal) return;
        quickBookingModal.classList.remove('active');
        setTimeout(() => {
            quickBookingModal.style.display = 'none';
        }, 300);
    }

    function closeSuccessPopup() {
        if (!successModal) return;
        const content = successModal.querySelector('.success-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'scale(0.92)';
        }
        successModal.classList.remove('active');
        setTimeout(() => {
            successModal.style.display = 'none';
        }, 300);
    }

    function renderTimeSlots() {
        if (!modalTimeSlotsContainer) return;
        modalTimeSlotsContainer.innerHTML = '';
        selectedTime = null;
        
        const now = new Date();
        
        times.forEach((time, index) => {
            const slotDateTime = parseTimeStringToDate(time, selectedDate);
            const isPast = slotDateTime <= now;
            // Realistic booked state mock for demo
            const isBooked = isPast || (index === 2 || index === 7);
            
            const slotBtn = document.createElement('button');
            slotBtn.type = 'button';
            slotBtn.textContent = time;
            slotBtn.className = 'quick-time-slot-btn';
            
            if (isBooked) {
                slotBtn.classList.add('disabled');
                slotBtn.disabled = true;
                slotBtn.title = isPast ? 'Time passed' : 'Already Booked';
            } else {
                slotBtn.addEventListener('click', () => {
                    modalTimeSlotsContainer.querySelectorAll('.quick-time-slot-btn').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    slotBtn.classList.add('selected');
                    selectedTime = time;
                    checkFormValid();
                });
            }
            
            modalTimeSlotsContainer.appendChild(slotBtn);
        });
    }

    function checkFormValid() {
        if (!modalConfirmBtn || !modalMobileInput) return;
        const phone = modalMobileInput.value.trim();
        if (selectedTime && phone.length >= 7) {
            modalConfirmBtn.disabled = false;
        } else {
            modalConfirmBtn.disabled = true;
        }
    }

    function renderCalendar(month, year) {
        if (!monthYearDisplay || !calendarDaysContainer) return;
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let htmlStr = `
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Su</div>
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Mo</div>
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Tu</div>
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">We</div>
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Th</div>
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Fr</div>
            <div style="font-weight: 600; color: var(--text-muted); font-size: 14px; margin-bottom: 8px;">Sa</div>
        `;
        
        for (let i = 0; i < firstDay; i++) {
            htmlStr += `<div style="padding: 8px; border-radius: 8px; font-size: 14px; color: transparent;">0</div>`;
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(year, month, i);
            thisDate.setHours(0, 0, 0, 0);
            
            let isSelected = (selectedDate && selectedDate.getTime() === thisDate.getTime());
            
            if (thisDate < today) {
                htmlStr += `<div style="padding: 8px; border-radius: 8px; font-size: 14px; color: #cbd5e1; cursor: not-allowed; background: transparent;">${i}</div>`;
            } else {
                let style = isSelected ? 
                    'padding: 8px; border-radius: 8px; font-size: 14px; background: var(--clr-blue); color: white; box-shadow: 0 4px 12px rgba(37,99,235,0.3); font-weight: 600; cursor: pointer; transform: scale(1.05);' : 
                    'padding: 8px; border-radius: 8px; font-size: 14px; color: #1e293b; background: #f8fafc; cursor: pointer; transition: all 0.2s;';
                    
                htmlStr += `<div class="cal-day-btn" data-day="${i}" style="${style}">${i}</div>`;
            }
        }
        
        calendarDaysContainer.innerHTML = htmlStr;
        
        calendarDaysContainer.querySelectorAll('.cal-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = parseInt(e.target.getAttribute('data-day'), 10);
                selectedDate = new Date(year, month, day);
                selectedDate.setHours(0, 0, 0, 0);
                renderCalendar(currentMonth, currentYear);
                
                if (selectDateBtn) {
                    selectDateBtn.textContent = `Book for ${monthNames[month].substring(0, 3)} ${day}`;
                    selectDateBtn.disabled = false;
                }
                
                // Open booking or request login with selected date
                handleBookingRequest(selectedDate);
            });
        });
    }
    
    if (calendarDaysContainer) {
        selectedDate = new Date();
        selectedDate.setHours(0, 0, 0, 0);
        
        if (selectDateBtn) {
            selectDateBtn.textContent = `Book for ${monthNames[currentMonth].substring(0, 3)} ${selectedDate.getDate()}`;
            selectDateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleBookingRequest(selectedDate || new Date());
            });
        }
        
        renderCalendar(currentMonth, currentYear);
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                renderCalendar(currentMonth, currentYear);
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                renderCalendar(currentMonth, currentYear);
            });
        }
    }

    if (modalMobileInput) {
        modalMobileInput.addEventListener('input', checkFormValid);
    }

    if (closeQuickBookingBtn) {
        closeQuickBookingBtn.addEventListener('click', closeQuickBookingModal);
    }

    if (quickBookingModal) {
        quickBookingModal.addEventListener('click', (e) => {
            if (e.target === quickBookingModal) {
                closeQuickBookingModal();
            }
        });
    }

    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            const phone = modalMobileInput ? modalMobileInput.value.trim() : '';
            const formattedDate = formatLongDate(selectedDate);
            
            closeQuickBookingModal();
            
            if (successModal && successDetails) {
                successDetails.innerHTML = `<strong>Date:</strong> ${formattedDate}<br><strong>Time:</strong> ${selectedTime}<br><strong>Mobile:</strong> ${phone}<br><br>We have scheduled your appointment with AuraClinic. An SMS reminder will be sent shortly.`;
                
                successModal.style.display = 'flex';
                requestAnimationFrame(() => {
                    successModal.classList.add('active');
                    const content = successModal.querySelector('.success-content');
                    if (content) {
                        content.style.opacity = '1';
                        content.style.transform = 'scale(1)';
                    }
                });
            }
            
            selectedTime = null;
            if (modalMobileInput) modalMobileInput.value = '';
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeSuccessPopup);
    }

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccessPopup();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (quickBookingModal && quickBookingModal.classList.contains('active')) {
                closeQuickBookingModal();
            }
            if (successModal && successModal.classList.contains('active')) {
                closeSuccessPopup();
            }
        }
    });


    // ==========================================
    // Horizontal Scroll for "Why Choose Us"
    // ==========================================
    const whyUsSection = document.getElementById('why-us');
    const whyUsTrack = document.getElementById('why-choose-us-track');
    
    if (whyUsSection && whyUsTrack) {
        let ticking = false;
        
        const calculateMaxTranslate = () => {
            const firstCard = whyUsTrack.querySelector('.feature-card:first-child');
            const lastCard = whyUsTrack.querySelector('.feature-card:last-child');
            
            if (!firstCard || !lastCard) return 0;
            
            const firstCardLeft = firstCard.offsetLeft;
            const lastCardRight = lastCard.offsetLeft + lastCard.offsetWidth;
            const targetRightEdge = window.innerWidth - firstCardLeft;
            const maxTranslate = Math.max(0, lastCardRight - targetRightEdge);
            
            return maxTranslate;
        };

        const updateScroll = () => {
            const maxTranslate = calculateMaxTranslate();
            if (maxTranslate <= 0) {
                whyUsTrack.style.transform = 'translate3d(0px, 0, 0)';
                ticking = false;
                return;
            }
            
            const rect = whyUsSection.getBoundingClientRect();
            const totalScrollLength = whyUsSection.offsetHeight - window.innerHeight;
            
            if (totalScrollLength <= 0) {
                whyUsTrack.style.transform = 'translate3d(0px, 0, 0)';
                ticking = false;
                return;
            }
            
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                const currentScroll = Math.abs(rect.top);
                const progress = Math.min(Math.max(currentScroll / totalScrollLength, 0), 1);
                whyUsTrack.style.transform = `translate3d(-${progress * maxTranslate}px, 0, 0)`;
            } else if (rect.top > 0) {
                whyUsTrack.style.transform = 'translate3d(0px, 0, 0)';
            } else {
                whyUsTrack.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
            }
            ticking = false;
        };

        const setSectionHeight = () => {
            const maxTranslate = calculateMaxTranslate();
            if (maxTranslate > 0) {
                whyUsSection.style.height = `${window.innerHeight + maxTranslate}px`;
            } else {
                whyUsSection.style.height = 'auto';
            }
            updateScroll();
        };

        window.addEventListener('resize', setSectionHeight, { passive: true });
        window.addEventListener('orientationchange', setSectionHeight, { passive: true });
        window.addEventListener('load', setSectionHeight);
        setTimeout(setSectionHeight, 150);
        setTimeout(setSectionHeight, 600);
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }, { passive: true });
        
        setSectionHeight(); // Initial set
    }

    // ==========================================
    // Navbar Scroll & Dynamic CTA Extension
    // ==========================================
    const navbar = document.getElementById('navbar');
    const testimonialsSection = document.getElementById('testimonials');
    
    if (navbar) {
        const updateNavbarOnScroll = () => {
            // Normal top navbar converts to floating pill after ~3 scrolls (220px)
            if (window.scrollY > 220) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // "Book Appointment" CTA smoothly glides in when scrolling down into "Real Patients. Real Experiences." (#testimonials)
            if (testimonialsSection) {
                const rect = testimonialsSection.getBoundingClientRect();
                if (rect.top <= 100) {
                    navbar.classList.add('show-booking-cta');
                } else {
                    navbar.classList.remove('show-booking-cta');
                }
            }
        };

        window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
        updateNavbarOnScroll(); // Initial check
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav ul li');
    const indicator = document.querySelector('.mobile-bottom-nav .indicator');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only update nav if the section actually has a corresponding link
                const targetId = '#' + entry.target.id;
                const hasDesktopLink = Array.from(navLinks).some(link => link.getAttribute('href') === targetId);
                const hasMobileLink = Array.from(mobileNavItems).some(item => {
                    const a = item.querySelector('a');
                    return a && a.getAttribute('href') === targetId;
                });
                
                if (hasDesktopLink || hasMobileLink) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === targetId) {
                            link.classList.add('active');
                        }
                    });
                    
                    // Sync mobile bottom nav
                    if (mobileNavItems.length && indicator) {
                        mobileNavItems.forEach((item, index) => {
                            item.classList.remove('active');
                            const link = item.querySelector('a');
                            if (link && link.getAttribute('href') === targetId) {
                                item.classList.add('active');
                                const itemWidthPercent = 100 / mobileNavItems.length;
                                indicator.style.left = `calc(${index * itemWidthPercent}% + (${itemWidthPercent}% / 2) - 25px)`;
                            }
                        });
                    }
                }
            }
        });
    }, observerOptions);

    if (mobileNavItems.length && indicator) {
        mobileNavItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // IntersectionObserver handles the class changes on scroll, 
                // but we also want instant feedback on click before smooth scroll finishes
                mobileNavItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const itemWidthPercent = 100 / mobileNavItems.length;
                indicator.style.left = `calc(${index * itemWidthPercent}% + (${itemWidthPercent}% / 2) - 25px)`;
            });
        });
    }

    sections.forEach(section => observer.observe(section));

    // ==========================================
    // Footer Parallax Effect
    // ==========================================
    function updateFooterParallax() {
        const footer = document.querySelector('.footer');
        const mainWrapper = document.querySelector('.main-wrapper');
        if (footer && mainWrapper) {
            mainWrapper.style.marginBottom = footer.offsetHeight + 'px';
        }
    }
    
    window.addEventListener('resize', updateFooterParallax);
    // Initialize
    setTimeout(updateFooterParallax, 100);

    // ==========================================================
    // USER AUTHENTICATION STATE & LOGGED-IN MANAGEMENT
    // ==========================================================
    const loginModal = document.getElementById('login-modal');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const closeLoginBtn = document.getElementById('close-login-modal');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleLoginPwd = document.getElementById('toggle-login-pwd');
    const loginPwdInput = document.getElementById('login-password');
    const authStatusMsg = document.getElementById('auth-status-msg');
    const bookingLoginAlert = document.getElementById('booking-login-alert');

    let isLoginModalOpen = false;
    let pendingBooking = null; // Stores target booking date when redirecting through login

    function getSignedInUser() {
        try {
            const stored = localStorage.getItem('aura_clinic_user');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    function isUserSignedIn() {
        return getSignedInUser() !== null;
    }

    function setSignedInUser(userData) {
        try {
            localStorage.setItem('aura_clinic_user', JSON.stringify(userData));
        } catch (e) {
            console.error('Error saving user data:', e);
        }
        updateAuthUI();
    }

    function logoutUser() {
        try {
            localStorage.removeItem('aura_clinic_user');
        } catch (e) {
            console.error('Error removing user data:', e);
        }
        updateAuthUI();
    }

    function updateAuthUI() {
        const user = getSignedInUser();
        if (navLoginBtn) {
            if (user) {
                const displayName = user.name || 'Account';
                navLoginBtn.innerHTML = `<i class="ph-fill ph-user-circle" style="font-size: 16px;"></i> <span>${displayName}</span> <span id="nav-logout-action" title="Sign Out"><i class="ph ph-sign-out"></i></span>`;
                navLoginBtn.classList.add('logged-in');
            } else {
                navLoginBtn.innerHTML = `<i class="ph ph-user"></i> Login`;
                navLoginBtn.classList.remove('logged-in');
            }
        }
    }

    function openLoginModal() {
        if (!loginModal) return;
        loginModal.style.display = 'flex';
        requestAnimationFrame(() => {
            loginModal.classList.add('active');
            isLoginModalOpen = true;
        });
    }

    function closeLoginModal() {
        if (!loginModal) return;
        loginModal.classList.remove('active');
        isLoginModalOpen = false;
        setTimeout(() => {
            loginModal.style.display = 'none';
            if (authStatusMsg) authStatusMsg.style.display = 'none';
            if (bookingLoginAlert) bookingLoginAlert.style.display = 'none';
        }, 300);
    }

    function promptLoginForBooking(targetDate = null) {
        pendingBooking = {
            date: targetDate || selectedDate || new Date()
        };
        if (bookingLoginAlert) {
            bookingLoginAlert.style.display = 'flex';
        }
        openLoginModal();
    }

    function handleBookingRequest(targetDate = null) {
        const dateToBook = targetDate || selectedDate || new Date();
        if (!isUserSignedIn()) {
            promptLoginForBooking(dateToBook);
        } else {
            openGeneralBookingModal(dateToBook);
        }
    }

    function handleSuccessfulAuth(userData, isNewAccount = false) {
        setSignedInUser(userData);

        if (authStatusMsg) {
            if (pendingBooking) {
                authStatusMsg.textContent = `Welcome, ${userData.name}! Opening your appointment booking...`;
            } else {
                authStatusMsg.textContent = isNewAccount
                    ? `Account created successfully! Welcome to AuraClinic, ${userData.name}.`
                    : `Welcome back, ${userData.name}! Logged in successfully.`;
            }
            authStatusMsg.style.display = 'block';
            authStatusMsg.style.background = '#ecfdf5';
            authStatusMsg.style.color = '#065f46';
            authStatusMsg.style.borderColor = '#a7f3d0';
        }

        setTimeout(() => {
            closeLoginModal();
            if (pendingBooking) {
                const targetDate = pendingBooking.date;
                pendingBooking = null;
                setTimeout(() => {
                    openGeneralBookingModal(targetDate);
                }, 350);
            }
        }, pendingBooking ? 600 : 1000);
    }

    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const logoutTrigger = e.target.closest('#nav-logout-action');
            if (logoutTrigger) {
                logoutUser();
                return;
            }

            if (isUserSignedIn()) {
                const user = getSignedInUser();
                const confirmLogout = confirm(`Signed in as ${user?.name || 'Patient'} (${user?.email || ''}).\n\nDo you want to log out?`);
                if (confirmLogout) {
                    logoutUser();
                }
                return;
            }

            pendingBooking = null;
            if (bookingLoginAlert) bookingLoginAlert.style.display = 'none';
            openLoginModal();
        });
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener('click', closeLoginModal);
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeLoginModal();
            }
        });
    }

    // Tab switcher between Sign In and Create Account
    if (tabLogin && tabRegister && loginForm && registerForm) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            if (authStatusMsg) authStatusMsg.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            if (authStatusMsg) authStatusMsg.style.display = 'none';
        });
    }

    // Password visibility toggle
    if (toggleLoginPwd && loginPwdInput) {
        toggleLoginPwd.addEventListener('click', () => {
            const isPassword = loginPwdInput.type === 'password';
            loginPwdInput.type = isPassword ? 'text' : 'password';
            toggleLoginPwd.innerHTML = isPassword ? '<i class="ph ph-eye-slash"></i>' : '<i class="ph ph-eye"></i>';
        });
    }

    // Login Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('login-email');
            const email = emailInput ? emailInput.value.trim() : 'patient@example.com';
            let derivedName = email.split('@')[0];
            derivedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

            handleSuccessfulAuth({
                name: derivedName,
                email: email,
                phone: ''
            }, false);
        });
    }

    // Register Form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name')?.value.trim() || 'Patient';
            const email = document.getElementById('reg-email')?.value.trim() || 'patient@example.com';
            const phone = document.getElementById('reg-phone')?.value.trim() || '';

            handleSuccessfulAuth({
                name: name,
                email: email,
                phone: phone
            }, true);
        });
    }

    // Social Auth Buttons (Google & Apple)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isApple = btn.textContent.includes('Apple');
            handleSuccessfulAuth({
                name: isApple ? 'Apple Patient' : 'Google Patient',
                email: isApple ? 'patient@icloud.com' : 'patient@gmail.com',
                phone: ''
            }, false);
        });
    });

    // Initial auth UI synchronization
    updateAuthUI();

    // ==========================================================
    // GENERAL QUESTIONS CONSULTATION & APPOINTMENT BOOKING MODAL
    // ==========================================================
    const generalBookingModal = document.getElementById('general-booking-modal');
    const closeGeneralBookingBtn = document.getElementById('close-general-booking-modal');
    const openBookingBtns = document.querySelectorAll('.open-booking-btn');
    const comprehensiveBookingForm = document.getElementById('comprehensive-booking-form');
    const bookingModalSuccess = document.getElementById('booking-modal-success');
    const finishBookingBtn = document.getElementById('finish-booking-modal-btn');

    const step1Content = document.getElementById('step-1-content');
    const step2Content = document.getElementById('step-2-content');
    const step3Content = document.getElementById('step-3-content');
    const stepIndicators = [
        document.getElementById('stepper-indicator-1'),
        document.getElementById('stepper-indicator-2'),
        document.getElementById('stepper-indicator-3')
    ];

    let currentStep = 1;

    // Set minimum date on date picker to today
    const bookingDateInput = document.getElementById('booking-date-input');
    if (bookingDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        bookingDateInput.min = todayStr;
        bookingDateInput.value = todayStr;
    }

    function openGeneralBookingModal(prefilledDate = null) {
        if (!generalBookingModal) return;
        // If login modal was open, close it
        if (isLoginModalOpen) closeLoginModal();

        resetBookingModal();

        // Auto pre-fill with authenticated user details
        const signedUser = getSignedInUser();
        if (signedUser) {
            const nameInput = document.getElementById('patient-fullname');
            const emailInput = document.getElementById('patient-email');
            const phoneInput = document.getElementById('patient-phone');
            if (nameInput && signedUser.name && !nameInput.value) nameInput.value = signedUser.name;
            if (emailInput && signedUser.email && !emailInput.value) emailInput.value = signedUser.email;
            if (phoneInput && signedUser.phone && !phoneInput.value) phoneInput.value = signedUser.phone;
        }

        if (prefilledDate && prefilledDate instanceof Date && !isNaN(prefilledDate)) {
            const year = prefilledDate.getFullYear();
            const month = String(prefilledDate.getMonth() + 1).padStart(2, '0');
            const day = String(prefilledDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            if (bookingDateInput) {
                bookingDateInput.value = dateStr;
            }
        }
        updateBookingSummary();

        generalBookingModal.style.display = 'flex';
        requestAnimationFrame(() => {
            generalBookingModal.classList.add('active');
        });
    }

    function closeGeneralBookingModal() {
        if (!generalBookingModal) return;
        generalBookingModal.classList.remove('active');
        setTimeout(() => {
            generalBookingModal.style.display = 'none';
        }, 300);
    }

    function goToStep(stepNumber) {
        currentStep = stepNumber;
        if (step1Content) step1Content.style.display = stepNumber === 1 ? 'block' : 'none';
        if (step2Content) step2Content.style.display = stepNumber === 2 ? 'block' : 'none';
        if (step3Content) step3Content.style.display = stepNumber === 3 ? 'block' : 'none';

        stepIndicators.forEach((indicator, idx) => {
            if (!indicator) return;
            const stepVal = idx + 1;
            if (stepVal === stepNumber) {
                indicator.className = 'step-indicator active';
            } else if (stepVal < stepNumber) {
                indicator.className = 'step-indicator completed';
            } else {
                indicator.className = 'step-indicator';
            }
        });

        if (stepNumber === 3) {
            updateBookingSummary();
        }
    }

    function resetBookingModal() {
        goToStep(1);
        if (comprehensiveBookingForm) {
            comprehensiveBookingForm.reset();
            comprehensiveBookingForm.style.display = 'block';
        }
        if (bookingModalSuccess) {
            bookingModalSuccess.style.display = 'none';
        }
        // Re-set today's date
        if (bookingDateInput) {
            const todayStr = new Date().toISOString().split('T')[0];
            bookingDateInput.value = todayStr;
        }
        // Reset card active states
        document.querySelectorAll('.consult-type-card').forEach((c, i) => {
            if (i === 0) c.classList.add('active');
            else c.classList.remove('active');
        });
        document.querySelectorAll('#reason-chips .chip-option').forEach((c, i) => {
            if (i === 0) c.classList.add('active');
            else c.classList.remove('active');
        });
        document.querySelectorAll('#patient-history-group .radio-pill').forEach((c, i) => {
            if (i === 0) c.classList.add('active');
            else c.classList.remove('active');
        });
    }

    function updateBookingSummary() {
        const consultType = document.querySelector('input[name="consultation_type"]:checked')?.value || 'In-Person Clinic Visit';
        const deptSelect = document.getElementById('booking-department');
        const dept = deptSelect && deptSelect.value ? deptSelect.value : 'General Physician & Family Medicine';
        const doctorSelect = document.getElementById('booking-doctor');
        const doctor = doctorSelect ? doctorSelect.value : 'First Available Specialist';
        const dateVal = bookingDateInput ? bookingDateInput.value : '';
        const timeVal = document.getElementById('booking-time-select')?.value || 'Selected Slot';

        const sumType = document.getElementById('sum-type');
        const sumDept = document.getElementById('sum-dept');
        const sumDoc = document.getElementById('sum-doc');
        const sumSchedule = document.getElementById('sum-schedule');

        if (sumType) sumType.textContent = consultType;
        if (sumDept) sumDept.textContent = dept;
        if (sumDoc) sumDoc.textContent = doctor;
        if (sumSchedule) {
            if (dateVal && timeVal !== 'Selected Slot') {
                const dateObj = new Date(dateVal + 'T00:00:00');
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                sumSchedule.textContent = `${formattedDate} at ${timeVal}`;
            } else if (dateVal) {
                sumSchedule.textContent = `${dateVal} (Select a time slot)`;
            } else {
                sumSchedule.textContent = 'Please choose date and time';
            }
        }
    }

    // Attach open booking flow to all booking buttons/links across the site
    const allBookingTriggers = document.querySelectorAll('.open-booking-btn, #select-date-btn, a[href="#booking"], button[data-booking]');
    allBookingTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleBookingRequest(selectedDate || new Date());
        });
    });

    if (closeGeneralBookingBtn) {
        closeGeneralBookingBtn.addEventListener('click', closeGeneralBookingModal);
    }

    if (generalBookingModal) {
        generalBookingModal.addEventListener('click', (e) => {
            if (e.target === generalBookingModal) {
                closeGeneralBookingModal();
            }
        });
    }

    // Consultation Type Card Selection
    document.querySelectorAll('.consult-type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.consult-type-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Reason Chips Selection
    document.querySelectorAll('#reason-chips .chip-option').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#reason-chips .chip-option').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const radio = chip.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Patient History Pills Selection
    document.querySelectorAll('#patient-history-group .radio-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('#patient-history-group .radio-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const radio = pill.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Next / Prev Step Navigation Buttons
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.getAttribute('data-next'));
            if (nextStep === 2) {
                const deptSelect = document.getElementById('booking-department');
                if (deptSelect && !deptSelect.value) {
                    deptSelect.focus();
                    deptSelect.style.borderColor = '#ef4444';
                    setTimeout(() => { deptSelect.style.borderColor = '#e2e8f0'; }, 2000);
                    return;
                }
            } else if (nextStep === 3) {
                const symptomsText = document.getElementById('symptoms-desc');
                if (symptomsText && !symptomsText.value.trim()) {
                    symptomsText.focus();
                    symptomsText.style.borderColor = '#ef4444';
                    setTimeout(() => { symptomsText.style.borderColor = '#e2e8f0'; }, 2000);
                    return;
                }
            }
            goToStep(nextStep);
        });
    });

    document.querySelectorAll('.prev-step-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });

    // Handle Time & Date changes to update summary live
    const bookingTimeSelect = document.getElementById('booking-time-select');
    if (bookingTimeSelect) bookingTimeSelect.addEventListener('change', updateBookingSummary);
    if (bookingDateInput) bookingDateInput.addEventListener('change', updateBookingSummary);

    // Form Submission & Success View
    if (comprehensiveBookingForm) {
        comprehensiveBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const consultType = document.querySelector('input[name="consultation_type"]:checked')?.value || 'In-Person Clinic Visit';
            const dept = document.getElementById('booking-department')?.value || 'General Physician';
            const doctor = document.getElementById('booking-doctor')?.value || 'First Available Specialist';
            const reason = document.querySelector('input[name="visit_reason"]:checked')?.value || 'General Health Consultation';
            const patientType = document.querySelector('input[name="patient_history"]:checked')?.value || 'New Patient';
            const dateVal = bookingDateInput ? bookingDateInput.value : '';
            const timeVal = document.getElementById('booking-time-select')?.value || '09:00 AM';
            const patientName = document.getElementById('patient-fullname')?.value || 'Valued Patient';
            const patientPhone = document.getElementById('patient-phone')?.value || '';
            const patientEmail = document.getElementById('patient-email')?.value || '';

            const dateObj = new Date(dateVal + 'T00:00:00');
            const formattedDate = isNaN(dateObj) ? dateVal : dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

            const refNumber = 'AC-' + Math.floor(100000 + Math.random() * 900000);

            const isOnline = consultType.includes('Online');

            const ticketContainer = document.getElementById('success-ticket-details');
            if (ticketContainer) {
                ticketContainer.innerHTML = `
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
                        <span style="color: var(--text-muted);">Booking Reference:</span>
                        <strong style="color: var(--clr-blue); font-family: monospace; font-size: 15px;">#${refNumber}</strong>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px;">
                        <p><strong>Patient:</strong> ${patientName} (${patientType})</p>
                        <p><strong>Mode:</strong> <span style="color: ${isOnline ? 'var(--clr-teal)' : 'var(--clr-blue)'}; font-weight: 600;">${consultType}</span></p>
                        <p><strong>Specialty:</strong> ${dept}</p>
                        <p><strong>Doctor:</strong> ${doctor}</p>
                        <p><strong>Scheduled:</strong> ${formattedDate}</p>
                        <p><strong>Time Slot:</strong> ${timeVal}</p>
                        <p><strong>Reason:</strong> ${reason}</p>
                        <p><strong>Contact:</strong> ${patientPhone}</p>
                    </div>
                `;
            }

            const noticeText = document.getElementById('channel-notice-text');
            if (noticeText) {
                if (isOnline) {
                    noticeText.textContent = `A secure encrypted HD video consultation link and digital pass have been sent to ${patientEmail} and ${patientPhone}.`;
                } else {
                    noticeText.textContent = `Appointment confirmation and clinic entrance pass have been sent to ${patientPhone} and ${patientEmail}.`;
                }
            }

            comprehensiveBookingForm.style.display = 'none';
            if (bookingModalSuccess) {
                bookingModalSuccess.style.display = 'block';
            }
        });
    }

    if (finishBookingBtn) {
        finishBookingBtn.addEventListener('click', closeGeneralBookingModal);
    }

    // Global ESC key listener to close modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isLoginModalOpen) closeLoginModal();
            if (generalBookingModal && generalBookingModal.classList.contains('active')) closeGeneralBookingModal();
        }
    });
});

