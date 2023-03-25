
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ThisisSecretKey";

const fetchuser = (req, res, next) => {
    try {
        
        const token = req.header('authtoken');
        const data = jwt.verify(JSON.parse(token), JWT_SECRET);
        req.user = data.user;
        console.log(data);
        next();
        if (!token)
        {
            return res.status(401).send({ error: "Authentication denied" });
            }

    } catch (error) {
        res.status(401).send({ error: error.message });
    }
}

module.exports = fetchuser;