import * as http from 'http';
import { apiServer, webServer } from './server'; // Import server instances

// Test configuration
const API_PORT: number = 4513;
const WEB_PORT: number = 4514;

interface TestResult {
    statusCode?: number;
    data: string;
    headers: http.IncomingHttpHeaders;
}

// Helper function to make HTTP requests
function makeRequest(port: number, method: string = 'GET', path: string = '/'): Promise<TestResult> {
    return new Promise((resolve, reject) => {
        const options: http.RequestOptions = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res: http.IncomingMessage) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data,
                    headers: res.headers
                });
            });
        });

        req.on('error', (err: Error) => {
            reject(err);
        });

        req.end();
    });
}

// Test functions (no changes needed here)
async function testApiServer(): Promise<void> {
    console.log('\n=== Testing API Server (Port 4513) ===');
    
    // Test POST request (should work)
    console.log('Testing POST request...');
    const postResult = await makeRequest(API_PORT, 'POST');
    console.log(`POST Response: ${postResult.statusCode} - "${postResult.data}"`);
    
    // Test GET request (should fail with 405)
    console.log('Testing GET request...');
    const getResult = await makeRequest(API_PORT, 'GET');
    console.log(`GET Response: ${getResult.statusCode} - "${getResult.data}"`);
}

async function testWebServer(): Promise<void> {
    console.log('\n=== Testing Web Server (Port 4514) ===');
    
    // Test GET request (should work)
    console.log('Testing GET request...');
    const getResult = await makeRequest(WEB_PORT, 'GET');
    console.log(`GET Response: ${getResult.statusCode} - "${getResult.data}"`);
    
    // Test POST request (should work)
    console.log('Testing POST request...');
    const postResult = await makeRequest(WEB_PORT, 'POST');
    console.log(`POST Response: ${postResult.statusCode} - "${postResult.data}"`);
}

async function verifyStatements(): Promise<void> {
    console.log('\n=== Verifying Statements ===');
    let allTestsPassed = true;

    // 1. Test handleWeb with GET, POST, PUT
    console.log('Testing handleWeb with GET, POST, PUT...');
    const webGet = await makeRequest(WEB_PORT, 'GET');
    const webPost = await makeRequest(WEB_PORT, 'POST');
    const webPut = await makeRequest(WEB_PORT, 'PUT');

    if (webGet.statusCode === 200 && webGet.data === 'Request Completed' &&
        webPost.statusCode === 200 && webPost.data === 'Request Completed' &&
        webPut.statusCode === 200 && webPut.data === 'Request Completed') {
        console.log('  [PASS] handleWeb correctly handles GET, POST, and PUT.');
    } else {
        console.log('  [FAIL] handleWeb did not handle GET, POST, and PUT as expected.');
        allTestsPassed = false;
    }

    // 2. Test handleApi with POST
    console.log('Testing handleApi with POST...');
    const apiPost = await makeRequest(API_PORT, 'POST');
    if (apiPost.statusCode === 200 && apiPost.data === 'Request Completed') {
        console.log('  [PASS] handleApi correctly handles POST.');
    } else {
        console.log('  [FAIL] handleApi did not handle POST as expected.');
        allTestsPassed = false;
    }
    
    // 3. Test handleWeb with a query string
    console.log('Testing handleWeb with a query string...');
    const webQuery = await makeRequest(WEB_PORT, 'GET', '/test?param=value');
    if (webQuery.statusCode === 200 && webQuery.data === 'Request Completed') {
        console.log('  [PASS] handleWeb correctly handles a request with a query string.');
    } else {
        console.log('  [FAIL] handleWeb did not handle a query string as expected.');
        allTestsPassed = false;
    }
    
    console.log(`\nVerification Result: ${allTestsPassed ? 'All statements verified!' : 'Some statements failed verification.'}`);
}

// Main test function to manage server lifecycle
async function runTests(): Promise<void> {
    console.log('Starting server tests...');

    // Start servers
    await new Promise<void>(resolve => apiServer.listen(API_PORT, resolve));
    await new Promise<void>(resolve => webServer.listen(WEB_PORT, resolve));
    console.log('Servers started for testing on ports 4513 and 4514.');

    try {
        // Run all tests
        await testApiServer();
        await testWebServer();
        await verifyStatements();
    } catch (error) {
        console.error("An error occurred during tests:", error);
    } finally {
        // Stop servers
        await new Promise<void>((resolve, reject) => apiServer.close(err => err ? reject(err) : resolve()));
        await new Promise<void>((resolve, reject) => webServer.close(err => err ? reject(err) : resolve()));
        console.log('Servers stopped.');
    }
    
    console.log('\n=== Test Summary ===');
    console.log('API Server (4513): Should accept POST, reject others.');
    console.log('Web Server (4514): Should accept GET, POST, PUT and handle query strings.');
    console.log('\nTests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

export { makeRequest, testApiServer, testWebServer, verifyStatements }; 