const express = require("express");
const app = express();
const PORT = 3000;

app.get("/random/:min/:max", (req, res) => {

  const minVal = parseInt(req.params.min);
  const maxVal = parseInt(req.params.max);

    if (isNaN(minVal) || isNaN(maxVal)) {
      res.status(400);
      res.json({
        error: "Bad Request"
      });
      return;
    }
  
  const result = Math.round((Math.random() * (maxVal - minVal)) + minVal);
  res.json(
    result
  );
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})