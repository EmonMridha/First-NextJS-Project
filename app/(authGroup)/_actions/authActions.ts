"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginState = {
    success: true,
    statusCode: number,
    message: string,
    data: {
        accessToken: string,
        refreshToken: string
    }
}

export const loginAction = async (prevState: LoginState, formData: FormData) => {

    const email = formData.get("email");
    const password = formData.get("password")

    const payLoad = {
        email,
        password
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payLoad)
    })

    const result = await res.json();

    if (result.success) {
        const cookieStore = await cookies()

        // Setting the accessToken into the browser
        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: "lax"
        })

        // setting the refresh token into the browser
        cookieStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax"
        })

        console.log(cookieStore.getAll());

        redirect("/dashboard", "replace")
    }
    return result
}