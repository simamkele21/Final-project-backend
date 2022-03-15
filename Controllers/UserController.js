exports.allAccess = (req, res) => {
  res.status(200).send("Public Content");
};

exports.clientBoard = (req, res) => {
  res.status(200).send("Client Content");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content");
};
