# Math API

A lightweight, JSON-based mathematics API built with **Node.js**, **Vercel Serverless Functions**, and **Math.js**. It supports evaluating expressions, differentiating expressions, simplifying expressions, and calculating definite integrals numerically. Requests are protected by an API key.

**Creator:** Aritra Nath  
**Instagram:** [@its_aritra_nath](https://www.instagram.com/its_aritra_nath/)

## Features

- **Evaluate** mathematical expressions.
- **Differentiate** an expression with respect to a variable.
- **Simplify** mathematical expressions.
- **Numerical definite integration** using Simpson's rule.
- **API-key authentication** through the `x-api-key` request header.
- Supports **GET** and **POST** requests.
- CORS headers for browser-based clients.
- Designed to deploy as a Vercel serverless function.

## API endpoint

After deployment, the endpoint is:

```text
https://YOUR-PROJECT.vercel.app/api/calculate
```

For local development with Vercel, it is typically:

```text
http://localhost:3000/api/calculate
```

## Authentication

Set an environment variable named `API_KEY` in your deployment environment. Every calculation request must provide the matching key using the `x-api-key` header.

```http
x-api-key: YOUR_API_KEY
```

The implementation also accepts an `apiKey` query parameter for compatibility, but using the header is recommended because query-string secrets can be recorded in URLs and logs. **Never commit your real API key to GitHub.**

## Supported operations

Pass the operation in the `op` field. The default is `evaluate`.

| Operation (`op`) | Aliases | Required parameters | Description |
|---|---|---|---|
| `evaluate` | `eval` | `expr` | Evaluates a mathematical expression. |
| `derivative` | `diff` | `expr`, `var` | Finds the symbolic derivative with respect to `var`. |
| `simplify` | — | `expr` | Simplifies a mathematical expression. |
| `integrate` | `integral` | `expr`, `var`, `a`, `b` for definite integration | Numerically integrates the expression from lower bound `a` to upper bound `b` using Simpson's rule. |

For integration, provide `var`, `a`, and `b` to calculate a definite integral. Symbolic integration is **not enabled by default**; without those bounds, the API returns a message explaining that numerical integration needs the variable and bounds.

## Usage examples

Replace `YOUR_API_KEY` with the value configured in your environment.

### 1. Evaluate an expression (GET)

```bash
curl -G "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "x-api-key: YOUR_API_KEY" \
  --data-urlencode "expr=sqrt(25) + 10" \
  --data-urlencode "op=evaluate"
```

Example success response:

```json
{
  "success": true,
  "operation": "evaluate",
  "expression": "sqrt(25) + 10",
  "result": 15,
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

### 2. Find a derivative (POST)

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"expr":"x^2 + 3*x","op":"derivative","var":"x"}'
```

### 3. Simplify an expression (GET)

```bash
curl -G "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "x-api-key: YOUR_API_KEY" \
  --data-urlencode "expr=2*x + 3*x" \
  --data-urlencode "op=simplify"
```

### 4. Calculate a definite integral (POST)

This example calculates the integral of `x^2` from `0` to `3`.

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"expr":"x^2","op":"integrate","var":"x","a":0,"b":3}'
```

The integral is evaluated numerically, so the returned value may contain a small floating-point rounding difference.

## Request parameters

| Parameter | Type | Required? | Details |
|---|---|---|---|
| `expr` | String | Yes | Mathematical expression to process. |
| `op` | String | No | Operation to run; defaults to `evaluate`. |
| `var` | String | For `derivative`; for definite `integrate` | Variable name, such as `x`. |
| `a` | Number | For definite `integrate` | Lower integration bound. |
| `b` | Number | For definite `integrate` | Upper integration bound. |

For GET requests, pass parameters as query parameters. For POST requests, send them in a JSON body.

## Response and errors

Successful calculations return HTTP `200` with `success: true`, the requested operation, the original expression, and the result.

Errors are returned as JSON and may include:

- `400 Bad Request` — missing expression, missing required variable, unsupported operation, invalid integration bounds, or a calculation error.
- `401 Unauthorized` — the API key is missing or invalid.
- `500 Internal Server Error` — the server's `API_KEY` environment variable is not configured.

Example error response:

```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API key.",
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

## Run locally

### Prerequisites

- Node.js and npm
- A Vercel account for deployment (optional for local use, but the Vercel CLI is used to emulate the deployment environment)

### 1. Clone the repository

```bash
git clone https://github.com/aiaritranath/math-api.git
cd math-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API key

Create a `.env.local` file in the project root and add a private key:

```env
API_KEY=replace-this-with-a-long-random-secret
```

Do not commit `.env.local` or share this secret publicly.

### 4. Start the local Vercel development server

```bash
npx vercel dev
```

Follow any first-run prompts from the Vercel CLI. The API should be available at `http://localhost:3000/api/calculate` when the local server starts on port `3000`.

## Deploy to Vercel

1. Push the project to your GitHub repository.
2. Import the repository into [Vercel](https://vercel.com/).
3. In the Vercel project's **Settings → Environment Variables**, add `API_KEY` and set its value to a strong, private secret.
4. Enable the variable for the environments you use (Production, Preview, and/or Development).
5. Deploy or redeploy the project.
6. Send requests to `https://YOUR-PROJECT.vercel.app/api/calculate` with the `x-api-key` header.

The included `vercel.json` uses Vercel configuration version `2`; the API handler lives at `api/calculate.js`.

## Project structure

```text
math-api/
├── api/
│   └── calculate.js   # API handler and math operations
├── package.json       # Project metadata and Math.js dependency
├── vercel.json        # Vercel configuration
└── README.md
```

## Notes and limitations

- Definite integration is performed numerically with Simpson's rule and a fixed number of subintervals; it is an approximation, not a symbolic antiderivative.
- Symbolic integration is not enabled by default in this project.
- The endpoint currently allows cross-origin requests (`Access-Control-Allow-Origin: *`). Authentication is still required, but you may wish to restrict allowed origins for your own deployment.
- An API key alone does not provide rate limiting or usage quotas. Add platform-level limits or other protections if you expose the endpoint publicly.

## License

No license file was included in the project archive. Add a `LICENSE` file if you want to specify how others may use, modify, or redistribute this project.
