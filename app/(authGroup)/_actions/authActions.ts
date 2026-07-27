"use server"

import { cookies } from "next/headers"

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

    console.log(prevState, "previous state");

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

    const result: LoginState = await res.json();

    if (result.success) {
        const cookieStore = await cookies()

        cookieStore.set("accTok", result.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: "lax"
        })

        cookieStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax"
        })
    }
    return result
}