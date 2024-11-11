const cryto = require("crypto");

const Crypto = {
    generateToken: () => {
        return cryto.randomBytes(64).toString("hex");
    },
};

module.exports = Crypto;
