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

    // Pastilles de vue (côté droit)
    const viewDots = document.getElementById('viewDots');
    if (viewDots) {
        // Injecter une mini-image dans chaque pastille et ajouter hover preview
        viewDots.querySelectorAll('.rolex-view-dot').forEach(btn => {
            // ajouter img mini
            const img = document.createElement('img');
            const mainSrc = document.getElementById('mainProductImage')?.src || '';
            img.src = mainSrc;
            img.alt = btn.getAttribute('title') || 'Aperçu';
            btn.innerHTML = '';
            btn.appendChild(img);

            // click -> changer la classe view
            btn.addEventListener('click', () => {
                viewDots.querySelectorAll('.rolex-view-dot').forEach(b => b.classList.toggle('active', b === btn));
                const v = btn.dataset.view || '0';
                const container = document.querySelector('.rolex-image-container');
                if (container) {
                    container.classList.remove('view-0','view-1','view-2');
                    container.classList.add('view-' + v);
                }
            });

            // hover pour prévisualiser la vue sans changer définitivement
            btn.addEventListener('mouseenter', () => {
                const container = document.querySelector('.rolex-image-container');
                if (container) {
                    const v = btn.dataset.view || '0';
                    container.classList.add('preview-' + v);
                }
            });
            btn.addEventListener('mouseleave', () => {
                const container = document.querySelector('.rolex-image-container');
                if (container) {
                    container.classList.remove('preview-0','preview-1','preview-2');
                }
            });
        });
    }

    // Bouton + de la barre d'infos -> ouvrir panneau de détails (blanc) depuis le bas
    const plusBtn = document.getElementById('plusDetailsBtn');
    if (plusBtn) plusBtn.addEventListener('click', toggleDetailPanel);

    // Fermeture panneau d'aide (côté droit)
    const closeHelp = document.getElementById('closeHelpPanel');
    if (closeHelp) closeHelp.addEventListener('click', () => toggleHelpPanel(false));

    // Fermeture panneau détails bas
    const closeDetail = document.getElementById('closeDetailPanel');
    if (closeDetail) closeDetail.addEventListener('click', () => toggleDetailPanel(false));

    // mettre à jour la barre d'infos initiale
    updateBottomBar();
}

/**
 * Afficher l'étape courante
 */
function renderStep() {
    // Si nous sommes sur l'étape de récapitulatif final
    if (configState.currentStep === steps.length) {
        renderSummaryStep();
        updateProgress();
        if (typeof updateBottomBar === 'function') updateBottomBar();
        return;
    }

    const step = steps[configState.currentStep];

    // Vérifier la condition de l'étape
    if (step.condition && !step.condition()) {
        nextStep();
        return;
    }

    // Mettre à jour le titre (le compteur d'étape a été supprimé)
    const stepNumberEl = document.getElementById('stepNumber');
    if (stepNumberEl) stepNumberEl.textContent = configState.currentStep + 1;
    const stepTitleEl = document.getElementById('stepTitle');
    if (stepTitleEl) stepTitleEl.textContent = step.title;

    // Afficher les options
    // s'assurer que l'optionList n'a plus la classe 'summary-step'
    const optionListEl = document.getElementById('optionList');
    if (optionListEl) optionListEl.classList.remove('summary-step');
    renderOptions(step);

    // Mettre à jour la barre de progression
    updateProgress();

    // Mettre à jour l'image principale
    updateMainImage();

    // Mettre à jour la barre d'infos (prix / nom)
    if (typeof updateBottomBar === 'function') updateBottomBar();
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

    // Mettre à jour la barre d'infos
    if (typeof updateBottomBar === 'function') updateBottomBar();

    // Mettre à jour aussi les miniatures des pastilles de vue si présentes
    document.querySelectorAll('.rolex-view-dot img').forEach(i => {
        i.src = image || i.src;
    });
}

/**
 * Passer à l'étape suivante
 */
function nextStep() {
    // Si on est déjà sur l'étape récapitulatif, ne rien faire
    if (configState.currentStep === steps.length) return;

    const currentStepData = steps[configState.currentStep];

    // Vérifier qu'une option est sélectionnée
    if (!configState.selections[currentStepData.key]) {
        alert('Veuillez sélectionner une option avant de continuer.');
        return;
    }
    
    configState.currentStep++;

    // Si on a fini toutes les étapes réelles -> aller à l'étape récap (index = steps.length)
    if (configState.currentStep > steps.length - 1) {
        // maintenant currentStep === steps.length (récapitulatif)
        renderStep();
        return;
    }

    renderStep();
}

/**
 * Revenir à l'étape précédente
 */
function prevStep() {
    // Si on est sur l'étape de récapitulatif (nouvelle étape inline), revenir à la dernière étape réelle
    if (configState.currentStep === steps.length) {
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
    const total = steps.length + 1; // inclure l'étape récap
    const progress = Math.min(100, ((configState.currentStep + 1) / total) * 100);
    const el = document.getElementById('progressFill');
    if (el) el.style.width = `${progress}%`;
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
            const mainImg = document.getElementById('mainProductImage');
            if (mainImg) mainImg.src = option.image;

            // Mettre à jour les miniatures dans les view dots si présentes
            document.querySelectorAll('.rolex-view-dot img').forEach(i => {
                i.src = option.thumbnail || option.image || i.src;
            });
        }
    }
}

/**
 * Afficher le récapitulatif
 */
function showSummary() {
    // Au lieu d'un modal, navigue vers une étape de récapitulatif inline
    configState.currentStep = steps.length;
    renderStep();
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
 * Met à jour la barre d'infos fixe en bas (nom du modèle & prix)
 */
function updateBottomBar() {
    const nameEl = document.getElementById('bottomModelName');
    const priceEl = document.getElementById('bottomModelPrice');
    const total = calculateTotalPrice();
    if (priceEl) priceEl.textContent = `${total.toLocaleString('fr-FR')} €`;

    // Déterminer un nom de modèle simple à partir des sélections
    const modelParts = [];
    if (configState.selections.goldType) modelParts.push(configState.selections.goldType.toUpperCase());
    if (configState.selections.goldColor) modelParts.push(configState.selections.goldColor);
    if (modelParts.length === 0) {
        if (nameEl) nameEl.textContent = 'Modèle : Inconnu';
    } else {
        if (nameEl) nameEl.textContent = 'Modèle : ' + modelParts.join(' - ');
    }
}

/**
 * Rendu de l'étape de récapitulatif finale (bulles avec images)
 */
function renderSummaryStep() {
    // Masquer l'indicateur de pas (ex: "6/5") sur la page récapitulatif
    const stepIndicator = document.querySelector('.rolex-step-indicator');
    if (stepIndicator) stepIndicator.style.display = 'none';
    document.getElementById('stepTitle').textContent = 'Récapitulatif de votre création';

    const optionList = document.getElementById('optionList');
    optionList.innerHTML = '';
    optionList.classList.add('summary-step');

    // Container de bulles
    const bubbles = document.createElement('div');
    bubbles.className = 'rolex-summary-bubbles';

    // Pour chaque étape, afficher une bulle si une sélection existe
    steps.forEach((step, index) => {
        // Vérifier condition
        if (step.condition && !step.condition()) return;

        const selectedVal = configState.selections[step.key];
        const bubble = document.createElement('button');
        bubble.className = 'rolex-summary-bubble';
        bubble.type = 'button';
        bubble.dataset.step = index;

        const imgWrap = document.createElement('div');
        imgWrap.className = 'rolex-summary-bubble-img';

        const label = document.createElement('div');
        label.className = 'rolex-summary-bubble-label';

        if (selectedVal) {
            const opt = step.options.find(o => o.value === selectedVal);
            const src = (opt && (opt.thumbnail || opt.image)) || '../assets/images/configurator/default.jpg';
            const img = document.createElement('img');
            img.src = src;
            img.alt = opt ? opt.title : 'Choix';
            imgWrap.appendChild(img);
            label.textContent = opt ? opt.title : selectedVal;

        } else {
            // Indiquer non-sélection
            const img = document.createElement('div');
            img.textContent = '?';
            imgWrap.appendChild(img);
            label.textContent = step.title;
            bubble.classList.add('empty');
        }

        bubble.appendChild(imgWrap);
        bubble.appendChild(label);

        // clic pour revenir à l'étape correspondante
        bubble.addEventListener('click', () => {
            goToStep(index);
        });

        bubbles.appendChild(bubble);
    });

    optionList.appendChild(bubbles);

    // Footer actions: bouton commander + revenir modifier
    const actions = document.createElement('div');
    actions.className = 'rolex-summary-actions-inline';

    const checkout = document.createElement('button');
    checkout.className = 'btn btn-gold btn-lg';
    checkout.id = 'checkoutInlineBtn';
    checkout.textContent = 'Commander';
    checkout.addEventListener('click', handleCheckout);

    const modify = document.createElement('button');
    modify.className = 'btn btn-secondary';
    modify.textContent = 'Demander un devis';
    modify.addEventListener('click', (e) => {
        e.preventDefault();
        handleQuote();
    });

    actions.appendChild(checkout);
    actions.appendChild(modify);

    optionList.appendChild(actions);
}

/**
 * Ouvrir/fermer le panneau de détails bas (white panel)
 */
function toggleDetailPanel(forceState) {
    const panel = document.getElementById('choicesDetailPanel');
    if (!panel) return;
    const isOpen = panel.getAttribute('aria-hidden') === 'false';
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    panel.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    if (shouldOpen) renderDetailPanel();
}

/**
 * Rendu du panneau de détails pour l'étape courante : liste des options proposées
 */
function renderDetailPanel() {
    const container = document.getElementById('choicesDetailContent');
    if (!container) return;
    container.innerHTML = '';
    // Si on est sur l'étape récapitulatif (summary), afficher le détail de toutes les options choisies
    if (configState.currentStep === steps.length) {
        const header = document.createElement('div');
        header.className = 'choices-help-note';
        header.textContent = 'Détails des options sélectionnées :';
        container.appendChild(header);

        steps.forEach((step) => {
            if (step.condition && !step.condition()) return;
            const selectedVal = configState.selections[step.key];
            const row = document.createElement('div');
            row.className = 'choices-detail-step';

            const thumb = document.createElement('div');
            thumb.className = 'choices-detail-thumb';
            const img = document.createElement('img');
            const opt = step.options.find(o => o.value === selectedVal);
            img.src = (opt && (opt.thumbnail || opt.image)) || '../assets/images/configurator/default.jpg';
            img.alt = opt ? opt.title : step.title;
            thumb.appendChild(img);

            const meta = document.createElement('div');
            meta.className = 'choices-detail-meta';
            const t = document.createElement('div'); t.className = 'title'; t.textContent = step.title || '';
            const s = document.createElement('div'); s.className = 'subtitle'; s.textContent = opt ? (opt.subtitle || '') : 'Aucun choix';
            const p = document.createElement('div'); p.className = 'price';

            let priceText = '';
            if (selectedVal) {
                if (step.key === 'diamond' && configState.prices.diamonds[selectedVal]) priceText = `${configState.prices.diamonds[selectedVal].toLocaleString('fr-FR')} €`;
                else if (step.key === 'goldType' && configState.prices.goldType[selectedVal] !== undefined) {
                    const v = configState.prices.goldType[selectedVal]; priceText = v ? `+${v.toLocaleString('fr-FR')} €` : 'Inclus';
                } else if (step.key === 'goldColor' && configState.prices.goldColor[selectedVal] !== undefined) {
                    const v = configState.prices.goldColor[selectedVal]; priceText = v ? `+${v.toLocaleString('fr-FR')} €` : 'Inclus';
                } else if (step.key === 'setting' && configState.prices.setting[selectedVal] !== undefined) {
                    const v = configState.prices.setting[selectedVal]; priceText = v ? `+${v.toLocaleString('fr-FR')} €` : 'Inclus';
                }
            }
            p.textContent = priceText;

            meta.appendChild(t);
            if (s.textContent) meta.appendChild(s);
            if (p.textContent) meta.appendChild(p);

            row.appendChild(thumb);
            row.appendChild(meta);
            container.appendChild(row);
        });
        return;
    }

    // Comportement par défaut : détail de l'étape courante
    const stepIndex = Math.min(configState.currentStep, steps.length - 1);
    const step = steps[stepIndex];
    if (!step) return;

    // Titre décrivant l'étape
    const header = document.createElement('div');
    header.className = 'choices-help-note';
    header.textContent = `Options proposées : ${step.title}`;
    container.appendChild(header);

    // Pour chaque option, ajouter une ligne détaillée
    step.options.forEach(opt => {
        const row = document.createElement('div');
        row.className = 'choices-detail-step';

        const thumb = document.createElement('div');
        thumb.className = 'choices-detail-thumb';
        const img = document.createElement('img');
        img.src = opt.thumbnail || opt.image || '../assets/images/configurator/default.jpg';
        img.alt = opt.title || '';
        thumb.appendChild(img);

        const meta = document.createElement('div');
        meta.className = 'choices-detail-meta';
        const t = document.createElement('div'); t.className = 'title'; t.textContent = opt.title || '';
        const s = document.createElement('div'); s.className = 'subtitle'; s.textContent = opt.subtitle || '';
        const p = document.createElement('div'); p.className = 'price';
        // essayer d'afficher un prix si existant dans configState.prices
        let priceText = '';
        if (step.key === 'diamond' && configState.prices.diamonds[opt.value]) priceText = `${configState.prices.diamonds[opt.value]} €`;
        if (step.key === 'goldType' && configState.prices.goldType[opt.value] !== undefined) priceText = `+${configState.prices.goldType[opt.value]} €`;
        if (step.key === 'goldColor' && configState.prices.goldColor[opt.value] !== undefined) priceText = `+${configState.prices.goldColor[opt.value]} €`;
        if (step.key === 'setting' && configState.prices.setting[opt.value] !== undefined) priceText = `+${configState.prices.setting[opt.value]} €`;
        p.textContent = priceText;

        meta.appendChild(t);
        if (s.textContent) meta.appendChild(s);
        if (p.textContent) meta.appendChild(p);

        // click pour sélectionner cette option et fermer le panneau
        row.appendChild(thumb);
        row.appendChild(meta);
        row.addEventListener('click', () => {
            selectOption(step.key, opt.value, opt.image);
            toggleDetailPanel(false);
        });

        container.appendChild(row);
    });
}

/**
 * Affiche / masque le panneau d'aide qui montre les différences entre choix
 * Si forceState === false on ferme, true on ouvre, undefined toggles
 */
function toggleHelpPanel(forceState) {
    const panel = document.getElementById('choicesHelpPanel');
    if (!panel) return;
    const isOpen = panel.getAttribute('aria-hidden') === 'false';
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    panel.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');

    if (shouldOpen) renderHelpPanel();
}

/**
 * Générer le contenu du panneau d'aide : pour chaque étape, montrer les options
 * et mettre en évidence la sélection actuelle. Affiche également une preview
 * des choix déjà faits via petites vignettes.
 */
function renderHelpPanel() {
    const container = document.getElementById('choicesHelpContent');
    if (!container) return;
    container.innerHTML = '';

    // Header des choix actuels
    const currentWrap = document.createElement('div');
    currentWrap.className = 'choices-help-current';
    const currentTitle = document.createElement('div');
    currentTitle.className = 'choices-help-note';
    currentTitle.textContent = 'Prévisualisation des choix actuels :';
    currentWrap.appendChild(currentTitle);

    const currentGrid = document.createElement('div');
    currentGrid.style.display = 'flex';
    currentGrid.style.gap = '8px';
    currentGrid.style.flexWrap = 'wrap';

    steps.forEach((s) => {
        if (s.condition && !s.condition()) return;
        const val = configState.selections[s.key];
        const el = document.createElement('div');
        el.style.width = '56px';
        el.style.height = '56px';
        el.style.borderRadius = '8px';
        el.style.overflow = 'hidden';
        el.style.background = 'rgba(255,255,255,0.02)';

        if (val) {
            const opt = s.options.find(o => o.value === val);
            const img = document.createElement('img');
            img.src = (opt && (opt.thumbnail || opt.image)) || '../assets/images/configurator/default.jpg';
            img.alt = opt ? opt.title : '';
            img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
            el.appendChild(img);
        } else {
            el.textContent = '—';
            el.style.display = 'flex'; el.style.alignItems = 'center'; el.style.justifyContent = 'center'; el.style.color = 'rgba(255,255,255,0.45)';
        }

        currentGrid.appendChild(el);
    });

    currentWrap.appendChild(currentGrid);
    container.appendChild(currentWrap);

    // Détail par étape : montrer toutes les options disponibles
    steps.forEach((step, idx) => {
        if (step.condition && !step.condition()) return;
        const stepBlock = document.createElement('div');
        stepBlock.className = 'choices-help-step';
        const h = document.createElement('h4');
        h.textContent = step.title;
        stepBlock.appendChild(h);

        const optionsWrap = document.createElement('div');
        optionsWrap.className = 'choices-help-options';

        step.options.forEach(opt => {
            const o = document.createElement('button');
            o.type = 'button';
            o.className = 'choices-help-option';
            if (configState.selections[step.key] === opt.value) o.classList.add('selected');

            const img = document.createElement('img');
            img.src = opt.thumbnail || opt.image || '../assets/images/configurator/default.jpg';
            img.alt = opt.title || '';
            o.appendChild(img);

            // au clic, naviguer vers l'étape pour modifier si souhaité
            o.addEventListener('click', () => {
                toggleHelpPanel(false);
                goToStep(idx);
            });

            optionsWrap.appendChild(o);
        });

        stepBlock.appendChild(optionsWrap);
        container.appendChild(stepBlock);
    });

    // note explicative
    const note = document.createElement('div');
    note.className = 'choices-help-note';
    note.textContent = 'Cliquez sur une vignette pour aller modifier ce choix. Les vignettes sélectionnées sont marquées en or.';
    container.appendChild(note);
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
