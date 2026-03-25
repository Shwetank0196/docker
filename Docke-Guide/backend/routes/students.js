const express = require('express');
const router = express.Router();
const { db } = require('../database');

// GET all students
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM students ORDER BY created_at DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching students:', err.message);
      return res.status(500).json({ error: 'Failed to fetch students' });
    }
    res.json({ students: rows, count: rows.length });
  });
});

// GET single student by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM students WHERE id = ?';

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching student:', err.message);
      return res.status(500).json({ error: 'Failed to fetch student' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(row);
  });
});

// POST create new student
router.post('/', (req, res) => {
  const { name, age, father_name, aadhaar_number, class: studentClass } = req.body;

  // Validation
  if (!name || !age || !father_name || !aadhaar_number || !studentClass) {
    return res.status(400).json({
      error: 'All fields are required',
      required: ['name', 'age', 'father_name', 'aadhaar_number', 'class']
    });
  }

  // Validate Aadhaar number (12 digits)
  if (!/^\d{12}$/.test(aadhaar_number)) {
    return res.status(400).json({
      error: 'Invalid Aadhaar number. Must be 12 digits.'
    });
  }

  // Validate age
  if (isNaN(age) || age < 1 || age > 100) {
    return res.status(400).json({
      error: 'Invalid age. Must be between 1 and 100.'
    });
  }

  const sql = `
    INSERT INTO students (name, age, father_name, aadhaar_number, class)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, age, father_name, aadhaar_number, studentClass], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
          error: 'Student with this Aadhaar number already exists'
        });
      }
      console.error('Error creating student:', err.message);
      return res.status(500).json({ error: 'Failed to create student' });
    }

    res.status(201).json({
      message: 'Student created successfully',
      id: this.lastID,
      student: { id: this.lastID, name, age, father_name, aadhaar_number, class: studentClass }
    });
  });
});

// PUT update student
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, father_name, aadhaar_number, class: studentClass } = req.body;

  // Validation
  if (!name || !age || !father_name || !aadhaar_number || !studentClass) {
    return res.status(400).json({
      error: 'All fields are required',
      required: ['name', 'age', 'father_name', 'aadhaar_number', 'class']
    });
  }

  // Validate Aadhaar number (12 digits)
  if (!/^\d{12}$/.test(aadhaar_number)) {
    return res.status(400).json({
      error: 'Invalid Aadhaar number. Must be 12 digits.'
    });
  }

  // Validate age
  if (isNaN(age) || age < 1 || age > 100) {
    return res.status(400).json({
      error: 'Invalid age. Must be between 1 and 100.'
    });
  }

  const sql = `
    UPDATE students
    SET name = ?, age = ?, father_name = ?, aadhaar_number = ?, class = ?
    WHERE id = ?
  `;

  db.run(sql, [name, age, father_name, aadhaar_number, studentClass, id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
          error: 'Another student with this Aadhaar number already exists'
        });
      }
      console.error('Error updating student:', err.message);
      return res.status(500).json({ error: 'Failed to update student' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student: { id, name, age, father_name, aadhaar_number, class: studentClass }
    });
  });
});

// DELETE student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      console.error('Error deleting student:', err.message);
      return res.status(500).json({ error: 'Failed to delete student' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      message: 'Student deleted successfully',
      id: parseInt(id)
    });
  });
});

module.exports = router;
