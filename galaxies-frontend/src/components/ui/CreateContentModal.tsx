//import { useState } from "react";
import { useRef, useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";
import { BACKEND_URL } from "../../config";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateContentModal: React.FC<CreateContentModalProps> = ({ open, onClose }) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState(ContentType.Youtube)

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You are not logged in. Please sign in again.");
            window.location.href = "/signin";
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/api/v1/content`, {
                link,
                type,
                title
            }, {
                headers: {
                    "Authorization": token
                }
            })
            onClose();
        } catch (error: any) {
            console.error("Error adding content:", error);
            if (error.response?.status === 403) {
                localStorage.removeItem("token");
                window.location.href = "/signin";
            } else {
                alert("Failed to add content. Please try again.");
            }
        }
    }

    return <div>
        {open && (<div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md">
            <div className="bg-white opacity-100 p-4 rounded shadow-lg">
                <div className="flex justify-end cursor-pointer" onClick={onClose}>
                    <CrossIcon />
                </div>
                <div>
                    <Input reference={titleRef} placeholder="Title" />
                    <Input reference={linkRef} placeholder="Link" />
                </div>
                <div>
                    <h1 className="flex justify-center items-center">Type</h1>
                    <div className="flex gap-1 p-4">
                        <Button text="Youtube" variant={type === ContentType.Youtube ? "primary" : "secondary"} onClick={() => {
                            setType(ContentType.Youtube)
                        }} />
                        <Button text="Twitter" variant={type === ContentType.Twitter ? "primary" : "secondary"} onClick={() => {
                            setType(ContentType.Twitter)
                        }} />
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <Button onClick={addContent} variant="primary" text="Submit" />
                </div>
            </div>
        </div>
        )}
    </div>
}
