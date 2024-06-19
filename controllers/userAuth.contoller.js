import prisma from "../db/dbConfig.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
class AuthController {
    static async register(req, res) {
        try {
            const body = req.body
            const validator = vine.compile(registerSchema)
            const payload = await validator.validate(body)

            const findUser = await prisma.users.findUnique({
                where: {
                    email: payload.email
                }
            })

            if (findUser) {
                return res.status(401).json(
                    {
                        status: 401,
                        error: "User already exists"
                    }
                )
            }

            const salt = bcrypt.genSaltSync(10)
            payload.password = bcrypt.hashSync(payload.password, salt)

            const user = await prisma.users.create({
                data: payload
            })

            return res.json({
                status: 200,
                message: "User created successfully",
                user
            })

        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages })
            }
            else {
                // res.status(500).json({ status: 500, error: "Internal server error" })
                throw new ApiError(500, "Internal server error")
            }
        }
    }

    static async login(req, res) {

        try {
            const body = req.body

            const validator = vine.compile(loginSchema)
            const payload = await validator.validate(body)

            const findUser = await prisma.users.findUnique({
                where:
                {
                    email: payload.email
                }
            })

            if (findUser) {
                if (!bcrypt.compareSync(payload.password, findUser.password)) {
                    return res.status(403).json({
                        status: 403,
                        errors: {
                            password: "Invalid password"
                        }
                    })
                }

                const payload_data = {
                    name: findUser.name,
                    id: findUser.id,
                    email: findUser.email,
                }
                const token = jwt.sign(payload_data, process.env.JWT_SECRET, { expiresIn: '365d' })

                return res.status(201).json({ status: 201, message: "Login successful", access_token: `Bearer ${token}` })
            }


            return res.status(402).json({
                status: 402,
                errors: {
                    email: "Invalid Email"
                }
            })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: error.messages })
            }
            else {
                // res.status(500).json({ status: 500, error: "Internal server error" })
                throw new ApiError(500, "Internal server error")
            }
        }
    }
}

export default AuthController;