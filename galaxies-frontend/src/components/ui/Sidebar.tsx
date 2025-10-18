import { useState, useEffect } from 'react';
import { BrainIcon } from "../../icons/BrainIcon";
import { XIcon } from "../../icons/xIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SidebarItems } from "./SidebarItem";

export const Sidebar = () => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e:any) => {
            if (e.clientX < 100) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-white border-r-2 w-72 transform transition-transform duration-700 ${
                isHovered ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}
        >
            <div className="flex font-semibold text-2xl pt-8 items-center pl-6">
                <div className="pr-2 text-purple-900">
                    <BrainIcon />
                </div>
                Second Brain
            </div>
            <div className="pt-10 pl-8">
                <SidebarItems text="X" icon={<XIcon />} />
                <SidebarItems text="YouTube" icon={<YoutubeIcon />} />
            </div>
        </div>
    );
};
