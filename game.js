// Game State
let gameState = {
    money: 0,
    perClick: 1,
    perSecond: 0,
    buildings: {
        lemonadeStand: { cost: 10, income: 1, count: 0 },
        shop: { cost: 100, income: 5, count: 0 },
        factory: { cost: 1000, income: 25, count: 0 },
        skyscraper: { cost: 10000, income: 150, count: 0 }
    },
    upgrades: {
        doubleIncome: { cost: 1000, purchased: false, multiplier: 2 },
        clickPower: { cost: 500, purchased: false, multiplier: 2 },
        autoClicker: { cost: 5000, purchased: false }
    },
    lastSave: Date.now()
};

// DOM Elements
const moneyElement = document.getElementById('money');
const perSecondElement = document.getElementById('per-second');
const perClickElement = document.getElementById('per-click');
const clickButton = document.getElementById('click-button');
const buildingsContainer = document.getElementById('buildings-container');
const upgradesContainer = document.getElementById('upgrades-container');
const saveButton = document.getElementById('save-btn');
const resetButton = document.getElementById('reset-btn');
const notification = document.getElementById('notification');

// Initialize the game
function init() {
    loadGame();
    renderBuildings();
    renderUpgrades();
    updateDisplay();
    
    // Set up game loop
    setInterval(gameLoop, 100);
    
    // Set up event listeners
    clickButton.addEventListener('click', handleClick);
    saveButton.addEventListener('click', saveGame);
    resetButton.addEventListener('click', resetGame);
    
    // Auto-clicker functionality
    setInterval(() => {
        if (gameState.upgrades.autoClicker.purchased) {
            handleClick(true);
        }
    }, 1000);
}

// Game loop
function gameLoop() {
    // Calculate passive income
    let incomePerSecond = 0;
    for (const building in gameState.buildings) {
        const b = gameState.buildings[building];
        incomePerSecond += b.income * b.count;
    }
    
    // Apply double income upgrade if purchased
    if (gameState.upgrades.doubleIncome.purchased) {
        incomePerSecond *= gameState.upgrades.doubleIncome.multiplier;
    }
    
    // Add passive income
    const now = Date.now();
    const timePassed = now - gameState.lastSave;
    const income = (incomePerSecond * timePassed) / 1000;
    gameState.money += income;
    gameState.perSecond = incomePerSecond;
    gameState.lastSave = now;
    
    updateDisplay();
}

// Handle click event
function handleClick(isAuto = false) {
    let clickValue = gameState.perClick;
    
    // Apply click power upgrade if purchased
    if (gameState.upgrades.clickPower.purchased) {
        clickValue *= gameState.upgrades.clickPower.multiplier;
    }
    
    gameState.money += clickValue;
    
    // Visual feedback for manual clicks
    if (!isAuto) {
        moneyElement.classList.add('money-increase');
        setTimeout(() => {
            moneyElement.classList.remove('money-increase');
        }, 300);
        
        // Create a floating "+$" text
        createFloatingText(clickButton, `+$${clickValue}`);
    }
    
    updateDisplay();
    saveGame();
}

// Create floating text animation
function createFloatingText(element, text) {
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.position = 'absolute';
    floatingText.style.color = '#FFD700';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.fontSize = '1.2rem';
    floatingText.style.pointerEvents = 'none';
    floatingText.style.zIndex = '1000';
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = `${rect.left + rect.width / 2}px`;
    floatingText.style.top = `${rect.top}px`;
    
    document.body.appendChild(floatingText);
    
    // Animate the text
    let opacity = 1;
    let y = 0;
    const animation = setInterval(() => {
        opacity -= 0.02;
        y -= 2;
        floatingText.style.opacity = opacity;
        floatingText.style.transform = `translate(-50%, ${y}px)`;
        
        if (opacity <= 0) {
            clearInterval(animation);
            document.body.removeChild(floatingText);
        }
    }, 20);
}

// Render buildings in the UI
function renderBuildings() {
    buildingsContainer.innerHTML = '';
    
    const buildings = [
        { id: 'lemonadeStand', name: 'Lemonade Stand', icon: '🍋' },
        { id: 'shop', name: 'Shop', icon: '🛒' },
        { id: 'factory', name: 'Factory', icon: '🏭' },
        { id: 'skyscraper', name: 'Skyscraper', icon: '🏙️' }
    ];
    
    buildings.forEach(building => {
        const b = gameState.buildings[building.id];
        const buildingElement = document.createElement('div');
        buildingElement.className = 'building-item';
        
        buildingElement.innerHTML = `
            <div class="building-info">
                <div class="building-name">${building.icon} ${building.name}</div>
                <div class="building-income">Income: $${b.income}/sec</div>
            </div>
            <div class="building-count">${b.count}</div>
            <button class="buy-button" data-building="${building.id}">
                Buy ($${b.cost})
            </button>
        `;
        
        buildingsContainer.appendChild(buildingElement);
    });
    
    // Add event listeners to buy buttons
    document.querySelectorAll('.building-item .buy-button').forEach(button => {
        button.addEventListener('click', () => {
            const buildingId = button.getAttribute('data-building');
            buyBuilding(buildingId);
        });
    });
}

// Render upgrades in the UI
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    
    const upgrades = [
        { 
            id: 'clickPower', 
            name: 'Click Power x2', 
            description: 'Doubles money per click',
            icon: '⚡'
        },
        { 
            id: 'doubleIncome', 
            name: 'Double Income', 
            description: 'Doubles all building income',
            icon: '💰'
        },
        { 
            id: 'autoClicker', 
            name: 'Auto Clicker', 
            description: 'Automatically clicks every second',
            icon: '🤖'
        }
    ];
    
    upgrades.forEach(upgrade => {
        const u = gameState.upgrades[upgrade.id];
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade-item';
        
        upgradeElement.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.icon} ${upgrade.name}</div>
                <div class="upgrade-description">${upgrade.description}</div>
            </div>
            <div class="upgrade-price">$${u.cost}</div>
            <button class="buy-button" data-upgrade="${upgrade.id}" ${u.purchased ? 'disabled' : ''}>
                ${u.purchased ? 'Purchased' : 'Buy'}
            </button>
        `;
        
        upgradesContainer.appendChild(upgradeElement);
    });
    
    // Add event listeners to upgrade buttons
    document.querySelectorAll('.upgrade-item .buy-button').forEach(button => {
        button.addEventListener('click', () => {
            const upgradeId = button.getAttribute('data-upgrade');
            buyUpgrade(upgradeId);
        });
    });
}

// Buy a building
function buyBuilding(buildingId) {
    const building = gameState.buildings[buildingId];
    
    if (gameState.money >= building.cost) {
        gameState.money -= building.cost;
        building.count++;
        
        // Increase cost for next purchase (10% increase)
        building.cost = Math.floor(building.cost * 1.1);
        
        updateDisplay();
        renderBuildings();
        saveGame();
        showNotification(`Purchased ${buildingId.replace(/([A-Z])/g, ' $1').toLowerCase()}!`);
    } else {
        showNotification('Not enough money!', 'error');
    }
}

// Buy an upgrade
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    
    if (!upgrade.purchased && gameState.money >= upgrade.cost) {
        gameState.money -= upgrade.cost;
        upgrade.purchased = true;
        
        // Apply upgrade effects
        if (upgradeId === 'clickPower') {
            showNotification('Click power doubled!');
        } else if (upgradeId === 'doubleIncome') {
            showNotification('All building income doubled!');
        } else if (upgradeId === 'autoClicker') {
            showNotification('Auto-clicker activated!');
        }
        
        updateDisplay();
        renderUpgrades();
        saveGame();
    } else if (!upgrade.purchased) {
        showNotification('Not enough money!', 'error');
    }
}

// Update the display
function updateDisplay() {
    // Format money with commas
    moneyElement.textContent = `$${formatNumber(gameState.money)}`;
    perSecondElement.textContent = `$${formatNumber(gameState.perSecond.toFixed(1))}`;
    perClickElement.textContent = `$${formatNumber(gameState.perClick * (gameState.upgrades.clickPower.purchased ? gameState.upgrades.clickPower.multiplier : 1))}`;
    
    // Update building buttons
    document.querySelectorAll('.building-item .buy-button').forEach(button => {
        const buildingId = button.getAttribute('data-building');
        const building = gameState.buildings[buildingId];
        button.textContent = `Buy ($${formatNumber(building.cost)})`;
        button.disabled = gameState.money < building.cost;
    });
    
    // Update upgrade buttons
    document.querySelectorAll('.upgrade-item .buy-button').forEach(button => {
        const upgradeId = button.getAttribute('data-upgrade');
        const upgrade = gameState.upgrades[upgradeId];
        
        if (upgrade.purchased) {
            button.textContent = 'Purchased';
            button.disabled = true;
        } else {
            button.textContent = `Buy ($${formatNumber(upgrade.cost)})`;
            button.disabled = gameState.money < upgrade.cost;
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = 'notification';
    
    if (type === 'error') {
        notification.style.backgroundColor = '#dc3545';
    } else {
        notification.style.backgroundColor = '#28a745';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Format numbers with commas
function formatNumber(num) {
    return Math.floor(num).toLocaleString();
}

// Save game to localStorage
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('miniCityTycoonSave', JSON.stringify(gameState));
    showNotification('Game saved!');
}

// Load game from localStorage
function loadGame() {
    const saved = localStorage.getItem('miniCityTycoonSave');
    if (saved) {
        const parsed = JSON.parse(saved);
        
        // Merge saved state with default state to ensure all properties exist
        gameState = {
            ...gameState,
            ...parsed,
            buildings: { ...gameState.buildings, ...parsed.buildings },
            upgrades: { ...gameState.upgrades, ...parsed.upgrades }
        };
        
        showNotification('Game loaded!');
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset your game? All progress will be lost.')) {
        localStorage.removeItem('miniCityTycoonSave');
        gameState = {
            money: 0,
            perClick: 1,
            perSecond: 0,
            buildings: {
                lemonadeStand: { cost: 10, income: 1, count: 0 },
                shop: { cost: 100, income: 5, count: 0 },
                factory: { cost: 1000, income: 25, count: 0 },
                skyscraper: { cost: 10000, income: 150, count: 0 }
            },
            upgrades: {
                doubleIncome: { cost: 1000, purchased: false, multiplier: 2 },
                clickPower: { cost: 500, purchased: false, multiplier: 2 },
                autoClicker: { cost: 5000, purchased: false }
            },
            lastSave: Date.now()
        };
        
        updateDisplay();
        renderBuildings();
        renderUpgrades();
        showNotification('Game reset!');
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', init);
