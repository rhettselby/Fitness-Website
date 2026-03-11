import { useState } from "react";

type Props = {
  name: string;
  description?: string;
  image: string;
  bio?: string | null;
  location?: string | null;
};

const Class = ({ name, description, bio, location }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const hasExtra = !!(bio || location);

  return (
    <li
      className="relative w-[160px] sm:w-[220px] md:w-[280px] flex-shrink-0"
      onClick={() => hasExtra && setExpanded((v) => !v)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Base card */}
      <div className="flex flex-col items-center justify-center h-[160px] sm:h-[220px] md:h-[280px] w-full bg-gray-200 border-2 border-primary-300 rounded-lg shadow-lg">
        <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
          🏋️
        </div>
        <p className="text-sm md:text-base font-bold text-gray-800 mb-2 px-3 text-center">
          {name}
        </p>
        <p className="text-xs md:text-sm text-gray-600 px-2 text-center">
          {description}
        </p>
        {hasExtra && (
          <p className="mt-2 text-xs text-primary-400 md:hidden">tap for info</p>
        )}
      </div>

      {/* Overlay — hover on desktop, tap on mobile */}
      <div
        className={`
          p-4 absolute top-0 left-0 z-30
          flex flex-col items-center justify-center
          h-[160px] sm:h-[220px] md:h-[280px] w-full
          whitespace-normal bg-primary-500 text-center text-white
          rounded-lg border-2 border-primary-300
          transition-opacity duration-300
          ${expanded ? "opacity-90" : "opacity-0"}
          md:hover:opacity-90
        `}
      >
        <p className="text-base font-bold mb-1">{name}</p>
        <p className="mb-2 text-sm">{description}</p>
        {hasExtra && (
          <div className="mt-2 pt-2 border-t border-white/30 w-full">
            {bio && (
              <p className="text-xs mb-1 px-2">
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
  );
};

export default Class;