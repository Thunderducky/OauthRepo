const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true, 
        required: true
    },
    password: String, // might be unnecessary when we do Google integration
    authType: String,
    googleId: String
})

UserSchema.methods.checkPassword = function(password){
    return bcrypt.compare(password, this.password)
}

UserSchema.pre('save', function(next){
    if(this.authType !== "google"){
        return bcrypt.genSalt(10).then(salt => {
            return bcrypt.hash(this.password, salt)
        }).then(hash => {
            this.password = hash
            return Promise.resolve()
        })
    } else {
        return Promise.resolve()
    }
});

const User = mongoose.model("User", UserSchema)

module.exports = User;