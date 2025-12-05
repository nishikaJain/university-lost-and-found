# 🎓 University Lost & Found App

A full-stack web application for managing lost and found items at universities, with real-time MySQL database integration.

## ✨ Features

- **Report Items**: Submit lost or found items with detailed information
- **Browse Items**: View all lost and found items with filtering and search
- **Live Database View**: Real-time database records display for demonstrations
- **Categories**: Electronics, Bags, Books, Clothing, Accessories, Documents, and more
- **Contact Management**: Store contact information for item recovery
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Modern gradient design)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- MySQL2 (Promise-based)

**Database:**
- MySQL

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nishikaJain/university-lost-and-found.git
cd university-lost-and-found
```

### 2. Database Setup

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p < database/schema.sql
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script

This will:
- Create `university_lost_found` database
- Create `items` table with proper schema
- Insert sample data for testing

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=university_lost_found
PORT=3000
```

**Start the backend server:**

```bash
npm start
```

You should see:
```
✅ Connected to MySQL database successfully!
🚀 Server running on http://localhost:3000
```

### 4. Frontend Setup

Simply open `frontend/index.html` in your browser, or use a local server:

```bash
cd frontend
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

Then visit: `http://localhost:8080`

## 📱 Usage

### For Demonstration to Teachers

1. **Start Backend**: Run `npm start` in backend directory
2. **Open Frontend**: Open `index.html` in browser
3. **Show Database Tab**: Click "Database View" to show live MySQL data
4. **Add New Item**: 
   - Click "Report Item" tab
   - Fill in the form (e.g., "Lost Laptop", "Electronics", etc.)
   - Submit the form
5. **Show Real-time Update**:
   - Switch to "Database View" tab
   - Click "🔄 Refresh Database"
   - The new item appears in the database table immediately!

### Key Demo Points

✅ **Real-time sync**: Data entered in app appears instantly in MySQL  
✅ **Full CRUD**: Create, Read, Update, Delete operations  
✅ **Live database view**: Shows actual MySQL records  
✅ **Professional UI**: Clean, modern interface  
✅ **Search & Filter**: Find items quickly  

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| GET | `/api/items/:status` | Get items by status (lost/found) |
| GET | `/api/item/:id` | Get single item by ID |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| PATCH | `/api/items/:id/claim` | Mark item as claimed |
| DELETE | `/api/items/:id` | Delete item |
| GET | `/api/search?q=query` | Search items |

## 📊 Database Schema

```sql
items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    status ENUM('lost', 'found'),
    location VARCHAR(255),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    date_reported DATETIME,
    image_url VARCHAR(500),
    is_claimed BOOLEAN,
    claimed_date DATETIME
)
```

## 🎯 Demo Script for Teachers

**"Let me demonstrate how our Lost & Found app connects to MySQL:"**

1. "Here's our web interface where students can report items"
2. "I'll add a new lost item - let's say a Blue Backpack"
3. *Fill form and submit*
4. "Now, let me show you the database view"
5. *Click Database View tab*
6. "As you can see, the data is immediately stored in MySQL"
7. "This table shows the actual database records with all fields"
8. *Point out: ID, timestamps, all form fields*
9. "The app uses REST API to communicate with MySQL backend"

## 🔧 Troubleshooting

**Backend won't start:**
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials
- Ensure port 3000 is available

**Database connection error:**
- Confirm database exists: `SHOW DATABASES;`
- Check user permissions
- Verify password in `.env`

**Frontend can't connect:**
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify API_URL in `script.js`

## 📝 License

MIT License - Feel free to use for educational purposes

## 👥 Contributors

Created by Nishika Jain

---

**Perfect for university projects and demonstrations! ⭐**
