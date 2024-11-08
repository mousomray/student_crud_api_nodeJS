const express = require('express')
const studentcontroller = require('../../controller/apicontroller/studentcontroller')
const uploadImage = require('../../helper/studentimage') // Image handle Area
const router = express.Router()

router.post('/create', uploadImage.single('image'), studentcontroller.create) // Create API 
router.get('/studentlist', studentcontroller.getall) // Get API
router.get('/singlestudent/:id', studentcontroller.getsingle) // Get Single API
router.put('/edit/:id', uploadImage.single('image'), studentcontroller.studentupdate) // Edit Data 
router.delete('/delete/:id', studentcontroller.studentdelete) // Delete Data 

module.exports = router