const User = require("../models/User");

const sendUser = async(req, res) => {
    try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        createdAt: user.createdAt,
    });
 
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", err:error.message });
    }

}


const updateUser = async (req, res) => {
    try {
        const id = req.user.id;
        const { name, email, image } = req.body;

        // Build update object only with provided fields
        const update = {};
        if (typeof name === 'string' && name.trim() !== '') update.name = name;
        if (typeof email === 'string' && email.trim() !== '') update.email = email;
        if (typeof image === 'string' && image.trim() !== '') update.image = image;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: user.provider,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
}

module.exports = {
    sendUser,   
    updateUser
};