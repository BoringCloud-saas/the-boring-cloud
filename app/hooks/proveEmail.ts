"use client"

import axios from "axios"

const useEmail = () => {
    const proveEmail = async (ID: string) => {
        try {
            const response = await axios.post("https://9a4fc9678fde.ngrok.app/api/email", {
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
