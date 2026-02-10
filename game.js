// Game State
const gameState = {
    // Core stats
    money: 1000,
    perClick: 1,
    perSecond: 0,
    totalLand: 25, // 5x5 grid = 25 plots
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
    
    // Building templates with proper sizes
    buildingTemplates: {
        // Small buildings (1x1)
        lemonadeStand: {
            id: 'lemonadeStand',
            name: 'Lemonade',
            cost: 50,
            income: 2,
            width: 1,
            height: 1,
            space: 1,
            population: 1,
            type: 'commercial',
            category: 'small',
            color: '#FFD54F',
            icon: '🍋',
            description: 'Simple lemonade stand'
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
            category: 'small',
            color: '#FF8A65',
            icon: '🍔',
            description: 'Mobile food service'
        },
        newsstand: {
            id: 'newsstand',
            name: 'Newsstand',
            cost: 250,
            income: 8,
            width: 1,
            height: 1,
            space: 1,
            population: 1,
            type: 'commercial',
            category: 'small',
            color: '#4DB6AC',
            icon: '📰',
            description: 'Newspaper and magazine stand'
        },
        
        // Medium buildings (2x1 or 1x2)
        smallShop: {
            id: 'smallShop',
            name: 'Shop',
            cost: 300,
            income: 10,
            width: 2,
            height: 1,
            space: 2,
            population: 3,
            type: 'commercial',
            category: 'medium',
            color: '#64B5F6',
            icon: '🏪',
            description: 'Small retail store'
        },
        cafe: {
            id: 'cafe',
            name: 'Cafe',
            cost: 400,
            income: 12,
            width: 1,
            height: 2,
            space: 2,
            population: 4,
            type: 'commercial',
            category: 'medium',
            color: '#7986CB',
            icon: '☕',
            description: 'Coffee shop'
        },
        apartment: {
            id: 'apartment',
            name: 'Apartment',
            cost: 500,
            income: 15,
            width: 2,
            height: 1,
            space: 2,
            population: 10,
            type: 'residential',
            category: 'medium',
            color: '#BA68C8',
            icon: '🏢',
            description: 'Small apartment building'
        },
        
        // Large buildings (2x2 or bigger)
        restaurant: {
            id: 'restaurant',
            name: 'Restaurant',
            cost: 1000,
            income: 25,
            width: 2,
            height: 2,
            space: 4,
            population: 8,
            type: 'commercial',
            category: 'large',
            color: '#E57373',
            icon: '🍽️',
            description: 'Full-service restaurant'
        },
        office: {
            id: 'office',
            name: 'Office',
            cost: 1500,
            income: 35,
            width: 2,
            height: 2,
            space: 4,
            population: 15,
            type: 'commercial',
            category: 'large',
            color: '#4A6572',
            icon: '🏛️',
            description: 'Office building'
        },
        factory: {
            id: 'factory',
            name: 'Factory',
            cost: 2500,
            income: 50,
            width: 3,
            height: 2,
            space: 6,
            population: 20,
            type: 'industrial',
            category: 'large',
            color: '#90A4AE',
            icon: '🏭',
            description: 'Manufacturing facility'
        },
        mall: {
            id: 'mall',
            name: 'Mall',
            cost: 5000,
            income: 100,
            width: 3,
            height: 3,
            space: 9,
            population: 50,
            type: 'commercial',
            category: 'large',
            color: '#FFB74D',
            icon: '🏬',
            description: 'Shopping mall'
        }
    },
    
    // Upgrades
    upgrades: {
        clickPower: {
            id: 'clickPower',
            name: 'Click Power x2',
            description: 'Double click value',
            cost: 200,
            purchased: false,
            effect: 'clickMultiplier',
            value: 2,
            icon: '⚡'
        },
        landDiscount: {
            id: 'landDiscount',
            name: 'Land Discount 20%',
            description: 'Reduce land cost',
            cost: 1000,
            purchased: false,
            effect: 'landDiscount',
            value: 0.8,
            icon: '🏙️'
        },
        autoClicker: {
            id: 'autoClicker',
            name: 'Auto Clicker',
            description: 'Auto click every second',
            cost: 5000,
            purchased: false,
            effect: 'autoClick',
            value: true,
            icon: '🤖'
        },
        buildingBoost: {
            id: 'buildingBoost',
            name: 'Building Boost',
            description: 'All buildings +25% income',
            cost: 10000,
            purchased: false,
            effect: 'buildingMultiplier',
            value: 1.25,
            icon: '📈'
        }
    },
    
    // Game settings
    lastSave: Date.now(),
    lastUpdate: Date.now(),
    autoSaveInterval: 30000,
    isInitialized: false,
    GRID_SIZE: 5 // 5x5 grid
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
    landStats: document.getElementById('land-stats'),
    buildingCount: document.getElementById('building-count'),
    population: document.getElementById('population'),
    totalClicks: document.getElementById('total-clicks'),
    clickRevenue: document.getElementById('click-revenue'),
    clickValueDisplay: document.getElementById('click-value-display'),
    incomeDisplay: document.getElementById('income-display'),
    
    // UI Elements
    dragInstruction: document.getElementById('drag-instruction'),
    selectedBuildingInfo: document.getElementById('selected-building-info'),
    selectedIcon: document.getElementById('selected-icon'),
    gridPreviewOverlay: document.getElementById('grid-preview-overlay'),
    
    // Containers
    landGrid: document.getElementById('land-grid'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    
    // Buttons
    clickButton: document.getElementById('click-button'),
    buyLandBtn: document.getElementById('buy-land-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    resetBtn: document.getElementById('reset-btn'),
    helpBtn: document.getElementById('help-btn'),
    clearBtn: document.getElementById('clear-btn'),
    statsBtn: document.getElementById('stats-btn'),
    
    // Modals
    buildingModal: document.getElementById('building-modal'),
    modalContent: document.getElementById('modal-content'),
    
    // Time
    playTime: document.getElementById('play-time'),
    
    // Notification
    notification: document.getElementById('notification')
};

// Initialize Game
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
    showNotification('Welcome! Select a building, then click empty green plots to build.', 'success');
    
    console.log('Game initialized!');
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
    elements.clearBtn.addEventListener('click', clearBuildingSelection);
    elements.statsBtn.addEventListener('click', showStats);
    
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
    // Income calculation (1 second)
    setInterval(calculateIncome, 1000);
    
    // Auto clicker (1 second)
    setInterval(autoClick, 1000);
    
    // Play time counter
    setInterval(updatePlayTime, 1000);
    
    // Auto save
    setInterval(autoSave, gameState.autoSaveInterval);
}

// Calculate Passive Income
function calculateIncome() {
    let totalIncome = 0;
    let totalPopulation = 0;
    
    gameState.buildings.forEach(building => {
        let buildingIncome = building.income * building.level;
        
        // Apply building boost upgrade
        if (gameState.upgrades.buildingBoost.purchased) {
            buildingIncome *= gameState.upgrades.buildingBoost.value;
        }
        
        totalIncome += buildingIncome;
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
    elements.clickButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.clickButton.style.transform = 'scale(1)';
    }, 100);
    
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
        showNotification(`Need $${template.cost - gameState.money} more`, 'error');
        return;
    }
    
    // Check if there's enough empty plots
    const emptyPlots = document.querySelectorAll('.land-plot.purchased:not(.occupied)').length;
    if (emptyPlots < template.space) {
        showNotification(`Need ${template.space} empty plots (${emptyPlots} available)`, 'error');
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
    elements.selectedIcon.textContent = template.icon;
    elements.selectedIcon.style.background = template.color;
    elements.selectedBuildingInfo.querySelector('h4').textContent = template.name;
    elements.selectedBuildingInfo.querySelector('p').textContent = 
        `Size: ${template.width}×${template.height} • Cost: $${template.cost}`;
    
    elements.dragInstruction.textContent = `Click empty green plots to place ${template.name}`;
    elements.dragInstruction.style.color = '#4cc9f0';
    
    // Setup plot hover listeners
    setupPlotHoverListeners();
    
    showNotification(`${template.name} selected. Click empty green plots.`, 'info');
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
    
    // Show preview
    showPreview(plotIndex, canFit);
    gameState.hoveredPlot = canFit ? plotIndex : null;
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
        const building = gameState.buildings.find(b => 
            b.plots && b.plots.includes(plotIndex)
        );
        
        if (building) {
            showBuildingModal(building);
        } else if (plot.classList.contains('purchased')) {
            showNotification('Select a building from the shop first.', 'info');
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
        showNotification("Can't place here! Not enough space or plots occupied.", 'error');
    }
}

// Check if Building Fits at Plot Index
function checkIfBuildingFits(startPlotIndex) {
    if (!gameState.selectedBuilding) return false;
    
    const template = gameState.selectedBuilding;
    const gridSize = gameState.GRID_SIZE;
    
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
    const gridSize = gameState.GRID_SIZE;
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
    
    const plotIndices = getPlotIndicesForBuilding(startPlotIndex);
    
    // Store preview plots
    gameState.previewPlots = plotIndices;
    
    // Show overlay
    elements.gridPreviewOverlay.innerHTML = '';
    elements.gridPreviewOverlay.classList.add('active');
    
    // Highlight plots on grid and create overlay
    plotIndices.forEach(plotIndex => {
        const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
        if (plot) {
            plot.classList.add(isValid ? 'valid' : 'invalid');
        }
        
        // Create visual overlay
        const plotRect = plot.getBoundingClientRect();
        const gridRect = elements.landGrid.getBoundingClientRect();
        
        const previewSlot = document.createElement('div');
        previewSlot.className = `preview-slot ${isValid ? 'valid' : 'invalid'}`;
        previewSlot.style.left = `${plotRect.left - gridRect.left}px`;
        previewSlot.style.top = `${plotRect.top - gridRect.top}px`;
        previewSlot.style.width = `${plotRect.width}px`;
        previewSlot.style.height = `${plotRect.height}px`;
        
        elements.gridPreviewOverlay.appendChild(previewSlot);
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
    elements.gridPreviewOverlay.innerHTML = '';
    elements.gridPreviewOverlay.classList.remove('active');
    gameState.previewPlots = [];
}

// Place Building
function placeBuilding(startPlotIndex) {
    if (!gameState.selectedBuilding) return;
    
    const template = gameState.selectedBuilding;
    const plotIndices = getPlotIndicesForBuilding(startPlotIndex);
    
    // Final validation
    if (gameState.money < template.cost) {
        showNotification(`Need $${template.cost - gameState.money} more`, 'error');
        return;
    }
    
    // Check all plots are available
    for (const plotIndex of plotIndices) {
        const existingBuilding = gameState.buildings.find(b => 
            b.plots && b.plots.includes(plotIndex)
        );
        if (existingBuilding) {
            showNotification('Some plots are occupied!', 'error');
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
    
    showNotification(`${template.name} built! +$${template.income}/sec`, 'success');
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
    
    elements.selectedIcon.textContent = '🏗️';
    elements.selectedIcon.style.background = '';
    elements.selectedBuildingInfo.querySelector('h4').textContent = 'No Building Selected';
    elements.selectedBuildingInfo.querySelector('p').textContent = 'Click a building in the shop first';
    
    elements.dragInstruction.textContent = 'Select a building, then click empty green plots';
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
            showNotification('All plots purchased!', 'info');
            return;
        }
        
        // Increase land cost
        gameState.landCost = Math.floor(gameState.landCost * 1.5);
        
        renderLandGrid();
        updateDisplay();
        showNotification('Land purchased!', 'success');
    } else {
        showNotification(`Need $${cost - gameState.money} more`, 'error');
    }
}

// Render Land Grid (FIXED 5x5)
function renderLandGrid() {
    if (!elements.landGrid) return;
    
    elements.landGrid.innerHTML = '';
    
    // Create 5x5 grid
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
            
            // Only show icon on the starting plot
            const isStartPlot = building.startPlot === i;
            
            plot.innerHTML = `
                <div class="plot-building">
                    <div class="building-visual" style="background: ${building.color}">
                        ${isStartPlot ? building.icon : ''}
                    </div>
                </div>
            `;
            
            plot.addEventListener('click', () => showBuildingModal(building));
        } else {
            // First 9 plots are free (center of 5x5 grid)
            const isCenterPlot = i >= 6 && i <= 8 || i >= 11 && i <= 13 || i >= 16 && i <= 18;
            if (isCenterPlot) {
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
        const emptyPlots = document.querySelectorAll('.land-plot.purchased:not(.occupied)').length;
        const hasPlots = emptyPlots >= template.space;
        
        const item = document.createElement('div');
        item.className = `building-item ${canAfford && hasSpace && hasPlots ? '' : 'disabled'}`;
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
                    <div class="building-meta">
                        <span class="meta-item">$${template.income}/s</span>
                        <span class="meta-item">${sizeText}</span>
                        <span class="meta-item">👤 ${template.population}</span>
                    </div>
                </div>
                <div class="building-cost">$${template.cost}</div>
            </div>
        `;
        
        if (canAfford && hasSpace && hasPlots) {
            item.addEventListener('click', () => selectBuilding(template.id));
        } else {
            if (!hasPlots) {
                item.title = `Need ${template.space} empty plots`;
            } else if (!canAfford) {
                item.title = `Need $${template.cost - gameState.money} more`;
            } else if (!hasSpace) {
                item.title = "Not enough total land";
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
                    <div class="building-meta">${upgrade.description}</div>
                </div>
                <div class="building-cost">${upgrade.purchased ? '✓' : `$${upgrade.cost}`}</div>
            </div>
        `;
        
        if (canAfford) {
            item.addEventListener('click', () => buyUpgrade(upgrade.id));
        } else if (upgrade.purchased) {
            item.title = "Purchased";
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
        
        // Apply upgrade
        switch (upgrade.effect) {
            case 'clickMultiplier':
                gameState.perClick *= upgrade.value;
                break;
            case 'landDiscount':
                gameState.landCost = Math.floor(gameState.landCost * upgrade.value);
                break;
            case 'buildingMultiplier':
                // Applied in calculateIncome
                break;
        }
        
        renderUpgrades();
        updateDisplay();
        showNotification(`Upgrade: ${upgrade.name}`, 'success');
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
    if (elements.perSecond) elements.perSecond.textContent = `$${gameState.perSecond}/sec`;
    if (elements.perClick) elements.perClick.textContent = `$${gameState.perClick}`;
    if (elements.landUsed) elements.landUsed.textContent = gameState.usedLand;
    if (elements.landTotal) elements.landTotal.textContent = gameState.totalLand;
    if (elements.landCost) elements.landCost.textContent = gameState.landCost;
    if (elements.landStats) elements.landStats.textContent = `${gameState.usedLand}/${gameState.totalLand}`;
    if (elements.buildingCount) elements.buildingCount.textContent = gameState.buildings.length;
    if (elements.population) elements.population.textContent = gameState.population;
    if (elements.totalClicks) elements.totalClicks.textContent = gameState.totalClicks;
    if (elements.clickRevenue) elements.clickRevenue.textContent = formatMoney(gameState.clickRevenue);
    if (elements.clickValueDisplay) elements.clickValueDisplay.textContent = gameState.perClick;
    if (elements.incomeDisplay) elements.incomeDisplay.textContent = gameState.perSecond;
    
    // Update auto-clicker status
    const autoClickerStatus = document.getElementById('auto-click-status');
    if (autoClickerStatus) {
        autoClickerStatus.textContent = gameState.upgrades.autoClicker.purchased ? 'ON' : 'OFF';
        autoClickerStatus.style.color = gameState.upgrades.autoClicker.purchased ? '#4ade80' : '#ef4444';
    }
}

// Update Land Display
function updateLandDisplay() {
    const purchasedPlots = document.querySelectorAll('.land-plot.purchased').length;
    const percent = purchasedPlots > 0 ? Math.min(100, (gameState.usedLand / gameState.totalLand) * 100) : 0;
    
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
                    <span>People</span>
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
        showNotification(`${building.name} Level ${building.level}!`, 'success');
    } else {
        showNotification(`Need $${upgradeCost} more`, 'error');
    }
}

// Sell Building
function sellBuilding(buildingId) {
    const building = gameState.buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    const sellPrice = Math.floor(building.cost * 0.7);
    
    if (confirm(`Sell ${building.name} for $${sellPrice}?`)) {
        gameState.money += sellPrice;
        gameState.usedLand -= building.space;
        gameState.buildings = gameState.buildings.filter(b => b.id !== buildingId);
        
        renderLandGrid();
        renderBuildingsShop();
        updateDisplay();
        if (elements.buildingModal) {
            elements.buildingModal.style.display = 'none';
        }
        
        showNotification(`Sold for $${sellPrice}`, 'success');
    }
}

// Show Help
function showHelp() {
    alert(`
=== MINI CITY TYCOON ===

HOW TO PLAY:
1. Click buildings in shop to select them
2. Click empty green plots to place buildings
3. Buildings generate income every second
4. Click main button for instant cash
5. Buy land when you need more space
6. Click on buildings to upgrade/sell them

BUILDING SIZES:
• 1×1: Lemonade, Food Truck, Newsstand
• 2×1 or 1×2: Shop, Cafe, Apartment  
• 2×2: Restaurant, Office
• 3×2: Factory
• 3×3: Mall

TIPS:
- Start with 1×1 buildings
- Plan space for larger buildings
- Upgrade buildings for more income
- Buy upgrades for permanent bonuses
    `);
}

// Show Stats
function showStats() {
    const emptyPlots = document.querySelectorAll('.land-plot.purchased:not(.occupied)').length;
    
    alert(`
=== GAME STATS ===

Cash: $${gameState.money}
Income: $${gameState.perSecond}/sec
Total Clicks: ${gameState.totalClicks}
Click Revenue: $${gameState.clickRevenue}

Buildings: ${gameState.buildings.length}
Population: ${gameState.population}
Land Used: ${gameState.usedLand}/${gameState.totalLand}
Empty Plots: ${emptyPlots}

Upgrades: ${Object.values(gameState.upgrades).filter(u => u.purchased).length}/4
Play Time: ${formatTime(gameState.playTime)}
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
        showNotification('Game saved!', 'success');
    } catch (error) {
        showNotification('Save failed', 'error');
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
            
            // Load stats
            const stats = ['money', 'perClick', 'perSecond', 'totalLand', 'usedLand', 
                          'landCost', 'totalClicks', 'clickRevenue', 'playTime', 
                          'population', 'currentMap'];
            
            stats.forEach(stat => {
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
            
            showNotification('Game loaded!', 'success');
        }
    } catch (error) {
        console.log('No save file found');
    }
}

// Reset Game
function resetGame() {
    if (confirm('Reset all progress?')) {
        localStorage.removeItem('miniCityTycoonSave');
        
        // Reset state
        gameState.money = 1000;
        gameState.perClick = 1;
        gameState.perSecond = 0;
        gameState.totalLand = 25;
        gameState.usedLand = 0;
        gameState.landCost = 500;
        gameState.totalClicks = 0;
        gameState.clickRevenue = 0;
        gameState.playTime = 0;
        gameState.population = 0;
        gameState.buildings = [];
        gameState.selectedBuilding = null;
        
        // Reset upgrades
        Object.values(gameState.upgrades).forEach(upgrade => {
            upgrade.purchased = false;
        });
        
        renderLandGrid();
        renderBuildingsShop();
        renderUpgrades();
        updateDisplay();
        
        showNotification('Game reset!', 'success');
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

// Show Notification
function showNotification(message, type = 'success') {
    if (!elements.notification) return;
    
    const notification = elements.notification;
    const content = notification.querySelector('.notification-content');
    
    if (!content) return;
    
    const textElement = content.querySelector('.notification-text');
    const iconElement = content.querySelector('.notification-icon');
    
    if (textElement) textElement.textContent = message;
    
    // Set icon
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

// Initialize
window.addEventListener('DOMContentLoaded', init);
