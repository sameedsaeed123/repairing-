import React, { useState, useEffect, useMemo } from 'react';
import { pub } from '../utils/assets';
import { FiSettings, FiLayers, FiLock, FiMail, FiPhoneCall, FiUsers, FiFileText, FiSend } from 'react-icons/fi';
import { useI18n } from '../i18n';
import API_URL from '../utils/api';

const About = () => {
	const { t } = useI18n();
	const aboutInfo = [
		{
			icon: <FiUsers className="w-8 h-8 text-[#B32346]" />,
			title: t('about.info.who.title','Who we are'),
			text: t('about.info.who.text','We are the experts of gadget and device repair. Our company is the name of trust and credibility in the contemporary market. We work with strong devotion and give you 100 %. We are the symbol of mastery and our services are the representation of our hard work. With a visionary mind, we offer you guaranteed outcome.')
		},
		{
			icon: <FiFileText className="w-8 h-8 text-[#B32346]" />,
			title: t('about.info.history.title','Our history'),
			text: t('about.info.history.text','With over 15 years of experience, our motto was to bring repair and technical services with reliability and authenticity and we are successfully delivering it to our clients. We have started our root of work from the seeds of sincerity, dedication and commitment and now have established a rich environment of professionalism.')
		},
		{
			icon: <FiSend className="w-8 h-8 text-[#B32346]" />,
			title: t('about.info.why.title','Why choose us'),
			text: t('about.info.why.text','Our mission is to deliver our clients with utter satisfaction and reliability. We strive for the best and do not make any compromises when it comes to providing you the services for which you prefer us. We are aimed to come up to your expectations.')
		}
	];

	const stats = [
		{ value: "14+", label: "Glorious Years" },
		{ value: "500+", label: "Happy Customer" },
		{ value: "620+", label: "Service Complete" },
		{ value: "99%", label: "Satisfactions" },
	];

	function AnimatedNumber({ value, duration = 2000, className }) {
		const [display, setDisplay] = useState('0');
		useEffect(() => {
			const match = String(value).match(/^(\d+)([+%]?)$/);
			if (!match) { setDisplay(String(value)); return; }
			const target = parseInt(match[1], 10);
			const suffix = match[2] || '';
			const start = performance.now();
			let rafId;
			const tick = (now) => {
				const p = Math.min(1, (now - start) / duration);
				const eased = 1 - Math.pow(1 - p, 3);
				const current = Math.floor(eased * target);
				setDisplay(`${current}${suffix}`);
				if (p < 1) rafId = requestAnimationFrame(tick);
			};
			rafId = requestAnimationFrame(tick);
			return () => cancelAnimationFrame(rafId);
		}, [value, duration]);
		return <span className={className}>{display}</span>;
	}

	// Load active team members from backend
	const [teamMembers, setTeamMembers] = useState([]);
	const [tmLoading, setTmLoading] = useState(true);
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(`${API_URL}/api/team-members/active`);
				const data = await res.json();
				setTeamMembers(Array.isArray(data) ? data : []);
			} catch (e) {
				console.error('Failed to load team members', e);
			} finally {
				setTmLoading(false);
			}
		})();
	}, []);

	const groupsOfThree = useMemo(() => {
		const groups = [];
		for (let i = 0; i < teamMembers.length; i += 3) groups.push(teamMembers.slice(i, i + 3));
		return groups;
	}, [teamMembers]);

	const [slide, setSlide] = useState(0);
	const hasCarousel = groupsOfThree.length > 1;
	const next = () => setSlide((s) => (s + 1) % groupsOfThree.length);
	const prev = () => setSlide((s) => (s - 1 + groupsOfThree.length) % groupsOfThree.length);

	const features = [
		{
			icon: <FiSettings className="w-6 h-6 text-white" />,
			title: t('about.features.quality.title','Quality Services'),
			description: t('about.features.quality.desc','We provide top-notch repair services ensuring your device works like new.'),
		},
		{
			icon: <FiLayers className="w-6 h-6 text-white" />,
			title: t('about.features.genuine.title','Genuine Parts'),
			description: t('about.features.genuine.desc','We only use genuine and high-quality parts for all repairs.'),
		},
		{
			icon: <FiLock className="w-6 h-6 text-white" />,
			title: t('about.features.security.title','Data Security'),
			description: t("about.features.security.desc","Your data's privacy and security are our utmost priority."),
		},
	];

	return (
		<main>
			<section className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-white"
				style={{ backgroundImage: `url('${pub('about-hero.jpg')}')` }}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-[#b32346] to-[#4b2781] opacity-80"></div>
				<div className="relative text-center z-10 p-4">
					<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 transition-opacity duration-1000 animate-[fade-in-down_1s_ease-out]">
						{t('about.title','About Us')}
					</h1>
					<p className="text-lg opacity-90 transition-opacity duration-1000 animate-[fade-in-up_1s_ease-out]">{t('about.breadcrumb','Home / About')}</p>
				</div>
			</section>

			{/* About Section */}
			<section className="py-16 sm:py-28 bg-gray-50">
				<div
					className="container mx-auto px-6 transition-all duration-1000 ease-in-out"
				>
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						<div className="relative group overflow-hidden rounded-xl shadow-xl">
							<img
								src={pub('about-section.jpg')}
								alt="Technician repairing a device"
								className="h-[600px] w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
							/>
						</div>
						<div className="space-y-6">
							<h3 className="text-sm text-[#B32346] uppercase font-bold tracking-wide">{t('about.aboutUs','ABOUT US')}</h3>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800">
								{t('about.mainHeading','14+ Years of Experience in This Field')}
							</h2>
							<p className="text-gray-600 leading-relaxed">
								{t('about.mainText','With over a decade of experience, Mobile and Computer Care stands as a beacon of reliability and expertise in the gadget repair industry. We pride ourselves on our commitment to quality service, rapid turnaround times, and customer satisfaction.')}
							</p>
							<div className="space-y-4 pt-4">
								{features.map((feature, index) => (
									<div key={index} className="flex items-start gap-4">
										<div className="flex-shrink-0 bg-[#B32346] p-3 rounded-full">
											{feature.icon}
										</div>
										<div>
											<h4 className="text-lg font-semibold text-gray-800">{feature.title}</h4>
											<p className="text-gray-600">{feature.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Info Section */}
			<section className="py-16 sm:py-28 bg-white">
				<div className="container mx-auto px-6">
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
						{aboutInfo.map((item, index) => (
							<div
								key={index}
								className="flex flex-col items-center text-center space-y-4 transition-all duration-700 ease-out"
								style={{ transitionDelay: `${index * 200}ms` }}
							>
								<div className="bg-red-50 p-5 rounded-full inline-flex mb-4 transition-transform duration-300 hover:scale-110">
									{item.icon}
								</div>
								<h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
								<p className="text-gray-600 leading-relaxed">{item.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section
				className="relative bg-cover bg-center bg-fixed py-16 sm:py-28"
				style={{ backgroundImage: `url('${pub('stats-bg.jpg')}')` }}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-[#b32346] to-[#4b2781] opacity-60"></div>
				<div className="relative container mx-auto px-6 transition-opacity duration-1000">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
						{stats.map((stat, index) => (
							<div key={index} className="p-4 transform hover:scale-110 transition-transform duration-300">
								<AnimatedNumber className="text-4xl md:text-5xl font-bold text-white mb-2" value={stat.value} />
								<p className="text-base text-gray-300">{t(`about.stats.${stat.label.replace(/\s+/g,'').toLowerCase()}`, stat.label)}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="bg-white py-16 sm:py-28">
				<div
					className="container mx-auto px-6 text-center transition-all duration-1000 ease-in-out"
				>
					<h3 className="text-sm text-[#B32346] uppercase font-bold tracking-wide mb-2">{t('about.team.heading','OUR TEAM')}</h3>
					<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
						{t('about.team.subheading','Meet Our Experts')}
					</h2>
					{tmLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="bg-gray-50 rounded-lg shadow-lg p-8 animate-pulse h-64" />
							))}
						</div>
					) : (
						<>
							{!hasCarousel ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
									{teamMembers.map((m) => (
										<div key={m._id} className="bg-gray-50 rounded-lg shadow-lg overflow-hidden p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 group">
											<img src={m.image?.startsWith('http') ? m.image : `${API_URL}${m.image}`} alt={m.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-transparent group-hover:border-[#B32346] transition-all duration-300" />
											<h3 className="text-xl font-semibold text-gray-800 mb-1">{m.name}</h3>
											<p className="text-[#B32346] font-medium">{m.position}</p>
										</div>
									))}
								</div>
							) : (
								<div className="relative">
									<div className="overflow-hidden">
										<div className="flex transition-transform duration-500" style={{ transform: `translateX(-${slide * 100}%)`, width: `${groupsOfThree.length * 100}%` }}>
											{groupsOfThree.map((group, gi) => (
												<div key={gi} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-1">
													{group.map((m) => (
														<div key={m._id} className="bg-gray-50 rounded-lg shadow-lg overflow-hidden p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 group">
															<img src={m.image?.startsWith('http') ? m.image : `${API_URL}${m.image}`} alt={m.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-transparent group-hover:border-[#B32346] transition-all duration-300" />
															<h3 className="text-xl font-semibold text-gray-800 mb-1">{m.name}</h3>
															<p className="text-[#B32346] font-medium">{m.position}</p>
														</div>
													))}
												</div>
											))}
										</div>
									</div>
									<div className="flex items-center justify-center gap-4 mt-8">
										<button onClick={prev} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">Prev</button>
										<div className="flex gap-2">
											{groupsOfThree.map((_, i) => (
												<button key={i} className={`w-2.5 h-2.5 rounded-full ${i === slide ? 'bg-[#B32346]' : 'bg-gray-300'}`} onClick={() => setSlide(i)} />
											))}
										</div>
										<button onClick={next} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">Next</button>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</section>
		</main>
	);
};

export default About;
