/**
 * Environment Variable Test Script
 * Use this to verify that dotenv is loading variables correctly on Windows.
 */
require('dotenv').config();

console.log('--- Dotenv Verification ---');
console.log('Current Working Directory:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'FOUND (Length: ' + process.env.MONGODB_URI.length + ')' : 'NOT FOUND');
console.log('PORT:', process.env.PORT || 'NOT FOUND');
console.log('---------------------------');

if (process.env.MONGODB_URI) {
    console.log('✅ Success: Environment variables are being loaded correctly.');
} else {
    console.log('❌ Error: MONGODB_URI is missing. Check file name (.env) and path.');
}
