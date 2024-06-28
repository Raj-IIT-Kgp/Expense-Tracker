
import {useUserName} from '../hooks';


export const ProfileLogo = () => {

    const authorName = useUserName();
    const firstLetter = authorName ? authorName[0].toUpperCase() : 'A';
    return (
        <div className="relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full w-10 h-10 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <span className="text-md font-extralight text-white">
                {firstLetter}
            </span>
        </div>
    );
};