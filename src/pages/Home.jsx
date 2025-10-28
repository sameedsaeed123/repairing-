import React, { useState, useEffect, memo, useCallback, useRef, useMemo } from 'react';
import { pub } from '../utils/assets';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FiSettings, FiLayers, FiLock, FiMail, FiPhoneCall, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import axios from 'axios';
import API_URL from '../utils/api';

import { BsQuote } from 'react-icons/bs';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const SERVICES = [
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

const CHOOSE_US = [
  { key: 'professional', img: '/choose-1.jpg', alt: 'Professional Technician', title: 'Professional' },
  { key: 'sameDay', img: '/choose-2.jpg', alt: 'Same Day Repairs', title: 'Same Day Repairs' },
  { key: 'genuine', img: '/choose-3.jpg', alt: 'Genuine Parts', title: 'Genuine Part' },
];

const STATS = [
  { key: 'gloriousYears', value: '14+', label: 'Glorious Years' },
  { key: 'happyCustomer', value: '500+', label: 'Happy Customer' },
  { key: 'serviceComplete', value: '620+', label: 'Service Complete' },
  { key: 'satisfactions', value: '99%', label: 'Satisfactions' },
];

const HERO_SLIDES = [
  {
    titleKey: 'home.hero.slide1',
    buttonKey: 'home.hero.cta',
    title: 'Fast and Reliable Mobile and Computer and Gaming Console Repair Services',
    buttonText: 'Contact Us',
    link: '/contact',
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=1080&fit=crop&q=80",
  },
  {
    titleKey: 'home.hero.slide2',
    buttonKey: 'home.hero.cta',
    title: 'Bring Your Gadget Back To Life',
    buttonText: 'Contact Us',
    link: '/contact',
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1920&h=1080&fit=crop&q=80",
  },
];

const RepairServiceHero = memo(function RepairServiceHero({ slides, onButtonClick, t }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Detect mobile to swap in dedicated mobile hero images
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Preload images
  useEffect(() => {
    const imagesToPreload = isMobile
      ? [pub('hero-mbl-1.jpg'), pub('hero-mbl-2.webp')]
      : slides.map(s => s.image);

    imagesToPreload.forEach((src) => {
      if (!imagesLoaded[src]) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, [src]: true }));
        };
      }
    });
  }, [isMobile, slides, imagesLoaded]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentSlide + 1) % slides.length;
      const nextImage = isMobile
        ? (nextIndex === 0 ? pub('hero-mbl-1.jpg') : pub('hero-mbl-2.webp'))
        : slides[nextIndex].image;

      // Only transition if next image is loaded
      if (imagesLoaded[nextImage]) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide(nextIndex);
          setIsTransitioning(false);
        }, 300);
      }
    }, 6000);

    return () => clearInterval(timer);
  }, [slides, currentSlide, isMobile, imagesLoaded]);

  const slide = slides[currentSlide];

  const bgImage = isMobile
    ? (currentSlide === 0 ? pub('hero-mbl-1.jpg') : pub('hero-mbl-2.webp'))
    : slide.image;

  return (
    <section
      className={`relative text-white bg-center bg-no-repeat bg-cover transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black opacity-40 md:opacity-50"></div>
  <div className="relative z-10 w-full h-[55vh] sm:h-[65vh] md:h-[80vh] lg:h-[85vh] flex items-center justify-center p-4 text-center">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-snug md:leading-tight mb-3 sm:mb-5 animate-fade-in-down max-w-[92vw] md:max-w-[70vw] mx-auto">
            {slide.titleKey ? t(slide.titleKey, slide.title) : slide.title}
          </h1>
          {slide.buttonText && (
            <button
              onClick={() => onButtonClick && onButtonClick(slide.link)}
              className="bg-[#B32346] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
            >
              {slide.buttonKey ? t(slide.buttonKey, slide.buttonText) : slide.buttonText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

function ReviewForm() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('rating', rating);
      formData.append('comment', review);
      if (imageFile) {
        formData.append('image', imageFile);
      }

  const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setRating(5);
      setReview('');
      setImageFile(null);
      setPreview(null);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(t('home.reviewError', 'Failed to submit review. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={name} onChange={e => setName(e.target.value)} required placeholder={t('common.firstName', 'Your name')} className="w-full border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#B32346] focus:outline-none" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('home.emailOptional', 'Email (optional)')} className="w-full border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#B32346] focus:outline-none" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">{t('home.rating', 'Rating')}</label>
          <div className="flex items-center gap-1" aria-label={`Rating: ${rating} stars`}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="text-[#F59E0B] hover:scale-110 transition-transform"
                aria-pressed={rating >= n}
                title={`${n} star${n > 1 ? 's' : ''}`}
              >
                {rating >= n ? <FaStar /> : <FaRegStar />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">{t('home.uploadPhoto', 'Upload your photo (optional)')}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm" />
        </div>
      </div>
      {preview && (
        <div className="flex items-center gap-3">
          <img src={preview} alt="preview" className="w-14 h-14 rounded-full object-cover border" />
          <span className="text-sm text-gray-600">{t('home.preview', 'Preview')}</span>
        </div>
      )}
      <textarea value={review} onChange={e => setReview(e.target.value)} required rows={4} placeholder={t('home.writeReview', 'Write your review')} className="w-full border border-gray-200 rounded-md p-3 focus:ring-2 focus:ring-[#B32346] focus:outline-none" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center gap-3">
        <button disabled={submitting} type="submit" className="bg-[#B32346] text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 disabled:opacity-60">
          {submitting ? t('home.submitting', 'Submitting…') : t('home.submitReview', 'Submit review')}
        </button>
        {submitted && <span className="text-sm text-green-600">{t('home.thanks', 'Thanks! Your review has been submitted for approval.')}</span>}
      </div>
    </form>
  );
}

// AnimatedNumber: counts from 0 to target value (supports suffix like + or %)
function AnimatedNumber({ value, duration = 1200, className }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const match = String(value).match(/^(\d+)([+%]?)$/);
    if (!match) { setDisplay(value); return; }
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

const ServiceCard = memo(function ServiceCard({ service, index, t }) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group"
      style={{ willChange: 'transform' }}
    >
      <img loading="lazy" src={pub(service.img)} alt={service.name} className="w-full h-56 object-cover" />
      <div className="p-6">
  <h3 className="text-lg font-semibold text-gray-800">{t(`home.services.${service.key}`, service.name)}</h3>
      </div>
    </div>
  );
});

const Home = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  // stable handler so RepairServiceHero doesn't receive a new function every render
  const handleHeroButton = useCallback((link) => {
    if (link) navigate(link);
  }, [navigate]);

  // Reviews state and carousel
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);


  // Fetch approved reviews
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
  const response = await axios.get(`${API_URL}/api/reviews/approved`);
        
        const data = response?.data;
        if (Array.isArray(data)) {
          setApprovedReviews(data);
        } else if (data && Array.isArray(data.data)) {
          setApprovedReviews(data.data);
        } else {
          // fallback: if it's a single object, wrap it; otherwise empty array
          setApprovedReviews(data ? [data] : []);
        }
      } catch (error) {
        console.error('Error fetching approved reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchApprovedReviews();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (approvedReviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % approvedReviews.length);
    }, 5000); // Change review every 5 seconds

    return () => clearInterval(interval);
  }, [approvedReviews.length]);

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % approvedReviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      index < rating ? (
        <AiFillStar key={index} className="inline" />
      ) : (
        <AiOutlineStar key={index} className="inline" />
      )
    ));
  };

  // One-time shuffled services list (stable across renders and routes)
  const shuffledServicesRef = useRef(null);
  if (!shuffledServicesRef.current) {
    const arr = [...SERVICES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    shuffledServicesRef.current = arr;
  }
  const shuffledServices = shuffledServicesRef.current;

  // CHOOSE_US and STATS already at module scope (stable)

  return (
    <main>
      {/* Hero Section */}
      <RepairServiceHero slides={HERO_SLIDES} onButtonClick={handleHeroButton} t={t} />

      {/* Services Section */}
      <section className="bg-gray-50 py-16 sm:py-28">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-sm text-[#B32346] uppercase font-bold tracking-wide mb-2">{t('home.ourServices', 'Our Services')}</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            {t('home.servicesHeading', 'We offer a wide variety mobile and computer repair services')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-500 ease-out opacity-100">
            {shuffledServices.map((service, index) => (
              <ServiceCard key={service.name} service={service} index={index} t={t} />
            ))}
          </div>
          <button onClick={() => navigate("/services")} className="mt-12 bg-[#B32346] text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300">
            {t('home.viewMore', 'View More')} &rarr;
          </button>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gradient-to-r from-[#4c1d95] to-[#b32346] text-white py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in">
            <div className="p-4 rounded-full bg-gray-500/40 backdrop-blur-sm flex items-center justify-center">
              <FiSettings className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('home.info.s1.title', 'How to update your TomTom device')}</h3>
              <p className="opacity-80">{t('home.info.s1.body', 'Firmware problems with TomTom GPS devices can make the on-screen keyboard stop responding to your touch, cause the screen to freeze, or stop the device.')}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-4 rounded-full bg-gray-500/40 backdrop-blur-sm flex items-center justify-center">
              <FiLayers className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('home.info.s2.title', 'Are you too an iphone user?')}</h3>
              <p className="opacity-80">{t('home.info.s2.body', 'Once you switch to iPhones, you likely keep using them. iPhone lovers are particular about their phones. When damaged, they feel an urgency to repair or replace.')}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="p-4 rounded-full bg-gray-500/40 backdrop-blur-sm flex items-center justify-center">
              <FiLock className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{t('home.info.s3.title', 'Screen protector')}</h3>
              <p className="opacity-80">{t('home.info.s3.body', 'A broken display can be stressful. Need a repair specialist to fix your broken screen? We can help.')}</p>
            </div>
          </div>
        </div>
      </section>


      {/* About Culture Section */}
      <section className="relative my-16 sm:my-28">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B32346] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 opacity-5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="space-y-4">
              <h4 className="text-sm text-[#B32346] font-bold tracking-wide uppercase">{t('home.aboutCulture', 'ABOUT OUR CULTURE')}</h4>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{t('home.culture.heading', 'Have you, too, succumbed to the effects of screen protector time?')}</h2>
              <p className="text-base text-gray-600 leading-relaxed">{t('home.culture.body', 'Despite the closeness, a broken display can cause anxiety. If you have a broken screen and need help in the UK, finding a repair service is simple.')}</p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/about" className="bg-[#B32346] text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-[#8f1c37] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {t('home.learnMore', 'Learn More')}
                </Link>
              </div>
            </div>

            {/* Images Side */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Large Image */}
                <div className="col-span-2 relative group overflow-hidden rounded-xl shadow-xl">
                  <img
                    src={pub('culture-1.jpg')}
                    alt="Repair shop interior"
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-[#B32346] via-[#8f1c37] to-[#4c1d95] text-white p-6 rounded-xl shadow-lg flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <p className="text-xs opacity-90 mb-1">{t('home.culture.goalLabel', 'Our Goal:')}</p>
                    <p className="text-lg font-bold">{t('home.culture.goalQuote', '"We will fix it, till we make it"')}</p>
                  </div>
                </div>

                {/* Small Image */}
                <div className="relative group overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={pub('culture-2.jpg')}
                    alt="Repair shop products"
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-16 sm:py-28">
        <div className="container mx-auto px-6 text-center">
          <h4 className="text-sm text-[#B32346] font-bold tracking-wide uppercase mb-2">{t('home.whyChoose', 'WHY CHOOSE US')}</h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">{t('home.forYears', 'For over 12 years in the gadget area')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {CHOOSE_US.map((item, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden shadow-lg group"
              >
                <img loading="lazy" src={pub(item.img)} alt={item.alt} className="w-full h-80 object-cover" />
                <div className="absolute inset-0 flex items-end justify-center p-6">
                  <h3 className="text-xl font-bold bg-white text-gray-800 px-6 py-2 rounded">
                    {t(`home.choose.${item.key}`, item.title)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
  <section className="relative bg-cover bg-center py-16 sm:py-20" style={{ backgroundImage: `url('${pub('contact-bg.jpg')}')` }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-6 text-center text-white z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.contactUs', 'Contact us')}</h2>
          <p className="text-base max-w-3xl mx-auto mb-8 leading-relaxed">{t('home.contactBody', 'Mobile and Computer Care works with refined technical expertise. Contact us using the details on the website. Our latest products and services are updated regularly.')}</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <a 
              href="mailto:techtrust76@gmail.com" 
              className="bg-white text-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center w-72 h-48 justify-center transform hover:scale-105 transition-transform duration-300 no-underline"
            >
              <FiMail className="text-4xl text-[#B32346] mb-3" />
              <h3 className="text-lg font-bold mb-1">{t('home.contactCards.email', 'Send us an email')}</h3>
              <p className="text-sm text-gray-600">techtrust76@gmail.com</p>
            </a>
            <a 
              href="tel:+34632404585" 
              className="bg-white text-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center w-72 h-48 justify-center transform hover:scale-105 transition-transform duration-300 no-underline"
            >
              <FiPhoneCall className="text-4xl text-[#B32346] mb-3" />
              <h3 className="text-lg font-bold mb-1">{t('home.contactCards.call', 'Give us a call')}</h3>
              <p className="text-sm text-gray-600">0034 632404585</p>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 sm:py-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, index) => (
              <div key={index} className="p-4">
                <AnimatedNumber className="text-4xl md:text-5xl font-bold text-[#B32346] mb-2" value={stat.value} />
                <p className="text-base text-gray-600">{t(`about.stats.${stat.key}`, stat.label)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}

      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 sm:py-28">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h4 className="text-sm text-[#B32346] uppercase font-bold tracking-wide mb-3 flex items-center justify-center gap-2">
              {t('home.testimonial', 'TESTIMONIAL')}
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {t('home.reviewHeading', 'Review from our customer')}
            </h2>
          </div>

          {/* Dynamic Reviews Carousel */}
          {!reviewsLoading && approvedReviews.length > 0 ? (
            <div className="max-w-3xl mx-auto mb-16">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B32346]/5 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-8 left-8 text-[#B32346]/10">
                  <BsQuote className="text-7xl transform rotate-180" />
                </div>
                <div className="relative p-8 md:p-12 lg:p-16">
                  <div className="flex justify-center mb-6">
                    <div className="text-2xl text-yellow-500">
                      {renderStars(approvedReviews[currentReviewIndex].rating)}
                    </div>
                  </div>

                  {/* Review Content with smooth transition */}
                  <div className="transition-all duration-500 ease-in-out">
                    <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed font-light relative">
                      <span className="text-[#B32346] text-xl">"</span>
                      {approvedReviews[currentReviewIndex].comment}
                      <span className="text-[#B32346] text-xl ">"</span>
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        {approvedReviews[currentReviewIndex].image && (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B32346] to-[#8B1B37] p-1">
                            <img
                              src={`${API_URL}${approvedReviews[currentReviewIndex].image}`}
                              alt={approvedReviews[currentReviewIndex].name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-base font-bold text-gray-900 mb-1">
                          {approvedReviews[currentReviewIndex].name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {approvedReviews[currentReviewIndex].email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                {approvedReviews.length > 1 && (
                  <>
                    <button
                      onClick={prevReview}
                      className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white text-[#B32346] p-4 rounded-full hover:bg-[#B32346] hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-[#B32346]/20"
                      aria-label="Previous review"
                    >
                      <FiChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextReview}
                      className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white text-[#B32346] p-4 rounded-full hover:bg-[#B32346] hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-[#B32346]/20"
                      aria-label="Next review"
                    >
                      <FiChevronRight size={24} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 pb-8">
                      {approvedReviews.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentReviewIndex(index)}
                          className={`h-2 rounded-full transition-all duration-300 ${index === currentReviewIndex ? 'bg-[#B32346] w-10' : 'bg-gray-300 w-2 hover:bg-gray-400'
                            }`}
                          aria-label={`Go to review ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : reviewsLoading ? (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 mb-16">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="flex justify-center mt-8">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto mb-16">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B32346]/5 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-8 left-8 text-[#B32346]/10">
                  <BsQuote className="text-7xl transform rotate-180" />
                </div>

                <div className="relative p-8 md:p-12 lg:p-16">
                  <div className="flex justify-center mb-6">
                    <div className="text-2xl flex text-yellow-500">
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed font-light relative">
                    <span className="text-[#B32346] text-xl">"</span>
                    {t('home.testimonialQuote', '"Professional, helpful, prompt efficient service, at a reasonable price. Would recommend them to everyone with a mobile problem. Guarantee also fills you with confidence."')}
                    <span className="text-[#B32346] text-xl ">"</span>
                  </p>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B32346] to-[#8B1B37] p-1">
                        <img
                          src={pub('customer.jpg')}
                          alt="Keila Shiver"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900 mb-1">
                        {t('home.testimonialCustomerName', 'Keila Shiver')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit a review form */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {t('home.shareExperience', 'Share your experience')}
              </h3>
            </div>
            <ReviewForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
