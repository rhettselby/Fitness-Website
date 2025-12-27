// import Logo from "@/assets/Logo.png" // TODO: Add Logo.png to src/assets/ directory

type Props = {}

const Footer = (props: Props) => {

    return (
        <footer className = "bg-primary-100 py-16">
            <div className = "justify-between mx-auto w-5/6 gap-16 md:flex">
                <div className = "mt-16 basis-1/2 md:mt-0">
                    {/* <img alt='logo' src={Logo} /> */}
                    <div className="font-bold text-xl text-gray-900">About</div>
                    <div>
                       <div>
                        Community.
                        </div>
                        <div>
                        Growth.
                        </div>
                        <div>
                        Fun.
                        </div>
                    </div>
                    <p>
                        Copy Right Rhett's Fitness Community All Rights Reserved
                    </p>

                </div>
                <div className="mt-16 basis-1/4 md:mt-0">
                    <h4 className="font-bold text-gray-900" >Links</h4>
                    <p className="mt-5 text-gray-900">https://fitness-website-git-main-rhettselbys-projects.vercel.app</p>
                    <p className="mt-5 text-gray-900">https://github.com/rhettselby</p>
                </div>
                <div className = "mt-16 basis-1/4 md:mt-0">
                    <h4 className="font-bold text-gray-900">Contact Us</h4>
                    <p className="mt-5 text-gray-900">rhettselby6@g.ucla.edu</p>
                    <p className="mt-5 text-gray-900">805-245-6513</p>

                </div>

            </div>

        </footer>

    )
}

export default Footer