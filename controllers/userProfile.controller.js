import prisma from "../db/dbConfig.js"
import { imageValidator } from "../utils/helper.js"
import { redis } from "../config/redis.config.js"

class profileContoller {

    static async allProfiles(req, res) {
        // try {
        //     const user = await prisma.users.findMany()
        //     return res.json({ status: 200, user })
        // } catch (error) {
        //     return res.status(500).json({ status: 500, error: "Internal server error" })
        // }

        try {

            let users = await redis.get("users")

            if (users) {
                // const users = await redis.get("users")
                console.log("got from cache");
                return res.status(201).json({
                    status: 201, users: JSON.parse(users)
                })
            }


            users = await prisma.users.findMany();

            await redis.setex("users", 30, JSON.stringify(users))
            return res.json({ status: 200, users })


        } catch (error) {
            return res.status(500).json({ status: 500, error: "Internal server error" })

        }
    }

    static async index(req, res) {
        try {
            const user = req.user
            return res.json({ status: 200, user })
        } catch (error) {
            return res.status(500).json({ status: 500, error: "Internal server error" })
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ status: 400, message: "Profile Image is Required" })
            }

            const profile = req.files.profile

            const message = imageValidator(profile.size, profile.mimetype)

            if (message !== null) {
                return res.status(400).json({
                    errors: {
                        profile: message
                    }
                })
            }

            const uploadPath = process.cwd() + '/public/images/' + profile.name

            profile.mv(uploadPath, (err) => {
                if (err) throw err
            })

            await prisma.users.update({
                data: {
                    profile: profile.name
                },

                where: {
                    id: Number(id)
                }
            })

            return res.status(200).json({
                status: 200,
                message: "Profile Image Updated Successfully"
            })
        }
        catch (error) {
            return res.status(500).json(
                {
                    status: 500,
                    error: "Internal server error"
                }
            )
        }

    }

}

export default profileContoller