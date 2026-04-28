// =============================================
// FILE: src/controllers/auth_controller.js
// =============================================

const service = require("../services/auth_service");

// =============================================
// LOGIN
// =============================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const result = await service.login(email, password);

    if (!result) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// LOGOUT
// =============================================

exports.logout = async (req, res) => {
  try {
    const token =
      req.headers.authorization.split(" ")[1];

    await service.logout(token);

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// =============================================
// GET CURRENT USER
// =============================================

exports.get_me = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};