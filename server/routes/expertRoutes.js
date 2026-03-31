const express = require('express');
const router = express.Router();
const { 
    createExpert, 
    getExperts, 
    getExpertById, 
    getFeaturedExperts,
    deleteExpert,
    updateExpert
} = require('../controllers/expertController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedExperts);

router.route('/')
    .post(protect, createExpert)
    .get(protect, getExperts);

router.route('/:id')
    .get(protect, getExpertById)
    .delete(protect, admin, deleteExpert)
    .put(protect, admin, updateExpert);

module.exports = router;
