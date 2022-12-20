const app = require("./app");
const db = require("./src/models");

db.sequelize.sync().then((req) => {
  const port = 3000;
  app.listen(port, () => {
    console.log(
      `🚀 Server listening on port ${port}.\nvisit at https://localhost:${port}`
    );
  });
});
