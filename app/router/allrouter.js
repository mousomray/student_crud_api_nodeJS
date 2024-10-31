const express = require('express')
const allcontroller = require('../controller/allcontroller')
const router = express.Router()

router.post('/create', allcontroller.create) // Create API 
router.get('/studentlist', allcontroller.getall) // Get API
router.get('/singlestudent/:id', allcontroller.getsingle) // Get Single API
router.put('/edit/:id', allcontroller.studentupdate) // Edit Data 
router.delete('/delete/:id', allcontroller.studentdelete) // Delete Data 

module.exports = router