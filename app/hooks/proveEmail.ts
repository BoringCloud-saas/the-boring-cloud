"use client"

import axios from "axios"

const useEmail = () => {
    const proveEmail = async (ID: string) => {
        try {
            const response = await axios.post("https://27886bad9908.ngrok.app/api/email", {
                historyID: ID,
            })
            return response
        } catch (err) {
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveEmail }
}

export default useEmail
