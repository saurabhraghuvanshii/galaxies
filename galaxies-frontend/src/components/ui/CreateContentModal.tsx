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

export const CreateContentModal = ({ open, onClose }) => {
    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>();
    const [type, setType] = useState(ContentType.Youtube)

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        await axios.post(`${BACKEND_URL}/api/v1/content`,{
            link,
            type,
            title
        },{
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        onClose();
    }

	return <div> 
        {open && ( <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md"> 
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
                        <Button text="Youtube" variant={type === ContentType.Youtube? "primary": "secondary"} onClick={() =>{
                            setType(ContentType.Youtube)
                        }}/>
                        <Button text="Twitter" variant={type === ContentType.Twitter? "primary": "secondary"} onClick={() =>{
                            setType(ContentType.Twitter)}}/>
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
