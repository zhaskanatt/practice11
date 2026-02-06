function apiKeyAuth(req, res, next) {
  try {
    const expected = process.env.API_KEY;

    // если забыли задать ключ на сервере — безопасно запрещаем
    if (!expected) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const provided = req.header("x-api-key"); // читает заголовок x-api-key

    // нет ключа
    if (!provided) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ключ неверный
    if (provided !== expected) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (err) {
    // не падаем, не раскрываем детали
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = apiKeyAuth;
