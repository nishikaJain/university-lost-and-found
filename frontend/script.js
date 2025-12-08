// API Base URL - Change this to your backend URL
const API_URL = 'http://localhost:3000/api';

let allItems = [];

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Load data for specific tabs
    if (tabName === 'view') {
        loadItems();
    } else if (tabName === 'database') {
        refreshDatabase();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Form submission
document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('✅ Item reported successfully!', 'success');
            e.target.reset();
            
            // Auto-switch to view tab to show the new item
            setTimeout(() => {
                document.querySelector('.tab-btn:nth-child(2)').click();
            }, 1500);
        } else {
            showNotification('❌ Error: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Failed to submit. Make sure backend is running!', 'error');
        console.error('Error:', error);
    }
});

// Load all items
async function loadItems(filter = 'all') {
    try {
        const endpoint = filter === 'all' ? '/items' : `/items/${filter}`;
        const response = await fetch(`${API_URL}${endpoint}`);
        const result = await response.json();
        
        if (result.success) {
            allItems = result.data;
            displayItems(allItems);
        }
    } catch (error) {
        console.error('Error loading items:', error);
        document.getElementById('items-container').innerHTML = 
            '<p style="text-align: center; color: #ff6b6b;">⚠️ Unable to load items. Make sure the backend server is running!</p>';
    }
}

// Mark item as claimed
async function markAsClaimed(itemId) {
    if (!confirm('Mark this item as claimed?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/items/${itemId}/claim`, {
            method: 'PATCH'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('✅ Item marked as claimed!', 'success');
            // Reload items to show updated status
            loadItems();
        } else {
            showNotification('❌ Error: ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Failed to update item!', 'error');
        console.error('Error:', error);
    }
}

// Display items
function displayItems(items) {
    const container = document.getElementById('items-container');
    
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No items found.</p>';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="item-card ${item.status}">
            <span class="item-status ${item.status}">${item.status.toUpperCase()}</span>
            <h3>${item.item_name}</h3>
            <p><strong>Category:</strong> <span class="category">${item.category}</span></p>
            <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Contact:</strong> ${item.contact_name}</p>
            ${item.contact_email ? `<p><strong>Email:</strong> ${item.contact_email}</p>` : ''}
            ${item.contact_phone ? `<p><strong>Phone:</strong> ${item.contact_phone}</p>` : ''}
            <p style="font-size: 0.85em; color: #999; margin-top: 10px;">
                <strong>Reported:</strong> ${new Date(item.date_reported).toLocaleDateString()}
            </p>
            ${item.is_claimed 
                ? '<p style="color: #51cf66; font-weight: 600; margin-top: 10px;">✓ Claimed on ' + new Date(item.claimed_date).toLocaleDateString() + '</p>' 
                : '<button onclick="markAsClaimed(' + item.id + ')" style="margin-top: 10px; padding: 8px 15px; background: #51cf66; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">Mark as Claimed</button>'
            }
        </div>
    `).join('');
}

// Filter items
function filterItems(status) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadItems(status);
}

// Search items
function searchItems() {
    const query = document.getElementById('search-input').value.toLowerCase();
    
    const filtered = allItems.filter(item => 
        item.item_name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    );
    
    displayItems(filtered);
}

// Refresh database view
async function refreshDatabase() {
    try {
        const response = await fetch(`${API_URL}/items`);
        const result = await response.json();
        
        if (result.success) {
            displayDatabaseTable(result.data);
        }
    } catch (error) {
        console.error('Error loading database:', error);
        document.getElementById('database-table').innerHTML = 
            '<p style="text-align: center; color: #ff6b6b;">⚠️ Unable to connect to database!</p>';
    }
}

// Display database table
function displayDatabaseTable(items) {
    const container = document.getElementById('database-table');
    
    if (items.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No records in database.</p>';
        return;
    }
    
    const table = `
        <table class="database-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date Reported</th>
                    <th>Claimed</th>
                    <th>Claimed Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.item_name}</td>
                        <td>${item.category}</td>
                        <td><span class="item-status ${item.status}">${item.status}</span></td>
                        <td>${item.location}</td>
                        <td>${item.contact_name}</td>
                        <td>${item.contact_email || 'N/A'}</td>
                        <td>${item.contact_phone || 'N/A'}</td>
                        <td>${new Date(item.date_reported).toLocaleString()}</td>
                        <td style="font-size: 1.2em; font-weight: bold; color: ${item.is_claimed ? '#51cf66' : '#ff6b6b'};">${item.is_claimed ? '✓' : '✗'}</td>
                        <td>${item.claimed_date ? new Date(item.claimed_date).toLocaleString() : 'N/A'}</td>
                        <td>
                            ${!item.is_claimed 
                                ? '<button onclick="markAsClaimed(' + item.id + ')" style="padding: 5px 10px; background: #51cf66; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em;">Claim</button>' 
                                : '<span style="color: #51cf66;">Claimed</span>'
                            }
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

// Load items on page load
window.addEventListener('load', () => {
    loadItems();
});
