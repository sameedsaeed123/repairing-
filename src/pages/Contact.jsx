import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { useI18n } from '../i18n';
import axios from 'axios';

const Contact = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const { t } = useI18n();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		message: ''
	});
	const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		// Trigger animations on component mount
		const timer = setTimeout(() => setIsLoaded(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const handleInputChange = (e) => {
		const { id, value } = e.target;
		setFormData(prev => ({
			...prev,
			[id]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus({ type: '', message: '' });

		try {
			const response = await axios.post('http://localhost:5000/api/contact-forms', {
				name: `${formData.firstName} ${formData.lastName}`,
				email: formData.email,
				phone: formData.phone,
				message: formData.message
			});

			setSubmitStatus({
				type: 'success',
				message: t('contact.successMessage', 'Thank you for contacting us! We will get back to you soon.')
			});

			// Reset form
			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				message: ''
			});
		} catch (error) {
			setSubmitStatus({
				type: 'error',
				message: t('contact.errorMessage', 'Something went wrong. Please try again.')
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const contactInfo = [
		{
			icon: <FiMapPin className="w-8 h-8 text-[#B32346]" />,
			title: t('contact.location','Location'),
			lines: ["130 CHORLEY OLD ROAD BL1 3AT", "(BOLTON)"],
		},
		{
			icon: <FiPhone className="w-8 h-8 text-[#B32346]" />,
			title: t('contact.contact','Contact'),
			lines: ["01204 398348", "07423 526826", "+44 7423526826"],
		},
		{
			icon: <FiMail className="w-8 h-8 text-[#B32346]" />,
			title: t('contact.email','Email'),
			lines: ["computercare500@gmail.com"],
		},
	];

	return (
		<main className="bg-gray-50">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-[#8f1c37] to-[#4c1d95] text-white pt-32 pb-48 text-center">
				<div
					className={`container mx-auto px-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
				>
					<h1 className="text-5xl md:text-6xl font-bold">{t('contact.title','Contact Us')}</h1>
				</div>
			</section>

			{/* Main Content Area (Cards + Form) */}
			<section className="relative pb-16 sm:pb-24">
				<div className="container mx-auto px-6">
					{/* Contact Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 -mt-32">
						{contactInfo.map((info, index) => (
							<div
								key={index}
								className={`bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
								style={{ transitionDelay: `${index * 200}ms` }}
							>
								<div className="bg-red-100 p-5 rounded-full mb-6">
									{info.icon}
								</div>
								<h3 className="text-xl font-bold text-gray-800 mb-2">{info.title}</h3>
								<div className="text-gray-600">
									{info.lines.map((line, i) => (
										<p key={i}>{line}</p>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Contact Form */}
					<div
						className={`bg-white rounded-xl shadow-2xl p-8 md:p-12 mt-16 lg:mt-24 mx-auto max-w-4xl transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
						style={{ transitionDelay: '500ms' }}
					>
						{submitStatus.message && (
							<div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
								{submitStatus.message}
							</div>
						)}
						<form onSubmit={handleSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
								<div>
									<label htmlFor="firstName" className="block text-sm font-medium text-gray-500 mb-2 tracking-wider">{t('contact.firstName','FIRST NAME')}</label>
									<input type="text" id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder={t('common.firstName','First Name')} className="w-full bg-gray-100 rounded-md border-gray-200 p-3 focus:ring-1 focus:ring-[#B32346] focus:border-[#B32346] transition duration-300" required />
								</div>
								<div>
									<label htmlFor="lastName" className="block text-sm font-medium text-gray-500 mb-2 tracking-wider">{t('contact.lastName','LAST NAME')}</label>
									<input type="text" id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder={t('common.lastName','Last Name')} className="w-full bg-gray-100 rounded-md border-gray-200 p-3 focus:ring-1 focus:ring-[#B32346] focus:border-[#B32346] transition duration-300" required />
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2 tracking-wider">{t('contact.emailLabel','EMAIL')}</label>
									<input type="email" id="email" value={formData.email} onChange={handleInputChange} placeholder={t('common.email','Email')} className="w-full bg-gray-100 rounded-md border-gray-200 p-3 focus:ring-1 focus:ring-[#B32346] focus:border-[#B32346] transition duration-300" required />
								</div>
								<div>
									<label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-2 tracking-wider">{t('contact.phone','PHONE')}</label>
									<input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('common.phoneLabel','Phone')} className="w-full bg-gray-100 rounded-md border-gray-200 p-3 focus:ring-1 focus:ring-[#B32346] focus:border-[#B32346] transition duration-300" required />
								</div>
							</div>
							<div className="mb-8">
								<label htmlFor="message" className="block text-sm font-medium text-gray-500 mb-2 tracking-wider">{t('contact.message','MESSAGE')}</label>
								<textarea id="message" value={formData.message} onChange={handleInputChange} rows="6" placeholder="Add your message..." className="w-full bg-gray-100 rounded-md border-gray-200 p-3 focus:ring-1 focus:ring-[#B32346] focus:border-[#B32346] transition duration-300" required></textarea>
							</div>
							<div>
								<button type="submit" disabled={isSubmitting} className="bg-[#B32346] text-white px-10 py-3 rounded-lg text-base font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
									{isSubmitting ? t('contact.submitting', 'Submitting...') : t('contact.submit','Submit')}
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>

			<div
				className={`mt-20 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
					}`}
				style={{ transitionDelay: '700ms' }}
			>
				<div className="rounded-xl overflow-hidden shadow-2xl h-[400px]">
					<iframe
						title="Google Map"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.057681209201!2d-2.438550123496593!3d53.57847476046438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487baf9c9e3c7a8b%3A0x75dc216ce9cf02c!2s130%20Chorley%20Old%20Rd%2C%20Bolton%20BL1%203AT%2C%20UK!5e0!3m2!1sen!2s!4v1696950070000!5m2!1sen!2s"
						width="100%"
						height="100%"
						style={{ border: 0 }}
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					></iframe>
				</div>
			</div>
		</main>
	);
};

export default Contact;