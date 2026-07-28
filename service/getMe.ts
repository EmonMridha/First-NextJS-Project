"use server"

import { cookies } from "next/headers"

export const getMe = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value; // Get the accessToken from the browser's cookies

    if (!accessToken) {

        return {
            success: false,
            message: "User not logged in"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/user/me`, {
        headers: {
            Authorization: `${accessToken}`
        },

        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24,
            tags: ["my-profile"]
        }
    })

    const result = res.json()

    return result
}