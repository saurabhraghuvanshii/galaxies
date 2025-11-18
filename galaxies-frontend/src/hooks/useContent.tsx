import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export const useContent = () => {
    const [contents, setContents] = useState([]);

    function refresh() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }

        axios.get(`${BACKEND_URL}/api/v1/content`,{
            headers: {
                "Authorization": token
            }
        })
        .then((response) => {
            setContents(response.data.content)
        })
        .catch((error) => {
            console.error("Error fetching content:", error);
            if (error.response) {
                // Server responded with error status
                console.error("Error response:", error.response.data);
                if (error.response.status === 403) {
                    // Token invalid or expired
                    localStorage.removeItem("token");
                    window.location.href = "/signin";
                }
            } else if (error.request) {
                // Request made but no response
                console.error("No response received:", error.request);
            } else {
                // Something else happened
                console.error("Error:", error.message);
            }
        })
    }
    useEffect(()=> {
        refresh()
        let interval = setInterval(()=>{
            refresh()
        },10*1000)
        
        return () => {
            clearInterval(interval)
        }

    }, [])

    return {contents, refresh};

}