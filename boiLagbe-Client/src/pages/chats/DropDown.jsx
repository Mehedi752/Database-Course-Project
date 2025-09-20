import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const Dropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`w-4 h-4 text-black cursor-pointer absolute top-1/2 -left-7 ${isOpen ? "inline-block" : "hidden"} -translate-y-1/2 group-hover:inline-block" ref={menuRef}`}>
                <BsThreeDotsVertical onClick={()=>setIsOpen(!isOpen)} className="w-4 h-4" />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md border">
                    <button className=" z-50  w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => alert("Delete clicked")}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dropdown;