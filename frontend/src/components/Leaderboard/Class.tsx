

type Props = {
    name: string;
    description?: string;
    image: string;
    bio?: string | null;
    location?: string | null;
    rank?: number;
}

const Class = ({name, description, image, bio, location, rank}: Props ) => {

    const getEmoji = () => {
        if (rank === 1) return "🥇"; // Gold medal
        if (rank === 2) return "🥈"; // Silver medal
        if (rank === 3) return "🥉"; // Bronze medal
        return "🏋️"; // Default for 4th and 5th
    };

    return (
        <li className="relative inline-block h-[220px] w-[220px]">
            {/* Main card display */}
            <div className="flex flex-col items-center justify-center h-[220px] w-[220px] bg-gray-200 border-2 border-primary-300 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-primary-500 mb-2">
                    {getEmoji()}
                </div>
                <p className="text-base font-bold text-gray-800 mb-2 px-3 text-center">
                    {name}
                </p>
                <p className="text-sm text-gray-600">
                    {description}
                </p>
            </div>
            {/* Hover overlay with profile information */}
            <div className="p-4 absolute top-0 left-0 z-30 flex h-[220px] w-[220px] flex-col items-center justify-center whitespace-normal bg-primary-500 text-center text-white opacity-0 transition duration-500 hover:opacity-90 rounded-lg border-2 border-primary-300">
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