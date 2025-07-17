# HTTP Server Demo (TypeScript)

This project demonstrates a simple Node.js HTTP server, written in TypeScript, that hosts both a website and an API on the same server using different ports.

## Project Structure

- `src/server.ts` - Main server file with both API and web handlers.
- `src/test.ts` - Test file for the servers.
- `dist/` - Compiled JavaScript output.
- `package.json` - Project configuration.
- `tsconfig.json` - TypeScript compiler configuration.
- `README.md` - This file.

## Features

- **API Server** (Port 4513): Accepts POST requests only.
- **Web Server** (Port 4514): Accepts all HTTP requests.
- Both servers use a common response function.
- Console logging for request tracking.
- Written in TypeScript with type safety.
- Self-contained tests that manage the server lifecycle.

## How to Run

1.  Make sure you have Node.js installed (version 14 or higher).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the TypeScript code:
    ```bash
    npm run build
    ```
4.  Start the servers:
    ```bash
    npm start
    ```

## Testing the Servers

You can run the automated tests, which will automatically start and stop the servers.

```bash
npm test
```

Alternatively, you can use `curl` to test the endpoints manually after starting the server with `npm start`.

### Test the API Server (Port 4513)

```bash
# Test POST request (should work)
curl -X POST http://localhost:4513

# Test GET request (should return 405 Method Not Allowed)
curl http://localhost:4513
```

### Test the Web Server (Port 4514)

```bash
# Test GET request (should work)
curl http://localhost:4514

# Test POST request (should work)
curl -X POST http://localhost:4514
```

## Cleaning Up

To remove the compiled files and installed dependencies, run:

```bash
npm run clean
```

## Expected Output

When you run the server, you should see:

```
Both servers are now running!
API Server running on http://localhost:4513
API accepts POST requests only
Web Server running on http://localhost:4514
Web server accepts all requests
Press Ctrl+C to stop the servers
```

## Ports Used

- **4513**: API Server (POST requests only)
- **4514**: Web Server (all requests)

Both servers respond with "Request Completed" when successful. 