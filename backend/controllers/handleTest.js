const handleTest =  (req, res) => {
    const { username, password } = req.body;
  
    try {
      if (!username) throw Error("username is required");
      res.status(200).json({ status: "success", data: "some data" });
    } catch (error) {
      res.status(403).json({ status: "error", error: error.message });
    }
  }
  module.exports = handleTest;