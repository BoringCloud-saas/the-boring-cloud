"use client"

import axios from "axios"
import { useState } from "react"

const useGmail = () => {
    const watchRequest = async () => {
        try {
            const response = await axios.post("https://ec26-2001-871-25f-1b02-115-8b33-1eb1-e220.ngrok-free.app/webhook/gmail")
            console.log(response.data)
        } catch (err) {
            console.error("auth hook catch err: ", err)
        }
    }

    return { watchRequest }
}

export default useGmail
