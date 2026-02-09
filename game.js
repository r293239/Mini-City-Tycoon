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
        },
        suburbs: { 
            unlocked: false, 
            name: 'Suburbs', 
            description: 'Quiet residential area with space for expansion',
            incomeMultiplier: 1.2,
            landMultiplier: 1.5,
            unlockCost: 10000
        },
        industrial: { 
            unlocked: false, 
            name: 'Industrial Zone', 
            description: 'Perfect for factories and manufacturing',
            incomeMultiplier: 1.5,
            landMultiplier: 2.0,
            unlockCost: 50000
        },
        beachfront: { 
            unlocked: false, 
            name: 'Beachfront', 
            description: 'Premium location for tourism and luxury',
            incomeMultiplier: 2.0,
            landMultiplier: 1.0,
            unlockCost: 200000
        },
        mountain: { 
            unlocked: false, 
            name: 'Mountain Resort', 
            description: 'Exclusive mountain resort with premium income',
            incomeMultiplier: 3.0,
            landMultiplier: 0.8,
            unlockCost: 1000000
        }
    },
    
    // Buildings data
    buildings: [],
    buildingToPlace: null,
    
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
        },
        skyscraper: {
            id: 'skyscraper',
            name: 'Skyscraper',
            cost: 25000,
            income: 300,
            space: 4,
            population: 100,
            type: 'residential',
            category: 'advanced',
            color: '#4A6572',
            icon: '🏙️',
            description: 'Massive residential and commercial tower'
        },
        stadium: {
            id: 'stadium',
            name: 'Stadium',
            cost: 50000,
            income: 500,
            space: 6,
            population: 200,
            type: 'entertainment',
            category: 'advanced',
            color: '#FFB74D',
            icon: '🏟️',
            description: 'Sports and entertainment venue'
        },
        airport: {
            id: 'airport',
            name: 'Airport',
            cost: 100000,
            income: 1000,
            space: 8,
            population: 500,
            type: 'transport',
            category: 'advanced',
            color: '#FFF176',
            icon: '✈️',
            description: 'Major transportation hub'
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
        },
        buildingBoost: {
            id: 'buildingBoost',
            name: 'Building Boost',
            description: 'All buildings produce 25% more',
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
    autoSaveInterval: 30000 // 30 seconds
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
    cityGrid: document.getElementById('city-grid'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    
    // Buttons
    clickButton: document.getElementById('click-button'),
    buyLandBtn: document.getElementById('buy-land-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    resetBtn: document.getElementById('reset-btn'),
    prestigeBtn: document.getElementById('prestige-btn'),
    clearBtn: document.getElementById('clear-btn'),
    helpBtn: document.getElementById('help-btn'),
    statsBtn: document.getElementById('stats-btn'),
    
    // Modals
    buildingModal: document.getElementById('building-modal'),
    mapModal: document.getElementById('map-unlock-modal'),
    modalContent: document.getElementById('modal-content'),
    
    // Time
    lastSave: document.getElementById('last-save'),
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
    renderCityGrid();
    renderBuildingsShop();
    renderUpgrades();
    updateMapDisplay();
    updateDisplay();
    
    // Start game loops
    startGameLoops();
    
    // Show welcome message
    showNotification('Welcome to Mini City Tycoon! Start building your city.', 'success');
    
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
    elements.prestigeBtn.addEventListener('click', prestige);
    elements.clearBtn.addEventListener('click', clearSelection);
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
    
    // Map switch button
    document.getElementById('switch-map-btn')?.addEventListener('click', switchToNewMap);
    
    // Window close modal on outside click
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
    
    // Update time-based calculations here if needed
}

// Calculate Passive Income
function calculateIncome() {
    let totalIncome = 0;
    let totalPopulation = 0;
    
    gameState.buildings.forEach(building => {
        let buildingIncome = building.income;
        
        // Apply map multiplier
        const mapMultiplier = gameState.maps[gameState.currentMap].incomeMultiplier;
        buildingIncome *= mapMultiplier;
        
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
    animateClick();
    
    // Check for map unlocks
    checkMapUnlocks();
    
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
        gameState.totalLand += 4; // Add a 2x2 plot
        
        // Increase land cost for next purchase
        gameState.landCost = Math.floor(gameState.landCost * 1.5);
        
        renderCityGrid();
        updateDisplay();
        showNotification('Purchased new land plot!', 'success');
    } else {
        showNotification('Not enough money to buy land!', 'error');
    }
}

// Render City Grid
function renderCityGrid() {
    elements.cityGrid.innerHTML = '';
    
    // Calculate grid size (always square)
    const gridSize = Math.ceil(Math.sqrt(gameState.totalLand));
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const plot = document.createElement('div');
        plot.className = 'land-plot';
        plot.dataset.index = i;
        
        if (i < gameState.totalLand) {
            // Find building on this plot
            const building = gameState.buildings.find(b => b.plotIndex === i);
            
            if (building) {
                plot.classList.add('occupied');
                plot.style.color = building.color;
                
                plot.innerHTML = `
                    <div class="building-preview">
                        <div class="building-shape" style="height: ${60 + (building.space * 10)}%; background: ${building.color}"></div>
                        <div class="building-name">${building.icon}</div>
                    </div>
                `;
                
                plot.addEventListener('click', () => showBuildingModal(building));
            } else {
                plot.classList.add('empty');
                plot.innerHTML = `<div class="plot-plus">+</div>`;
                
                plot.addEventListener('click', () => selectPlotForBuilding(i));
            }
        } else {
            plot.classList.add('locked');
            plot.innerHTML = `<div class="plot-plus">🔒</div>`;
        }
        
        elements.cityGrid.appendChild(plot);
    }
    
    // Update grid columns
    elements.cityGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    updateLandDisplay();
}

// Select Plot for Building
function selectPlotForBuilding(plotIndex) {
    if (gameState.buildingToPlace) {
        const template = gameState.buildingTemplates[gameState.buildingToPlace];
        
        // Check if we can afford it
        if (gameState.money < template.cost) {
            showNotification(`Not enough money! Need $${template.cost}`, 'error');
            return;
        }
        
        // Check if there's enough space
        if (gameState.usedLand + template.space > gameState.totalLand) {
            showNotification('Not enough land! Buy more land first.', 'error');
            return;
        }
        
        // Create building
        const building = {
            ...JSON.parse(JSON.stringify(template)),
            plotIndex: plotIndex,
            id: `${template.id}_${Date.now()}`,
            level: 1
        };
        
        // Deduct cost
        gameState.money -= template.cost;
        gameState.usedLand += template.space;
        
        // Add to buildings
        gameState.buildings.push(building);
        
        // Clear selection
        gameState.buildingToPlace = null;
        
        // Update UI
        renderCityGrid();
        renderBuildingsShop();
        updateDisplay();
        
        showNotification(`Built ${template.name}!`, 'success');
    } else {
        showNotification('Select a building from the shop first!', 'error');
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
        
        if (canAfford && hasSpace) {
            item.addEventListener('click', () => {
                gameState.buildingToPlace = template.id;
                showNotification(`Selected ${template.name}. Click on an empty plot to build!`, 'success');
            });
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
            case 'buildingMultiplier':
                // Already applied in calculateIncome
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
    
    // Update map display
    updateMapDisplay();
}

// Update Land Display
function updateLandDisplay() {
    const percent = Math.min(100, (gameState.usedLand / gameState.totalLand) * 100);
    elements.landFill.style.width = `${percent}%`;
    elements.landPercent.textContent = `${Math.round(percent)}%`;
}

// Update Map Display
function updateMapDisplay() {
    const currentMap = gameState.maps[gameState.currentMap];
    const nextMap = getNextMap();
    
    elements.currentMap.textContent = currentMap.name;
    elements.mapNameDisplay.textContent = `${currentMap.name} District`;
    elements.mapDescription.textContent = currentMap.description;
    
    if (nextMap) {
        elements.nextMapPrice.textContent = formatMoney(nextMap.unlockCost);
        
        // Calculate progress
        const progress = Math.min(100, (gameState.money / nextMap.unlockCost) * 100);
        elements.mapProgress.style.width = `${progress}%`;
    } else {
        elements.nextMapPrice.textContent = 'MAX';
        elements.mapProgress.style.width = '100%';
    }
}

// Get Next Map to Unlock
function getNextMap() {
    const maps = Object.values(gameState.maps);
    for (const map of maps) {
        if (!map.unlocked) {
            return map;
        }
    }
    return null;
}

// Check Map Unlocks
function checkMapUnlocks() {
    const nextMap = getNextMap();
    
    if (nextMap && gameState.money >= nextMap.unlockCost && !nextMap.unlocked) {
        unlockMap(nextMap);
    }
}

// Unlock Map
function unlockMap(map) {
    map.unlocked = true;
    
    // Show unlock modal
    const unlockModal = document.getElementById('map-unlock-modal');
    const mapCard = document.getElementById('unlocked-map-card');
    
    document.getElementById('unlocked-map-name').textContent = map.name;
    document.getElementById('unlock-bonus').textContent = `+${((map.incomeMultiplier - 1) * 100).toFixed(0)}% Income Bonus`;
    document.getElementById('unlock-description').textContent = map.description;
    
    // Set map icon based on name
    let icon = '🏙️';
    if (map.name.includes('Suburb')) icon = '🏘️';
    if (map.name.includes('Industrial')) icon = '🏭';
    if (map.name.includes('Beach')) icon = '🌊';
    if (map.name.includes('Mountain')) icon = '⛰️';
    mapCard.querySelector('.map-icon').textContent = icon;
    
    unlockModal.style.display = 'flex';
    showNotification(`New map unlocked: ${map.name}!`, 'success');
}

// Switch to New Map
function switchToNewMap() {
    const nextMap = getNextMap();
    if (nextMap) {
        gameState.currentMap = Object.keys(gameState.maps).find(key => 
            gameState.maps[key].name === nextMap.name
        );
        updateMapDisplay();
        document.getElementById('map-unlock-modal').style.display = 'none';
        showNotification(`Switched to ${nextMap.name}!`, 'success');
    }
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
    
    gameState.money += sellPrice;
    gameState.usedLand -= building.space;
    gameState.buildings = gameState.buildings.filter(b => b.id !== buildingId);
    
    renderCityGrid();
    renderBuildingsShop();
    updateDisplay();
    elements.buildingModal.style.display = 'none';
    
    showNotification(`Sold ${building.name} for $${sellPrice}!`, 'success');
}

// Prestige System
function prestige() {
    if (gameState.money >= 1000000) {
        if (confirm('Prestige will reset your progress but give you a permanent 2x income multiplier. Continue?')) {
            gameState.prestigeLevel = (gameState.prestigeLevel || 0) + 1;
            gameState.money = 1000;
            gameState.buildings = [];
            gameState.usedLand = 0;
            gameState.upgrades = JSON.parse(JSON.stringify(initialUpgrades));
            
            // Apply prestige multiplier to all future income
            const prestigeMultiplier = 1 + (gameState.prestigeLevel * 0.5);
            
            renderCityGrid();
            renderBuildingsShop();
            renderUpgrades();
            updateDisplay();
            
            showNotification(`Prestiged! All income now multiplied by ${prestigeMultiplier}x!`, 'success');
        }
    } else {
        showNotification('Need $1,000,000 to prestige!', 'error');
    }
}

// Clear Selection
function clearSelection() {
    gameState.buildingToPlace = null;
    showNotification('Building selection cleared.', 'info');
}

// Show Help
function showHelp() {
    alert(`
=== MINI CITY TYCOON GUIDE ===

1. CLICK the main button to earn money
2. BUY BUILDINGS from the shop
3. PLACE BUILDINGS on empty land plots
4. BUILDINGS generate passive income every second
5. UPGRADES boost your income and efficiency
6. BUY MORE LAND to expand your city
7. UNLOCK NEW MAPS by reaching money milestones
8. SAVE your progress automatically

TIP: Start with Lemonade Stands and Apartments!
    `);
}

// Show Stats
function showStats() {
    alert(`
=== GAME STATISTICS ===

Total Clicks: ${gameState.totalClicks}
Click Revenue: $${gameState.clickRevenue}
Play Time: ${formatTime(gameState.playTime)}
Buildings Owned: ${gameState.buildings.length}
Total Population: ${gameState.population}
Current Map: ${gameState.maps[gameState.currentMap].name}
Prestige Level: ${gameState.prestigeLevel || 0}

Income Breakdown:
- Click Income: $${gameState.perClick}/click
- Passive Income: $${gameState.perSecond}/sec
- Total Money: $${gameState.money}
    `);
}

// Save Game
function saveGame() {
    const saveData = {
        ...gameState,
        lastSave: Date.now()
    };
    
    localStorage.setItem('miniCityTycoonSave', JSON.stringify(saveData));
    elements.lastSave.textContent = 'Just now';
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
            buildingToPlace: null,
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
        
        renderCityGrid();
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

// Initial upgrades backup
const initialUpgrades = {
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
    },
    buildingBoost: {
        id: 'buildingBoost',
        name: 'Building Boost',
        description: 'All buildings produce 25% more',
        cost: 10000,
        purchased: false,
        effect: 'buildingMultiplier',
        value: 1.25,
        icon: '📈'
    }
};

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);
