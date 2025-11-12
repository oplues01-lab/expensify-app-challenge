<?php 
// Use environment variables for sensitive data
// These will be set in Render's dashboard
define('PARTNER_NAME', getenv('PARTNER_NAME') ?: 'applicant');
define('PARTNER_PASSWORD', getenv('PARTNER_PASSWORD') ?: 'd7c3119c6cdab02d68d9');
