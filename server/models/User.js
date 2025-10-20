import mongoose from "mongoose";
import bctypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 20 },
})

//hash password
userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bctypt.genSalt(10);
    this.password = await bctypt.hash(this.password,salt);
    next(); 
})

const User = mongoose.model('User',userSchema);

export default User;