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
    // Dynamic Booking Calendar Logic (Inline)
    // ==========================================
    const calendarDaysContainer = document.getElementById('calendar-days-container');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectDateBtn = document.getElementById('select-date-btn');
    
    const timeSelectionSection = document.getElementById('time-selection-section');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const mobileInput = document.getElementById('mobile-number-input');
    const confirmBtn = document.getElementById('confirm-booking-btn');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDate = null;
    let selectedTime = null;
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Expanded times to include evening slots
    const times = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM"];
    
    function parseTimeStringToDate(timeStr, baseDate) {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const result = new Date(baseDate);
        result.setHours(hours, parseInt(minutes), 0, 0);
        return result;
    }

    function renderCalendar(month, year) {
        if (!monthYearDisplay) return;
        monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
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
            thisDate.setHours(0,0,0,0);
            
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
        
        document.querySelectorAll('.cal-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const day = parseInt(e.target.getAttribute('data-day'));
                selectedDate = new Date(year, month, day);
                selectedDate.setHours(0,0,0,0);
                renderCalendar(currentMonth, currentYear);
                
                if (selectDateBtn) {
                    selectDateBtn.textContent = `Book for ${monthNames[month].substring(0,3)} ${day}`;
                    selectDateBtn.disabled = false;
                }
                
                if (timeSelectionSection) {
                    timeSelectionSection.style.display = 'none';
                }
            });
        });
    }
    
    if(calendarDaysContainer) {
        selectedDate = new Date();
        selectedDate.setHours(0,0,0,0);
        
        if (selectDateBtn) {
            selectDateBtn.textContent = `Book for ${monthNames[currentMonth].substring(0,3)} ${selectedDate.getDate()}`;
        }
        
        renderCalendar(currentMonth, currentYear);
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentMonth--;
                if(currentMonth < 0) { currentMonth = 11; currentYear--; }
                renderCalendar(currentMonth, currentYear);
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentMonth++;
                if(currentMonth > 11) { currentMonth = 0; currentYear++; }
                renderCalendar(currentMonth, currentYear);
            });
        }
        
        if (selectDateBtn) {
            selectDateBtn.addEventListener('click', () => {
                if(!selectedDate) return;
                showTimeSelection();
            });
        }
    }
    
    function showTimeSelection() {
        if (!timeSelectionSection) return;
        timeSelectionSection.style.display = 'block';
        
        const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        selectedDateDisplay.textContent = `${dayName}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
        
        renderTimeSlots();
        if(mobileInput) mobileInput.value = '';
        checkFormValid();
    }
    
    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        selectedTime = null;
        
        const now = new Date();
        
        times.forEach((time, index) => {
            const slotDateTime = parseTimeStringToDate(time, selectedDate);
            const isPast = slotDateTime <= now;
            
            // Randomly mock some slots as booked
            const isBooked = isPast || (index === 2 || index === 6);
            
            const slotBtn = document.createElement('button');
            slotBtn.textContent = time;
            slotBtn.style.padding = '12px';
            slotBtn.style.borderRadius = '8px';
            slotBtn.style.border = '1px solid #e2e8f0';
            slotBtn.style.fontWeight = '600';
            slotBtn.style.transition = 'all 0.2s';
            
            if (isBooked) {
                slotBtn.style.background = '#f1f5f9';
                slotBtn.style.color = '#94a3b8';
                slotBtn.style.cursor = 'not-allowed';
                if (isPast) {
                    slotBtn.style.textDecoration = 'line-through';
                    slotBtn.title = 'Time passed';
                } else {
                    slotBtn.style.textDecoration = 'line-through';
                    slotBtn.title = 'Already Booked';
                }
            } else {
                slotBtn.style.background = 'white';
                slotBtn.style.color = 'var(--text-primary)';
                slotBtn.style.cursor = 'pointer';
                
                slotBtn.addEventListener('click', () => {
                    Array.from(timeSlotsContainer.children).forEach(child => {
                        if(child.style.cursor === 'pointer') {
                            child.style.background = 'white';
                            child.style.color = 'var(--text-primary)';
                            child.style.borderColor = '#e2e8f0';
                        }
                    });
                    
                    slotBtn.style.background = 'var(--clr-blue)';
                    slotBtn.style.color = 'white';
                    slotBtn.style.borderColor = 'var(--clr-blue)';
                    selectedTime = time;
                    checkFormValid();
                });
            }
            
            timeSlotsContainer.appendChild(slotBtn);
        });
    }
    
    function checkFormValid() {
        if (!confirmBtn || !mobileInput) return;
        const phone = mobileInput.value.trim();
        if (selectedTime && phone.length > 8) {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    }
    
    if (mobileInput) {
        mobileInput.addEventListener('input', checkFormValid);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const successModal = document.getElementById('success-modal');
            const successDetails = document.getElementById('success-details');
            const closeSuccessBtn = document.getElementById('close-success-btn');
            
            if (successModal && successDetails) {
                successDetails.textContent = `Date: ${selectedDateDisplay.textContent}\nTime: ${selectedTime}\nMobile: ${mobileInput.value}\n\nWe will send you an SMS reminder shortly.`;
                
                successModal.style.display = 'flex';
                setTimeout(() => {
                    successModal.querySelector('.success-content').style.opacity = '1';
                    successModal.querySelector('.success-content').style.transform = 'scale(1)';
                }, 10);
                
                closeSuccessBtn.addEventListener('click', () => {
                    successModal.querySelector('.success-content').style.opacity = '0';
                    successModal.querySelector('.success-content').style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        successModal.style.display = 'none';
                    }, 300);
                });
            }
            
            timeSelectionSection.style.display = 'none';
            selectedTime = null;
            if(mobileInput) mobileInput.value = '';
        });
    }

    // ==========================================
    // Horizontal Scroll for "Why Choose Us"
    // ==========================================
    const whyUsSection = document.getElementById('why-us');
    const whyUsTrack = document.getElementById('why-choose-us-track');
    
    if (whyUsSection && whyUsTrack) {
        let ticking = false;
        
        const updateScroll = () => {
            const rect = whyUsSection.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                const totalScrollLength = rect.height - window.innerHeight;
                const currentScroll = Math.abs(rect.top);
                const scrollProgress = currentScroll / totalScrollLength;
                const maxTranslate = whyUsTrack.scrollWidth - window.innerWidth;
                
                if (maxTranslate > 0) {
                    whyUsTrack.style.transform = `translateX(-${scrollProgress * maxTranslate}px)`;
                }
            } else if (rect.top > 0) {
                whyUsTrack.style.transform = `translateX(0px)`;
            } else {
                const maxTranslate = whyUsTrack.scrollWidth - window.innerWidth;
                if (maxTranslate > 0) {
                    whyUsTrack.style.transform = `translateX(-${maxTranslate}px)`;
                }
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    // ==========================================
    // Navbar Scroll & Glow Effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

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

    // ==========================================
    // Navbar Button Scroll Reveal
    // ==========================================
    const navBtn = document.querySelector('.nav-btn');
    const testimonialsSection = document.getElementById('testimonials');
    
    if (navBtn && testimonialsSection) {
        const handleScroll = () => {
            const rect = testimonialsSection.getBoundingClientRect();
            // Show button when the top of the testimonials section comes into the top 50% of the viewport,
            // or if the user has scrolled past it.
            if (rect.top <= window.innerHeight / 2) {
                navBtn.classList.add('show');
            } else {
                navBtn.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state
    }
});
