const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Validation function for phone number
function validatePhoneNumber(phone) {
    // Check if phone is exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Routes

// Get all items
app.get('/api/items', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items ORDER BY date_reported DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get items by status (lost/found)
app.get('/api/items/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const [rows] = await db.query('SELECT * FROM items WHERE status = ? ORDER BY date_reported DESC', [status]);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single item by ID
app.get('/api/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add new item
app.post('/api/items', async (req, res) => {
    try {
        const { item_name, category, description, status, location, contact_name, contact_email, contact_phone, image_url } = req.body;
        
        // Validate phone number - must be exactly 10 digits
        if (!validatePhoneNumber(contact_phone)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number must be exactly 10 digits' 
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO items (item_name, category, description, status, location, contact_name, contact_email, contact_phone, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [item_name, category, description, status, location, contact_name, contact_email, contact_phone, image_url || null]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Item added successfully',
            itemId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update item
app.put('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, category, description, status, location, contact_name, contact_email, contact_phone, is_claimed } = req.body;
        
        // Validate phone number if provided
        if (contact_phone && !validatePhoneNumber(contact_phone)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Phone number must be exactly 10 digits' 
            });
        }
        
        const [result] = await db.query(
            'UPDATE items SET item_name = ?, category = ?, description = ?, status = ?, location = ?, contact_name = ?, contact_email = ?, contact_phone = ?, is_claimed = ? WHERE id = ?',
            [item_name, category, description, status, location, contact_name, contact_email, contact_phone, is_claimed, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        res.json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark item as claimed
app.patch('/api/items/:id/claim', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query(
            'UPDATE items SET is_claimed = TRUE, claimed_date = NOW() WHERE id = ?',
            [id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        res.json({ success: true, message: 'Item marked as claimed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM items WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Search items
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        const [rows] = await db.query(
            'SELECT * FROM items WHERE item_name LIKE ? OR description LIKE ? OR category LIKE ? ORDER BY date_reported DESC',
            [`%${q}%`, `%${q}%`, `%${q}%`]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
