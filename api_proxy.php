<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: expensifyengineeringcandidate, Authorization, Content-Type'); 

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


require_once 'config.php';

// Here I checked the method in the request
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'GET'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST or GET.']);
    exit();
}

// The endpoints are the extra parameters added to the request body for url mapping

$endpoint = $_REQUEST['endpoint'] ?? null;

if (!$endpoint) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing endpoint parameter.']);
    exit();
}

// this is where I defined the main api endpoints dynamically, mapping each endpoint request params to the correct api endpoints

$endpointMap = [
    'authenticate' => 'https://www.expensify.com/api/Authenticate',
    'getTransaction' => 'https://www.expensify.com/api/Get',
    'createTransaction' => 'https://www.expensify.com/api/CreateTransaction'
];

if (!isset($endpointMap[$endpoint])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid endpoint: ' . $endpoint]);
    exit();
}

// I used unset method to remove all endpoint from data. A way to make data simple and clean before sending to the api url 
$data = $_REQUEST;
unset($data['endpoint']);

//  retreiving sensitive data and attatching to existing data 
$data['partnerName'] = PARTNER_NAME;
$data['partnerPassword'] = PARTNER_PASSWORD;



// Since endpointMap is an array, each endpoint is retrived using bracket notation

$apiUrl = $endpointMap[$endpoint];

// Client url (CURL) is initialized and the required parameter sent into it as array 
$ch = curl_init();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data), // data is sent as form data (application/x-www-form-urlencoded) not as json, so this method convert them to key&value format
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/x-www-form-urlencoded', 
            'expensifyengineeringcandidate: true'
        ],
        CURLOPT_TIMEOUT => 30,
    ]);
} else { // GET
    $queryString = http_build_query($data);
    curl_setopt_array($ch, [
        CURLOPT_URL => $apiUrl . ($queryString ? '?' . $queryString : ''), //here I mapped the request params to the url for get method
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'expensifyengineeringcandidate: true'
        ],
        CURLOPT_TIMEOUT => 30,
    ]);
}        


$response = curl_exec($ch); // here is where the real execution of the api call happened
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to connect to Expensify API',
        'details' => $curlError
    ]);
    exit();
}

http_response_code($httpCode);

echo $response; // this is the real dumping of the request parameters and headers to the expensify api
?>
