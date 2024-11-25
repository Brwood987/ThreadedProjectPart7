// Written by Ben Wood

const express = require('express');
const router = express.Router();
const db = require('../config/db'); //Import the database connection
const { body, param, validationResult } = require('express-validator'); //Import validators

//Helper function for sending validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//Fetch all products (GET /products)
router.get('/', (req, res) => {
    const query = 'SELECT * FROM Products';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to fetch products' });
        } else {
            res.json(results);
        }
    });
});

//Fetch a single product by ID (GET /products/:id)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Products WHERE ProductId = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to fetch product' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.json(results[0]);
        }
    });
});

//Create a new product (POST /products)
router.post(
    '/',
    body('ProdName').isString().notEmpty().withMessage('Product name must be a non-empty string'),
    validateRequest,
    (req, res) => {
        const { ProdName } = req.body;
        const query = 'INSERT INTO Products (ProdName) VALUES (?)';

        db.query(query, [ProdName], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Handle duplicate entries
                    res.status(400).json({ error: 'Duplicate entry. Product already exists.' });
                } else {
                    // General database error
                    res.status(500).json({ error: 'Database query failed', details: err.message });
                }
                return;
            }
            res.status(201).json({ message: 'Product created', productId: results.insertId });
        });
    }
);

//Update a product by ID (PUT /products/:id)
router.put(
    '/:id',
    [
        param('id').isInt().withMessage('Product ID must be an integer'),
        body('ProdName').isString().notEmpty().withMessage('Product name must be a non-empty string')
    ],
    validateRequest,
    (req, res) => {
        const { id } = req.params;
        const { ProdName } = req.body;
        const query = 'UPDATE Products SET ProdName = ? WHERE ProductId = ?';

        db.query(query, [ProdName, id], (err, results) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to update product' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Product not found' });
            } else {
                res.json({ message: 'Product updated' });
            }
        });
    }
);

// Delete a product by ID (DELETE /products/:id)
router.delete(
    '/:id',
    param('id').isInt().withMessage('Product ID must be an integer'),
    validateRequest,
    (req, res) => {
        const { id } = req.params;
        const query = 'DELETE FROM Products WHERE ProductId = ?';

        db.query(query, [id], (err, results) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Failed to delete product' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: `No product found with ID ${id}` });
            } else {
                res.json({ message: 'Product deleted successfully' });
            }
        });
    }
);

module.exports = router;
