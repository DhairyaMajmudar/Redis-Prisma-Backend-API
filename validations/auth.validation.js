import vine from "@vinejs/vine";
import { JSONAPIErrorReporter } from "./error.js";

vine.errorReporter = () => new JSONAPIErrorReporter()

export const registerSchema = vine.object({
    name: vine.string().minLength(2).maxLength(50),
    email: vine.string().email().maxLength(50),
    password: vine.string().minLength(6).maxLength(50).confirmed()
})

export const loginSchema = vine.object({
    email: vine.string().email(),
    password: vine.string()
})