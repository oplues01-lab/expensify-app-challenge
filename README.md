# Expensify Mini App

A single-page web application for managing Expensify transactions using PHP, JavaScript (jQuery), and the Expensify API.



- **Authentication**: Secure login with email and password
- **Session Persistence**: Cookie-based authentication that persists across page refreshes
- **Transaction Management**: View all existing transactions in a responsive table
- **Create Transactions**: Add new transactions with date, merchant, amount, and currency
- **AJAX-Powered**: No page reloads - all operations use AJAX
- **Error Handling**: Graceful error messages for failed operations
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Installation

1. **Prerequisites**:
   - PHP 7.0 or higher
   - Web server (Apache, Nginx, or PHP built-in server)
   - cURL extension enabled in PHP

2. **Setup**:
   ```bash
   # Clone or download the project
   cd expensify-mini-app
   
   # Start PHP development server
   php -S localhost:8000
   ```

3. **Access**:
   - Open your browser and navigate to `http://localhost:8000`

## 📖 Usage

### Login
1. Enter your Expensify credentials:
   - **Email**: Your Expensify partner user ID
   - **Password**: Your Expensify partner user secret
2. Click "Sign In"
3. If successful, you'll be redirected to the transactions view

### View Transactions
- All transactions are displayed in a table with columns:
  - Date
  - Merchant
  - Amount
  - Currency
- The table efficiently handles large datasets

### Add New Transaction
1. Scroll to the "Add New Transaction" form
2. Fill in the required fields:
   - **Date**: Transaction date
   - **Merchant**: Merchant name
   - **Amount**: Transaction amount
   - **Currency**: Select from USD, EUR, GBP, or NGN
3. Click "Add Transaction"
4. The new transaction appears instantly at the top of the table

### Logout
- Click the "Logout" button in the header to clear your session

## 🔐 API Configuration

The application uses the following Expensify API endpoints:

- **Authentication**: `https://expensi.com/api/authenticate`
- **Get Transactions**: `https://expensi.com/api/getTransaction`
- **Create Transaction**: `https://expensi.com/api/createTransaction`

### Required Headers
All API requests include the custom header:
```
student: expensify-challenge-2025
```

### Partner Credentials
The app uses hardcoded partner credentials (as specified):
- **partnerName**: `applihgjhgt`
- **partnerPassword**: `f78tyiyuoiuog`

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES5/ES6)
- **Library**: jQuery 3.6.0 (loaded from CDN)
- **Backend**: PHP 7.x with cURL
- **API**: Expensify REST API

### Key Components

#### api_proxy.php
- Handles CORS issues by proxying requests to Expensify API
- Adds required custom headers
- Accepts JSON input and returns JSON output
- Validates endpoints and request format

#### js/app.js
- Manages application state and logic
- Handles authentication flow
- Performs AJAX requests via jQuery
- Implements cookie-based session management
- Efficiently renders large transaction lists
- Provides error handling and user feedback

#### css/style.css
- Clean, minimal design
- Responsive layout
- Accessible form elements
- Smooth transitions and hover effects

## 🐛 Issues Solved

1. **CORS Restrictions**: 
   - Implemented PHP proxy to bypass browser CORS policies
   - All API requests route through `api_proxy.php`

2. **Session Persistence**:
   - Used cookies to store `authToken` and `userEmail`
   - Automatically restores session on page refresh

3. **Large Dataset Performance**:
   - Used DocumentFragment for efficient DOM manipulation
   - Minimized reflows and repaints when rendering transactions

4. **Error Handling**:
   - Graceful error messages for failed API calls
   - Input validation on forms
   - User-friendly error display (no alerts)

5. **Security**:
   - HTML escaping to prevent XSS attacks
   - Secure cookie storage
   - HTTPS API endpoints

## ⏱️ Time Spent

Approximate development time breakdown:
- **Planning & Architecture**: 30 minutes
- **HTML Structure**: 20 minutes
- **CSS Styling**: 30 minutes
- **JavaScript Logic**: 1.5 hours
- **PHP Proxy**: 30 minutes
- **Testing & Debugging**: 45 minutes
- **Documentation**: 25 minutes

**Total**: ~4 hours

## 🔒 Security Notes

- Never expose your real Expensify credentials in production
- Use environment variables for sensitive data
- Implement proper server-side validation
- Use HTTPS in production environments
- Consider implementing CSRF protection

## 📝 Future Enhancements

- Pagination for large transaction lists
- Transaction filtering and search
- Edit/delete transaction functionality
- Export transactions to CSV
- Better error recovery mechanisms
- Unit and integration tests
- Backend session management (instead of cookies)

## 📄 License

This project is for educational purposes only.

## 👤 Author

Built as a demonstration of full-stack web development skills with PHP, JavaScript, and RESTful API integration.