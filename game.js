// Game State
const gameState = {
    money: 100,
    perClick: 1,
    perSecond: 0,
    totalLand: 10,
    usedLand: 0,
    landCost: 500,
    buildings: [],
    upgrades: {
        clickPower: { 
            name: "Double Click", 
            description: "Double your click value", 
            cost: 200, 
            purchased: false, 
            multiplier: 2,
            icon: "⚡"
        },
        landDiscount: { 
            name: "Land Discount", 
            description: "Reduce land cost by 20%", 
            cost: 1000, 
            purchased: false, 
            discount: 0.2,
            icon: "🏙️"
        },
        autoClicker: { 
            name: "Auto Clicker", 
            description: "Automatically click every second", 
            cost: 5000, 
            purchased: false,
            icon: "🤖"
        }
    },
    lastSave: Date.now()
};

// Building Templates
const buildingTemplates = {
    lemonadeStand: {
        id: "lemonadeStand",
        name: "Lemonade Stand",
        baseCost: 50,
        baseIncome: 2,
        space: 1,
        color1: "#FFD54F",
        color2: "#FFB300",
        icon: "🍋",
        type: "stand",
        menuOptions: [
            { name: "Basic Lemonade", incomeMultiplier: 1, cost: 0 },
            { name: "Premium Lemonade", incomeMultiplier: 1.5, cost: 100 },
            { name: "Lemonade + Cookies", incomeMultiplier: 2, cost: 300 }
        ],
        currentMenu: 0
    },
    apartment: {
        id: "apartment",
        name: "Apartment",
        baseCost: 200,
        baseIncome: 8,
        space: 2,
        color1: "#7986CB",
        color2: "#3F51B5",
        icon: "🏢",
        type: "residential",
        tenants: [
            { name: "Student", incomeMultiplier: 1, reliability: 0.9 },
            { name: "Professional", incomeMultiplier: 1.5, reliability: 0.95 },
            { name: "Business Owner", incomeMultiplier: 2.5, reliability: 0.8 }
        ],
        currentTenant: 0
    },
    restaurant: {
        id: "restaurant",
        name: "Restaurant",
        baseCost: 800,
        baseIncome: 25,
        space: 3,
        color1: "#E57373",
        color2: "#C62828",
        icon: "🍽️",
        type: "commercial",
        menuOptions: [
            { name: "Fast Food", incomeMultiplier: 1, cost: 0 },
            { name: "Family Restaurant", incomeMultiplier: 1.8, cost: 500 },
            { name: "Fine Dining", incomeMultiplier: 3, cost: 2000 }
        ],
        currentMenu: 0
    },
    factory: {
        id: "factory",
        name: "Factory",
        baseCost: 2000,
        baseIncome: 60,
        space: 4,
        color1: "#90A4AE",
        color2: "#546E7A",
        icon: "🏭",
        type: "industrial"
    },
    mall: {
        id: "mall",
        name: "Shopping Mall",
        baseCost: 5000,
        baseIncome: 150,
        space: 5,
        color1: "#BA68C8",
        color2: "#7B1FA2",
        icon: "🏬",
        type: "commercial"
    }
};

// DOM Elements
const elements = {
    money: document.getElementById('money'),
    perSecond: document.getElementById('per-second'),
    perClick: document.getElementById('per-click'),
    landUsed: document.getElementById('land-used'),
    landTotal: document.getElementById('land-total'),
    landFill: document.getElementById('land-fill'),
    landPercent: document.getElementById('land-percent'),
    landCost: document.getElementById('land-cost'),
    cityGrid: document.getElementById('city-grid'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    clickButton: document.getElementById('click-button'),
    buyLandBtn: document.getElementById('buy-land-btn'),
    buildingModal: document.getElementById('building-modal'),
    modalContent: document.getElementById('modal-content'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    resetBtn: document.getElementById('reset-btn'),
    notification: document.getElementById('notification')
};

// Initialize Game
function init() {
    loadGame();
    renderCityGrid();
    renderBuildingsShop();
    renderUpgrades();
    updateDisplay();
    
    // Set up game loop
    setInterval(gameLoop, 1000);
    
    // Set up auto-clicker
    setInterval(autoClick, 1000);
    
    // Event Listeners
    elements.clickButton.addEventListener('click', handleClick);
    elements.buyLandBtn.addEventListener('click', buyMoreLand);
    elements.saveBtn.addEventListener('click', saveGame);
    elements.loadBtn.addEventListener('click', loadGame);
    elements.resetBtn.addEventListener('click', resetGame);
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.buildingModal) {
            closeModal();
        }
    });
    
    showNotification("Welcome to Mini City Tycoon!", "success");
}

// Game Loop
function gameLoop() {
    calculateIncome();
    updateDisplay();
    saveGameAuto();
}

// Calculate Passive Income
function calculateIncome() {
    let totalIncome = 0;
    
    gameState.buildings.forEach(building => {
        let buildingIncome = building.baseIncome;
        
        // Apply menu upgrades
        if (building.menuOptions && building.currentMenu > 0) {
            const menu = building.menuOptions[building.currentMenu];
            buildingIncome *= menu.incomeMultiplier;
        }
        
        // Apply tenant bonuses
        if (building.tenants && building.currentTenant > 0) {
            const tenant = building.tenants[building.currentTenant];
            buildingIncome *= tenant.incomeMultiplier;
        }
        
        totalIncome += buildingIncome;
    });
    
    gameState.perSecond = totalIncome;
    gameState.money += totalIncome;
}

// Handle Click
function handleClick() {
    let clickValue = gameState.perClick;
    
    // Apply click power upgrade
    if (gameState.upgrades.clickPower.purchased) {
        clickValue *= gameState.upgrades.clickPower.multiplier;
    }
    
    gameState.money += clickValue;
    
    // Visual effect
    elements.money.classList.add('money-pop');
    setTimeout(() => {
        elements.money.classList.remove('money-pop');
    }, 300);
    
    createFloatingText(elements.clickButton, `+$${clickValue}`);
    updateDisplay();
}

// Auto Clicker
function autoClick() {
    if (gameState.upgrades.autoClicker.purchased) {
        handleClick();
    }
}

// Create Floating Text
function createFloatingText(element, text) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'absolute';
    floatingText.style.color = '#FFD700';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '1.2rem';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    floatingText.classList.add('float-up');
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = `${rect.left + rect.width / 2}px`;
    floatingText.style.top = `${rect.top}px`;
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        document.body.removeChild(floatingText);
    }, 1000);
}

// Render City Grid
function renderCityGrid() {
    elements.cityGrid.innerHTML = '';
    
    for (let i = 0; i < gameState.totalLand; i++) {
        const plot = document.createElement('div');
        plot.className = 'land-plot empty';
        plot.dataset.index = i;
        
        // Check if this plot has a building
        const building = gameState.buildings.find(b => b.plotIndex === i);
        
        if (building) {
            plot.className = 'land-plot occupied';
            plot.style.color = building.color1;
            
            plot.innerHTML = `
                <div class="building-shape" style="background:${building.color1}"></div>
                <div class="building-name">${building.name}</div>
            `;
            
            plot.addEventListener('click', () => openBuildingModal(building));
        } else {
            plot.innerHTML = `<div class="plot-plus">+</div>`;
            plot.addEventListener('click', () => selectPlotForBuilding(i));
        }
        
        elements.cityGrid.appendChild(plot);
    }
    
    updateLandDisplay();
}

// Update Land Display
function updateLandDisplay() {
    const percent = Math.min(100, (gameState.usedLand / gameState.totalLand) * 100);
    elements.landFill.style.width = `${percent}%`;
    elements.landUsed.textContent = gameState.usedLand;
    elements.landTotal.textContent = gameState.totalLand;
    elements.landPercent.textContent = `${Math.round(percent)}%`;
    elements.landCost.textContent = gameState.landCost;
}

// Render Buildings Shop
function renderBuildingsShop() {
    elements.buildingsContainer.innerHTML = '';
    
    for (const [key, template] of Object.entries(buildingTemplates)) {
        const item = document.createElement('div');
        const canAfford = gameState.money >= template.baseCost;
        const hasSpace = (gameState.usedLand + template.space) <= gameState.totalLand;
        
        item.className = `shop-item ${canAfford && hasSpace ? '' : 'disabled'}`;
        item.style.setProperty('--color1', template.color1);
        item.style.setProperty('--color2', template.color2);
        
        item.innerHTML = `
            <div class="building-icon">${template.icon}</div>
            <div class="building-details">
                <h4>${template.name}</h4>
                <p class="building-income">$${template.baseIncome}/s</p>
                <p class="building-cost">Cost: $${template.baseCost}</p>
                <p class="building-space">Space: ${template.space} plots</p>
            </div>
        `;
        
        if (canAfford && hasSpace) {
            item.addEventListener('click', () => prepareToBuild(key));
        }
        
        elements.buildingsContainer.appendChild(item);
    }
}

// Prepare to Build
function prepareToBuild(buildingId) {
    const template = buildingTemplates[buildingId];
    showNotification(`Select an empty plot for your ${template.name}`);
    
    // Store the building to be placed
    gameState.buildingToPlace = buildingId;
}

// Select Plot for Building
function selectPlotForBuilding(plotIndex) {
    if (!gameState.buildingToPlace) return;
    
    const template = buildingTemplates[gameState.buildingToPlace];
    
    // Check if we can afford it
    if (gameState.money < template.baseCost) {
        showNotification("Not enough money!", "error");
        return;
    }
    
    // Check if there's enough space (for multi-plot buildings)
    if ((gameState.usedLand + template.space) > gameState.totalLand) {
        showNotification("Not enough land!", "error");
        return;
    }
    
    // Create building instance
    const building = {
        ...JSON.parse(JSON.stringify(template)),
        plotIndex: plotIndex,
        id: `${template.id}_${Date.now()}`
    };
    
    // Pay for building
    gameState.money -= template.baseCost;
    gameState.usedLand += template.space;
    
    // Add to buildings array
    gameState.buildings.push(building);
    
    // Clear building to place
    gameState.buildingToPlace = null;
    
    // Update display
    renderCityGrid();
    renderBuildingsShop();
    updateDisplay();
    
    showNotification(`Built ${template.name}!`, "success");
}

// Render Upgrades
function renderUpgrades() {
    elements.upgradesContainer.innerHTML = '';
    
    for (const [key, upgrade] of Object.entries(gameState.upgrades)) {
        const item = document.createElement('div');
        const canAfford = gameState.money >= upgrade.cost && !upgrade.purchased;
        
        item.className = `upgrade-item ${canAfford ? '' : 'disabled'}`;
        
        item.innerHTML = `
            <div class="building-icon">${upgrade.icon}</div>
            <div class="building-details">
                <h4>${upgrade.name}</h4>
                <p>${upgrade.description}</p>
                <p class="building-cost">$${upgrade.cost}</p>
                <p>${upgrade.purchased ? '✓ Purchased' : ''}</p>
            </div>
        `;
        
        if (canAfford) {
            item.addEventListener('click', () => buyUpgrade(key));
        }
        
        elements.upgradesContainer.appendChild(item);
    }
}

// Buy Upgrade
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    
    if (!upgrade.purchased && gameState.money >= upgrade.cost) {
        gameState.money -= upgrade.cost;
        upgrade.purchased = true;
        
        if (upgradeId === 'clickPower') {
            gameState.perClick *= upgrade.multiplier;
        } else if (upgradeId === 'landDiscount') {
            gameState.landCost = Math.floor(gameState.landCost * (1 - upgrade.discount));
        }
        
        updateDisplay();
        renderUpgrades();
        showNotification(`Purchased ${upgrade.name}!`, "success");
    }
}

// Buy More Land
function buyMoreLand() {
    if (gameState.money >= gameState.landCost) {
        gameState.money -= gameState.landCost;
        gameState.totalLand += 5;
        gameState.landCost = Math.floor(gameState.landCost * 1.5);
        
        renderCityGrid();
        updateDisplay();
        showNotification("Purchased more land!", "success");
    } else {
        showNotification("Not enough money!", "error");
    }
}

// Open Building Modal
function openBuildingModal(building) {
    elements.modalContent.innerHTML = '';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h3>${building.name}</h3>
        <p>Income: $${calculateBuildingIncome(building)}/s</p>
    `;
    elements.modalContent.appendChild(header);
    
    // Menu Options (for stands and restaurants)
    if (building.menuOptions) {
        const menuSection = document.createElement('div');
        menuSection.className = 'modal-section';
        menuSection.innerHTML = '<h4>Menu Options</h4>';
        
        building.menuOptions.forEach((menu, index) => {
            const option = document.createElement('div');
            option.className = `menu-option ${building.currentMenu === index ? 'selected' : ''}`;
            option.innerHTML = `
                <div>
                    <strong>${menu.name}</strong>
                    <p>${menu.cost > 0 ? `Upgrade Cost: $${menu.cost}` : 'Basic Menu'}</p>
                </div>
                <div class="rent-income">×${menu.incomeMultiplier}</div>
            `;
            
            if (menu.cost === 0 || gameState.money >= menu.cost) {
                option.addEventListener('click', () => upgradeMenu(building, index, menu.cost));
            } else {
                option.style.opacity = '0.5';
                option.style.cursor = 'not-allowed';
            }
            
            menuSection.appendChild(option);
        });
        
        elements.modalContent.appendChild(menuSection);
    }
    
    // Tenant Options (for apartments)
    if (building.tenants) {
        const tenantSection = document.createElement('div');
        tenantSection.className = 'modal-section';
        tenantSection.innerHTML = '<h4>Tenant Management</h4>';
        
        building.tenants.forEach((tenant, index) => {
            const option = document.createElement('div');
            option.className = `tenant-option ${building.currentTenant === index ? 'selected' : ''}`;
            option.innerHTML = `
                <div>
                    <strong>${tenant.name}</strong>
                    <p>Reliability: ${tenant.reliability * 100}%</p>
                </div>
                <div class="rent-income">×${tenant.incomeMultiplier}</div>
            `;
            
            option.addEventListener('click', () => changeTenant(building, index));
            tenantSection.appendChild(option);
        });
        
        elements.modalContent.appendChild(tenantSection);
    }
    
    // Sell Button
    const sellButton = document.createElement('button');
    sellButton.className = 'btn danger';
    sellButton.innerHTML = '<i class="fas fa-trash"></i> Sell Building';
    sellButton.addEventListener('click', () => sellBuilding(building));
    elements.modalContent.appendChild(sellButton);
    
    elements.buildingModal.style.display = 'flex';
}

// Calculate Building Income
function calculateBuildingIncome(building) {
    let income = building.baseIncome;
    
    if (building.menuOptions && building.currentMenu > 0) {
        income *= building.menuOptions[building.currentMenu].incomeMultiplier;
    }
    
    if (building.tenants && building.currentTenant > 0) {
        income *= building.tenants[building.currentTenant].incomeMultiplier;
    }
    
    return income;
}

// Upgrade Menu
function upgradeMenu(building, menuIndex, cost) {
    if (building.currentMenu === menuIndex) return;
    
    if (cost > 0 && gameState.money >= cost) {
        gameState.money -= cost;
        building.currentMenu = menuIndex;
        showNotification(`Upgraded to ${building.menuOptions[menuIndex].name}!`, "success");
        closeModal();
        updateDisplay();
    } else if (cost === 0) {
        building.currentMenu = menuIndex;
        showNotification(`Changed to ${building.menuOptions[menuIndex].name}`, "success");
        closeModal();
    } else {
        showNotification("Not enough money!", "error");
    }
}

// Change Tenant
function changeTenant(building, tenantIndex) {
    if (building.currentTenant === tenantIndex) return;
    
    building.currentTenant = tenantIndex;
    showNotification(`Changed tenant to ${building.tenants[tenantIndex].name}!`, "success");
    closeModal();
}

// Sell Building
function sellBuilding(building) {
    const refund = Math.floor(building.baseCost * 0.7);
    gameState.money += refund;
    gameState.usedLand -= building.space;
    
    // Remove building
    gameState.buildings = gameState.buildings.filter(b => b.id !== building.id);
    
    closeModal();
    renderCityGrid();
    renderBuildingsShop();
    updateDisplay();
    showNotification(`Sold ${building.name} for $${refund}`, "success");
}

// Close Modal
function closeModal() {
    elements.buildingModal.style.display = 'none';
}

// Update Display
function updateDisplay() {
    // Format money
    const formatMoney = (amount) => {
        if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
        return `$${Math.floor(amount)}`;
    };
    
    elements.money.textContent = formatMoney(gameState.money);
    elements.perSecond.textContent = formatMoney(gameState.perSecond);
    elements.perClick.textContent = formatMoney(gameState.perClick);
    
    // Update button states
    elements.buyLandBtn.disabled = gameState.money < gameState.landCost;
    elements.buyLandBtn.innerHTML = `<i class="fas fa-expand"></i> Buy More Land ($${gameState.landCost})`;
}

// Show Notification
function showNotification(message, type = "success") {
    elements.notification.textContent = message;
    elements.notification.className = 'notification';
    elements.notification.classList.add(type === "error" ? "error" : "success", "show");
    
    setTimeout(() => {
        elements.notification.classList.remove("show");
    }, 3000);
}

// Save Game
function saveGame() {
    const saveData = {
        ...gameState,
        lastSave: Date.now()
    };
    
    localStorage.setItem('miniCityTycoonSave', JSON.stringify(saveData));
    showNotification("Game saved!", "success");
}

// Auto Save
function saveGameAuto() {
    if (Date.now() - gameState.lastSave > 30000) { // Save every 30 seconds
        saveGame();
    }
}

// Load Game
function loadGame() {
    const saved = localStorage.getItem('miniCityTycoonSave');
    if (saved) {
        const savedState = JSON.parse(saved);
        
        // Merge with current state
        Object.assign(gameState, savedState);
        
        // Ensure arrays are properly loaded
        if (!Array.isArray(gameState.buildings)) {
            gameState.buildings = [];
        }
        
        updateDisplay();
        showNotification("Game loaded!", "success");
    }
}

// Reset Game
function resetGame() {
    if (confirm("Are you sure you want to reset your game? All progress will be lost.")) {
        localStorage.removeItem('miniCityTycoonSave');
        
        // Reset to initial state
        Object.assign(gameState, {
            money: 100,
            perClick: 1,
            perSecond: 0,
            totalLand: 10,
            usedLand: 0,
            landCost: 500,
            buildings: [],
            upgrades: {
                clickPower: { 
                    name: "Double Click", 
                    description: "Double your click value", 
                    cost: 200, 
                    purchased: false, 
                    multiplier: 2,
                    icon: "⚡"
                },
                landDiscount: { 
                    name: "Land Discount", 
                    description: "Reduce land cost by 20%", 
                    cost: 1000, 
                    purchased: false, 
                    discount: 0.2,
                    icon: "🏙️"
                },
                autoClicker: { 
                    name: "Auto Clicker", 
                    description: "Automatically click every second", 
                    cost: 5000, 
                    purchased: false,
                    icon: "🤖"
                }
            },
            lastSave: Date.now()
        });
        
        renderCityGrid();
        renderBuildingsShop();
        renderUpgrades();
        updateDisplay();
        showNotification("Game reset!", "success");
    }
}

// Initialize the game when page loads
window.addEventListener('DOMContentLoaded', init);
