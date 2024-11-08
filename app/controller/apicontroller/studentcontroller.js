const Student = require('../../model/student');

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


    // Get API 
    async getall(req, res) {
        try {
            const data = await Student.find()
            res.status(200).json({
                message: "Student get successfully",
                total: data.length,
                students: data
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error retrieving student data" });
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
        try {
            const deletedStudent = await Student.findByIdAndDelete(id);
            res.status(deletedStudent ? 200 : 404).json(
                deletedStudent ? { message: "Student deleted successfully", delete: deletedStudent } : { message: "Student not found" }
            );
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error deleting student" });
        }
    }




}


module.exports = new studentcontroller()