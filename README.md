Expensify App Challenge

A single-page web application for managing Expensify transactions using PHP, JavaScript (jQuery), and the Expensify API.

1. Authentication: Secure login with email and password
2. Session Persistence: Cookie-based authentication that persists across page refreshes
3. Transaction Management: View all existing transactions in a responsive table
4. Create Transactions: Add new transactions with date, merchant, amount, and currency
5. AJAX-Powered: No page reloads - all operations use AJAX
6. Error Handling: Graceful error messages for failed operations
7. Responsive Design: Works on desktop and mobile devices

Installation

1. Prerequisites:
   - PHP 8.0 or higher
   - Web server (Apache, Nginx, or PHP built-in server)
   - cURL extension enabled in PHP

2. Setup:
   cd expensify
   php -S localhost:8000

3. Access:
   Go to http://localhost:8000 (localhost)
   https://expensify-app-challenge.onrender.com/ (online)

Usage

Login
1. Enter your Expensify credentials:
   - Email: Your Expensify partner user ID
   - Password: Your Expensify partner user secret
2. Click Sign In
3. If successful, you'll be redirected to the transactions view

View Transactions
All transactions are displayed in a table with columns:
1. Date
2. Merchant
3. Amount
4. Currency
The table efficiently handles large datasets; it has it own vertical scroll bar
Click download to download the datasets automatically

Add New Transaction
1. Scroll to the Add New Transaction form
2. Fill in the required fields:
   - Date: Transaction date
   - Merchant: Merchant name
   - Amount: Transaction amount
   - Currency: Select from USD, EUR, GBP, or NGN
3. Click Add Transaction
4. The new transaction appears instantly at the top of the table

Logout
Click the Logout button on the header to clear your session

API Configuration

The application uses the following Expensify API endpoints:
1. Authentication: https://expensi.com/api/authenticate
2. Get Transactions: https://expensi.com/api/getTransaction
3. Create Transaction: https://expensi.com/api/createTransaction

Required Headers
All API requests include the custom header:
expensifyengineeringcandidate 

Partner Credentials
The app uses hardcoded partner credentials:
- partnerName: ''
- partnerPassword: ''

Technical Details

Technologies Used
- Frontend: HTML5, CSS3, JavaScript (ES5/ES6)
- Library: jQuery 3.6.0
- Backend: PHP 8.x with cURL
- API: Expensify REST API

Key Components

1. api_proxy.php
   - Handles CORS issues by proxying requests to Expensify API
   - Adds required custom headers
   - Accepts application/x-www-form-urlencoded input and returns JSON output
   - Validates endpoints and request format

2. js/script.js
   - Manages application state and logic
   - Handles authentication flow
   - Performs AJAX requests via jQuery
   - Implements cookie-based session management
   - Efficiently renders large transaction lists
   - Provides error handling and user feedback

3. css/style.css
   - Clean, minimal design
   - Responsive layout
   - Accessible form elements
   - Smooth transitions and hover effects

Issues Solved

1. CORS Restrictions: Implemented PHP proxy to bypass browser CORS policies. All API requests route through api_proxy.php
2. Session Persistence: Used cookies to store authToken and userEmail. Automatically restores session on page refresh
3. Large Dataset Performance: Used DocumentFragment for efficient DOM manipulation. Minimized reflows and repaints when rendering transactions
4. Error Handling: Graceful error messages for failed API calls. Input validation on forms. User-friendly error display
5. Security: HTML escaping to prevent XSS attacks. Secure cookie storage. HTTPS API endpoints.  Use environment variables for sensitive data in config. Use HTTPS in production environments


I Humbly Recommend Future Enhancements

1. Pagination for large transaction lists
2. Transaction filtering and search
3. Edit/delete transaction functionality
4. PDF download of transactions list
5. Better error recovery mechanisms
6. Unit and integration tests
7. Backend session management instead of cookies



Conclusion
I built this application as a demonstration of full-stack web development skills with PHP, JavaScript, and RESTful API integration
