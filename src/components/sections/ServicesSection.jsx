import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';

const TOP_N = 4; // number of featured items to take from API
const AUTO_SCROLL_SPEED = 0.13; // px per ms (tune for faster/slower)

const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]); // only top N
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel controls
  const carouselRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const isPausedRef = useRef(false);
  const userInteractedRef = useRef(false);

  // Intersection Observer for animations
  useEffect(() => {
    const sectionRef = document.querySelector('#services-section-ref');
    if (!sectionRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef);
    return () => observer.disconnect();
  }, []);

  // Fetch featured services (unchanged backend logic)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try featured
        let servicesData = await ApiService.getFeaturedServices();

        // fallback to all services if not enough featured
        if (!servicesData || servicesData.length < 3) {
          const allData = await ApiService.getAllServices();
          servicesData = allData.slice(0, 6);
        }

        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error('ServicesSection fetch error:', err);
        setError('Failed to load services. Please try again later.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Update displayed services (top N)
  useEffect(() => {
    setDisplayedServices(Array.isArray(services) ? services.slice(0, TOP_N) : []);
  }, [services]);

  // Prepare infinite scrolling (duplicate items)
  const getLoopList = () => {
    if (!displayedServices || displayedServices.length === 0) return [];
    return [...displayedServices, ...displayedServices];
  };

  // Auto-scroll loop
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const loopList = getLoopList();
    if (loopList.length === 0) return;

    // ensure starting position is exactly at beginning of first set
    // no forced scrollLeft here; let animation handle it.

    const step = (timestamp) => {
      if (isPausedRef.current || userInteractedRef.current) {
        // keep lastTimeRef set to null so delta recalculates on resume
        lastTimeRef.current = null;
      } else {
        if (lastTimeRef.current != null) {
          const delta = timestamp - lastTimeRef.current;
          // advance
          el.scrollLeft += AUTO_SCROLL_SPEED * delta;
          // when we've scrolled past half of the scrollWidth (i.e., one copy), reset back by half
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft -= el.scrollWidth / 2;
          } else if (el.scrollLeft <= 0) {
            // in case of negative (rare), move forward by half
            el.scrollLeft += el.scrollWidth / 2;
          }
        }
        lastTimeRef.current = timestamp;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    // Pause when user hovers or focuses the carousel (handled via event listeners)
    const onPointerEnter = () => { isPausedRef.current = true; };
    const onPointerLeave = () => { isPausedRef.current = false; };
    const onFocusIn = () => { isPausedRef.current = true; };
    const onFocusOut = () => { isPausedRef.current = false; };

    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedServices]); // re-run when displayedServices changes

  // Helper: scroll by one card width (for prev/next buttons)
  const scrollByCard = (dir = 1) => {
    const container = carouselRef.current;
    if (!container) return;

    // mark user interaction to briefly stop auto-advance (so user can control)
    userInteractedRef.current = true;
    clearTimeout(container._userInteractionTimeout);
    container._userInteractionTimeout = setTimeout(() => {
      userInteractedRef.current = false;
    }, 1500); // resume after 1.5s of no interaction

    const firstChild = container.querySelector('[data-carousel-item]');
    let scrollAmount = container.clientWidth; // fallback
    if (firstChild) {
      const style = window.getComputedStyle(firstChild);
      const marginRight = parseFloat(style.marginRight || '0');
      scrollAmount = firstChild.offsetWidth + marginRight;
    }

    // Smooth scroll
    container.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  // Render duplicated list for looping
  const looped = getLoopList();

  return (
    <section id="services-section-ref" className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="text-purple-600 font-medium tracking-wide uppercase text-sm">Featured Services</span>
          </div>

          <h2 className={`text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Professional Beauty
            <span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">Services at Home</span>
          </h2>

          <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Experience luxury beauty treatments in the comfort of your home. Our certified professionals bring salon-quality services right to your doorstep.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading our amazing services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-all duration-300">Try Again</button>
          </div>
        ) : !looped || looped.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Services Available</h3>
            <p className="text-gray-600 mb-2">We're working on adding more services for you.</p>
          </div>
        ) : (
          <>
            <div className="relative mb-8">
              {/* Prev */}
              <button
                onClick={() => scrollByCard(-1)}
                aria-label="Previous"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow-lg bg-white hover:scale-105"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Carousel track */}
              <div
                ref={carouselRef}
                className="flex space-x-6 overflow-x-auto snap-x snap-mandatory py-6 px-6 scrollbar-none"
                style={{ scrollbarWidth: 'none' }}
                tabIndex={0}
                aria-roledescription="carousel"
              >
                {looped.map((service, index) => {
                  const key = `${service?.id || 's'}-${index}`;
                  // We show the exact same markup as before for each card. Because the loop duplicates the array,
                  // the UI will render two copies and auto-scroll will loop by resetting scrollLeft.
                  return (
                    <div
                      key={key}
                      data-carousel-item
                      className="snap-start flex-shrink-0 w-[90%] sm:w-[65%] md:w-[45%] lg:w-[30%]"
                    >
                      <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group`}>
                        <div className={`h-56 bg-gradient-to-br ${service?.gradient || 'from-pink-500 to-purple-500'} flex items-center justify-center relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

                          {service?.popular && (
                            <div className="absolute top-4 left-4">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>Popular</span>
                              </div>
                            </div>
                          )}

                          <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                              <CheckCircle className="h-10 w-10 text-white" />
                            </div>
                            <div className="text-white/90 font-medium text-sm uppercase tracking-wide">
                              {service?.category || 'Service'}
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex">{renderStars(service?.rating)}</div>
                              <span>({service?.reviews || 0})</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{service?.duration || '60 mins'}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                            {service?.name || 'Service Name'}
                          </h3>

                          <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                            {service?.description || 'Professional service description'}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">₹{service?.price || 0}</span>
                              {service?.originalPrice && (
                                <span className="text-sm text-gray-400 line-through ml-2">₹{service.originalPrice}</span>
                              )}
                            </div>
                            {service?.savings && (
                              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Save ₹{service.savings}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-3">
                            <Link
                              to={`/services/${service?.slug || 'not-found'}`}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 text-center"
                            >
                              <span>Book Now</span>
                              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>

                            <button className="bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-600 font-semibold py-2 px-3 rounded-xl transition-all duration-300 flex items-center justify-center">
                              <Calendar className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next */}
              <button
                onClick={() => scrollByCard(1)}
                aria-label="Next"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow-lg bg-white hover:scale-105"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className={`text-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link
                to="/services"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span>View All Services</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
