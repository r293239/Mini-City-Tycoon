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
    
    // Map elements
    currentMap: document.getElementById('current-map'),
    mapNameDisplay: document.getElementById('map-name-display'),
    mapDescription: document.getElementById('map-description'),
    
    // Containers
    landGrid: document.getElementById('land-grid'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    
    // Drag & Drop
    dragPreview: document.getElementById('drag-preview'),
    dragGhost: document.getElementById('drag-ghost'),
    dragInstruction: document.getElementById('drag-instruction'),
    selectedBuildingInfo: document.getElementById('selected-building-info'),
    draggingName: document.getElementById('dragging-name'),
    
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
    if (gameState.isInitialized) return;
    
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
    
    gameState.isInitialized = true;
    
    // Show welcome message
    showNotification('Welcome to Mini City Tycoon! Drag buildings from the shop to green plots.', 'success');
    
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
    
    // Prevent context menu on drag ghost
    elements.dragGhost?.addEventListener('contextmenu', (e) => e.preventDefault());
}

// Setup Drag and Drop System
function setupDragAndDrop() {
    // Prevent default drag behaviors
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        return false;
    });
    
    document.addEventListener('drop', (e) => {
        e.preventDefault();
        return false;
    });
    
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
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Update drag ghost position
    updateDragGhost(mouseX, mouseY);
    
    // Update drag preview on map
    updateDragPreview(mouseX, mouseY);
}

// Handle Touch Move
function handleTouchMove(e) {
    if (!gameState.draggingBuilding || e.touches.length !== 1) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const mouseX = touch.clientX;
    const mouseY = touch.clientY;
    
    // Update drag ghost position
    updateDragGhost(mouseX, mouseY);
    
    // Update drag preview on map
    updateDragPreview(mouseX, mouseY);
}

// Handle Mouse Up (Drop)
function handleMouseUp(e) {
    if (!gameState.draggingBuilding) return;
    
    let mouseX, mouseY;
    
    if (e.type === 'touchend') {
        if (e.changedTouches.length !== 1) return;
        const touch = e.changedTouches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
    } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    if (mouseX && mouseY) {
        tryPlaceBuilding(mouseX, mouseY);
    }
    
    // Clear dragging state
    clearDragging();
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
    
    // Check if there are available purchased plots
    const purchasedPlots = document.querySelectorAll('.land-plot.purchased:not(.occupied)');
    if (purchasedPlots.length === 0) {
        showNotification('No available plots! Buy more land or sell buildings.', 'error');
        return;
    }
    
    // Set dragging state
    gameState.draggingBuilding = {
        template: template,
        buildingId: buildingId
    };
    
    // Get start position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX && clientY) {
        gameState.dragStartPos = {
            x: clientX,
            y: clientY
        };
        
        const rect = e.target.closest('.building-item').getBoundingClientRect();
        gameState.dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
        
        // Update UI
        e.target.closest('.building-item').classList.add('dragging');
        showDragGhost(template);
        showDragPreview();
        
        // Show selected building info
        elements.selectedBuildingInfo.style.display = 'block';
        elements.draggingName.textContent = template.name;
        
        // Update instruction
        elements.dragInstruction.textContent = 'Drag to a green plot';
        elements.dragInstruction.style.color = '#4cc9f0';
    }
}

// Update Drag Ghost
function updateDragGhost(mouseX, mouseY) {
    if (!gameState.draggingBuilding || !elements.dragGhost) return;
    
    elements.dragGhost.style.left = `${mouseX}px`;
    elements.dragGhost.style.top = `${mouseY}px`;
    elements.dragGhost.style.transform = 'translate(-50%, -50%)';
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
    elements.dragPreview.style.display = 'none';
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
    const gridSize = Math.sqrt(gameState.totalLand);
    const plotSize = mapRect.width / gridSize;
    const plotX = Math.floor(relativeX / plotSize);
    const plotY = Math.floor(relativeY / plotSize);
    
    // Check if plot is valid
    const plotIndex = plotY * gridSize + plotX;
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
        elements.dragPreview.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
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
    
    // Check if plot exists and is within totalLand
    if (plotIndex < 0 || plotIndex >= gameState.totalLand) return false;
    
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
        showNotification('Cannot place building here! Plot must be purchased and empty.', 'error');
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
    
    const existingBuilding = gameState.buildings.find(b => b.plotIndex === plotIndex);
    if (existingBuilding) {
        showNotification('This plot is already occupied!', 'error');
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
    
    showNotification(`Built ${template.name}! Income: $${template.income}/sec`, 'success');
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
    
    // Hide selected building info
    elements.selectedBuildingInfo.style.display = 'none';
    
    // Reset instruction
    elements.dragInstruction.textContent = 'Click and drag buildings';
    elements.dragInstruction.style.color = '';
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
    
    // Update animations or visual effects here
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
        showNotification('Purchased land plot! Drag buildings to green plots.', 'success');
    } else {
        showNotification(`Not enough money to buy land! Need $${cost}`, 'error');
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
            // First 4 plots are free, mark as purchased
            if (i < 4) {
                plot.classList.add('purchased');
                plot.innerHTML = '<div class="plot-plus">+</div>';
            } else {
                plot.innerHTML = '<div class="plot-plus" style="opacity:0.3;">+</div>';
            }
            
            plot.addEventListener('click', () => handlePlotClick(i));
        }
        
        elements.landGrid.appendChild(plot);
    }
    
    updateLandDisplay();
}

// Handle Plot Click
function handlePlotClick(plotIndex) {
    const plot = document.querySelector(`.land-plot[data-index="${plotIndex}"]`);
    
    if (plot.classList.contains('occupied')) {
        // Already handled by building click
        return;
    } else if (plot.classList.contains('purchased')) {
        showNotification('Empty plot - drag a building here!', 'info');
    } else {
        // Offer to buy the plot
        if (confirm(`Buy this land plot for $${gameState.landCost}?`)) {
            buyLand();
        }
    }
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
        const hasAvailablePlots = purchasedPlots > 0;
        
        const item = document.createElement('div');
        item.className = `building-item ${canAfford && hasSpace && hasAvailablePlots ? '' : 'disabled'}`;
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
        `;
        
        if (canAfford && hasSpace && hasAvailablePlots) {
            // Add drag event listeners
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                startDraggingBuilding(template.id, e);
            });
            
            item.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    e.preventDefault();
                    startDraggingBuilding(template.id, e);
                }
            }, { passive: false });
        } else {
            if (!hasAvailablePlots) {
                item.title = "No available plots! Buy more land.";
            } else if (!canAfford) {
                item.title = `Need $${template.cost - gameState.money} more`;
            } else if (!hasSpace) {
                item.title = "Not enough land space!";
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
        if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
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

// Update Map Display
function updateMapDisplay() {
    if (elements.currentMap) elements.currentMap.textContent = 'Downtown';
    if (elements.mapNameDisplay) elements.mapNameDisplay.textContent = 'Downtown District';
    if (elements.mapDescription) elements.mapDescription.textContent = 'A bustling urban center perfect for starting your empire';
}

// Show Building Modal
function showBuildingModal(building) {
    const template = gameState.buildingTemplates[building.id.split('_')[0]];
    
    if (!elements.modalContent) return;
    
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
        building.income = Math.floor(building.income * 1.2); // 20% increase per level
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
        
        showNotification(`Sold ${building.name} for $${sellPrice}!`, 'success');
    }
}

// Show Help
function showHelp() {
    alert(`
=== MINI CITY TYCOON - HOW TO PLAY ===

1. CLICK the main button to earn money
2. BUY BUILDINGS from the shop
3. DRAG BUILDINGS to green plots on the map
4. BUILDINGS generate passive income every second
5. UPGRADE buildings by clicking on them
6. BUY MORE LAND when you run out of space
7. PURCHASE upgrades for permanent bonuses

CONTROLS:
- Drag buildings from shop to map
- Click buildings to manage/upgrade/sell
- Click empty plots to buy land
- Green plots = available for building
- Red plots = locked/not purchased

TIP: Start with Lemonade Stands on green plots!
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
Empty Plots: ${emptyPlots}

Income Breakdown:
- Click Income: $${gameState.perClick}/click
- Passive Income: $${gameState.perSecond}/sec
- Total Money: $${gameState.money}

Upgrades Purchased: ${Object.values(gameState.upgrades).filter(u => u.purchased).length}/3
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
        gameState.draggingBuilding = null;
        
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
    
    // Create floating text
    const floatingText = document.createElement('div');
    floatingText.textContent = `+$${gameState.perClick}`;
    floatingText.style.position = 'fixed';
    floatingText.style.color = '#FFD700';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '1.2rem';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.style.animation = 'floatUp 1s ease-out forwards';
    
    const rect = button.getBoundingClientRect();
    floatingText.style.left = `${rect.left + rect.width / 2}px`;
    floatingText.style.top = `${rect.top}px`;
    floatingText.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        if (floatingText.parentNode) {
            document.body.removeChild(floatingText);
        }
    }, 1000);
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

// Add CSS for floatUp animation
if (!document.querySelector('#floatUpStyle')) {
    const style = document.createElement('style');
    style.id = 'floatUpStyle';
    style.textContent = `
        @keyframes floatUp {
            0% {
                opacity: 1;
                transform: translate(-50%, 0);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50px);
            }
        }
    `;
    document.head.appendChild(style);
}
