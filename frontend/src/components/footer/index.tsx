// import Logo from "@/assets/Logo.png" // TODO: Add Logo.png to src/assets/ directory

type Props = {}

const Footer = (props: Props) => {

    return (
        <footer className = "bg-primary-100 py-16">
            <div className = "justify-between mx-auto w-5/6 gap-16 md:flex">
                <div className = "mt-16 basis-1/2 md:mt-0">
                    {/* <img alt='logo' src={Logo} /> */}
                    <div className="font-bold text-xl">LOGO</div>
                    <p>
                        Three
                        Lines of 
                        text
                    </p>
                    <p>
                        Copy Right FitnessTracker All Rights Reserved
                    </p>

                </div>
                <div className="mt-16 basis-1/4 md:mt-0">
                    <h4 className="font-bold">Links</h4>
                    <p className="mt-5">Random Text</p>
                    <p className="mt-5"> Random Text v2</p>
                </div>
                <div className = "mt-16 basis-1/4 md:mt-0">
                    <h4 className="font-bold">Contact Us</h4>
                    <p className="mt-5">Random Text Yet Again</p>
                    <p>805-245-6513</p>

                </div>

            </div>

        </footer>

    )
}

export default Footer