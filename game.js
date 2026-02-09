// Game State
const gameState = {
    // Core stats
    money: 1000,
    perClick: 1,
    perSecond: 0,
    totalLand: 16,
    usedLand: 0,
    landCost: 500,
    totalClicks: 0,
    clickRevenue: 0,
    playTime: 0,
    population: 0,
    
    // Current map
    currentMap: 'downtown',
    
    // Buildings data
    buildings: [],
    
    // Currently selected building for placement
    selectedBuilding: null,
    hoveredPlot: null,
    previewPlots: [],
    
    // Building templates with different sizes
    buildingTemplates: {
        // 1x1 buildings
        lemonadeStand: {
            id: 'lemonadeStand',
            name: 'Lemonade Stand',
            cost: 50,
            income: 2,
            width: 1,
            height: 1,
            space: 1,
            population: 1,
            type: 'commercial',
            category: 'basic',
            color: '#FFD54F',
            icon: '🍋',
            description: 'A simple lemonade stand for starting your business'
        },
        foodTruck: {
            id: 'foodTruck',
            name: 'Food Truck',
            cost: 150,
            income: 5,
            width: 1,
            height: 1,
            space: 1,
            population: 2,
            type: 'commercial',
            category: 'basic',
            color: '#FF8A65',
            icon: '🍔',
            description: 'Mobile food service with quick returns'
        },
        
        // 1x2 buildings
        smallShop: {
            id: 'smallShop',
            name: 'Small Shop',
            cost: 300,
            income: 10,
            width: 1,
            height: 2,
            space: 2,
            population: 3,
            type: 'commercial',
            category: 'basic',
            color: '#4DB6AC',
            icon: '🏪',
            description: 'A small retail store for everyday goods'
        },
        
        // 2x1 buildings
        apartment: {
            id: 'apartment',
            name: 'Apartment Building',
            cost: 500,
            income: 15,
            width: 2,
            height: 1,
            space: 2,
            population: 10,
            type: 'residential',
            category: 'basic',
            color: '#7986CB',
            icon: '🏢',
            description: 'Houses multiple families for stable income'
        },
        
        // 2x2 buildings
        restaurant: {
            id: 'restaurant',
            name: 'Restaurant',
            cost: 1000,
            income: 25,
            width: 2,
            height: 2,
            space: 4,
            population: 5,
            type: 'commercial',
            category: 'advanced',
            color: '#E57373',
            icon: '🍽️',
            description: 'Full-service dining establishment'
        },
        
        // 2x2 buildings
        office: {
            id: 'office',
            name: 'Office Building',
            cost: 2000,
            income: 40,
            width: 2,
            height: 2,
            space: 4,
            population: 15,
            type: 'commercial',
            category: 'advanced',
            color: '#64B5F6',
            icon: '🏛️',
            description: 'Corporate offices with high income'
        },
        
        // 3x2 buildings
        factory: {
            id: 'factory',
            name: 'Factory',
            cost: 5000,
            income: 75,
            width: 3,
            height: 2,
            space: 6,
            population: 20,
            type: 'industrial',
            category: 'advanced',
            color: '#90A4AE',
            icon: '🏭',
            description: 'Industrial production facility'
        },
        
        // 3x3 buildings
        mall: {
            id: 'mall',
            name: 'Shopping Mall',
            cost: 10000,
            income: 150,
            width: 3,
            height: 3,
            space: 9,
            population: 50,
            type: 'commercial',
            category: 'advanced',
            color: '#BA68C8',
            icon: '🏬',
            description: 'Large retail complex with multiple stores'
        }
    },
    
    // Upgrades
    upgrades: {
        clickPower: {
            id: 'clickPower',
            name: 'Better Clicking',
            description: 'Double your click value',
            cost: 200,
            purchased: false,
            effect: 'clickMultiplier',
            value: 2,
            icon: '⚡'
        },
        landDiscount: {
            id: 'landDiscount',
            name: 'Land Discount',
            description: 'Reduce land cost by 30%',
            cost: 1000,
            purchased: false,
            effect: 'landDiscount',
            value: 0.7,
            icon: '🏙️'
        },
        autoClicker: {
            id: 'autoClicker',
            name: 'Auto Clicker',
            description: 'Automatically click every second',
            cost: 5000,
            purchased: false,
            effect: 'autoClick',
            value: true,
            icon: '🤖'
        }
    },
    
    // Game settings
    lastSave: Date.now(),
    lastUpdate: Date.now(),
    autoSaveInterval: 30000,
    isInitialized: false
};

// DOM Elements
const elements = {
    // Stats
    money: document.getElementById('money'),
    perSecond: document.getElementById('per-second'),
    perClick: document.getElementById('per-click'),
    landUsed: document.getElementById('land-used'),
    landTotal: document.getElementById('land-total'),
    landFill: document.getElementById('land-fill'),
    landPercent: document.getElementById('land-percent'),
    landCost: document.getElementById('land-cost'),
    buildingCount: document.getElementById('building-count'),
    population: document.getElementById('population'),
    totalClicks: document.getElementById('total-clicks'),
    clickRevenue: document.getElementById('click-revenue'),
    clickValueDisplay: document.getElementById('click-value-display'),
    
    // Containers
    landGrid: document.getElementById('land-grid'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    
    // UI Elements
    dragInstruction: document.getElementById('drag-instruction'),
    selectedBuildingInfo: document.getElementById('selected-building-info'),
    draggingName: document.getElementById('dragging-name'),
    buildingSizeDisplay: document.getElementById('building-size-display'),
    dragPreviewOverlay: document.getElementById('drag-preview-overlay'),
    
    // Buttons
    clickButton: document.getElementById('click-button'),
    buyLandBtn: document.getElementById('buy-land-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    resetBtn: document.getElementById('reset-btn'),
    helpBtn: document.getElementById('help-btn'),
    
    // Modals
    buildingModal: document.getElementById('building-modal'),
    modalContent: document.getElementById('modal-content'),
    
    // Time
    playTime: document.getElementById('play-time'),
    
    // Notification
    notification: document.getElementById('notification')
};

// Game Initialization
function init() {
    if (gameState.isInitialized) return;
    
    console.log('Initializing Mini City Tycoon...');
    
    // Load saved game
    loadGame();
    
    // Setup game systems
    setupEventListeners();
    renderLandGrid();
    renderBuildingsShop();
    renderUpgrades();
    updateDisplay();
    
    // Start game loops
    startGameLoops();
    
    gameState.isInitialized = true;
    
    // Show welcome message
    showNotification('Welcome! Click a building in the shop, then click an empty green plot to place it.', 'success');
    
    console.log('Game initialized successfully!');
}

// Setup Event Listeners
function setupEventListeners() {
    // Click button
    elements.clickButton.addEventListener('click', handleClick);
    
    // Building purchase
    elements.buyLandBtn.addEventListener('click', buyLand);
    
    // Game controls
    elements.saveBtn.addEventListener('click', saveGame);
    elements.loadBtn.addEventListener('click', loadGame);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.helpBtn.addEventListener('click', showHelp);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderBuildingsShop(this.dataset.filter);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Start Game Loops
function startGameLoops() {
    // Main game loop (60fps)
    setInterval(gameLoop, 1000/60);
    
    // Income calculation (1 second)
    setInterval(calculateIncome, 1000);
    
    // Auto clicker (1 second)
    setInterval(autoClick, 1000);
    
    // Play time counter
    setInterval(updatePlayTime, 1000);
    
    // Auto save
    setInterval(autoSave, gameState.autoSaveInterval);
}

// Main Game Loop
function gameLoop() {
    const now = Date.now();
    const deltaTime = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;
}

// Calculate Passive Income
function calculateIncome() {
    let totalIncome = 0;
    let totalPopulation = 0;
    
    gameState.buildings.forEach(building => {
        totalIncome += building.income * building.level;
        totalPopulation += building.population;
    });
    
    gameState.perSecond = Math.floor(totalIncome);
    gameState.population = totalPopulation;
    gameState.money += gameState.perSecond;
    
    updateDisplay();
}

// Handle Click
function handleClick() {
    let clickValue = gameState.perClick;
    
    // Apply click power upgrade
    if (gameState.upgrades.clickPower.purchased) {
        clickValue *= gameState.upgrades.clickPower.value;
    }
    
    gameState.money += clickValue;
    gameState.totalClicks++;
    gameState.clickRevenue += clickValue;
    
    // Animation
    animateClick();
    
    updateDisplay();
}

// Auto Click
function autoClick() {
    if (gameState.upgrades.autoClicker.purchased) {
        handleClick();
    }
}

// Select Building for Placement
function selectBuilding(buildingId) {
    const template = gameState.buildingTemplates[buildingId];
    if (!template) return;
    
    // Check if we can afford it
    if (gameState.money < template.cost) {
        showNotification(`Not enough money! Need $${template.cost}`, 'error');
        return;
    }
    
    // Check if there's space
    if (gameState.usedLand + template.space > gameState.totalLand) {
        showNotification('Not enough land! Buy more land first.', 'error');
        return;
    }
    
    // Check if there are available purchased plots
    const purchasedPlots = document.querySelectorAll('.land-plot.purchased:not(.occupied)').length;
    if (purchasedPlots < template.space) {
        showNotification(`Not enough empty plots! Need ${template.space} adjacent plots.`, 'error');
        return;
    }
    
    // Set selected building
    gameState.selectedBuilding = template;
    
    // Update UI
    document.querySelectorAll('.building-item').forEach(item => {
        item.classList.remove('selected');
        if (item.dataset.buildingId === buildingId) {
            item.classList.add('selected');
        }
    });
    
    // Update selected building info
    elements.selectedBuildingInfo.style.display = 'block';
    elements.draggingName.textContent = template.name;
    elements.buildingSizeDisplay.textContent = `Size: ${template.width}×${template.height}`;
    elements.dragInstruction.textContent = `Click an empty green plot to place ${template.name}`;
    elements.dragInstruction.style.color = '#4cc9f0';
    
    // Setup plot hover listeners
    setupPlotHoverListeners();
    
    showNotification(`${template.name} selected. Click empty green plots to place.`, 'info');
}

// Setup Plot Hover Listeners
function setupPlotHoverListeners() {
    // Remove existing listeners
    const plots = document.querySelectorAll('.land-plot');
    plots.forEach(plot => {
        plot.removeEventListener('mouseenter', handlePlotHover);
        plot.removeEventListener('mouseleave', handlePlotLeave);
        plot.removeEventListener('click', handlePlotClick);
        
        // Add new listeners
        plot.addEventListener('mouseenter', handlePlotHover);
        plot.addEventListener('mouseleave', handlePlotLeave);
        plot.addEventListener('click', handlePlotClick);
    });
}

// Handle Plot Hover
function handlePlotHover(e) {
    if (!gameState.selectedBuilding) return;
    
    const plot = e.currentTarget;
    const plotIndex = parseInt(plot.dataset.index);
    
    // Clear previous preview
    clearPreview();
    
    // Calculate if building can fit here
    const canFit = checkIfBuildingFits(plotIndex);
    
    if (canFit) {
        // Show valid preview
        showPreview(plotIndex, true);
        gameState.hoveredPlot = plotIndex;
    } else {
        // Show invalid preview
        showPreview(plotIndex, false);
        gameState.hoveredPlot = null;
    }
}

// Handle Plot Leave
function handlePlotLeave() {
    clearPreview();
    gameState.hoveredPlot = null;
}

// Handle Plot Click
function handlePlotClick(e) {
    if (!gameState.selectedBuilding) {
        // If no building selected, check if this is an occupied plot
        const plot = e.currentTarget;
        const plotIndex = parseInt(plot.dataset.index);
        const building = gameState.buildings.find(b => b.plots && b.plots.includes(plotIndex));
        
        if (building) {
            showBuildingModal(building);
        } else if (plot.classList.contains('purchased')) {
            showNotification('Select a building from the shop first, then click here to place it.', 'info');
        } else {
            // Offer to buy the plot
            if (confirm(`Buy this land plot for $${gameState.landCost}?`)) {
                buyLand();
            }
        }
        return;
    }
    
    const plot = e.currentTarget;
    const plotIndex = parseInt(plot.dataset.index);
    
    // Check if building can fit here
    const canFit = checkIfBuildingFits(plotIndex);
    
    if (canFit) {
        placeBuilding(plotIndex);
    } else {
        showNotification('Cannot place building here! Not enough space or plots occupied.', 'error');
    }
}

// Check if Building Fits at Plot Index
function checkIfBuildingFits(startPlotIndex) {
    if (!gameState.selectedBuilding) return false;
    
    const template = gameState.selectedBuilding;
    const gridSize = Math.sqrt(gameState.totalLand);
    
    // Calculate start position in grid
    const startRow = Math.floor(startPlotIndex / gridSize);
    const startCol = startPlotIndex % gridSize;
    
    // Check if building fits within grid boundaries
    if (startRow + template.height > gridSize || startCol + template.width > gridSize) {
        return false;
    }
    
    // Check all required plots
    for (let row = 0; row < template.height; row++) {
        for (let col = 0; col < template.width; col++) {
            const plotIndex = (startRow + row) * gridSize + (startCol + col);
            
            // Check if plot exists
            if (plotIndex >= gameState.totalLand) return false;
            
            // Check if plot is purchased
            const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
            if (!plot || !plot.classList.contains('purchased')) return false;
            
            // Check if plot is already occupied
            const existingBuilding = gameState.buildings.find(b => 
                b.plots && b.plots.includes(plotIndex)
            );
            if (existingBuilding) return false;
        }
    }
    
    return true;
}

// Get All Plot Indices for Building
function getPlotIndicesForBuilding(startPlotIndex) {
    if (!gameState.selectedBuilding) return [];
    
    const template = gameState.selectedBuilding;
    const gridSize = Math.sqrt(gameState.totalLand);
    const indices = [];
    
    const startRow = Math.floor(startPlotIndex / gridSize);
    const startCol = startPlotIndex % gridSize;
    
    for (let row = 0; row < template.height; row++) {
        for (let col = 0; col < template.width; col++) {
            const plotIndex = (startRow + row) * gridSize + (startCol + col);
            indices.push(plotIndex);
        }
    }
    
    return indices;
}

// Show Preview on Grid
function showPreview(startPlotIndex, isValid) {
    if (!gameState.selectedBuilding) return;
    
    const template = gameState.selectedBuilding;
    const plotIndices = getPlotIndicesForBuilding(startPlotIndex);
    const gridSize = Math.sqrt(gameState.totalLand);
    
    // Clear overlay
    elements.dragPreviewOverlay.innerHTML = '';
    elements.dragPreviewOverlay.classList.add('active');
    
    // Store preview plots
    gameState.previewPlots = plotIndices;
    
    // Highlight plots on grid
    plotIndices.forEach(plotIndex => {
        const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
        if (plot) {
            plot.classList.add(isValid ? 'valid' : 'invalid');
        }
        
        // Add visual overlay
        const plotRect = plot.getBoundingClientRect();
        const gridRect = elements.landGrid.getBoundingClientRect();
        
        const previewSlot = document.createElement('div');
        previewSlot.className = `preview-slot ${isValid ? 'valid' : 'invalid'}`;
        previewSlot.style.left = `${plotRect.left - gridRect.left}px`;
        previewSlot.style.top = `${plotRect.top - gridRect.top}px`;
        previewSlot.style.width = `${plotRect.width}px`;
        previewSlot.style.height = `${plotRect.height}px`;
        
        elements.dragPreviewOverlay.appendChild(previewSlot);
    });
}

// Clear Preview
function clearPreview() {
    // Remove highlight classes
    gameState.previewPlots.forEach(plotIndex => {
        const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
        if (plot) {
            plot.classList.remove('valid', 'invalid');
        }
    });
    
    // Clear overlay
    elements.dragPreviewOverlay.innerHTML = '';
    elements.dragPreviewOverlay.classList.remove('active');
    gameState.previewPlots = [];
}

// Place Building
function placeBuilding(startPlotIndex) {
    if (!gameState.selectedBuilding) return;
    
    const template = gameState.selectedBuilding;
    const plotIndices = getPlotIndicesForBuilding(startPlotIndex);
    
    // Final validation
    if (gameState.money < template.cost) {
        showNotification(`Not enough money! Need $${template.cost}`, 'error');
        return;
    }
    
    if (gameState.usedLand + template.space > gameState.totalLand) {
        showNotification('Not enough land! Buy more land first.', 'error');
        return;
    }
    
    // Check all plots are available
    for (const plotIndex of plotIndices) {
        const existingBuilding = gameState.buildings.find(b => 
            b.plots && b.plots.includes(plotIndex)
        );
        if (existingBuilding) {
            showNotification('Some plots are already occupied!', 'error');
            return;
        }
        
        const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
        if (!plot || !plot.classList.contains('purchased')) {
            showNotification('Some plots are not purchased!', 'error');
            return;
        }
    }
    
    // Create building
    const building = {
        ...JSON.parse(JSON.stringify(template)),
        id: `${template.id}_${Date.now()}`,
        level: 1,
        placedAt: Date.now(),
        plots: plotIndices,
        startPlot: startPlotIndex
    };
    
    // Deduct cost
    gameState.money -= template.cost;
    gameState.usedLand += template.space;
    
    // Add to buildings
    gameState.buildings.push(building);
    
    // Clear selection
    clearBuildingSelection();
    
    // Update UI
    renderLandGrid();
    renderBuildingsShop();
    updateDisplay();
    
    showNotification(`${template.name} built! Income: $${template.income}/sec`, 'success');
}

// Clear Building Selection
function clearBuildingSelection() {
    gameState.selectedBuilding = null;
    gameState.hoveredPlot = null;
    clearPreview();
    
    // Update UI
    document.querySelectorAll('.building-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    elements.selectedBuildingInfo.style.display = 'block';
    elements.draggingName.textContent = 'None';
    elements.buildingSizeDisplay.textContent = 'Size: 1x1';
    elements.dragInstruction.textContent = 'Click building in shop, then click plot';
    elements.dragInstruction.style.color = '';
}

// Buy Land
function buyLand() {
    const cost = gameState.landCost;
    
    if (gameState.money >= cost) {
        gameState.money -= cost;
        
        // Find next available plot to purchase
        let plotFound = false;
        for (let i = 0; i < gameState.totalLand; i++) {
            const plot = document.querySelector(`.land-plot[data-index="${i}"]`);
            if (plot && !plot.classList.contains('purchased') && !plot.classList.contains('occupied')) {
                plot.classList.add('purchased');
                plotFound = true;
                break;
            }
        }
        
        if (!plotFound) {
            showNotification('All available plots are already purchased!', 'info');
            return;
        }
        
        // Increase land cost for next purchase
        gameState.landCost = Math.floor(gameState.landCost * 1.5);
        
        renderLandGrid();
        updateDisplay();
        showNotification('Land plot purchased!', 'success');
    } else {
        showNotification(`Not enough money! Need $${cost}`, 'error');
    }
}

// Render Land Grid
function renderLandGrid() {
    if (!elements.landGrid) return;
    
    elements.landGrid.innerHTML = '';
    
    // Calculate grid size (square grid)
    const gridSize = Math.ceil(Math.sqrt(gameState.totalLand));
    elements.landGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    elements.landGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    for (let i = 0; i < gameState.totalLand; i++) {
        const plot = document.createElement('div');
        plot.className = 'land-plot';
        plot.dataset.index = i;
        
        // Find building on this plot
        const building = gameState.buildings.find(b => 
            b.plots && b.plots.includes(i)
        );
        
        if (building) {
            plot.classList.add('occupied');
            plot.style.color = building.color;
            
            // Check if this is the start plot (for multi-slot buildings)
            const isStartPlot = building.startPlot === i;
            const visualClass = (building.width > 1 || building.height > 1) ? 'multi-slot' : '';
            
            plot.innerHTML = `
                <div class="plot-building">
                    <div class="building-visual ${visualClass}" style="background: ${building.color}"></div>
                    <div class="building-label">${isStartPlot ? building.icon : ''}</div>
                </div>
            `;
            
            plot.addEventListener('click', () => showBuildingModal(building));
        } else {
            // First 4 plots are free, mark as purchased
            if (i < 4) {
                plot.classList.add('purchased');
                plot.innerHTML = '<div class="plot-plus">+</div>';
            } else {
                plot.innerHTML = '<div class="plot-plus" style="opacity:0.3;">+</div>';
            }
            
            plot.addEventListener('click', (e) => handlePlotClick(e));
        }
        
        elements.landGrid.appendChild(plot);
    }
    
    updateLandDisplay();
}

// Render Buildings Shop
function renderBuildingsShop(filter = 'all') {
    if (!elements.buildingsContainer) return;
    
    elements.buildingsContainer.innerHTML = '';
    
    Object.values(gameState.buildingTemplates).forEach(template => {
        // Apply filter
        if (filter !== 'all' && template.category !== filter) {
            return;
        }
        
        const canAfford = gameState.money >= template.cost;
        const hasSpace = gameState.usedLand + template.space <= gameState.totalLand;
        const purchasedPlots = document.querySelectorAll('.land-plot.purchased:not(.occupied)').length;
        const hasAvailablePlots = purchasedPlots >= template.space;
        
        const item = document.createElement('div');
        item.className = `building-item ${canAfford && hasSpace && hasAvailablePlots ? '' : 'disabled'}`;
        item.dataset.buildingId = template.id;
        
        const sizeText = template.width > 1 || template.height > 1 
            ? `${template.width}×${template.height}` 
            : '1×1';
        
        item.innerHTML = `
            <div class="building-header">
                <div class="building-icon" style="background: ${template.color}">
                    ${template.icon}
                </div>
                <div class="building-info">
                    <div class="building-name">${template.name}</div>
                    <div class="building-stats">
                        <span>$${template.income}/s</span>
                        • 
                        <span>${sizeText} (${template.space} plot${template.space > 1 ? 's' : ''})</span>
                        •
                        <span>👤 ${template.population}</span>
                    </div>
                </div>
                <div class="building-cost">$${template.cost}</div>
            </div>
        `;
        
        if (canAfford && hasSpace && hasAvailablePlots) {
            item.addEventListener('click', () => selectBuilding(template.id));
        } else {
            if (!hasAvailablePlots) {
                item.title = `Need ${template.space} adjacent empty plots`;
            } else if (!canAfford) {
                item.title = `Need $${template.cost - gameState.money} more`;
            } else if (!hasSpace) {
                item.title = "Not enough total land space!";
            }
        }
        
        elements.buildingsContainer.appendChild(item);
    });
}

// Render Upgrades
function renderUpgrades() {
    if (!elements.upgradesContainer) return;
    
    elements.upgradesContainer.innerHTML = '';
    
    Object.values(gameState.upgrades).forEach(upgrade => {
        const canAfford = gameState.money >= upgrade.cost && !upgrade.purchased;
        
        const item = document.createElement('div');
        item.className = `upgrade-item ${canAfford ? '' : 'disabled'}`;
        
        item.innerHTML = `
            <div class="building-header">
                <div class="building-icon" style="background: var(--primary-color)">
                    ${upgrade.icon}
                </div>
                <div class="building-info">
                    <div class="building-name">${upgrade.name}</div>
                    <div class="building-stats">${upgrade.description}</div>
                </div>
                <div class="building-cost">${upgrade.purchased ? '✓ Purchased' : `$${upgrade.cost}`}</div>
            </div>
        `;
        
        if (canAfford) {
            item.addEventListener('click', () => buyUpgrade(upgrade.id));
        } else if (upgrade.purchased) {
            item.title = "Already purchased";
        } else {
            item.title = `Need $${upgrade.cost - gameState.money} more`;
        }
        
        elements.upgradesContainer.appendChild(item);
    });
}

// Buy Upgrade
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    
    if (!upgrade.purchased && gameState.money >= upgrade.cost) {
        gameState.money -= upgrade.cost;
        upgrade.purchased = true;
        
        // Apply upgrade effects
        switch (upgrade.effect) {
            case 'clickMultiplier':
                gameState.perClick *= upgrade.value;
                break;
            case 'landDiscount':
                gameState.landCost = Math.floor(gameState.landCost * upgrade.value);
                break;
            case 'autoClick':
                // Will be handled by autoClick function
                break;
        }
        
        renderUpgrades();
        updateDisplay();
        showNotification(`Purchased ${upgrade.name}!`, 'success');
    }
}

// Update Display
function updateDisplay() {
    // Format numbers
    const formatMoney = (amount) => {
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
        return `$${Math.floor(amount)}`;
    };
    
    // Update stats
    if (elements.money) elements.money.textContent = formatMoney(gameState.money);
    if (elements.perSecond) elements.perSecond.textContent = formatMoney(gameState.perSecond);
    if (elements.perClick) elements.perClick.textContent = formatMoney(gameState.perClick);
    if (elements.landUsed) elements.landUsed.textContent = gameState.usedLand;
    if (elements.landTotal) elements.landTotal.textContent = gameState.totalLand;
    if (elements.landCost) elements.landCost.textContent = gameState.landCost;
    if (elements.buildingCount) elements.buildingCount.textContent = gameState.buildings.length;
    if (elements.population) elements.population.textContent = gameState.population;
    if (elements.totalClicks) elements.totalClicks.textContent = gameState.totalClicks;
    if (elements.clickRevenue) elements.clickRevenue.textContent = formatMoney(gameState.clickRevenue);
    if (elements.clickValueDisplay) elements.clickValueDisplay.textContent = gameState.perClick;
    
    // Update auto-clicker status
    const autoClickerStatus = document.getElementById('auto-click-status');
    if (autoClickerStatus) {
        autoClickerStatus.innerHTML = gameState.upgrades.autoClicker.purchased 
            ? '<i class="fas fa-robot"></i> Auto: ON'
            : '<i class="fas fa-robot"></i> Auto: OFF';
    }
    
    // Update buy land button
    if (elements.buyLandBtn) {
        elements.buyLandBtn.disabled = gameState.money < gameState.landCost;
        elements.buyLandBtn.innerHTML = `<i class="fas fa-expand"></i> Buy Land Plot ($${gameState.landCost})`;
    }
}

// Update Land Display
function updateLandDisplay() {
    const purchasedPlots = document.querySelectorAll('.land-plot.purchased').length;
    const percent = purchasedPlots > 0 ? Math.min(100, (gameState.usedLand / purchasedPlots) * 100) : 0;
    
    if (elements.landFill) elements.landFill.style.width = `${percent}%`;
    if (elements.landPercent) elements.landPercent.textContent = `${Math.round(percent)}%`;
}

// Show Building Modal
function showBuildingModal(building) {
    const template = gameState.buildingTemplates[building.id.split('_')[0]];
    
    if (!elements.modalContent) return;
    
    const sizeText = building.width > 1 || building.height > 1 
        ? `${building.width}×${building.height}` 
        : '1×1';
    
    elements.modalContent.innerHTML = `
        <div class="modal-building-info">
            <div class="building-icon-large" style="background: ${building.color}">
                ${building.icon}
            </div>
            <h4>${building.name}</h4>
            <p class="building-description">${template.description}</p>
            
            <div class="building-stats-grid">
                <div class="stat">
                    <span>Income</span>
                    <strong>$${building.income * building.level}/s</strong>
                </div>
                <div class="stat">
                    <span>Size</span>
                    <strong>${sizeText}</strong>
                </div>
                <div class="stat">
                    <span>Plots</span>
                    <strong>${building.space}</strong>
                </div>
                <div class="stat">
                    <span>Population</span>
                    <strong>${building.population}</strong>
                </div>
                <div class="stat">
                    <span>Level</span>
                    <strong>${building.level}</strong>
                </div>
                <div class="stat">
                    <span>Value</span>
                    <strong>$${building.cost}</strong>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn upgrade-btn" onclick="upgradeBuilding('${building.id}')">
                    <i class="fas fa-arrow-up"></i>
                    Upgrade ($${Math.floor(building.cost * 1.5)})
                </button>
                <button class="btn danger" onclick="sellBuilding('${building.id}')">
                    <i class="fas fa-trash"></i>
                    Sell ($${Math.floor(building.cost * 0.7)})
                </button>
            </div>
        </div>
    `;
    
    if (elements.buildingModal) {
        elements.buildingModal.style.display = 'flex';
    }
}

// Upgrade Building
function upgradeBuilding(buildingId) {
    const building = gameState.buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    const upgradeCost = Math.floor(building.cost * 1.5);
    
    if (gameState.money >= upgradeCost) {
        gameState.money -= upgradeCost;
        building.level++;
        building.income = Math.floor(building.income * 1.2);
        building.cost = upgradeCost;
        
        updateDisplay();
        renderLandGrid();
        if (elements.buildingModal) {
            elements.buildingModal.style.display = 'none';
        }
        showNotification(`${building.name} upgraded to level ${building.level}!`, 'success');
    } else {
        showNotification(`Need $${upgradeCost} to upgrade!`, 'error');
    }
}

// Sell Building
function sellBuilding(buildingId) {
    const building = gameState.buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    const sellPrice = Math.floor(building.cost * 0.7);
    
    if (confirm(`Sell ${building.name} for $${sellPrice}? This will free up ${building.space} plots.`)) {
        gameState.money += sellPrice;
        gameState.usedLand -= building.space;
        gameState.buildings = gameState.buildings.filter(b => b.id !== buildingId);
        
        // Clear selection if this was the selected building
        if (gameState.selectedBuilding && gameState.selectedBuilding.id === building.id.split('_')[0]) {
            clearBuildingSelection();
        }
        
        renderLandGrid();
        renderBuildingsShop();
        updateDisplay();
        if (elements.buildingModal) {
            elements.buildingModal.style.display = 'none';
        }
        
        showNotification(`Sold ${building.name} for $${sellPrice}!`, 'success');
    }
}

// Show Help
function showHelp() {
    alert(`
=== MINI CITY TYCOON - HOW TO PLAY ===

1. CLICK the main button to earn money
2. CLICK BUILDINGS in the shop to select them
3. CLICK EMPTY GREEN PLOTS to place selected building
4. LARGE BUILDINGS take multiple adjacent plots
5. BUILDINGS generate passive income every second
6. CLICK ON BUILDINGS to manage/upgrade/sell them
7. BUY MORE LAND when you run out of space
8. PURCHASE upgrades for permanent bonuses

BUILDING SIZES:
🍋 Lemonade Stand: 1×1 (1 plot)
🍔 Food Truck: 1×1 (1 plot)
🏪 Small Shop: 1×2 (2 plots)
🏢 Apartment: 2×1 (2 plots)
🍽️ Restaurant: 2×2 (4 plots)
🏛️ Office: 2×2 (4 plots)
🏭 Factory: 3×2 (6 plots)
🏬 Mall: 3×3 (9 plots)

TIP: Start with 1×1 buildings, then expand to larger ones!
    `);
}

// Save Game
function saveGame() {
    try {
        const saveData = {
            money: gameState.money,
            perClick: gameState.perClick,
            perSecond: gameState.perSecond,
            totalLand: gameState.totalLand,
            usedLand: gameState.usedLand,
            landCost: gameState.landCost,
            totalClicks: gameState.totalClicks,
            clickRevenue: gameState.clickRevenue,
            playTime: gameState.playTime,
            population: gameState.population,
            currentMap: gameState.currentMap,
            buildings: gameState.buildings,
            upgrades: gameState.upgrades,
            lastSave: Date.now()
        };
        
        localStorage.setItem('miniCityTycoonSave', JSON.stringify(saveData));
        showNotification('Game saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving game:', error);
        showNotification('Error saving game', 'error');
    }
}

// Auto Save
function autoSave() {
    saveGame();
}

// Load Game
function loadGame() {
    try {
        const saved = localStorage.getItem('miniCityTycoonSave');
        
        if (saved) {
            const savedState = JSON.parse(saved);
            
            // Load basic stats
            const basicStats = ['money', 'perClick', 'perSecond', 'totalLand', 'usedLand', 
                               'landCost', 'totalClicks', 'clickRevenue', 'playTime', 
                               'population', 'currentMap'];
            
            basicStats.forEach(stat => {
                if (savedState[stat] !== undefined) {
                    gameState[stat] = savedState[stat];
                }
            });
            
            // Load buildings
            if (Array.isArray(savedState.buildings)) {
                gameState.buildings = savedState.buildings;
            }
            
            // Load upgrades
            if (savedState.upgrades) {
                Object.keys(savedState.upgrades).forEach(key => {
                    if (gameState.upgrades[key]) {
                        gameState.upgrades[key].purchased = savedState.upgrades[key].purchased;
                    }
                });
            }
            
            showNotification('Game loaded successfully!', 'success');
        }
    } catch (error) {
        console.error('Error loading game:', error);
        showNotification('Error loading saved game', 'error');
    }
}

// Reset Game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
        localStorage.removeItem('miniCityTycoonSave');
        
        // Reset to initial state
        gameState.money = 1000;
        gameState.perClick = 1;
        gameState.perSecond = 0;
        gameState.totalLand = 16;
        gameState.usedLand = 0;
        gameState.landCost = 500;
        gameState.totalClicks = 0;
        gameState.clickRevenue = 0;
        gameState.playTime = 0;
        gameState.population = 0;
        gameState.currentMap = 'downtown';
        gameState.buildings = [];
        gameState.selectedBuilding = null;
        gameState.hoveredPlot = null;
        gameState.previewPlots = [];
        
        // Reset upgrades
        Object.values(gameState.upgrades).forEach(upgrade => {
            upgrade.purchased = false;
        });
        
        renderLandGrid();
        renderBuildingsShop();
        renderUpgrades();
        updateDisplay();
        
        showNotification('Game reset to initial state!', 'success');
    }
}

// Update Play Time
function updatePlayTime() {
    gameState.playTime++;
    if (elements.playTime) {
        elements.playTime.textContent = formatTime(gameState.playTime);
    }
}

// Format Time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Animate Click
function animateClick() {
    const button = elements.clickButton;
    if (!button) return;
    
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Show Notification
function showNotification(message, type = 'success') {
    if (!elements.notification) return;
    
    const notification = elements.notification;
    const content = notification.querySelector('.notification-content');
    
    if (!content) return;
    
    const textElement = content.querySelector('.notification-text');
    const iconElement = content.querySelector('.notification-icon');
    
    if (textElement) textElement.textContent = message;
    
    // Set icon based on type
    if (iconElement) {
        iconElement.className = 'notification-icon';
        if (type === 'success') {
            iconElement.style.color = '#4ade80';
            iconElement.textContent = '✓';
        } else if (type === 'error') {
            iconElement.style.color = '#ef4444';
            iconElement.textContent = '⚠';
        } else {
            iconElement.style.color = '#3b82f6';
            iconElement.textContent = 'ℹ';
        }
    }
    
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);
