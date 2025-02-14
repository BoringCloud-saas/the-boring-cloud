"use client"

import axios from "axios"

const useEmail = () => {
    const proveEmail = async (ID: string) => {
        try {
            const response = await axios.post("https://0ec3c8da7ca8.ngrok.app/api/email", {
                historyID: ID,
            })
            return response.data.message
        } catch (err) {
            console.error("auth hook catch err: ", err)
        }
    }

    return { proveEmail }
}

export default useEmail
