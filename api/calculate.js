const math = require('mathjs');

// Simple numerical integration (Simpson's rule) fallback
function numericalIntegrate(expr, variable, a, b, n = 1000) {
  const h = (b - a) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    const scope = {};
    scope[variable] = x;
    const y = math.evaluate(expr, scope);
    const coefficient = (i === 0 || i === n) ? 1 : (i % 2 === 0 ? 2 : 4);
    sum += coefficient * y;
  }
  return (h / 3) * sum;
}

module.exports = async (req, res) => {
  // --- CORS (optional) ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // --- API Key Check ---
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  const validKey = process.env.API_KEY;

  if (!validKey) {
    return res.status(500).json({
      success: false,
      error: 'Server API key not configured.',
      creator: 'Aritra Nath',
      instagram: '@its_aritra_nath'
    });
  }

  if (apiKey !== validKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API key.',
      creator: 'Aritra Nath',
      instagram: '@its_aritra_nath'
    });
  }

  // --- Parse Request ---
  let expression, operation, variable, a, b;

  if (req.method === 'GET') {
    expression = req.query.expr;
    operation = req.query.op || 'evaluate';
    variable = req.query.var;
    a = req.query.a;
    b = req.query.b;
  } else if (req.method === 'POST') {
    const body = req.body || {};
    expression = body.expr;
    operation = body.op || 'evaluate';
    variable = body.var;
    a = body.a;
    b = body.b;
  }

  if (!expression) {
    return res.status(400).json({
      success: false,
      error: 'Missing "expr" parameter.',
      creator: 'Aritra Nath',
      instagram: '@its_aritra_nath'
    });
  }

  // --- Perform Calculation ---
  try {
    let result;

    switch (operation.toLowerCase()) {
      case 'evaluate':
      case 'eval':
        result = math.evaluate(expression);
        break;

      case 'derivative':
      case 'diff':
        if (!variable) {
          return res.status(400).json({
            success: false,
            error: 'Missing "var" parameter for derivative.',
            creator: 'Aritra Nath',
            instagram: '@its_aritra_nath'
          });
        }
        result = math.derivative(expression, variable).toString();
        break;

      case 'simplify':
        result = math.simplify(expression).toString();
        break;

      case 'integrate':
      case 'integral':
        if (a !== undefined && b !== undefined && variable) {
          // Numerical integration
          const lower = parseFloat(a);
          const upper = parseFloat(b);
          if (isNaN(lower) || isNaN(upper)) {
            throw new Error('Invalid integration bounds.');
          }
          result = numericalIntegrate(expression, variable, lower, upper);
        } else {
          // Attempt symbolic integration via mathjs-simple-integral (if installed)
          // Otherwise, return a helpful message.
          try {
            const simpleIntegral = require('mathjs-simple-integral');
            math.import(simpleIntegral, { override: true });
            result = math.integral(expression, variable).toString();
          } catch (e) {
            result = 'Symbolic integration not supported in this API. Please provide "var", "a", and "b" for numerical integration.';
          }
        }
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unsupported operation: ${operation}`,
          supported: ['evaluate', 'derivative', 'simplify', 'integrate'],
          creator: 'Aritra Nath',
          instagram: '@its_aritra_nath'
        });
    }

    // --- Success Response ---
    return res.status(200).json({
      success: true,
      operation: operation,
      expression: expression,
      result: result,
      creator: 'Aritra Nath',
      instagram: '@its_aritra_nath'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Calculation error.',
      creator: 'Aritra Nath',
      instagram: '@its_aritra_nath'
    });
  }
};