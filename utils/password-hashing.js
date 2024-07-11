const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashingPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds)
        return hash
    }
    catch(err){
        console.log("Error in Hashing Password", err);
    }
   
}

module.exports = hashingPassword