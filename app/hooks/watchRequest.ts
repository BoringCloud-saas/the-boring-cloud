"use client"

import axios from "axios"
import { useState } from "react"

const useGmail = () => {
    const watchRequest = async () => {
        try {
            const response = await axios.post("https://0ec3c8da7ca8.ngrok.app/webhook/gmail")
            console.log(response.data)
        } catch (err) {
            console.error("auth hook catch err: ", err)
        }
    }

    return { watchRequest }
}

export default useGmail
