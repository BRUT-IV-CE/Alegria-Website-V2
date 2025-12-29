/**
 * ALEGRIA PARIS - Ring Configurator
 * ==================================
 * Complete frontend configurator for custom rings
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if on configurator page
    if (!document.querySelector('.configurator')) return;
    
    initConfigurator();
});

/**
 * Configurator State
 */
const configuratorState = {
    goldType: null,      // '14k' or '18k'
    goldColor: null,     // 'yellow', 'white', 'rose'
    ringSize: null,      // 46-62
    setting: null,       // 'solitaire' or 'none'
    diamond: null,       // { carat: '0.30', price: 890 }
    
    // Pricing
    prices: {
        base: 0,
        goldType: {
            '14k': 0,
            '18k': 200
        },
        goldColor: {
            'yellow': 0,
            'white': 0,
            'rose': 50
        },
        setting: {
            'none': 0,
            'solitaire': 150
        },
        diamonds: {
            '0.30': { price: 890, label: '0.30 ct' },
            '0.50': { price: 1490, label: '0.50 ct' },
            '0.70': { price: 2190, label: '0.70 ct' },
            '1.00': { price: 3490, label: '1.00 ct' },
            '1.50': { price: 5990, label: '1.50 ct' },
            '2.00': { price: 8990, label: '2.00 ct' }
        }
    },
    
    // External checkout URL base
    checkoutBaseUrl: 'https://pay.sumup.com/b2c/checkout'
};

/**
 * Initialize Configurator
 */
function initConfigurator() {
    initGoldTypeOptions();
    initColorOptions();
    initSizeOptions();
    initSettingOptions();
    initDiamondOptions();
    initCTAButtons();
    
    // Set default selections
    selectGoldType('18k');
    selectGoldColor('white');
    selectRingSize('52');
    selectSetting('solitaire');
    selectDiamond('1.50');
    
    updateSummary();
    updatePreview();
}

/**
 * Gold Type Selection (14k / 18k)
 */
function initGoldTypeOptions() {
    const goldTypeBtns = document.querySelectorAll('[data-gold-type]');
    
    goldTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.goldType;
            selectGoldType(type);
        });
    });
}

function selectGoldType(type) {
    configuratorState.goldType = type;
    
    // Update UI
    document.querySelectorAll('[data-gold-type]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.goldType === type);
    });
    
    updateSelectedLabel('goldType', type.toUpperCase());
    updateSummary();
    updatePreview();
}

/**
 * Gold Color Selection
 */
function initColorOptions() {
    const colorSwatches = document.querySelectorAll('[data-gold-color]');
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.goldColor;
            selectGoldColor(color);
        });
    });
}

function selectGoldColor(color) {
    configuratorState.goldColor = color;
    
    // Update UI
    document.querySelectorAll('[data-gold-color]').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.goldColor === color);
    });
    
    const colorLabels = {
        'yellow': 'Or Jaune',
        'white': 'Or Blanc',
        'rose': 'Or Rose'
    };
    
    updateSelectedLabel('goldColor', colorLabels[color]);
    updateSummary();
    updatePreview();
}

/**
 * Ring Size Selection
 */
function initSizeOptions() {
    const sizeBtns = document.querySelectorAll('[data-ring-size]');
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.ringSize;
            selectRingSize(size);
        });
    });
}

function selectRingSize(size) {
    configuratorState.ringSize = size;
    
    // Update UI
    document.querySelectorAll('[data-ring-size]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.ringSize === size);
    });
    
    updateSelectedLabel('ringSize', size);
    updateSummary();
}

/**
 * Setting Selection (with/without setting)
 */
function initSettingOptions() {
    const settingCards = document.querySelectorAll('[data-setting]');
    
    settingCards.forEach(card => {
        card.addEventListener('click', () => {
            const setting = card.dataset.setting;
            selectSetting(setting);
        });
    });
}

function selectSetting(setting) {
    configuratorState.setting = setting;
    
    // Update UI
    document.querySelectorAll('[data-setting]').forEach(card => {
        card.classList.toggle('active', card.dataset.setting === setting);
    });
    
    const settingLabels = {
        'none': 'Sans serti',
        'solitaire': 'Solitaire'
    };
    
    updateSelectedLabel('setting', settingLabels[setting]);
    
    // Show/hide diamond options based on setting
    const diamondSection = document.querySelector('.option-group--diamond');
    if (diamondSection) {
        diamondSection.style.display = setting === 'solitaire' ? 'block' : 'none';
    }
    
    updateSummary();
    updatePreview();
}

/**
 * Diamond Selection
 */
function initDiamondOptions() {
    const diamondCards = document.querySelectorAll('[data-diamond]');
    
    diamondCards.forEach(card => {
        card.addEventListener('click', () => {
            const carat = card.dataset.diamond;
            selectDiamond(carat);
        });
    });
}

function selectDiamond(carat) {
    configuratorState.diamond = {
        carat: carat,
        price: configuratorState.prices.diamonds[carat].price,
        label: configuratorState.prices.diamonds[carat].label
    };
    
    // Update UI
    document.querySelectorAll('[data-diamond]').forEach(card => {
        card.classList.toggle('active', card.dataset.diamond === carat);
    });
    
    updateSelectedLabel('diamond', configuratorState.diamond.label);
    updateSummary();
    updatePreview();
}

/**
 * Update selected label display
 */
function updateSelectedLabel(option, value) {
    const labelElement = document.querySelector(`[data-selected="${option}"]`);
    if (labelElement) {
        labelElement.textContent = value;
    }
}

/**
 * Calculate total price
 */
function calculateTotal() {
    const state = configuratorState;
    const prices = state.prices;
    
    let total = prices.base;
    
    // Add gold type price
    if (state.goldType) {
        total += prices.goldType[state.goldType];
    }
    
    // Add gold color price
    if (state.goldColor) {
        total += prices.goldColor[state.goldColor];
    }
    
    // Add setting price
    if (state.setting) {
        total += prices.setting[state.setting];
    }
    
    // Add diamond price (only if solitaire setting)
    if (state.setting === 'solitaire' && state.diamond) {
        total += state.diamond.price;
    }
    
    return total;
}

/**
 * Update summary panel
 */
function updateSummary() {
    const state = configuratorState;
    const total = calculateTotal();
    
    // Update individual summary items
    const summaryItems = {
        'summary-gold-type': state.goldType ? `Or ${state.goldType.toUpperCase()}` : '-',
        'summary-gold-color': getColorLabel(state.goldColor),
        'summary-ring-size': state.ringSize ? `Taille ${state.ringSize}` : '-',
        'summary-setting': getSettingLabel(state.setting),
        'summary-diamond': state.setting === 'solitaire' && state.diamond ? state.diamond.label : '-'
    };
    
    Object.entries(summaryItems).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
    
    // Update total price
    const totalElement = document.querySelector('.summary-total-price');
    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    }
    
    // Update CTA button state
    updateCTAState();
}

function getColorLabel(color) {
    const labels = {
        'yellow': 'Or Jaune',
        'white': 'Or Blanc',
        'rose': 'Or Rose'
    };
    return labels[color] || '-';
}

function getSettingLabel(setting) {
    const labels = {
        'none': 'Sans serti',
        'solitaire': 'Solitaire'
    };
    return labels[setting] || '-';
}

/**
 * Update preview image
 */
function updatePreview() {
    const state = configuratorState;
    
    // Generate image key based on selections
    const imageKey = generateImageKey();
    
    // Hide all preview images
    document.querySelectorAll('.preview-image').forEach(img => {
        img.classList.remove('active');
    });
    
    // Show matching preview image
    const activePreview = document.querySelector(`[data-preview="${imageKey}"]`);
    if (activePreview) {
        activePreview.classList.add('active');
    } else {
        // Show default/placeholder
        const defaultPreview = document.querySelector('[data-preview="default"]');
        if (defaultPreview) {
            defaultPreview.classList.add('active');
        }
    }
}

function generateImageKey() {
    const state = configuratorState;
    const parts = [];
    
    if (state.goldColor) parts.push(state.goldColor);
    if (state.goldType) parts.push(state.goldType);
    if (state.setting) parts.push(state.setting);
    if (state.setting === 'solitaire' && state.diamond) {
        parts.push(state.diamond.carat.replace('.', ''));
    }
    
    return parts.join('-');
}

/**
 * CTA Buttons
 */
function initCTAButtons() {
    const checkoutBtn = document.querySelector('[data-action="checkout"]');
    const quoteBtn = document.querySelector('[data-action="quote"]');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    if (quoteBtn) {
        quoteBtn.addEventListener('click', handleQuoteRequest);
    }
}

function updateCTAState() {
    const state = configuratorState;
    const checkoutBtn = document.querySelector('[data-action="checkout"]');
    
    // Check if all required options are selected
    const isComplete = state.goldType && 
                       state.goldColor && 
                       state.ringSize && 
                       state.setting &&
                       (state.setting !== 'solitaire' || state.diamond);
    
    if (checkoutBtn) {
        checkoutBtn.disabled = !isComplete;
        checkoutBtn.classList.toggle('btn-disabled', !isComplete);
    }
}

/**
 * Handle checkout - redirect to SumUp with parameters
 */
function handleCheckout() {
    const state = configuratorState;
    const total = calculateTotal();
    
    // Build URL parameters
    const params = new URLSearchParams({
        product: 'custom-ring',
        gold_type: state.goldType,
        gold_color: state.goldColor,
        ring_size: state.ringSize,
        setting: state.setting,
        diamond: state.setting === 'solitaire' ? state.diamond.carat : 'none',
        price: total,
        currency: 'EUR'
    });
    
    // Build checkout URL
    // TODO: Replace with actual SumUp product URL
    const checkoutUrl = `${configuratorState.checkoutBaseUrl}?${params.toString()}`;
    
    // Redirect to checkout
    window.location.href = checkoutUrl;
}

/**
 * Handle quote request - redirect to contact with parameters
 */
function handleQuoteRequest() {
    const state = configuratorState;
    
    // Build URL parameters for contact form pre-fill
    const params = new URLSearchParams({
        type: 'quote',
        product: 'custom-ring',
        gold_type: state.goldType || '',
        gold_color: state.goldColor || '',
        ring_size: state.ringSize || '',
        setting: state.setting || '',
        diamond: state.diamond ? state.diamond.carat : ''
    });
    
    // Redirect to contact page with pre-filled info
    window.location.href = `/pages/contact.html?${params.toString()}`;
}

/**
 * Format price in EUR
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Export for external access
window.AlegriConfigurator = {
    getState: () => ({ ...configuratorState }),
    getTotal: calculateTotal,
    selectGoldType,
    selectGoldColor,
    selectRingSize,
    selectSetting,
    selectDiamond
};
