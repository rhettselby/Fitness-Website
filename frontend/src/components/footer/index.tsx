const Footer = () => {
  return (
    <footer className="bg-primary-100 py-12 md:py-16">
      <div className="mx-auto w-5/6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">

          {/* About */}
          <div>
            <div className="font-bold text-xl text-gray-900 mb-3">About</div>
            <div className="space-y-1 mb-4">
              <div className="text-gray-900">Community.</div>
              <div className="text-gray-900">Growth.</div>
              <div className="text-gray-900">Fun.</div>
            </div>
            <p className="text-gray-900 text-sm mt-4">
              Copyright Rhett's Fitness Community. All Rights Reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Links</h4>
            <a
              href="https://fitness-website-git-main-rhettselbys-projects.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-2 text-gray-900 text-sm break-all hover:text-primary-500 transition"
            >
              fitness-website...vercel.app
            </a>
            <a
              href="https://github.com/rhettselby"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 text-gray-900 text-sm hover:text-primary-500 transition"
            >
              github.com/rhettselby
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Contact Us</h4>
            <a
              href="mailto:rhettselby6@g.ucla.edu"
              className="block mt-2 text-gray-900 text-sm hover:text-primary-500 transition"
            >
              rhettselby6@g.ucla.edu
            </a>
            <a
              href="tel:+18052456513"
              className="block mt-3 text-gray-900 text-sm hover:text-primary-500 transition"
            >
              805-245-6513
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;