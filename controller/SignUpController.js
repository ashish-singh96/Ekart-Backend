import signup from "../model/SignUpModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRETKEY;
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


    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(403).json({ message: "Please fill all details!" });
            }

            const user = await signup.findOne({ email });

            if (!user) {
                return res.status(403).json({ message: "User not registered!" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    secretKey,
                    { expiresIn: '1h' }
                );

                return res.status(200).json({ message: "Login Successfully!", token });
            } else {
                return res.status(403).json({ message: "Password didn't match" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: "Logout Successfully!" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    }


    static forget = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await signup.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            // Generate token
            const token = generateToken();
            // Update user's reset token
            await signup.findByIdAndUpdate(user._id, { token });
            // Send reset email
            try {
                await sendResetEmail(email, token);
                return res.status(200).json({ message: "Password reset link sent to your registered email id" });
            } catch (emailError) {
                console.error(emailError);
                return res.status(500).json({ message: "Failed to send reset email" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error!" });
        }
    }


};

export default SignUpController;