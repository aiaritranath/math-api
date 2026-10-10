# 🔢 Private Math API

A private REST API for evaluating mathematical expressions, differentiating and simplifying expressions, and performing numerical integration. Built with **Node.js**, **Math.js**, and **Vercel Serverless Functions**.

Every API response includes creator metadata:

- **Creator:** Aritra Nath
- **Instagram:** [@its_aritra_nath](https://www.instagram.com/its_aritra_nath/)

## ✨ Features

- API-key authentication using the `x-api-key` header or `apiKey` query parameter
- `GET` and `POST` requests
- Expression evaluation with Math.js
- Symbolic differentiation
- Expression simplification
- Numerical integration using Simpson's rule
- JSON responses and CORS support
- Deployable to Vercel

## 🚀 Deployment

### 1. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository into [Vercel](https://vercel.com/).
3. In **Project → Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `API_KEY` | A long, random secret value |

4. Apply the variable to the environments you need (Production, Preview, and/or Development).
5. Redeploy after adding or changing the environment variable.

Your endpoint will be:

```text
https://YOUR-PROJECT.vercel.app/api/calculate
```

Replace `YOUR-PROJECT` with your actual Vercel project domain.

### 2. Run locally

Requirements: a supported Node.js LTS release and npm.

```bash
npm install
```

Set `API_KEY` in your environment before running or testing the function. For example, in macOS/Linux:

```bash
export API_KEY="replace-with-a-long-random-secret"
```

In Windows PowerShell:

```powershell
$env:API_KEY = "replace-with-a-long-random-secret"
```

This repository is configured for Vercel serverless functions. For local Vercel-style development, install the Vercel CLI and run:

```bash
npm install --global vercel
vercel dev
```

Do not commit your real API key or put it directly into source code.

## 🔐 Authentication

The server reads the expected secret from the `API_KEY` environment variable.

You can provide the key in either of these ways:

**Recommended — request header**

```http
x-api-key: YOUR_API_KEY
```

**Alternative — query parameter**

```text
?apiKey=YOUR_API_KEY
```

Prefer the header because query parameters can be recorded in browser history, server logs, analytics, and shared URLs. Never expose this private key in browser-side JavaScript or a public frontend. If a frontend needs to use the API, call it through your own protected backend.

## 📡 Endpoint

```text
/api/calculate
```

Supported methods: `GET`, `POST`, and `OPTIONS` (for CORS preflight).

### Request parameters

| Key | Required? | Description | Example |
|---|---|---|---|
| `expr` | Yes | Mathematical expression to process | `sqrt(16)+pi` |
| `op` | No | Operation; defaults to `evaluate` | `derivative` |
| `var` | For derivative; for bounded integration | Variable name | `x` |
| `a` | For numerical integration | Lower bound | `0` |
| `b` | For numerical integration | Upper bound | `1` |
| `x-api-key` header or `apiKey` query parameter | Yes | API secret | `YOUR_API_KEY` |

For `POST`, send the calculation fields as a JSON object. Authentication can still be sent in the `x-api-key` header.

## ⚙️ Supported operations

| `op` value | Alias | Description | Additional fields |
|---|---|---|---|
| `evaluate` | `eval` | Evaluates an expression | None |
| `derivative` | `diff` | Symbolically differentiates an expression | `var` |
| `simplify` | — | Simplifies an expression | None |
| `integrate` | `integral` | Numerically integrates over a range; may attempt optional symbolic integration if the optional package is installed | For numerical integration: `var`, `a`, `b` |

### 1. Evaluate an expression

**GET**

```text
https://YOUR-PROJECT.vercel.app/api/calculate?expr=sqrt(16)%2Bpi
```

Include your key as the `x-api-key` header, or add `&apiKey=YOUR_API_KEY` for a quick test.

**POST**

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"expr":"2 + 3 * 4","op":"evaluate"}'
```

Example response:

```json
{
  "success": true,
  "operation": "evaluate",
  "expression": "2 + 3 * 4",
  "result": 14,
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

### 2. Differentiate an expression

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"expr":"x^2 + x","op":"derivative","var":"x"}'
```

The result is returned as a string representing the derivative.

### 3. Simplify an expression

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"expr":"(x^2 - 1)/(x - 1)","op":"simplify"}'
```

Math.js simplification is expression-based; transformations can depend on the form of the input and do not necessarily handle every algebraic identity.

### 4. Numerical integration

The API uses Simpson's rule with 1,000 subintervals by default. Simpson's rule works best for sufficiently smooth functions; the result is a numerical approximation.

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/calculate" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"expr":"x^2","op":"integrate","var":"x","a":0,"b":1}'
```

Expected result is approximately `0.3333333333`.

If `a`, `b`, or `var` are omitted, the code attempts to load the optional `mathjs-simple-integral` package for symbolic integration. That package is **not listed in the supplied `package.json`**, so symbolic integration will normally return a helpful message unless you install and configure a compatible package.

## 🧮 Math.js expression reference

Expressions are evaluated by [Math.js](https://mathjs.org/docs/expressions/syntax.html). The functions below are common examples, not a guarantee that every function or syntax is available in every context. Refer to the Math.js documentation for exact behavior and supported signatures.

### Arithmetic and operators

```text
+  -  *  /  ^  %  mod  !  ()
```

Examples: `2 + 3 * 4`, `5!`, `2^10`

### Constants

```text
pi  e  i  Infinity  NaN  true  false  null  tau  phi
```

Availability and meaning depend on Math.js syntax and version.

### Powers, roots, and logarithms

```text
sqrt(x)  cbrt(x)  square(x)  pow(x,y)  exp(x)
log(x)  log10(x)  log2(x)  nthRoot(x,n)
```

### Trigonometry and hyperbolic functions

```text
sin(x)  cos(x)  tan(x)  asin(x)  acos(x)  atan(x)
atan2(y,x)  sinh(x)  cosh(x)  tanh(x)
asinh(x)  acosh(x)  atanh(x)
```

Additional functions may be available, depending on Math.js: `sec`, `csc`, `cot`, `asec`, `acsc`, `acot`, `sech`, `csch`, and `coth`. Check the Math.js documentation for supported names.

### Rounding and absolute values

```text
abs(x)  sign(x)  ceil(x)  floor(x)  round(x)  fix(x)  trunc(x)
```

### Combinatorics and probability

```text
factorial(n)  combinations(n,k)  permutations(n,k)
random()  randomInt(min,max)
```

Other special functions may be supported by Math.js; check the documentation for the installed version.

### Statistics

Common examples include:

```text
min(...)  max(...)  sum(...)  mean(...)  median(...)
mode(...)  std(...)  variance(...)  prod(...)  cumsum(...)
```

### Matrices and arrays

Examples:

```text
det([1,2;3,4])
transpose([1,2;3,4])
inv([1,2;3,4])
dot([1,2,3],[4,5,6])
size([1,2;3,4])
```

Math.js supports matrix and array operations; exact syntax and input shapes matter.

### Algebra and calculus

```text
derivative(expr, variable)
simplify(expr)
rationalize(expr)
solve(equation, variable)
```

These are examples of Math.js functions, but their availability and exact behavior should be verified against the installed Math.js version. The API's dedicated `derivative` and `simplify` operations are implemented directly in the endpoint. Numerical integration is implemented by this project; `integrate` is not a standard Math.js expression function.

### Units

Examples:

```text
5 cm to inch
10 kg to lb
```

### Logical, comparison, and bitwise operations

Examples of supported expression syntax and functions can include:

```text
and  or  not  xor
==  !=  <  >  <=  >=
bitAnd(a,b)  bitOr(a,b)  bitXor(a,b)
leftShift(a,b)  rightShift(a,b)  bitNot(a)
```

Check Math.js documentation for exact names and syntax.

### Strings and formatting

Math.js supports strings and a range of formatting and utility functions. Function names such as `concat`, `format`, and `print` may have context-specific behavior; check the documentation before relying on them in an API expression.

> **Tip:** URL-encode expressions when calling the endpoint with GET. For example, encode `+` as `%2B`, or use a client that handles query-string encoding. POST requests avoid most URL-encoding issues.

## 📋 Error responses

### Missing expression — HTTP 400

```json
{
  "success": false,
  "error": "Missing \"expr\" parameter.",
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

### Invalid or missing API key — HTTP 401

```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API key.",
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

### API key not configured — HTTP 500

```json
{
  "success": false,
  "error": "Server API key not configured.",
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

### Unsupported operation — HTTP 400

```json
{
  "success": false,
  "error": "Unsupported operation: unknown",
  "supported": ["evaluate", "derivative", "simplify", "integrate"],
  "creator": "Aritra Nath",
  "instagram": "@its_aritra_nath"
}
```

Other expression or calculation errors return HTTP 400 with an `error` message and creator metadata.

## 🧰 Technology stack

- Node.js
- [Math.js](https://mathjs.org/)
- Vercel Serverless Functions

## 📁 Project structure

```text
math-api/
├── api/
│   └── calculate.js
├── package.json
├── vercel.json
└── README.md
```

## 🔧 Adding another top-level operation

Open `api/calculate.js` and add a new `case` to the `switch (operation.toLowerCase())` statement. Validate any required parameters, calculate the result, and return a consistent JSON response. Test locally and redeploy to Vercel.

## 🔒 Security notes

- Keep `API_KEY` private and configure it as a Vercel environment variable.
- Do not commit secrets or publish them in client-side code.
- Use the `x-api-key` header instead of a query parameter for normal usage.
- The supplied endpoint currently allows CORS from any origin (`*`). CORS is not authentication; consider restricting allowed origins if only specific browser-based sites should call it.
- Math expressions are user input. Consider rate limiting, request-size limits, and additional resource controls before exposing the endpoint publicly.
- This README documents the behavior of the supplied implementation; it does not imply that every Math.js function listed above has been independently tested through this API.

## 👨‍💻 Creator

**Aritra Nath**

- Instagram: [@its_aritra_nath](https://www.instagram.com/its_aritra_nath/)

---

If this project helps you, consider giving the repository a ⭐ on GitHub.
