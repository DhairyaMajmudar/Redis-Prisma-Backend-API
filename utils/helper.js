import { supportedMimeTypes } from "../config/fileSystem.js"

export const imageValidator = (size, mime) => {
    if (bytesToMb(size) > 2) {
        return 'Image size should be less than 2MB'
    }

    else if (!supportedMimeTypes.includes(mime)) {
        return 'Unsupported file type'
    }

    return null

}

export const bytesToMb = (bytes) => {
    return bytes / (1024 * 1024)
} 