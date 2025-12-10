

type Props = {
    name: string;
    description?: string;
    image: string;
    bio?: string | null;
    location?: string | null;
}

const Class = ({name, description, image, bio, location}: Props ) => {

    return (
        <li className="relative inline-block h-[280px] w-[280px]">
            {/* Main card display */}
            <div className="flex flex-col items-center justify-center h-[280px] w-[280px] bg-gray-200 border-2 border-primary-300 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-primary-500 mb-2">
                    🏋️
                </div>
                <p className="text-base font-bold text-gray-800 mb-2 px-3 text-center">
                    {name}
                </p>
                <p className="text-sm text-gray-600">
                    {description}
                </p>
            </div>
            {/* Hover overlay with profile information */}
            <div className="p-4 absolute top-0 left-0 z-30 flex h-[280px] w-[280px] flex-col items-center justify-center whitespace-normal bg-primary-500 text-center text-white opacity-0 transition duration-500 hover:opacity-90 rounded-lg border-2 border-primary-300">
                <p className="text-lg font-bold mb-2">
                    {name}
                </p>
                <p className="mb-3 text-sm">
                    {description}
                </p>
                {(bio || location) && (
                    <div className="mt-3 pt-3 border-t border-white/30 w-full">
                        {bio && (
                            <p className="text-xs mb-2 px-2">
                                <span className="font-semibold">Bio:</span> {bio}
                            </p>
                        )}
                        {location && (
                            <p className="text-xs px-2">
                                <span className="font-semibold">Location:</span> {location}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </li>
    )
}

export default Class