const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
module.exports = app;

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
       SELECT 
       *
       FROM
       cricket_team
       ORDER BY
       player_id
    `;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const playerQuery = `
        INSERT INTO 
        cricket_team (playerName, jerseyNumber, role)
        VALUES (
        '${playerName},
         ${jerseyNumber},
         ${role});`;

  const dbResponse = await db.run(playerQuery);
  const playerId = dbResponse.lastID;
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `
    UPDATE
        cricket_team
    SET
        player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
    WHERE
        player_id = ${playerId}`;

  await db.run(playerQuery);
  response.send("Players Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
