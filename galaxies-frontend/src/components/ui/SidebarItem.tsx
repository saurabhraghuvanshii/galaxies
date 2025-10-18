import { ReactElement } from "react";


export const SidebarItems = ({text, icon} : {text: string; icon:ReactElement}) =>  {

    return <div className="flex text-gray-700 py-2 cursor-pointer hover:bg-gray-100 rounded max-w-48 pl-4 transition-all duration-150">
        <div className="pr-2">
            {icon}
        </div>
        <div className="">
            {text}
        </div>
    </div>
}