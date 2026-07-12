// Pure CJS entrypoint for Vercel
module.exports = async function(req, res) {
  try {
    // Dynamically import the ESM Express app
    const { default: app } = await import('./index.js');
    return app(req, res);
  } catch (err) {
    console.error('Vercel Boot Error:', err);
    res.status(200).json({
      success: false,
      error: 'VERCEL_BOOT_ERROR',
      message: err.message,
      stack: err.stack,
    });
  }
};
