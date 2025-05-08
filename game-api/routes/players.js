const express = require('express');
const router = express.Router();
const pool = require('../db');

// Task 1: GET /players-scores
router.get('/players-scores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.name AS player_name, games.title AS game_title, scores.score
      FROM scores
      INNER JOIN players ON scores.player_id = players.id
      INNER JOIN games ON scores.game_id = games.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 2: GET /top-players
router.get('/top-players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.name, SUM(scores.score) AS total_score
      FROM players
      JOIN scores ON players.id = scores.player_id
      GROUP BY players.name
      ORDER BY total_score DESC
      LIMIT 3
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 3: GET /inactive-players
router.get('/inactive-players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT players.name
      FROM players
      LEFT JOIN scores ON players.id = scores.player_id
      WHERE scores.id IS NULL
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 4: GET /popular-genres
router.get('/popular-genres', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT games.genre, COUNT(*) AS play_count
      FROM scores
      JOIN games ON scores.game_id = games.id
      GROUP BY games.genre
      ORDER BY play_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task 5: GET /recent-players
router.get('/recent-players', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM players
      WHERE join_date >= CURRENT_DATE - INTERVAL '30 days'
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bonus: GET /favorite-games
router.get('/favorite-games', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT player_name, game_title FROM (
        SELECT 
          players.name AS player_name,
          games.title AS game_title,
          COUNT(scores.id) AS times_played,
          RANK() OVER (PARTITION BY players.id ORDER BY COUNT(scores.id) DESC) as rank
        FROM scores
        JOIN players ON scores.player_id = players.id
        JOIN games ON scores.game_id = games.id
        GROUP BY players.id, games.id
      ) ranked
      WHERE rank = 1
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
