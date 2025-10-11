import React, { useState, useEffect, useRef, memo } from 'react';
import { useI18n } from '../i18n';
import { pub } from '../utils/assets';
import { FiSmartphone, FiShoppingCart, FiZap, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import API_URL from '../utils/api';
import { FiShoppingBag, FiDollarSign, FiShield, FiCheckCircle, FiRefreshCw, FiAward } from 'react-icons/fi';
import { BsPhoneFill } from 'react-icons/bs';

const ALL_SERVICES = [
	{ key: 'webDevelopment', name: 'Web Development', img: '/service-1.jpg' },
	{ key: 'mobileComputerRepair', name: 'Mobile & Computer Repairing', img: '/service-2.jpg' },
	{ key: 'gamingConsoleRepair', name: 'Gaming Console Repairing', img: '/service-3.jpg' },
	{ key: 'playstationSpecialist', name: 'Specialist in Playstation', img: '/service-4.jpg' },
	{ key: 'mobileUpdate', name: 'Mobile Update', img: '/service-5.jpg' },
	{ key: 'tvRepair', name: 'TV Repairing', img: '/service-6.jpg' },
	{ key: 'mobileUnlocking', name: 'Mobile Unlocking', img: '/service-7.jpg' },
	{ key: 'mobileSaleAndPurchase', name: 'Mobile Sale & Purchase', img: '/service-8.jpg' },
	{ key: 'printingScanning', name: 'Photocopy, Printing & Scanning', img: '/service-9.jpg' },
];

const TABS_DATA = [
	{
		title: 'Are you too an iphone user?',
		content:
			'Iphones are used widely by all age groups. People find much convenience in using iphone. It also gives them a feeling of luxury yet comfort. Once you switch to iphones, you are always likely using it. The iphone lovers are also very particular about their phone charger.',
	},
	{
		title: 'Does your iphone also need repair?',
		content:
			"Even with the best care, iPhones can sometimes need repairs. Whether it's a cracked screen, a battery issue, or a software glitch, our expert technicians are here to help get your device back to perfect working condition quickly and efficiently.",
	},
	{
		title: 'What services we provide?',
		content:
			'We offer a comprehensive range of services for all your gadgets, including screen replacement, battery swaps, water damage repair, data recovery, and much more for phones, tablets, laptops, and gaming consoles.',
	},
];

const ServiceGridCard = memo(function ServiceGridCard({ service, index, visible, t }) {
	return (
		<div
			className={`bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-500 ease-out group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
			style={{ willChange: 'transform, opacity' }}
		>
			<img loading="lazy" src={pub(service.img)} alt={service.name} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
			<div className="p-6">
				<h3 className="text-lg font-semibold text-gray-800">{t(`home.services.${service.key}`, service.name)}</h3>
			</div>
		</div>
	);
});

const Services = () => {
	const { t } = useI18n();
	const [activeTab, setActiveTab] = useState(0);
	const [isVisible, setIsVisible] = useState({});
	const [loading, setLoading] = useState(true);
	const observerRef = useRef(null);
	const shuffledRef = useRef(null);

	const [serviceFormData, setServiceFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		serviceType: '',
		description: ''
	});
	const [serviceSubmitStatus, setServiceSubmitStatus] = useState({ type: '', message: '' });
	const [isServiceSubmitting, setIsServiceSubmitting] = useState(false);

	const [reviews, setReviews] = useState([]);
	const [showAllReviews, setShowAllReviews] = useState(false);
	const [reviewsLoading, setReviewsLoading] = useState(true);

	useEffect(() => {
		const sections = document.querySelectorAll('.section-animate');
		if (!sections.length) return;


		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
					}
				});
			},
			{ root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
		);

		sections.forEach((section) => observerRef.current.observe(section));

		return () => {
			if (observerRef.current) {
				sections.forEach((section) => observerRef.current.unobserve(section));
				observerRef.current.disconnect();
			}
		};
	}, []);

	useEffect(() => {
		const t = setTimeout(() => setLoading(false), 600);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const response = await axios.get(`${API_URL}/api/reviews/approved`);
				const data = response?.data;
				if (Array.isArray(data)) {
					setReviews(data);
				} else if (data && Array.isArray(data.data)) {
					setReviews(data.data);
				} else {
					setReviews(data ? [data] : []);
				}
			} catch (error) {
				console.error('Error fetching reviews:', error);
			} finally {
				setReviewsLoading(false);
			}
		};
		fetchReviews();
	}, []);

	const handleServiceInputChange = (e) => {
		const { name, value } = e.target;
		setServiceFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleServiceSubmit = async (e) => {
		e.preventDefault();
		setIsServiceSubmitting(true);
		setServiceSubmitStatus({ type: '', message: '' });

		try {
			await axios.post(`${API_URL}/api/service-requests`, {
				name: `${serviceFormData.firstName} ${serviceFormData.lastName}`,
				email: serviceFormData.email,
				phone: serviceFormData.phone,
				serviceType: serviceFormData.serviceType || 'General Service',
				description: serviceFormData.description || 'Service request from website'
			});

			setServiceSubmitStatus({
				type: 'success',
				message: t('services.successMessage', 'Thank you! Your service request has been submitted.')
			});

			setServiceFormData({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				serviceType: '',
				description: ''
			});
		} catch (error) {
			setServiceSubmitStatus({
				type: 'error',
				message: t('services.errorMessage', 'Something went wrong. Please try again.')
			});
		} finally {
			setIsServiceSubmitting(false);
		}
	};


	return (
		<main className="bg-white">
			{loading ? (
				<section className="h-[50vh] flex items-center justify-center bg-gray-100">
					<div className="animate-pulse w-3/4 max-w-2xl">
						<div className="h-10 bg-gray-200 rounded mb-4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					</div>
				</section>
			) : (
				<section
					className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-white"
					style={{ backgroundImage: `url('${pub('services-hero-bg.jpg')}')` }}
				>
					<div className="absolute inset-0 bg-gradient-to-r from-[#b32346] to-[#4b2781] opacity-80"></div>
					<div className="relative text-center z-10 p-4 transition-opacity duration-1000 animate-[fade-in-down_1s_ease-out]">
						<h1 className="text-5xl md:text-6xl font-bold leading-tight">{t('services.title', 'Services')}</h1>
						<p className="text-lg opacity-90 transition-opacity duration-1000 animate-[fade-in-up_1s_ease-out]">{t('services.breadcrumb', 'Home / About')}</p>
					</div>
				</section>
			)}

			<section id="mobile-sale-purchase" className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-white to-purple-50">
				<div className="container mx-auto px-6 max-w-7xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto mb-4">
							{t('services.mobileTrade.title', 'Mobile Sale & Purchase')}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b32346] to-[#4b2781]">.</span>
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">
							{t('services.mobileTrade.lead', 'Buy certified pre-owned phones or sell your device for the best value in the market')}
						</p>
					</div>

					{/* Two Column Layout */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

						{/* Left: Featured Selling Card */}
						{loading ? (
							<div className="rounded-3xl p-10 bg-gray-100 animate-pulse">
								<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
								<div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
								<div className="h-6 bg-gray-200 rounded w-1/2"></div>
							</div>
						) : (
							<div className="rounded-3xl p-10 text-white bg-gradient-to-br from-[#b32346] via-[#8b2860] to-[#4b2781] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
								<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
								<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 group-hover:scale-150 transition-transform duration-700"></div>

								<div className="relative z-10">
									<h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/90">
										{t('services.mobileTrade.sell.kicker', 'SELL YOUR DEVICE')}
									</h3>
									<p className="text-3xl font-bold mb-6 leading-tight">
										{t('services.mobileTrade.sell.title', 'Turn Your Old Phone Into Cash Today')}
									</p>
									<p className="text-white/80 mb-6">
										{t('services.mobileTrade.sell.desc', 'Get instant quotes and top dollar for your device. Fast, secure, and hassle-free process with same-day payment guaranteed.')}
									</p>
									<div className="flex flex-wrap gap-2">
										{(t('services.mobileTrade.sell.tags', ['Instant Quote', 'Same-Day Payment', 'No Hidden Fees', 'Fair Prices']) || []).map((tag, i) => (
											<span key={i} className="px-4 py-1.5 bg-white/20 rounded-full text-sm backdrop-blur-sm">{tag}</span>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Right: Featured Buying Card */}
						{loading ? (
							<div className="rounded-3xl p-10 bg-gray-100 animate-pulse">
								<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
								<div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
								<div className="h-6 bg-gray-200 rounded w-1/2"></div>
							</div>
						) : (
							<div className="rounded-3xl p-10 text-white bg-gradient-to-br from-[#b32346] via-[#8b2860] to-[#4b2781] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
								<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
								<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 group-hover:scale-150 transition-transform duration-700"></div>

								<div className="relative z-10">
									<h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/90">
										{t('services.mobileTrade.buy.kicker', 'BUY PRE-OWNED PHONES')}
									</h3>
									<p className="text-3xl font-bold mb-6 leading-tight">
										{t('services.mobileTrade.buy.title', 'Premium Quality Phones at Smart Prices')}
									</p>
									<p className="text-white/80 mb-6">
										{t('services.mobileTrade.buy.desc', 'Shop certified pre-owned devices with warranty protection. Every phone is thoroughly tested and quality guaranteed.')}
									</p>
									<div className="flex flex-wrap gap-2">
										{(t('services.mobileTrade.buy.tags', ['Certified Quality', 'Warranty Included', '7-Day Returns', 'All Brands']) || []).map((tag, i) => (
											<span key={i} className="px-4 py-1.5 bg-white/20 rounded-full text-sm backdrop-blur-sm">{tag}</span>
										))}
									</div>
								</div>
							</div>
						)}
					</div>


					{/* Bottom Cards Grid - 4 columns */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

						<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
							<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
								<FiDollarSign className="text-3xl text-[#b32346]" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
								{t('services.mobileTrade.cards.instantQuote.kicker', 'INSTANT VALUATION')}
							</h3>
							<p className="text-xl font-semibold text-gray-800 mb-2">
								{t('services.mobileTrade.cards.instantQuote.title', 'Get Your Quote in Minutes')}
							</p>
							<p className="text-sm text-gray-600">
								{t('services.mobileTrade.cards.instantQuote.desc', 'Fast and transparent pricing for your device based on condition and market value.')}
							</p>
						</div>

						<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
							<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
								<FiShield className="text-3xl text-[#b32346]" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
								{t('services.mobileTrade.cards.certified.kicker', 'CERTIFIED PRE-OWNED')}
							</h3>
							<p className="text-xl font-semibold text-gray-800 mb-2">
								{t('services.mobileTrade.cards.certified.title', 'Quality Guaranteed Devices')}
							</p>
							<p className="text-sm text-gray-600">
								{t('services.mobileTrade.cards.certified.desc', 'All pre-owned phones are thoroughly tested, certified, and come with warranty protection.')}
							</p>
						</div>

						<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
							<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
								<FiShoppingBag className="text-3xl text-[#b32346]" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
								{t('services.mobileTrade.cards.wideSelection.kicker', 'WIDE SELECTION')}
							</h3>
							<p className="text-xl font-semibold text-gray-800 mb-2">
								{t('services.mobileTrade.cards.wideSelection.title', 'Latest Models Available')}
							</p>
							<p className="text-sm text-gray-600">
								{t('services.mobileTrade.cards.wideSelection.desc', 'From flagship phones to budget-friendly options, find the perfect device for your needs.')}
							</p>
						</div>

					</div>
				</div>
			</section>

			<section id="web-development" className="py-20 sm:py-28 bg-gradient-to-br from-gray-50 via-white to-purple-50">
				<div className="container mx-auto px-6 max-w-7xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto mb-4">
							{t('services.webDevTitle', 'Web Development')}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b32346] to-[#4b2781]">.</span>
						</h2>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('services.webDevLead', 'Building powerful, scalable web solutions that drive your business forward')}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

						{loading ? (
							<div className="md:col-span-2 lg:col-span-2 rounded-3xl p-10 bg-gray-100 animate-pulse">
								<div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
								<div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
								<div className="h-6 bg-gray-200 rounded w-1/2"></div>
							</div>
						) : (
							<div className="md:col-span-2 lg:col-span-2 rounded-3xl p-10 text-white bg-gradient-to-br from-[#b32346] via-[#8b2860] to-[#4b2781] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
								<div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
								<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 group-hover:scale-150 transition-transform duration-700"></div>

								<div className="relative z-10">
									<h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white/90">{t('services.featured.kicker', 'CUSTOM WEB APPLICATIONS')}</h3>
									<p className="text-3xl font-bold mb-6 leading-tight">{t('services.featured.title', 'Build Scalable, High-Performance Web Apps Tailored to Your Business')}</p>
									<p className="text-white/80 mb-6">{t('services.featured.desc', 'From enterprise solutions to customer-facing platforms, we create custom web applications using modern frameworks like React, Next.js, and Node.js.')}</p>
									<div className="flex flex-wrap gap-2">
										{(t('services.featured.tags', ['React', 'Next.js', 'Node.js', 'TypeScript']) || []).map((tag, i) => (
											<span key={i} className="px-4 py-1.5 bg-white/20 rounded-full text-sm backdrop-blur-sm">{tag}</span>
										))}
									</div>
								</div>
							</div>
						)}

						{loading ? (
							<div className="rounded-3xl p-8 bg-gray-100 animate-pulse">
								<div className="h-16 w-16 bg-gray-200 rounded-2xl mb-5"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
						) : (
							<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
								<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
									<FiSmartphone className="text-3xl text-[#b32346]" />
								</div>
								<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">{t('services.cards.responsive.kicker', 'RESPONSIVE DESIGN')}</h3>
								<p className="text-xl font-semibold text-gray-800 mb-2">{t('services.cards.responsive.title', 'Pixel-Perfect on Every Device')}</p>
								<p className="text-sm text-gray-600">{t('services.cards.responsive.desc', 'Mobile-first designs that look stunning on phones, tablets, and desktops.')}</p>
							</div>
						)}

						<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
							<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
								<FiShoppingCart className="text-3xl text-[#b32346]" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">{t('services.cards.ecommerce.kicker', 'E-COMMERCE SOLUTIONS')}</h3>
							<p className="text-xl font-semibold text-gray-800 mb-2">{t('services.cards.ecommerce.title', 'Launch Your Online Store')}</p>
							<p className="text-sm text-gray-600">{t('services.cards.ecommerce.desc', 'Full-featured e-commerce platforms with payment integration and inventory management.')}</p>
						</div>

						<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
							<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
								<FiZap className="text-3xl text-[#b32346]" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">{t('services.cards.performance.kicker', 'PERFORMANCE OPTIMIZATION')}</h3>
							<p className="text-xl font-semibold text-gray-800 mb-2">{t('services.cards.performance.title', 'Lightning-Fast Load Times')}</p>
							<p className="text-sm text-gray-600">{t('services.cards.performance.desc', 'Optimized code, CDN integration, and caching strategies for superior speed.')}</p>
						</div>

						<div className="rounded-3xl p-8 bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
							<div className="bg-gradient-to-br from-[#b32346]/10 to-[#4b2781]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
								<FiTrendingUp className="text-3xl text-[#b32346]" />
							</div>
							<h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">{t('services.cards.seo.kicker', 'SEO & ANALYTICS')}</h3>
							<p className="text-xl font-semibold text-gray-800 mb-2">{t('services.cards.seo.title', 'Rank Higher, Convert Better')}</p>
							<p className="text-sm text-gray-600">{t('services.cards.seo.desc', 'Built-in SEO best practices and analytics integration for measurable results.')}</p>
						</div>
					</div>
				</div>
			</section>

			<section id="services-intro" className="py-16 sm:py-24 text-center bg-white section-animate">
				<div className={`container mx-auto px-6 transition-all duration-1000 ease-out ${isVisible['services-intro'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
					<h3 className="text-sm text-[#B32346] uppercase font-bold tracking-widest mb-4">{t('services.whatWeOffer', 'WHAT WE OFFER')}</h3>
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 max-w-4xl mx-auto">{t('services.gridHeading', 'Our Services is Computers, Laptops, TV, Gaming Console & Smartphones Repair')}</h2>
				</div>
			</section>

			<section id="services-grid" className="bg-gray-50 py-16 sm:py-24 section-animate">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{loading
							? Array.from({ length: 6 }).map((_, index) => (
								<div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
									<div className="w-full h-56 bg-gray-200" />
									<div className="p-6">
										<div className="h-5 w-2/3 bg-gray-200 rounded" />
									</div>
								</div>
							))
							: (() => {
								if (!shuffledRef.current) {
									const arr = [...ALL_SERVICES];
									for (let i = arr.length - 1; i > 0; i--) {
										const j = Math.floor(Math.random() * (i + 1));
										[arr[i], arr[j]] = [arr[j], arr[i]];
									}
									shuffledRef.current = arr;
								}
								return shuffledRef.current.map((service, index) => (
									<ServiceGridCard key={service.name} service={service} index={index} t={t} visible={isVisible['services-grid']} />
								));
							})()}
					</div>
				</div>
			</section>

			<section id="choose-us" className="bg-white section-animate">
				<div className={`container mx-auto px-0 max-w-none transition-all duration-1000 ease-out ${isVisible['choose-us'] ? 'opacity-100' : 'opacity-0'}`}>
					<div className="grid lg:grid-cols-3 items-stretch">
						<div className="hidden lg:block lg:col-span-1">
							<img loading="lazy" src={pub('why-choose-us.jpg')} alt="Question mark on keyboard" className="w-full h-full object-cover" />
						</div>
						<div className="lg:col-span-2 bg-gradient-to-r from-[#8f1c37] to-[#4c1d95] text-white p-12 md:p-20">
							<h4 className="text-sm font-bold tracking-widest uppercase opacity-80 mb-4">{t('services.whyChoose.heading', 'WHY CHOOSE US')}</h4>
							<h2 className="text-3xl md:text-4xl font-bold mb-8">{t('services.whyChoose.subheading', 'When you need repair services, we are here')}</h2>
							<div className="border-b border-white/20 flex space-x-4">
								{[{
									title: t('services.tabs.t1Title', TABS_DATA[0].title),
									content: t('services.tabs.t1Body', TABS_DATA[0].content)
								}, {
									title: t('services.tabs.t2Title', TABS_DATA[1].title),
									content: t('services.tabs.t2Body', TABS_DATA[1].content)
								}, {
									title: t('services.tabs.t3Title', TABS_DATA[2].title),
									content: t('services.tabs.t3Body', TABS_DATA[2].content)
								}].map((tab, index) => (
									<button
										key={index}
										onClick={() => setActiveTab(index)}
										className={`pb-3 text-sm font-semibold text-left transition-colors duration-300 ${activeTab === index ? 'border-b-2 border-white text-white' : 'text-white/70 hover:text-white'}`}
									>
										{tab.title}
									</button>
								))}
							</div>
							<div className="pt-6">
								<p className="leading-relaxed opacity-90">{[t('services.tabs.t1Body', TABS_DATA[0].content), t('services.tabs.t2Body', TABS_DATA[1].content), t('services.tabs.t3Body', TABS_DATA[2].content)][activeTab]}</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="testimonial" className="bg-gray-50 py-16 sm:py-24 section-animate">
				<div className={`container mx-auto px-6 text-center max-w-3xl transition-all duration-1000 ease-out ${isVisible['testimonial'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
					<p className="text-xl italic text-gray-700 leading-relaxed mb-6">
						"{reviews.length > 0
							? reviews[0].comment
							: 'Great service, they repaired my Phone in less than an hour. I thought the price was very reasonable, and they were fair and honest about what the fix was. Would definitely recommend and will see them again in the future.'}"
					</p>
					<p className="font-bold text-[#B32346] tracking-widest text-sm uppercase">
						{reviews.length > 0 ? reviews[0].name : 'KEILA SHIVER'}
					</p>
				</div>
			</section>

			<section id="cta-form" className="py-16 sm:py-24 bg-gradient-to-r from-[#8f1c37] to-[#4c1d95] section-animate">
				<div className={`container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ease-out ${isVisible['cta-form'] ? 'opacity-100' : 'opacity-0'}`}>
					<div className="text-white">
						<h2 className="text-4xl md:text-5xl font-bold">{t('common.bookService', 'Book a Service')}</h2>
						<p className="mt-4 text-white/80">{t('services.bookDescription', 'Fill out the form and we\'ll get back to you shortly.')}</p>
					</div>
					<div>
						{serviceSubmitStatus.message && (
							<div className={`mb-4 p-4 rounded-lg ${serviceSubmitStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-white' : 'bg-red-500/20 border border-red-500/30 text-white'}`}>
								{serviceSubmitStatus.message}
							</div>
						)}
						<form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<input
								type="text"
								name="firstName"
								value={serviceFormData.firstName}
								onChange={handleServiceInputChange}
								placeholder={t('common.firstName', 'First Name')}
								className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-md p-3 focus:ring-1 focus:ring-white focus:outline-none"
								required
							/>
							<input
								type="text"
								name="lastName"
								value={serviceFormData.lastName}
								onChange={handleServiceInputChange}
								placeholder={t('common.lastName', 'Last Name')}
								className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-md p-3 focus:ring-1 focus:ring-white focus:outline-none"
								required
							/>
							<input
								type="email"
								name="email"
								value={serviceFormData.email}
								onChange={handleServiceInputChange}
								placeholder={t('common.email', 'Email')}
								className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-md p-3 focus:ring-1 focus:ring-white focus:outline-none"
								required
							/>
							<input
								type="tel"
								name="phone"
								value={serviceFormData.phone}
								onChange={handleServiceInputChange}
								placeholder={t('common.phoneLabel', 'Phone')}
								className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-md p-3 focus:ring-1 focus:ring-white focus:outline-none"
								required
							/>
							<select
								name="serviceType"
								value={serviceFormData.serviceType}
								onChange={handleServiceInputChange}
								className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-md p-3 focus:ring-1 focus:ring-white focus:outline-none md:col-span-2"
								required
							>
								<option value="" className="text-gray-800">{t('services.selectService', 'Select Service Type')}</option>
								<option value="Mobile & Computer Repairing" className="text-gray-800">Mobile & Computer Repairing</option>
								<option value="Gaming Console Repairing" className="text-gray-800">Gaming Console Repairing</option>
								<option value="TV Repairing" className="text-gray-800">TV Repairing</option>
								<option value="Web Development" className="text-gray-800">Web Development</option>
								<option value="Other" className="text-gray-800">Other</option>
							</select>
							<textarea
								name="description"
								value={serviceFormData.description}
								onChange={handleServiceInputChange}
								placeholder={t('services.describeIssue', 'Describe your issue...')}
								rows="3"
								className="bg-white/20 border border-white/30 text-white placeholder-white/70 rounded-md p-3 focus:ring-1 focus:ring-white focus:outline-none md:col-span-2"
							></textarea>
							<div className="md:col-span-2">
								<button
									type="submit"
									disabled={isServiceSubmitting}
									className="w-full bg-white text-[#B32346] px-8 py-4 rounded-lg text-base font-bold hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isServiceSubmitting ? t('common.submitting', 'Submitting...') : t('common.bookService', 'Book a Service')}
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>


		</main>
	);
};

export default Services;
