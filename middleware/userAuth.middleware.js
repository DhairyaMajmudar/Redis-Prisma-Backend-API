import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (authHeader === null || authHeader === undefined) {
        return res.status(407).json({
            status: 407,
            message: "Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(407).json({ status: 407, message: "Unauthorized" })
        }

        req.user = user
        next()
    })
}

export default authMiddleware