export default async function handler(req, res) {
  try {
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
}
