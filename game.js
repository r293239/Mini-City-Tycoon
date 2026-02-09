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
    maps: {
        downtown: { 
            unlocked: true, 
            name: 'Downtown', 
            description: 'A bustling urban center perfect for starting your empire',
            incomeMultiplier: 1.0,
            landMultiplier: 1.0,
            unlockCost: 0
        }
    },
    
    // Buildings data
    buildings: [],
    
    // Currently dragging building
    draggingBuilding: null,
    dragStartPos: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    
    // Building templates
    buildingTemplates: {
        // Basic buildings
        lemonadeStand: {
            id: 'lemonadeStand',
            name: 'Lemonade Stand',
            cost: 50,
            income: 2,
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
            space: 1,
            population: 2,
            type: 'commercial',
            category: 'basic',
            color: '#FF8A65',
            icon: '🍔',
            description: 'Mobile food service with quick returns'
        },
        smallShop: {
            id: 'smallShop',
            name: 'Small Shop',
            cost: 300,
            income: 10,
            space: 1,
            population: 3,
            type: 'commercial',
            category: 'basic',
            color: '#4DB6AC',
            icon: '🏪',
            description: 'A small retail store for everyday goods'
        },
        apartment: {
            id: 'apartment',
            name: 'Apartment Building',
            cost: 500,
            income: 15,
            space: 2,
            population: 10,
            type: 'residential',
            category: 'basic',
            color: '#7986CB',
            icon: '🏢',
            description: 'Houses multiple families for stable income'
        },
        
        // Advanced buildings
        restaurant: {
            id: 'restaurant',
            name: 'Restaurant',
            cost: 1000,
            income: 25,
            space: 2,
            population: 5,
            type: 'commercial',
            category: 'advanced',
            color: '#E57373',
            icon: '🍽️',
            description: 'Full-service dining establishment'
        },
        office: {
            id: 'office',
            name: 'Office Building',
            cost: 2000,
            income: 40,
            space: 2,
            population: 15,
            type: 'commercial',
            category: 'advanced',
            color: '#64B5F6',
            icon: '🏛️',
            description: 'Corporate offices with high income'
        },
        factory: {
            id: 'factory',
            name: 'Factory',
            cost: 5000,
            income: 75,
            space: 3,
            population: 20,
            type: 'industrial',
            category: 'advanced',
            color: '#90A4AE',
            icon: '🏭',
            description: 'Industrial production facility'
        },
        mall: {
            id: 'mall',
            name: 'Shopping Mall',
            cost: 10000,
            income: 150,
            space: 4,
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
    autoSaveInterval: 30000
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
    
    // Map elements
    currentMap: document.getElementById('current-map'),
    mapNameDisplay: document.getElementById('map-name-display'),
    mapDescription: document.getElementById('map-description'),
    nextMapPrice: document.getElementById('next-map-price'),
    mapProgress: document.getElementById('map-progress'),
    
    // Containers
    landGrid: document.getElementById('land-grid'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    
    // Drag & Drop
    dragPreview: document.getElementById('drag-preview'),
    dragGhost: document.getElementById('drag-ghost'),
    dragInstruction: document.getElementById('drag-instruction'),
    
    // Buttons
    clickButton: document.getElementById('click-button'),
    buyLandBtn: document.getElementById('buy-land-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    resetBtn: document.getElementById('reset-btn'),
    clearDragBtn: document.getElementById('clear-drag-btn'),
    helpBtn: document.getElementById('help-btn'),
    statsBtn: document.getElementById('stats-btn'),
    
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
    console.log('Initializing Mini City Tycoon...');
    
    // Load saved game
    loadGame();
    
    // Setup game systems
    setupEventListeners();
    setupDragAndDrop();
    renderLandGrid();
    renderBuildingsShop();
    renderUpgrades();
    updateMapDisplay();
    updateDisplay();
    
    // Start game loops
    startGameLoops();
    
    // Show welcome message
    showNotification('Welcome to Mini City Tycoon! Drag buildings from the shop to the map.', 'success');
    
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
    elements.clearDragBtn.addEventListener('click', clearDragging);
    elements.helpBtn.addEventListener('click', showHelp);
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

// Setup Drag and Drop System
function setupDragAndDrop() {
    // Prevent default drag behaviors
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
    
    // Mouse move for dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events for mobile
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
}

// Handle Mouse Move for Dragging
function handleMouseMove(e) {
    if (!gameState.draggingBuilding) return;
    
    const mouseX = e.clientX || (e.touches && e.touches[0].clientX);
    const mouseY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (!mouseX || !mouseY) return;
    
    // Update drag ghost position
    updateDragGhost(mouseX, mouseY);
    
    // Update drag preview on map
    updateDragPreview(mouseX, mouseY);
}

// Handle Mouse Up (Drop)
function handleMouseUp(e) {
    if (!gameState.draggingBuilding) return;
    
    const mouseX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const mouseY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
    
    if (mouseX && mouseY) {
        tryPlaceBuilding(mouseX, mouseY);
    }
    
    // Clear dragging state
    clearDragging();
}

// Handle Touch Move
function handleTouchMove(e) {
    if (!gameState.draggingBuilding) return;
    e.preventDefault();
    handleMouseMove(e);
}

// Start Dragging a Building
function startDraggingBuilding(buildingId, e) {
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
    
    // Set dragging state
    gameState.draggingBuilding = {
        template: template,
        buildingId: buildingId
    };
    
    // Get start position
    const rect = e.target.getBoundingClientRect();
    gameState.dragStartPos = {
        x: e.clientX || (e.touches && e.touches[0].clientX),
        y: e.clientY || (e.touches && e.touches[0].clientY)
    };
    
    gameState.dragOffset = {
        x: gameState.dragStartPos.x - rect.left,
        y: gameState.dragStartPos.y - rect.top
    };
    
    // Update UI
    e.target.classList.add('dragging');
    showDragGhost(template);
    showDragPreview();
    
    // Update instruction
    elements.dragInstruction.textContent = 'Drag to an empty green plot';
}

// Update Drag Ghost
function updateDragGhost(mouseX, mouseY) {
    if (!gameState.draggingBuilding || !elements.dragGhost) return;
    
    elements.dragGhost.style.left = `${mouseX - gameState.dragOffset.x}px`;
    elements.dragGhost.style.top = `${mouseY - gameState.dragOffset.y}px`;
}

// Show Drag Ghost
function showDragGhost(template) {
    if (!elements.dragGhost) return;
    
    elements.dragGhost.innerHTML = `
        <div class="drag-ghost-content">
            <div class="drag-ghost-icon" style="background: ${template.color}">
                ${template.icon}
            </div>
            <div class="drag-ghost-name">${template.name}</div>
            <div class="drag-ghost-cost">$${template.cost}</div>
        </div>
    `;
    
    elements.dragGhost.classList.add('show');
}

// Hide Drag Ghost
function hideDragGhost() {
    if (!elements.dragGhost) return;
    elements.dragGhost.classList.remove('show');
}

// Show Drag Preview
function showDragPreview() {
    if (!elements.dragPreview) return;
    elements.dragPreview.classList.add('show');
}

// Hide Drag Preview
function hideDragPreview() {
    if (!elements.dragPreview) return;
    elements.dragPreview.classList.remove('show');
}

// Update Drag Preview
function updateDragPreview(mouseX, mouseY) {
    if (!gameState.draggingBuilding || !elements.dragPreview) return;
    
    const mapRect = elements.landGrid.getBoundingClientRect();
    const relativeX = mouseX - mapRect.left;
    const relativeY = mouseY - mapRect.top;
    
    // Check if mouse is over the map
    if (relativeX < 0 || relativeY < 0 || 
        relativeX > mapRect.width || relativeY > mapRect.height) {
        elements.dragPreview.style.display = 'none';
        return;
    }
    
    // Calculate which plot we're over
    const plotSize = mapRect.width / 8; // 8x8 grid
    const plotX = Math.floor(relativeX / plotSize);
    const plotY = Math.floor(relativeY / plotSize);
    
    // Check if plot is valid
    const plotIndex = plotY * 8 + plotX;
    const isValid = isValidPlotForBuilding(plotIndex);
    
    // Update preview position and style
    elements.dragPreview.style.display = 'block';
    elements.dragPreview.style.left = `${plotX * plotSize}px`;
    elements.dragPreview.style.top = `${plotY * plotSize}px`;
    elements.dragPreview.style.width = `${plotSize}px`;
    elements.dragPreview.style.height = `${plotSize}px`;
    
    if (isValid) {
        elements.dragPreview.classList.remove('invalid');
        elements.dragPreview.classList.add('valid');
        elements.dragPreview.style.backgroundColor = 'rgba(16, 185, 129, 0.3)';
    } else {
        elements.dragPreview.classList.remove('valid');
        elements.dragPreview.classList.add('invalid');
        elements.dragPreview.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
    }
    
    // Store current hover plot
    gameState.hoverPlot = { x: plotX, y: plotY, index: plotIndex, valid: isValid };
}

// Check if Plot is Valid for Building
function isValidPlotForBuilding(plotIndex) {
    if (!gameState.draggingBuilding) return false;
    
    const template = gameState.draggingBuilding.template;
    
    // Check if plot exists
    if (plotIndex >= gameState.totalLand) return false;
    
    // Check if plot is already occupied
    const existingBuilding = gameState.buildings.find(b => b.plotIndex === plotIndex);
    if (existingBuilding) return false;
    
    // Check if plot is purchased
    const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
    if (!plot || !plot.classList.contains('purchased')) return false;
    
    return true;
}

// Try to Place Building
function tryPlaceBuilding(mouseX, mouseY) {
    if (!gameState.draggingBuilding || !gameState.hoverPlot) return;
    
    if (gameState.hoverPlot.valid) {
        placeBuilding(gameState.draggingBuilding.buildingId, gameState.hoverPlot.index);
    } else {
        showNotification('Cannot place building here! Make sure the plot is purchased and empty.', 'error');
    }
}

// Place Building on Plot
function placeBuilding(buildingId, plotIndex) {
    const template = gameState.buildingTemplates[buildingId];
    
    // Final validation
    if (gameState.money < template.cost) {
        showNotification(`Not enough money! Need $${template.cost}`, 'error');
        return;
    }
    
    if (gameState.usedLand + template.space > gameState.totalLand) {
        showNotification('Not enough land! Buy more land first.', 'error');
        return;
    }
    
    // Create building
    const building = {
        ...JSON.parse(JSON.stringify(template)),
        plotIndex: plotIndex,
        id: `${template.id}_${Date.now()}`,
        level: 1,
        placedAt: Date.now()
    };
    
    // Deduct cost
    gameState.money -= template.cost;
    gameState.usedLand += template.space;
    
    // Add to buildings
    gameState.buildings.push(building);
    
    // Update UI
    renderLandGrid();
    renderBuildingsShop();
    updateDisplay();
    
    showNotification(`Placed ${template.name}!`, 'success');
}

// Clear Dragging State
function clearDragging() {
    gameState.draggingBuilding = null;
    gameState.hoverPlot = null;
    
    // Remove dragging class from all building items
    document.querySelectorAll('.building-item').forEach(item => {
        item.classList.remove('dragging');
    });
    
    // Hide drag elements
    hideDragGhost();
    hideDragPreview();
    
    // Reset instruction
    elements.dragInstruction.textContent = 'Drag buildings from shop to map';
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
        totalIncome += building.income;
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

// Buy Land
function buyLand() {
    const cost = gameState.landCost;
    
    if (gameState.money >= cost) {
        gameState.money -= cost;
        
        // Find next available plot
        let plotPlaced = false;
        for (let i = 0; i < gameState.totalLand; i++) {
            const plot = document.querySelector(`.land-plot[data-index="${i}"]`);
            if (plot && !plot.classList.contains('purchased') && !plot.classList.contains('occupied')) {
                // Mark this plot as purchased
                plot.classList.add('purchased');
                plotPlaced = true;
                break;
            }
        }
        
        // If all current plots are purchased, add more land
        if (!plotPlaced) {
            gameState.totalLand += 4;
            renderLandGrid();
        }
        
        // Increase land cost for next purchase
        gameState.landCost = Math.floor(gameState.landCost * 1.5);
        
        updateDisplay();
        showNotification('Purchased land plot! Drag buildings to green plots.', 'success');
    } else {
        showNotification('Not enough money to buy land!', 'error');
    }
}

// Render Land Grid
function renderLandGrid() {
    elements.landGrid.innerHTML = '';
    
    // Create 8x8 grid (64 total possible plots)
    for (let i = 0; i < 64; i++) {
        const plot = document.createElement('div');
        plot.className = 'land-plot';
        plot.dataset.index = i;
        
        // Check if plot is available (within totalLand)
        if (i < gameState.totalLand) {
            // Check if plot has a building
            const building = gameState.buildings.find(b => b.plotIndex === i);
            
            if (building) {
                plot.classList.add('occupied');
                plot.style.color = building.color;
                
                plot.innerHTML = `
                    <div class="plot-building">
                        <div class="building-visual" style="background: ${building.color}"></div>
                        <div class="building-label">${building.icon}</div>
                    </div>
                `;
                
                plot.addEventListener('click', () => showBuildingModal(building));
            } else {
                // Mark purchased plots (first 4 plots are free)
                if (i < 4) {
                    plot.classList.add('purchased');
                }
                
                plot.addEventListener('click', () => selectPlot(i));
            }
        } else {
            plot.classList.add('locked');
        }
        
        elements.landGrid.appendChild(plot);
    }
    
    updateLandDisplay();
}

// Select Plot (for buying)
function selectPlot(plotIndex) {
    const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
    
    if (plot.classList.contains('purchased')) {
        showNotification('This plot is already purchased!', 'info');
    } else if (plot.classList.contains('locked')) {
        showNotification('This plot is not available yet!', 'error');
    } else {
        // Show buying option
        if (confirm(`Buy this land plot for $${gameState.landCost}?`)) {
            buyLand();
        }
    }
}

// Render Buildings Shop
function renderBuildingsShop(filter = 'all') {
    elements.buildingsContainer.innerHTML = '';
    
    Object.values(gameState.buildingTemplates).forEach(template => {
        // Apply filter
        if (filter !== 'all' && template.category !== filter) {
            return;
        }
        
        const canAfford = gameState.money >= template.cost;
        const hasSpace = gameState.usedLand + template.space <= gameState.totalLand;
        
        const item = document.createElement('div');
        item.className = `building-item ${canAfford && hasSpace ? '' : 'disabled'}`;
        item.dataset.buildingId = template.id;
        
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
                        <span>${template.space} plot${template.space > 1 ? 's' : ''}</span>
                        •
                        <span>👤 ${template.population}</span>
                    </div>
                </div>
                <div class="building-cost">$${template.cost}</div>
            </div>
            <div class="drag-handle">
                <i class="fas fa-arrows-alt"></i>
            </div>
        `;
        
        if (canAfford && hasSpace) {
            // Add drag event listeners
            item.addEventListener('mousedown', (e) => startDraggingBuilding(template.id, e));
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startDraggingBuilding(template.id, e);
            }, { passive: false });
        }
        
        elements.buildingsContainer.appendChild(item);
    });
}

// Render Upgrades
function renderUpgrades() {
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
                <div class="building-cost">${upgrade.purchased ? '✓' : `$${upgrade.cost}`}</div>
            </div>
        `;
        
        if (canAfford) {
            item.addEventListener('click', () => buyUpgrade(upgrade.id));
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
        if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
        return `$${Math.floor(amount)}`;
    };
    
    // Update stats
    elements.money.textContent = formatMoney(gameState.money);
    elements.perSecond.textContent = formatMoney(gameState.perSecond);
    elements.perClick.textContent = formatMoney(gameState.perClick);
    elements.landUsed.textContent = gameState.usedLand;
    elements.landTotal.textContent = gameState.totalLand;
    elements.landCost.textContent = gameState.landCost;
    elements.buildingCount.textContent = gameState.buildings.length;
    elements.population.textContent = gameState.population;
    elements.totalClicks.textContent = gameState.totalClicks;
    elements.clickRevenue.textContent = formatMoney(gameState.clickRevenue);
    elements.clickValueDisplay.textContent = gameState.perClick;
    
    // Update auto-clicker status
    const autoClickerStatus = document.getElementById('auto-click-status');
    if (autoClickerStatus) {
        autoClickerStatus.innerHTML = gameState.upgrades.autoClicker.purchased 
            ? '<i class="fas fa-robot"></i> Auto: ON'
            : '<i class="fas fa-robot"></i> Auto: OFF';
    }
}

// Update Land Display
function updateLandDisplay() {
    const purchasedPlots = document.querySelectorAll('.land-plot.purchased').length;
    const percent = Math.min(100, (gameState.usedLand / purchasedPlots) * 100) || 0;
    elements.landFill.style.width = `${percent}%`;
    elements.landPercent.textContent = purchasedPlots > 0 ? `${Math.round(percent)}%` : '0%';
}

// Update Map Display
function updateMapDisplay() {
    const currentMap = gameState.maps[gameState.currentMap];
    
    elements.currentMap.textContent = currentMap.name;
    elements.mapNameDisplay.textContent = `${currentMap.name} District`;
    elements.mapDescription.textContent = currentMap.description;
    
    elements.nextMapPrice.textContent = 'Coming Soon';
    elements.mapProgress.style.width = '100%';
}

// Show Building Modal
function showBuildingModal(building) {
    const template = gameState.buildingTemplates[building.id.split('_')[0]];
    
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
                    <strong>$${building.income}/s</strong>
                </div>
                <div class="stat">
                    <span>Space</span>
                    <strong>${building.space} plot${building.space > 1 ? 's' : ''}</strong>
                </div>
                <div class="stat">
                    <span>Population</span>
                    <strong>${building.population}</strong>
                </div>
                <div class="stat">
                    <span>Level</span>
                    <strong>${building.level}</strong>
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
    
    elements.buildingModal.style.display = 'flex';
}

// Upgrade Building
function upgradeBuilding(buildingId) {
    const building = gameState.buildings.find(b => b.id === buildingId);
    const upgradeCost = Math.floor(building.cost * 1.5);
    
    if (gameState.money >= upgradeCost) {
        gameState.money -= upgradeCost;
        building.level++;
        building.income = Math.floor(building.income * 1.5);
        building.cost = upgradeCost;
        
        updateDisplay();
        renderLandGrid();
        elements.buildingModal.style.display = 'none';
        showNotification(`${building.name} upgraded to level ${building.level}!`, 'success');
    } else {
        showNotification(`Need $${upgradeCost} to upgrade!`, 'error');
    }
}

// Sell Building
function sellBuilding(buildingId) {
    const building = gameState.buildings.find(b => b.id === buildingId);
    const sellPrice = Math.floor(building.cost * 0.7);
    
    if (confirm(`Sell ${building.name} for $${sellPrice}?`)) {
        gameState.money += sellPrice;
        gameState.usedLand -= building.space;
        gameState.buildings = gameState.buildings.filter(b => b.id !== buildingId);
        
        renderLandGrid();
        renderBuildingsShop();
        updateDisplay();
        elements.buildingModal.style.display = 'none';
        
        showNotification(`Sold ${building.name} for $${sellPrice}!`, 'success');
    }
}

// Show Help
function showHelp() {
    alert(`
=== MINI CITY TYCOON - DRAG & DROP GUIDE ===

HOW TO PLAY:
1. Click the main button to earn money
2. Drag buildings from the SHOP to the MAP
3. Green plots are purchased land - drag buildings here
4. Click on buildings to manage/upgrade/sell them
5. Buy more land plots when you run out of space
6. Purchase upgrades for permanent bonuses

DRAG & DROP:
- Click and hold a building in the shop
- Drag it to a green plot on the map
- Release to place the building
- Red highlight means invalid location
- Green highlight means valid location

TIP: Start with Lemonade Stands on purchased plots!
    `);
}

// Show Stats
function showStats() {
    const purchasedPlots = document.querySelectorAll('.land-plot.purchased').length;
    const emptyPlots = purchasedPlots - gameState.usedLand;
    
    alert(`
=== GAME STATISTICS ===

Total Clicks: ${gameState.totalClicks}
Click Revenue: $${gameState.clickRevenue}
Play Time: ${formatTime(gameState.playTime)}
Buildings Owned: ${gameState.buildings.length}
Total Population: ${gameState.population}
Land Usage: ${gameState.usedLand}/${purchasedPlots} plots
Empty Plots Available: ${emptyPlots}

Income Breakdown:
- Click Income: $${gameState.perClick}/click
- Passive Income: $${gameState.perSecond}/sec
- Total Money: $${gameState.money}

Upgrades Purchased: ${Object.values(gameState.upgrades).filter(u => u.purchased).length}/3
    `);
}

// Save Game
function saveGame() {
    const saveData = {
        ...gameState,
        lastSave: Date.now()
    };
    
    localStorage.setItem('miniCityTycoonSave', JSON.stringify(saveData));
    showNotification('Game saved successfully!', 'success');
}

// Auto Save
function autoSave() {
    saveGame();
}

// Load Game
function loadGame() {
    const saved = localStorage.getItem('miniCityTycoonSave');
    
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            
            // Merge saved state
            Object.keys(savedState).forEach(key => {
                if (gameState[key] !== undefined) {
                    if (typeof gameState[key] === 'object' && !Array.isArray(gameState[key])) {
                        Object.assign(gameState[key], savedState[key]);
                    } else {
                        gameState[key] = savedState[key];
                    }
                }
            });
            
            showNotification('Game loaded successfully!', 'success');
        } catch (error) {
            console.error('Error loading game:', error);
            showNotification('Error loading saved game', 'error');
        }
    }
}

// Reset Game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost!')) {
        localStorage.removeItem('miniCityTycoonSave');
        
        // Reset to initial state
        Object.assign(gameState, {
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
            currentMap: 'downtown',
            buildings: [],
            draggingBuilding: null,
            dragStartPos: { x: 0, y: 0 },
            dragOffset: { x: 0, y: 0 },
            lastSave: Date.now(),
            lastUpdate: Date.now()
        });
        
        // Reset maps
        Object.keys(gameState.maps).forEach(key => {
            gameState.maps[key].unlocked = key === 'downtown';
        });
        
        // Reset upgrades
        Object.values(gameState.upgrades).forEach(upgrade => {
            upgrade.purchased = false;
        });
        
        renderLandGrid();
        renderBuildingsShop();
        renderUpgrades();
        updateMapDisplay();
        updateDisplay();
        
        showNotification('Game reset to initial state!', 'success');
    }
}

// Update Play Time
function updatePlayTime() {
    gameState.playTime++;
    elements.playTime.textContent = formatTime(gameState.playTime);
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
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
    
    // Create floating text
    const floatingText = document.createElement('div');
    floatingText.textContent = `+$${gameState.perClick}`;
    floatingText.style.position = 'absolute';
    floatingText.style.color = '#FFD700';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '1.2rem';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.animation = 'floatUp 1s ease-out forwards';
    
    const rect = button.getBoundingClientRect();
    floatingText.style.left = `${rect.left + rect.width / 2}px`;
    floatingText.style.top = `${rect.top}px`;
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        document.body.removeChild(floatingText);
    }, 1000);
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = elements.notification;
    const content = notification.querySelector('.notification-content');
    
    content.querySelector('.notification-text').textContent = message;
    
    // Set icon based on type
    const icon = content.querySelector('.notification-icon');
    if (type === 'success') {
        icon.style.color = '#4ade80';
        icon.textContent = '✓';
    } else if (type === 'error') {
        icon.style.color = '#ef4444';
        icon.textContent = '⚠';
    } else {
        icon.style.color = '#3b82f6';
        icon.textContent = 'ℹ';
    }
    
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);
