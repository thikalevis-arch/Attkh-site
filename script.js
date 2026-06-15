// Car Data - Centralized source of truth
const cars = [
    {
        id: 1,
        name: 'Sedan Deluxe',
        year: 2024,
        mileage: 0,
        price: 25000,
        image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop',
        description: 'Luxury sedan with advanced features and comfort.'
    },
    {
        id: 2,
        name: 'SUV Explorer',
        year: 2024,
        mileage: 5000,
        price: 35000,
        image: 'https://images.unsplash.com/photo-1533473359331-35acde7260c9?w=400&h=300&fit=crop',
        description: 'Spacious SUV perfect for family trips and adventures.'
    },
    {
        id: 3,
        name: 'Compact City',
        year: 2023,
        mileage: 15000,
        price: 18000,
        image: 'https://images.unsplash.com/photo-1566023967268-70eea8a6e9dd?w=400&h=300&fit=crop',
        description: 'Efficient city car, easy to park and great fuel economy.'
    },
    {
        id: 4,
        name: 'Sports Pro',
        year: 2024,
        mileage: 2000,
        price: 45000,
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
        description: 'High-performance sports car with sleek design.'
    },
    {
        id: 5,
        name: 'Family Van',
        year: 2023,
        mileage: 20000,
        price: 28000,
        image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
        description: 'Perfect for large families with spacious interior.'
    },
    {
        id: 6,
        name: 'Electric Future',
        year: 2024,
        mileage: 1000,
        price: 50000,
        image: 'https://images.unsplash.com/photo-1560958089-b8a46dd52afb?w=400&h=300&fit=crop',
        description: 'Eco-friendly electric vehicle with cutting-edge technology.'
    }
];

// State
let filteredCars = [...cars];
let currentFilters = {
    maxPrice: 60000,
    year: ''
};

// DOM Elements
const carGrid = document.getElementById('carGrid');
const priceFilter = document.getElementById('priceFilter');
const priceDisplay = document.getElementById('priceDisplay');
const yearFilter = document.getElementById('yearFilter');
const resetFilters = document.getElementById('resetFilters');
const noResults = document.getElementById('noResults');
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('nav');
const carModal = document.getElementById('carModal');
const modalBody = document.getElementById('modalBody');
const contactForm = document.getElementById('contactForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderCars();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Filters
    priceFilter.addEventListener('input', handlePriceFilter);
    yearFilter.addEventListener('change', handleYearFilter);
    resetFilters.addEventListener('click', handleResetFilters);

    // Mobile Menu
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Modal
    carModal.addEventListener('click', closeModal);
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);

    // Contact Form
    contactForm.addEventListener('submit', handleContactFormSubmit);

    // Close modal when clicking outside
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Filter Functions
function handlePriceFilter(e) {
    const maxPrice = parseInt(e.target.value);
    currentFilters.maxPrice = maxPrice;
    priceDisplay.textContent = `$${maxPrice.toLocaleString()}`;
    applyFilters();
}

function handleYearFilter(e) {
    currentFilters.year = e.target.value;
    applyFilters();
}

function handleResetFilters() {
    priceFilter.value = 60000;
    yearFilter.value = '';
    currentFilters = {
        maxPrice: 60000,
        year: ''
    };
    priceDisplay.textContent = '$60,000';
    applyFilters();
}

function applyFilters() {
    filteredCars = cars.filter(car => {
        const priceMatch = car.price <= currentFilters.maxPrice;
        const yearMatch = !currentFilters.year || car.year === parseInt(currentFilters.year);
        return priceMatch && yearMatch;
    });

    renderCars();
}

// Render Cars
function renderCars() {
    carGrid.innerHTML = '';

    if (filteredCars.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filteredCars.forEach((car, index) => {
        const carCard = createCarCard(car);
        carGrid.appendChild(carCard);
    });
}

function createCarCard(car) {
    const div = document.createElement('div');
    div.className = 'car-card';
    div.setAttribute('role', 'article');
    div.setAttribute('aria-label', `${car.name} car listing`);
    
    div.innerHTML = `
        <div class="car-image">
            <img src="${car.image}" alt="${car.name}" loading="lazy">
        </div>
        <div class="car-info">
            <h3>${car.name}</h3>
            <p>Year: ${car.year}</p>
            <p>Mileage: ${car.mileage.toLocaleString()} km</p>
            <p class="price">$${car.price.toLocaleString()}</p>
            <div class="car-actions">
                <button class="btn-primary" onclick="openCarModal(${car.id})">View Details</button>
                <button class="btn-secondary" onclick="inquireCar('${car.name}')">Inquire</button>
            </div>
        </div>
    `;

    return div;
}

// Modal Functions
function openCarModal(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    const modalTitle = document.createElement('h2');
    modalTitle.id = 'modalTitle';
    modalTitle.textContent = car.name;

    const modalHTML = `
        <h2 id="modalTitle">${car.name}</h2>
        <img src="${car.image}" alt="${car.name}" style="width: 100%; border-radius: 8px; margin: 1rem 0;">
        <p><strong>Year:</strong> ${car.year}</p>
        <p><strong>Mileage:</strong> ${car.mileage.toLocaleString()} km</p>
        <p><strong>Price:</strong> <span style="color: var(--secondary-color); font-weight: bold;">$${car.price.toLocaleString()}</span></p>
        <p><strong>Description:</strong> ${car.description}</p>
        <div style="margin-top: 1.5rem;">
            <button class="btn-primary" onclick="inquireCar('${car.name}')" style="width: 100%; padding: 0.75rem;">Inquire Now</button>
        </div>
    `;

    modalBody.innerHTML = modalHTML;
    carModal.classList.add('active');
    carModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    carModal.classList.remove('active');
    carModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

function inquireCar(carName) {
    // Scroll to contact form
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    // Populate the message field with car inquiry
    document.getElementById('message').value = `I'm interested in the ${carName}. Please provide more information.`;
    
    // Close modal if open
    closeModal();
    
    // Focus on the name field
    document.getElementById('name').focus();
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    nav.classList.toggle('active');
    const isOpen = nav.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
}

// Close mobile menu when a link is clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Contact Form Submission
function handleContactFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Here you would normally send the data to a server
    // For now, we'll just show a success message
    console.log('Form submitted:', { name, email, phone, message });

    // Show success message
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Message Sent!';
    submitBtn.style.backgroundColor = 'var(--accent-color)';

    // Reset form
    contactForm.reset();

    // Reset button after 3 seconds
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
    }, 3000);
}

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Smooth Scroll Behavior for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Analytics - Track page views
function trackPageView() {
    console.log('Page loaded:', {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
    });
}

trackPageView();

// Log car clicks for analytics
function trackCarClick(carName) {
    console.log('Car viewed:', {
        carName,
        timestamp: new Date().toISOString()
    });
}