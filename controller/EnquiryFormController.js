import enquiry from "../model/EnquiryForm.js";
class EnquiryFormController {

    static insert_enquiry = async (req, res) => {
        try {
            const { name, email, mobile, message } = req.body;
    
            if (!name || !email || !mobile || !message) {
                return res.status(400).json({ message: "Please fill all the data!" });
            }
    
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format!" });
            }
    
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(mobile)) {
                return res.status(400).json({ message: "Invalid mobile number!" });
            }
    

            const data = new enquiry({
                name: name.trim(),
                email: email.trim(),
                mobile: mobile.trim(),
                message: message.trim(),
            });
    
            await data.save();
    
            res.status(200).json({ message: "Message inserted successfully!" });
        } catch (error) {
            console.error("Error inserting enquiry:", error);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    };

    static get_enquiry = async (req, res) => {
        try {
            const data = await enquiry.find();
            if(data){
               return res.status(200).json({message:"Data get successfully!",data});
            }else{
                res.status(400).json({message:"Data not found!"});
            }
        } catch (error) {
           res.status(500).json({message:"Internal Server Error!"}); 
        }
    }

    
}
export default EnquiryFormController;