/**
 * ALEGRIA PARIS - Ring Configurator (Rolex Style)
 * ================================================
 * Configurateur de bijoux avec navigation par étapes
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.rolex-configurator')) return;
    
    initRolexConfigurator();
});

/**
 * État du configurateur
 */
const configState = {
    currentStep: 0,
    selections: {
        goldType: null,
        goldColor: null,
        ringSize: null,
        setting: null,
        diamond: null
    },
    prices: {
        basePrice: 500,
        goldType: {
            '14k': 0,
            '18k': 200
        },
        goldColor: {
            'yellow': 0,
            'white': 50,
            'rose': 100
        },
        setting: {
            'alliance': 0,
            'solitaire': 200
        },
        diamonds: {
            '0.30': 890,
            '0.50': 1490,
            '0.70': 2190,
            '1.00': 3490,
            '1.50': 5990,
            '2.00': 8990
        }
    }
};

/**
 * Configuration des étapes
 */
const steps = [
    {
        title: "Choisissez le type d'or",
        key: 'goldType',
        options: [
            {
                value: '14k',
                title: 'Or 14K',
                subtitle: '585 millièmes',
                image: '../assets/images/configurator/14k-preview.jpg',
                thumbnail: '../assets/images/configurator/thumb-14k.jpg'
            },
            {
                value: '18k',
                title: 'Or 18K',
                subtitle: '750 millièmes (Recommandé)',
                image: '../assets/images/configurator/18k-preview.jpg',
                thumbnail: '../assets/images/configurator/thumb-18k.jpg'
            }
        ]
    },
    {
        title: "Choisissez la couleur de l'or",
        key: 'goldColor',
        options: [
            {
                value: 'yellow',
                title: 'Or Jaune',
                subtitle: 'Classique et intemporel',
                image: '../assets/images/configurator/yellow-gold.jpg',
                thumbnail: '../assets/images/configurator/thumb-yellow.jpg'
            },
            {
                value: 'white',
                title: 'Or Blanc',
                subtitle: 'Élégant et moderne',
                image: '../assets/images/configurator/white-gold.jpg',
                thumbnail: '../assets/images/configurator/thumb-white.jpg'
            },
            {
                value: 'rose',
                title: 'Or Rose',
                subtitle: 'Romantique et tendance',
                image: '../assets/images/configurator/rose-gold.jpg',
                thumbnail: '../assets/images/configurator/thumb-rose.jpg'
            }
        ]
    },
    {
        title: "Choisissez la taille de bague",
        key: 'ringSize',
        options: [
            { value: '46', title: 'Taille 46', image: '../assets/images/configurator/size-46.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '48', title: 'Taille 48', image: '../assets/images/configurator/size-48.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '50', title: 'Taille 50', image: '../assets/images/configurator/size-50.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '52', title: 'Taille 52', subtitle: 'Taille moyenne', image: '../assets/images/configurator/size-52.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '54', title: 'Taille 54', image: '../assets/images/configurator/size-54.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '56', title: 'Taille 56', image: '../assets/images/configurator/size-56.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '58', title: 'Taille 58', image: '../assets/images/configurator/size-58.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' },
            { value: '60', title: 'Taille 60', image: '../assets/images/configurator/size-60.jpg', thumbnail: '../assets/images/configurator/thumb-size.jpg' }
        ]
    },
    {
        title: "Choisissez le type de monture",
        key: 'setting',
        options: [
            {
                value: 'alliance',
                title: 'Alliance Simple',
                subtitle: 'Sans diamant central',
                image: '../assets/images/configurator/alliance.jpg',
                thumbnail: '../assets/images/configurator/thumb-alliance.jpg'
            },
            {
                value: 'solitaire',
                title: 'Solitaire',
                subtitle: 'Avec diamant central',
                image: '../assets/images/configurator/solitaire.jpg',
                thumbnail: '../assets/images/configurator/thumb-solitaire.jpg'
            }
        ]
    },
    {
        title: "Choisissez votre diamant",
        key: 'diamond',
        condition: () => configState.selections.setting === 'solitaire',
        options: [
            {
                value: '0.30',
                title: '0.30 carat',
                subtitle: '890 €',
                image: '../assets/images/configurator/diamond-030.jpg',
                thumbnail: '../assets/images/configurator/thumb-diamond-030.jpg'
            },
            {
                value: '0.50',
                title: '0.50 carat',
                subtitle: '1 490 €',
                image: '../assets/images/configurator/diamond-050.jpg',
                thumbnail: '../assets/images/configurator/thumb-diamond-050.jpg'
            },
            {
                value: '0.70',
                title: '0.70 carat',
                subtitle: '2 190 €',
                image: '../assets/images/configurator/diamond-070.jpg',
                thumbnail: '../assets/images/configurator/thumb-diamond-070.jpg'
            },
            {
                value: '1.00',
                title: '1.00 carat',
                subtitle: '3 490 €',
                image: '../assets/images/configurator/diamond-100.jpg',
                thumbnail: '../assets/images/configurator/thumb-diamond-100.jpg'
            },
            {
                value: '1.50',
                title: '1.50 carat',
                subtitle: '5 990 €',
                image: '../assets/images/configurator/diamond-150.jpg',
                thumbnail: '../assets/images/configurator/thumb-diamond-150.jpg'
            },
            {
                value: '2.00',
                title: '2.00 carat',
                subtitle: '8 990 €',
                image: '../assets/images/configurator/diamond-200.jpg',
                thumbnail: '../assets/images/configurator/thumb-diamond-200.jpg'
            }
        ]
    }
];

/**
 * Initialisation du configurateur
 */
function initRolexConfigurator() {
    loadFromLocalStorage();
    renderStep();
    
    // Bouton suivant
    document.getElementById('nextStepBtn').addEventListener('click', nextStep);

    // Bouton précédent (si présent)
    const prevBtn = document.getElementById('prevStepBtn');
    if (prevBtn) prevBtn.addEventListener('click', prevStep);
    
    // Boutons du modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('modifyBtn').addEventListener('click', closeModal);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    document.getElementById('quoteBtn').addEventListener('click', handleQuote);
}

/**
 * Afficher l'étape courante
 */
function renderStep() {
    const step = steps[configState.currentStep];
    
    // Vérifier la condition de l'étape
    if (step.condition && !step.condition()) {
        nextStep();
        return;
    }
    
    // Mettre à jour le titre et l'indicateur
    document.getElementById('stepNumber').textContent = configState.currentStep + 1;
    document.getElementById('stepTitle').textContent = step.title;
    
    // Afficher les options
    renderOptions(step);

    
    // Mettre à jour la barre de progression
    updateProgress();
    
    // Mettre à jour l'image principale
    updateMainImage();
}

/**
 * Afficher les options à gauche
 */
function renderOptions(step) {
    const optionList = document.getElementById('optionList');
    optionList.innerHTML = '';
    
    step.options.forEach(option => {
        const optionItem = document.createElement('button');
        optionItem.className = 'rolex-option-item';
        optionItem.dataset.value = option.value;
        
        if (configState.selections[step.key] === option.value) {
            optionItem.classList.add('active');
        }
        
        optionItem.innerHTML = `
            <span class="rolex-option-item-title">${option.title}</span>
            ${option.subtitle ? `<span class="rolex-option-item-subtitle">${option.subtitle}</span>` : ''}
        `;
        
        optionItem.addEventListener('click', () => selectOption(step.key, option.value, option.image));
        
        optionList.appendChild(optionItem);
    });
}

/**
 * Sélectionner une option
 */
function selectOption(key, value, image) {
    configState.selections[key] = value;
    
    // Mettre à jour l'interface
    document.querySelectorAll('.rolex-option-item').forEach(item => {
        item.classList.toggle('active', item.dataset.value === value);
    });
    
    document.querySelectorAll('.rolex-thumbnail').forEach(thumb => {
        thumb.classList.toggle('active', thumb.dataset.value === value);
    });
    
    // Mettre à jour l'image principale
    const mainImage = document.getElementById('mainProductImage');
    mainImage.style.opacity = '0';
    
    setTimeout(() => {
        mainImage.src = image;
        mainImage.style.opacity = '1';
    }, 300);
    
    // Sauvegarder
    saveToLocalStorage();
}

/**
 * Passer à l'étape suivante
 */
function nextStep() {
    const currentStepData = steps[configState.currentStep];
    
    // Vérifier qu'une option est sélectionnée
    if (!configState.selections[currentStepData.key]) {
        alert('Veuillez sélectionner une option avant de continuer.');
        return;
    }
    
    configState.currentStep++;
    
    // Si on a fini toutes les étapes
    if (configState.currentStep >= steps.length) {
        showSummary();
        return;
    }
    
    renderStep();
}

/**
 * Revenir à l'étape précédente
 */
function prevStep() {
    const modal = document.getElementById('summaryModal');
    // Si le modal de récapitulatif est ouvert, le fermer et revenir à la dernière étape
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        configState.currentStep = Math.max(0, steps.length - 1);
        renderStep();
        return;
    }

    if (configState.currentStep > 0) {
        configState.currentStep--;
        renderStep();
    }
}

/**
 * Mettre à jour la barre de progression
 */
function updateProgress() {
    const progress = ((configState.currentStep + 1) / steps.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

/**
 * Mettre à jour l'image principale
 */
function updateMainImage() {
    const step = steps[configState.currentStep];
    const selectedValue = configState.selections[step.key];
    
    if (selectedValue) {
        const option = step.options.find(opt => opt.value === selectedValue);
        if (option) {
            document.getElementById('mainProductImage').src = option.image;
        }
    }
}

/**
 * Afficher le récapitulatif
 */
function showSummary() {
    const modal = document.getElementById('summaryModal');
    modal.classList.add('active');
    
    // Remplir les informations
    document.getElementById('summaryGoldType').textContent = 
        steps[0].options.find(o => o.value === configState.selections.goldType)?.title || '-';
    
    document.getElementById('summaryGoldColor').textContent = 
        steps[1].options.find(o => o.value === configState.selections.goldColor)?.title || '-';
    
    document.getElementById('summaryRingSize').textContent = 
        `Taille ${configState.selections.ringSize || '-'}`;
    
    document.getElementById('summarySetting').textContent = 
        steps[3].options.find(o => o.value === configState.selections.setting)?.title || '-';
    
    if (configState.selections.setting === 'solitaire' && configState.selections.diamond) {
        document.getElementById('summaryDiamond').textContent = 
            `${configState.selections.diamond} carat`;
    } else {
        document.getElementById('summaryDiamond').textContent = 'Aucun';
    }
    
    // Calculer et afficher le prix
    const totalPrice = calculateTotalPrice();
    document.getElementById('summaryPrice').textContent = `${totalPrice.toLocaleString('fr-FR')} €`;
    
    // Image finale
    document.getElementById('summaryImage').src = document.getElementById('mainProductImage').src;

    // Rendre chaque item cliquable pour revenir à l'étape correspondante
    const summaryItems = document.querySelectorAll('.rolex-summary-item[data-step]');
    summaryItems.forEach(item => {
        // enlève d'anciennes liaisons éventuelles
        item.replaceWith(item.cloneNode(true));
    });

    // ré-obtenir les éléments clonés
    const freshItems = document.querySelectorAll('.rolex-summary-item[data-step]');
    freshItems.forEach(item => {
        const stepIndex = parseInt(item.dataset.step, 10);
        item.addEventListener('click', () => goToStep(stepIndex));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToStep(stepIndex);
            }
        });
    });
}

/**
 * Fermer le modal
 */
function closeModal() {
    document.getElementById('summaryModal').classList.remove('active');
    configState.currentStep = 0;
    renderStep();
}

/**
 * Masquer le modal sans réinitialiser l'étape
 */
function hideSummaryModal() {
    const modal = document.getElementById('summaryModal');
    if (modal) modal.classList.remove('active');
}

/**
 * Aller à une étape précise depuis le récapitulatif
 */
function goToStep(stepIndex) {
    hideSummaryModal();
    configState.currentStep = Math.max(0, Math.min(stepIndex, steps.length - 1));
    renderStep();
}

/**
 * Calculer le prix total
 */
function calculateTotalPrice() {
    let total = configState.prices.basePrice;
    
    if (configState.selections.goldType) {
        total += configState.prices.goldType[configState.selections.goldType];
    }
    
    if (configState.selections.goldColor) {
        total += configState.prices.goldColor[configState.selections.goldColor];
    }
    
    if (configState.selections.setting) {
        total += configState.prices.setting[configState.selections.setting];
    }
    
    if (configState.selections.setting === 'solitaire' && configState.selections.diamond) {
        total += configState.prices.diamonds[configState.selections.diamond];
    }
    
    return total;
}

/**
 * Gestion du paiement
 */
function handleCheckout() {
    const totalPrice = calculateTotalPrice();
    
    // Créer une description pour le paiement
    const description = `Bague personnalisée - Or ${configState.selections.goldType} ${configState.selections.goldColor} - Taille ${configState.selections.ringSize} - ${configState.selections.setting}`;
    
    alert(`Redirection vers le paiement pour ${totalPrice}€\n\n${description}`);
    
    // TODO: Implémenter la redirection vers votre système de paiement
    // window.location.href = `https://votre-systeme-paiement.com?amount=${totalPrice}&description=${encodeURIComponent(description)}`;
}

/**
 * Demander un devis
 */
function handleQuote() {
    const totalPrice = calculateTotalPrice();
    
    const message = `Bonjour, je souhaite un devis pour une bague personnalisée :\n\n` +
        `- Type d'or : ${configState.selections.goldType}\n` +
        `- Couleur : ${configState.selections.goldColor}\n` +
        `- Taille : ${configState.selections.ringSize}\n` +
        `- Monture : ${configState.selections.setting}\n` +
        `${configState.selections.diamond ? `- Diamant : ${configState.selections.diamond} carat\n` : ''}` +
        `\nPrix estimé : ${totalPrice}€`;
    
    window.location.href = `mailto:contact@alegriaparis.com?subject=Demande de devis - Bague personnalisée&body=${encodeURIComponent(message)}`;
}

/**
 * Sauvegarder dans localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('alegria_configurator', JSON.stringify(configState));
    } catch (e) {
        console.warn('Impossible de sauvegarder dans localStorage:', e);
    }
}

/**
 * Charger depuis localStorage
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('alegria_configurator');
        if (saved) {
            const savedState = JSON.parse(saved);
            configState.selections = savedState.selections || {};
            // On ne restaure pas currentStep pour recommencer à 0
        }
    } catch (e) {
        console.warn('Impossible de charger depuis localStorage:', e);
    }
}
