module.exports = function(req, res) {
  res.status(200).json({ success: true, message: "Hello from CJS Lambda" });
};
