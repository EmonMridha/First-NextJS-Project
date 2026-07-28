import jwt from "jsonwebtoken"

const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret) // Finding the jwtPayload of the token owner
        return {
            success: true,
            data: verifiedToken
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            success: false,
            error: error.message
        }
    }
}

export const jwtUtils = {
    verifyToken
}