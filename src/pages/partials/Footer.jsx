import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { pub } from '../../utils/assets';
import { useI18n } from '../../i18n';

const Footer = () => {
	const { t } = useI18n();
	return (
		<footer className="bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] text-gray-300">
			<div className="container mx-auto px-6 pt-16">
				<div className="grid md:grid-cols-3 gap-12">
					{/* About Section */}
					<div className="space-y-6">
						<img src={pub('logo.png')} alt="Logo" className="h-16 bg-white p-3 rounded-lg shadow-lg" />
						<p className="text-sm leading-relaxed text-gray-400">
							{t('footer.tagline','Your trusted partner for mobile, computer, and gaming console repairs in the Spain.')}
						</p>
						<div className="space-y-4">
							<div className="flex items-start space-x-3 group">
								<div className="bg-[#B32346] bg-opacity-10 p-2 rounded-lg group-hover:bg-opacity-20 transition-all">
									<FiMapPin className="text-lg text-white" />
								</div>
								<p className="text-sm leading-relaxed">130 CHORLEY OLD ROAD BL 13AT (BOLTON)</p>
							</div>
							<div className="flex items-center space-x-3 group">
								<div className="bg-[#B32346] bg-opacity-10 p-2 rounded-lg group-hover:bg-opacity-20 transition-all">
									<FiPhone className="text-lg text-white" />
								</div>
								<a href="tel:+34632404585" className="text-sm hover:text-white transition-colors">
									0034 632404585
								</a>
							</div>
							<div className="flex items-center space-x-3 group">
								<div className="bg-[#B32346] bg-opacity-10 p-2 rounded-lg group-hover:bg-opacity-20 transition-all">
									<FiMail className="text-lg text-white" />
								</div>
								<a href="mailto:techtrust76@gmail.com" className="text-sm hover:text-white transition-colors break-all">
									techtrust76@gmail.com
								</a>
							</div>
						</div>
					</div>

					{/* Quick Links Section */}
					<div>
						<h3 className="text-xl font-bold text-white mb-6 relative inline-block">
							{t('common.quickLinks','QUICK LINKS')}
							{/* <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#B32346] rounded-full"></span> */}
						</h3>
						<ul className="space-y-3">
							<li>
								<Link to="/" className="text-base hover:text-white hover:pl-2 transition-all duration-300 inline-block">
									→ {t('nav.home','Home')}
								</Link>
							</li>
							<li>
								<Link to="/about" className="text-base hover:text-white hover:pl-2 transition-all duration-300 inline-block">
									→ {t('nav.about','About Us')}
								</Link>
							</li>
							<li>
								<Link to="/services" className="text-base hover:text-white hover:pl-2 transition-all duration-300 inline-block">
									→ {t('nav.services','Services')}
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-base hover:text-white hover:pl-2 transition-all duration-300 inline-block">
									→ {t('nav.contact','Contact Us')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Newsletter Section */}
					<div>
						<h3 className="text-xl font-bold text-white mb-6 relative inline-block">
							{t('common.newsletter','NEWSLETTER')}
							{/* <span className="absolute bottom-0 left-0 w-12 h-1 bg-[#B32346] rounded-full"></span> */}
						</h3>
						<p className="text-sm text-gray-400 mb-4">{t('common.subscribeText','Subscribe to get updates on our latest services and offers.')}</p>
						<form className="space-y-3">
							<input
								type="email"
								placeholder="Your Email"
								className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B32346] w-full text-sm border border-gray-700"
							/>
							<button
								type="submit"
								className="bg-[#B32346] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 w-full text-base"
							>
								{t('common.subscribeNow','Subscribe Now')}
							</button>
						</form>

						{/* Social Links */}
						<div className="mt-6">
							<p className="text-sm text-gray-400 mb-3">{t('common.followUs','Follow Us:')}</p>
							<div className="flex space-x-3">
								<a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-[#B32346] transition-all duration-300 transform hover:scale-110 border border-gray-700">
									<FaFacebookF className="text-sm" />
								</a>
								<a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-[#B32346] transition-all duration-300 transform hover:scale-110 border border-gray-700">
									<FaTwitter className="text-sm" />
								</a>
								<a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-[#B32346] transition-all duration-300 transform hover:scale-110 border border-gray-700">
									<FaLinkedinIn className="text-sm" />
								</a>
								<a href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-[#B32346] transition-all duration-300 transform hover:scale-110 border border-gray-700">
									<FaInstagram className="text-sm" />
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 mt-12 py-8">
					<div className="flex justify-center">
						<p className="text-sm text-gray-500">
							© 2025 Mobile & Computer Care. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;