const Student = require('../../model/student');
const path = require('path');
const fs = require('fs');

class studentcontroller {

    // Create API 
    async create(req, res) {
        try {
            // This code is for uploading image with validation
            if (!req.file) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: ["Please enter student image it is required"]
                });
            }
            const studentdata = new Student({ ...req.body, image: req.file.path }); // Assign the image path for validation
            const data = await studentdata.save();
            res.status(200).json({ message: "Student added successfully", data });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "An unexpected error occurred" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }


    // Fetch student without pagination 
    // async getall(req, res) {
    //     try {
    //         const data = await Student.find()
    //         res.status(200).json({
    //             message: "Student get successfully",
    //             total: data.length,
    //             students: data
    //         })
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: "Error retrieving student data" });
    //     }
    // }

    // Fetch student using pagination
    async getall(req, res) {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = 3
            const totaldata = await Student.countDocuments()
            const totalpage = Math.ceil(totaldata / limit)
            const nextpage = totalpage > page ? page + 1 : null
            const prevpage = page > 1 ? page - 1 : null
            const data = await Student.find().skip((page - 1) * limit).limit(limit)
            res.status(200).json({
                message: "Data get sucessfully",
                data: data,
                pagination: {
                    page,
                    prevpage,
                    nextpage,
                    totalpage,
                    totaldata
                }
            })
        } catch (error) {
            console.log("Error get data...", error);
        }
    }


    // Get Single 
    async getsingle(req, res) {
        const id = req.params.id;
        try {
            const data = await Student.findById(id);
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Student not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving student data" });
        }
    }

    // Update Data
    async studentupdate(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        if (req.file) {
            const student = await Student.findById(id);
            const imagePath = path.resolve(__dirname, '../../../', student.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting image file:', err);
                    } else {
                        console.log('Image file deleted successfully:', student.image);
                    }
                });
            } else {
                console.log('File does not exist:', imagePath);
            }
        }
        // Deleting image from uploads folder end
        try {
            const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }
            );
            // File Handling Area
            if (req.file) {
                updatedStudent.image = req.file.path
                await updatedStudent.save(); // Save the document with the updated image
            }
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student updated successfully", data: updatedStudent });
        } catch (error) {
            const statusCode = error.name === 'ValidationError' ? 400 : 500;
            const message = error.name === 'ValidationError'
                ? { message: "Validation error", errors: Object.values(error.errors).map(err => err.message) }
                : { message: "Error updating student data" };

            console.error(error);
            res.status(statusCode).json(message);
        }
    }

    // Delete Student
    async studentdelete(req, res) {
        const id = req.params.id;
        // Deleting image from uploads folder start
        const student = await Student.findById(id);
        const imagePath = path.resolve(__dirname, '../../../', student.image);
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                } else {
                    console.log('Image file deleted successfully:', student.image);
                }
            });
        } else {
            console.log('File does not exist:', imagePath);
        }
        // Deleting image from uploads folder end
        try {
            const deletedStudent = await Student.findByIdAndDelete(id);
            res.status(deletedStudent ? 200 : 404).json(
                deletedStudent ? { message: "Student deleted successfully" } : { message: "Student not found" }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting student" });
        }
    }

    // Search API for filtering products by Brand
    async searchQuery(req, res) {
        const { name, email } = req.query;
        const filter = {};
        if (name) {
            filter.name = { $regex: new RegExp(name, 'i') }; 
        }
        if (email) {
            filter.email = { $regex: new RegExp(email, 'i') }; 
        }
        try {
            const students = await Student.find(filter);
            res.status(200).json({
                message: "Search student retrieving successfully",
                total: students.length,
                students: students
            });
        } catch (error) {
            console.error("Error retrieving search students:", error);
            res.status(500).json({ message: "Error retrieving students" });
        }
    }

    // Search using post data not query params
    async search(req, res) {
        try {
            let query = {}
            const search = req.body.search
            if (req.body.search) {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ]
                }
            }
            const data = await Student.find(query)
            res.status(200).json({
                message: "Data get sucessfully",
                data: data
            })
        } catch (error) {
            console.log("Error get data", error);
        }
    }
}


module.exports = new studentcontroller()