const express = require('express');
const router = express.Router();
const { 
    getMachines, 
    getMachineById, 
    addMachine, 
    updateMachine, 
    deleteMachine, 
    controlMachine,
    assignJob
} = require('../controllers/machineController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public/Viewer Routes
router.get('/', protect, getMachines);//get all machines(/api/machines)
router.get('/:id', protect, getMachineById);//get details of single machine by id(/api/machines/:id)

// Engineer/Admin Routes
router.post('/:id/control', protect, authorize('Admin', 'Engineer'), controlMachine);//control machine start/stop(/api/machines/:id/control)

// Admin Only Routes (CRUD)
router.post('/', protect, authorize('Admin'), addMachine);//add new machine(/api/machines)
router.put('/:id', protect, authorize('Admin', 'Engineer'), updateMachine);//update machine details(/api/machines/:id)
router.delete('/:id', protect, authorize('Admin'), deleteMachine);//delete machine(/api/machines/:id)
router.route('/:id/job').put(protect, authorize('Admin', 'Engineer'), assignJob);//assigning job to machine(/api/machines/:id/job)

module.exports = router;