import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { PluseIcon } from "../icons/PluseIcon";
import { ShareIcon } from "../icons/ShareIcons";
import { Sidebar } from "../components/ui/Sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "../config";

const Dashboard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
    const {contents, refresh } = useContent();

    useEffect(()=> {
        refresh();
    },[modalOpen])

    useEffect(() => {
        const handleMouseMove = (e:any) => {
            if (e.clientX < 50 && !isLargeScreen) {
                setIsSidebarHovered(true);
            } else {
                setIsSidebarHovered(false);
            }
        };

        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, [isLargeScreen]);

    return (
        <div className="relative flex min-h-screen bg-gray-400 overflow-y-scroll no-scrollbar">
            <Sidebar />
            <div
                className={`p-4 flex-grow min-h-screen bg-gray-400 transition-all duration-500 ${
                    isSidebarHovered || isLargeScreen ? 'ml-72' : 'ml-0'
                }`}
            >
                <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />
                <div className="flex gap-4 justify-end py-4 px-4">
                    <Button onClick={async ()=>{
                        const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
                            share: true
                        },{
                            headers: {
                                "Authorization": localStorage.getItem("token")
                            }
                        })
                        const shareUrl = `http://127.0.0.1:5173/share/${response.data.hash}`
                        alert(shareUrl)
                    }} variant="secondary" text="Share Brain" startIcon={<ShareIcon />} />
                    <Button onClick={() => setModalOpen(true)} variant="primary" text="Add Content" startIcon={<PluseIcon />} />
                </div>
                <div className="flex gap-4 pl-4 flex-wrap">
                    {contents.map(({type, link, title})=><Card type={type} link={link} title={title}/>)}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
