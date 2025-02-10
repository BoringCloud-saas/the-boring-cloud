"use client"

import axios from "axios"
import { useState } from "react"

const useAuth = () => {
    const [status, setStatus] = useState<number | null>(null)

    const proveAuth = async () => {
        try {
            const response = await axios.post("http://localhost:3000/google/proveAuth")
            console.log(response.data)
            if (response.data.message == "No auth token or email found") {
                // redirect to sign in
                const url = window.location.href
                window.location.href = "http://localhost:3000/signin"
            }
            if (response.data.message == "Wrong access Token !") {
                // redirect to sign in
                const url = window.location.href
                window.location.href = "http://localhost:3000/signin"
            }
            return response.data.message
        } catch (err) {
            const url = window.location.href
            window.location.href = "http://localhost:3000/signin"
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveAuth, status }
}

export default useAuth
