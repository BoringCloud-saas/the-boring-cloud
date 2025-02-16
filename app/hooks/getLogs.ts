"use client"

import axios from "axios"

const useLogs = () => {
    const proveLogs = async () => {
        try {
            const response = await axios.post("https://27886bad9908.ngrok.app/api/logs")
            return response
        } catch (err) {
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveLogs }
}

export default useLogs
