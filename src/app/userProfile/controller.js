const userProfile = require('./service');
const cloudinary = require('cloudinary').v2;
const userProfileController = {
    getUserProfile: async (req,res)=>{
        try{
            if(!req.user)
                return res.redirect("/user/login");
            return res.render("userprofile",{page_style:"/css/profile.css"});
        }catch{
            res.status(500).send("Internal Server Error");
        }
    },

    updateImage: async (req, res) => {
        if (!req.file) {
          return res.status(400).send("No file uploaded.");
        }
      
        const filePath = req.file.path; // URL của ảnh trên Cloudinary
        await userProfile.updateImage(req.user.id, filePath);

        
        res.status(200).json({ message: "Avatar updated successfully", avatarUrl: filePath });
      }
}

module.exports = userProfileController;