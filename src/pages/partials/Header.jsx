import React, { useState, memo, useRef, useEffect } from 'react';
import { pub } from '../../utils/assets';
import { FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../../i18n';

const NAV_LINKS = [
	{ key: 'home', fallback: 'Home', path: '/' },
	{ key: 'about', fallback: 'About Us', path: '/about' },
	{ key: 'contact', fallback: 'Contact Us', path: '/contact' },
	{ key: 'services', fallback: 'Services', path: '/services' },
];

const Header = memo(function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [langOpen, setLangOpen] = useState(false);
	const dropdownRefDesktop = useRef(null);
	const dropdownRefMobile = useRef(null);
	const { t, locale, setLocale } = useI18n();

	useEffect(() => {
		function onDocClick(e) {
			const desktopEl = dropdownRefDesktop.current;
			const mobileEl = dropdownRefMobile.current;
			const clickedInsideDesktop = desktopEl && desktopEl.contains(e.target);
			const clickedInsideMobile = mobileEl && mobileEl.contains(e.target);
			if (!clickedInsideDesktop && !clickedInsideMobile) setLangOpen(false);
		}
		document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	}, []);

	const LANGS = [
		{ code: 'en', label: 'English', flag: '/english.png' },
		{ code: 'es', label: 'Español', flag: '/espanol.png' },
		{ code: 'ca', label: 'Català', flag: '/catala.png' }
	];

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-6 py-4 flex justify-between items-center">
				<Link to="/" className="flex items-center">
					<img src={pub('logo.png')} alt="Mobile & Computer Care Logo" className="h-14 w-auto" />
				</Link>

				<nav className="hidden lg:flex items-center space-x-8">
					{NAV_LINKS.map((link) => (
						<NavLink
							key={link.key}
							to={link.path}
							className={({ isActive }) =>
								isActive
									? 'text-base font-medium text-[#B32346] transition-colors duration-300 pb-2 border-b-2 border-[#B32346]'
									: 'text-base font-medium text-gray-700 hover:text-[#B32346] transition-colors duration-300 pb-2 border-b-2 border-transparent hover:border-[#B32346]'
							}
						>
							{t(`nav.${link.key}`, link.fallback)}
						</NavLink>
					))}
				</nav>

				<div className="hidden lg:flex items-center gap-4">
					<div ref={dropdownRefDesktop} className="relative">
						<button
							onClick={() => setLangOpen((v) => !v)}
							className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:border-[#B32346] text-sm focus:outline-none"
						>
							<span className="text-lg leading-none">
								<img src={locale === 'en' ? '/english.png' : locale === 'es' ? '/espanol.png' : '/catala.png'} className='h-5' />
							</span>
							<span className="hidden md:inline">{locale.toUpperCase()}</span>
						</button>
						{langOpen && (
							<div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
								{LANGS.map(l => (
									<button
										key={l.code}
										onClick={() => { setLocale(l.code); setLangOpen(false); }}
										className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 focus:outline-none ${locale === l.code ? 'bg-gray-50' : ''}`}
									>
										<img src={l.flag} className='h-5' />
										<span className="text-sm">{l.label}</span>
									</button>
								))}
							</div>
						)}
					</div>
					<a
						href="tel:+34632404585"
						className="bg-[#B32346] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-opacity-90 transition-all duration-300 text-base font-semibold"
					>
						<FaPhoneAlt />
						<span>{t('common.phone', '0034 632404585')}</span>
					</a>
				</div>

				<div className="lg:hidden">
					<button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
						{isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
					} overflow-hidden`}
			>
				<div className="bg-white flex flex-col items-center space-y-4 py-4 border-t border-gray-100">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.key}
							to={link.path}
							onClick={() => setIsOpen(false)}
							className="text-base font-medium text-gray-700 hover:text-[#B32346] transition-colors duration-300"
						>
							{t(`nav.${link.key}`, link.fallback)}
						</Link>
					))}
					{/* Desktop-style dropdown (visible in mobile menu) */}
					<div className="w-full px-6">
						<div className="flex items-center justify-center">
							<div ref={dropdownRefMobile} className="relative">
								<button
									onClick={() => setLangOpen((v) => !v)}
									className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 hover:border-[#B32346] text-sm focus:outline-none"
								>
									<span className="text-lg leading-none">
										<img src={locale === 'en' ? '/english.png' : locale === 'es' ? '/espanol.png' : '/catala.png'} className='h-5' />
									</span>
									<span className="hidden md:inline">{locale.toUpperCase()}</span>
								</button>
								{langOpen && (
									<div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-40">
										{LANGS.map(l => (
											<button
												key={l.code}
												onClick={() => { setLocale(l.code); setLangOpen(false); }}
												className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 focus:outline-none ${locale === l.code ? 'bg-gray-50' : ''}`}
											>
												<img src={l.flag} className='h-5' />
												<span className="text-sm">{l.label}</span>
											</button>
											))}
									</div>
								)}
							</div>
						</div>

						<div className="flex items-center justify-center gap-3 mt-3">
							{LANGS.map(l => (
								<button
									key={l.code}
									onClick={() => setLocale(l.code)}
									className={`p-2 rounded-md border ${locale === l.code ? 'border-[#B32346] bg-[#fff7f8]' : 'border-gray-200 hover:border-[#B32346]'}`}
								>
									<img src={l.flag} className="h-5" alt={l.label} />
								</button>
							))}
						</div>
					</div>

					{/* Phone link remains in mobile menu (kept alongside language toggles) */}
					<a
						href="tel:+34632404585"
						className="bg-[#B32346] text-white px-6 py-2 rounded-md flex items-center space-x-2 hover:bg-opacity-90 transition-all duration-300 mt-3"
					>
						<FaPhoneAlt />
						<span>{t('common.phone', '0034 632404585')}</span>
					</a>
				</div>
			</div>
		</header>
	);
});

export default Header;