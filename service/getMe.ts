"use server"

import { cookies } from "next/headers"

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value; // Get the accessToken from the browser's cookies

    if (!accessToken) {
        // throw new Error("User not logged in")

        return {
            success: false,
            message: "User not logged in"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
        headers: {
            Authorization: `${accessToken}`
        }
    })

    const result = res.json()

    return result
}