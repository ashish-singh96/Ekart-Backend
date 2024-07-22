import signup from "../model/SignUpModel.js";
import bcrypt from 'bcrypt';
class SignUpController {

    static register = async (req, res) => {
        try {
            const { name, email, mobile, password, cpassword, role } = req.body;
    
            if (!name || !email || !mobile || !password || !cpassword) {
                return res.status(403).json({ message: "Please fill all details" });
            }
    
            const emailExists = await signup.findOne({ email });
    
            if (emailExists) {
                return res.status(403).json({ message: "Email already registered" });
            }
    
            if (password !== cpassword) {
                return res.status(403).json({ message: "Passwords do not match" });
            }
    
            if (password.length <= 5) {
                return res.status(403).json({ message: "Enter a stronger password!" });
            }
    
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(403).json({ message: "Password must contain letters, numbers, and special characters!" });
            }
    
            const hashPassword = await bcrypt.hash(password, 10);
    
            const data = new signup({
                name: name,
                email: email,
                password: hashPassword,
                cpassword: hashPassword,
                role: role,
                mobile: mobile,
            });
            await data.save();
    
            res.status(200).json({ message: "Registered successfully! Please login to your account!" });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    };
    
};

export default SignUpController;