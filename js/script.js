// Global variables
let authToken = null;
let userEmail = null;

// Running the app on document ready
$(document).ready(function() {
    authToken = getCookie('authToken');
    userEmail = getCookie('userEmail');
    
    // Checking whether auth token exist, if yes, fetch transaction else show login form;
    if (authToken) {
        showTransactionsSection();
        fetchTransactions();
    } else {
        showLoginSection();
    }
    
    // Event handlers
    $('#login-form').on('submit', handleLogin);
    $('#add-transaction-form').on('submit', handleAddTransaction);
    $('#logout-btn').on('click', handleLogout);
});




// User Authentication 
function handleLogin(e) {
    e.preventDefault();
    
    // retrieve input values and remove extra space
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    
    $('#login-error').text('');
    // Basic validation
    if (!email || !password) {
        $('#login-error').text('Please enter both email and password.');
        return;
    }

  
    // Using ajax to authenticate, to ensure page don't refresh on submitting user credentials
    $.ajax({
        url: 'api_proxy.php', //this is the php file where the url routing to the main api enpoint took place
        method: 'POST',
        data: {
            endpoint: 'authenticate',
            partnerUserID: email,
            partnerUserSecret: password
            
        },
        dataType: "json",
        success: function(response) {
            if (response.authToken) {
                // Storing authtoken and user email in cookies
                authToken = response.authToken;
                userEmail = email;
                setCookie('authToken', authToken, 7);
                setCookie('userEmail', userEmail, 7);
                // console.log(response)
                // Display transactions List if the authentication is successful
                showTransactionsSection();
                fetchTransactions();
            } else {
                // console.log(response)
                $('#login-error').text('Authentication failed. Try entering password again.');
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'Login failed. Please try again.';
            
            // Handle specific error codes
            if (xhr.status === 401) {
                errorMessage = 'Password is wrong. Try entering password again.';
            } else if (xhr.status === 404) {
                errorMessage = 'Account not found. Make sure you are using a valid email address.';
            } else if (xhr.status === 407) {
                errorMessage = 'AuthToken expired. Please log in again.';
            } else if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            }
            
            $('#login-error').text(errorMessage);
        }
    });
}


//   Fetch all transactions
 
function fetchTransactions() {
    $('#loading').show();
    $('#transactions-error').text('');
    $('#transactions-body').empty();
    
    $.ajax({
        url: 'api_proxy.php',
        method: 'GET',
        data: {
            endpoint: 'getTransaction',
            authToken: authToken,
            returnValueList: 'transactionList'   //this is required for fetching transaction
        },        
        dataType: "json",

        success: function(response) {
            $('#loading').hide();
            console.log(response)
            
            if (response.transactionList && Array.isArray(response.transactionList)) {
                renderTransactions(response.transactionList);
            } else {

                $('#transactions-error').text('No transactions found.');
            }
        },
        error: function(xhr, status, error) {
            $('#loading').hide();
            let errorMessage = 'Failed to fetch transactions.';
            console.error(error)
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            }
            $('#transactions-error').text(errorMessage);
        }
    });
}


// Here dom is manipulated to display the large dataset


function renderTransactions(transactions) {
    const tbody = $('#transactions-body');
    tbody.empty();
    
    if (transactions.length === 0) {
        tbody.append('<tr><td colspan="4" class="no-data">No transactions yet</td></tr>');
        return;
    }
    
    // He I built the rows efficiently
    const fragment = document.createDocumentFragment();
    
    transactions.forEach(function(transaction, index) {
        const row = document.createElement('tr');
        
        // Format date
        const date = transaction.created ;
        
        // Extract transaction details
        const merchant = transaction.merchant;
        const amount = transaction.amount;
        const currency = transaction.currency;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${date}</td>
            <td>${escapeHtml(merchant)}</td>
            <td>${formatAmount(amount)}</td>
            <td>${escapeHtml(currency)}</td>
        `;
        
        fragment.appendChild(row);
    });
    
    tbody.append(fragment);
}


//  Handle add transaction form submission
 
function handleAddTransaction(e) {
    e.preventDefault();
    
    const date = $('#transaction-date').val();
    const merchant = $('#merchant').val();
    const amount = parseFloat($('#amount').val());
    
    $('#add-transaction-error').text('');
    
    $.ajax({
        url: 'api_proxy.php',
        method: 'POST',
        data: {
                endpoint: 'createTransaction',
                authToken: authToken,
                created: date,
                merchant: merchant,
                amount: amount,
        },
        success: function(response) {
            
            if (response.transactionID || response.success !== false) {
                // Clear form
                $('#add-transaction-form')[0].reset();
                
                // Add new transaction to table instantly
                const newTransaction = {
                    created: date,
                    merchant: merchant,
                    amount: amount,
                };
                
                addTransactionToTable(newTransaction);
            } else {
                $('#add-transaction-error').text('Failed to create transaction.');
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = 'Failed to create transaction.';
            if (xhr.responseJSON && xhr.responseJSON.error) {
                errorMessage = xhr.responseJSON.error;
            }
            $('#add-transaction-error').text(errorMessage);
        }
    });
}


//  Adding a single transaction to the table
 
function addTransactionToTable(transaction) {
    const tbody = $('#transactions-body');
    
    let serialNumber =  1;


    // Remove "no data" row if present
    tbody.find('.no-data').parent().remove();
    
    const row = $('<tr>');
    row.html(`
        <td></td>
        <td>${transaction.created}</td>
        <td>${escapeHtml(transaction.merchant)}</td>
        <td>${formatAmount(transaction.amount)}</td>        
        <td>${escapeHtml(transaction.currency)}</td> 
    `);
    
    // Add to top of table
    tbody.prepend(row);
}


//  For ease of testing the app, I added logout
 
function handleLogout() {
    // Clear cookies
    deleteCookie('authToken');
    deleteCookie('userEmail');
    
    // Reset state
    authToken = null;
    userEmail = null;
    
    // Show login section
    showLoginSection();
    
    // Clear forms and data
    $('#login-form')[0].reset();
    $('#add-transaction-form')[0].reset();
    $('#transactions-body').empty();
    $('#login-error').text('');
    $('#transactions-error').text('');
    $('#add-transaction-error').text('');
}


 //Show login section
 
function showLoginSection() {
    $('#login-section').show();
    $('#transactions-section').hide();
    $('#user-info').hide();
}


 // Show transactions section
 
function showTransactionsSection() {
    $('#login-section').hide();
    $('#transactions-section').show();
    $('#user-info').show();
    $('#user-email').text(userEmail);
}

 

//Cookie management functions
 
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Utility functions
 


function formatAmount(amount) {
    if (amount === null || amount === undefined) return '0.00';
    return parseFloat(amount).toFixed(2);
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function(m) { return map[m]; });
}




function downloadTableAsPDF() {
    // Select only the transactions table section
    const tableSection = document.getElementById('transactions-table-container');

    // Open a new print window
    const printWindow = window.open('', '', 'width=900,height=700');

    // Write only that section's HTML with your full site styling
    printWindow.document.write(`
        <html>
        <head>
            <title>Transactions History</title>
            <link rel="stylesheet" href="css/style.css">
            <style>
                /* Optional print adjustments */
                body {
                    background: white !important;
                    padding: 40px;
                }
                header, #add-transaction-section, #logout-btn {
                    display: none !important;
                }
                #transactions-table-container {
                    box-shadow: none !important;
                    overflow: visible !important;
                }
                .t-table-container::-webkit-scrollbar {
                    display: none;
                }
                @page {
                    size: A4;
                    margin: 15mm;
                }
            </style>
        </head>
        <body>
            ${tableSection.outerHTML}
        </body>
        </html>
    `);

    // Wait for the document to finish loading, then print
    printWindow.document.close();
    printWindow.focus();

    // Add a short delay to ensure styles load before print
    setTimeout(() => {
        printWindow.print();
    }, 500);
}
