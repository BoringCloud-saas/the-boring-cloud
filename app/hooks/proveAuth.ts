"use client"

import axios from "axios"
import { useState } from "react"

const useAuth = () => {
    const [status, setStatus] = useState<number | null>(null)

    const proveAuth = async () => {
        try {
            const response = await axios.post("https://0ec3c8da7ca8.ngrok.app/google/proveAuth")
            console.log(response.data)
            setStatus(response.data.status0)
            if (response.data.message == "No auth token or email found") {
                // redirect to sign in
                window.location.href = "https://0ec3c8da7ca8.ngrok.app/signin"
            }
            if (response.data.message == "Wrong access Token !") {
                // redirect to sign in
                window.location.href = "https://0ec3c8da7ca8.ngrok.app/signin"
            }
            return response.data.message
        } catch (err) {
            window.location.href = "https://0ec3c8da7ca8.ngrok.app/signin"
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveAuth, status }
}

export default useAuth
