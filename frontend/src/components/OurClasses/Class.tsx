

type Props = {
    name: string;
    description?: string;
    image: string;
}

const Class = ({name, description, image}: Props ) => {

    const overLayStyles = `p-5 absolute z-30 flex
    h-[380px] w-[450px] flex-col items-center justify-center
    whitespace-normal bg-primary-500 text-center text-white
    opacity-0 transition duration-500 hover:opacity-90`;
    return (
        <li className="relative mx-5 inline-block h-[380px] w-[450px]">
            <div className = {overLayStyles}>
                <p className = "text-2xl">
                    {name}
                </p>
                <p className="mt-5">
                    {description}
                </p>
            </div>
            <img 
                alt={name} 
                src={image} 
                className="h-[380px] w-[450px] object-cover"
                onError={(e) => {
                    console.error(`Failed to load image for ${name}:`, image);
                    e.currentTarget.style.display = 'none';
                }}
            />
        </li>



    )
}

export default Class