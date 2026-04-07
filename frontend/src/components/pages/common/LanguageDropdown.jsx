import { Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

const LanguageDropdown = () => {
const [open, setOpen] = useState(false);
const [language, setLanguage] = useState("English");

const languages = ["English", "Hindi", "Spanish", "French"];

return ( <div className="relative">
<button
onClick={() => setOpen(!open)}
className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
> <Globe className="h-4 w-4" /> <span className="hidden sm:inline">{language}</span> <ChevronDown className="h-4 w-4" /> </button>

 {open && (
 <div className="absolute right-0 mt-2 w-36 rounded-md border border-gray-200 bg-white shadow-lg z-50">
 {languages.map((lang) => (
 <button
 key={lang}
 onClick={() => {
 setLanguage(lang);
 setOpen(false);
 }}
 className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
 >
 {lang}
 </button>
 ))}
 </div>
 )}
</div>


);
};

export default LanguageDropdown;


