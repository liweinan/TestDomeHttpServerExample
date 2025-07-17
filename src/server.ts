import * as http from "http";

// Common response function
const commonResponse = function(response: http.ServerResponse) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Request Completed");
};

// API handler - handles POST requests
const handleApi = function(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(`API Request: ${req.method} ${req.url}`);
    
    if (req.method === "POST") {
        commonResponse(res);
        res.end();
    } else {
        res.writeHead(405, {"Content-Type": "text/html"});
        res.write("Method Not Allowed - Only POST requests are accepted for API");
        res.end();
    }
};

// Website handler - handles GET, POST, PUT requests and query strings
const handleWeb = function(req: http.IncomingMessage, res: http.ServerResponse) {
    console.log(`Web Request: ${req.method} ${req.url}`);
    commonResponse(res);
    res.end();
};

// Create server instances
const apiServer = http.createServer(handleApi);
const webServer = http.createServer(handleWeb);

// Start servers only if the script is executed directly
if (require.main === module) {
    apiServer.listen(4513, () => {
        console.log("API Server running on http://localhost:4513");
        console.log("API accepts POST requests only");
    });

    webServer.listen(4514, () => {
        console.log("Web Server running on http://localhost:4514");
        console.log("Web server accepts all requests");
    });

    console.log("Both servers are now running!");
    console.log("Press Ctrl+C to stop the servers");
}

// Export servers for testing purposes
export { apiServer, webServer }; 