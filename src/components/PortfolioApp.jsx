import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const cases = [
  {
    index: '00-1',
    name: 'Spitha Diamonds',
    meta: 'Research • Strategy • Design • Development',
    href: 'https://spithadiamonds.vercel.app',
    image: '/images/work-1.svg',
  },
  {
    index: '00-2',
    name: 'Claspr',
    meta: 'UX Design • Product Engineering • AI Workflows',
    href: 'https://claspr.vercel.app',
    image: '/images/work-2.svg',
  },
  {
    index: '00-3',
    name: 'Polymer Bazaar',
    meta: 'Frontend Systems • Scalable UI • Performance',
    href: 'http://polymerbazaar.com',
    image: '/images/work-3.svg',
  },
  {
    index: '00-4',
    name: 'Sumeru Platform',
    meta: 'Full Stack • Scheduling & RBAC • Operations',
    href: '#experience',
    image: '/images/work-4.svg',
  },
];

const experience = [
  {
    name: 'Sumeru',
    logo: '/images/work-2.svg',
    logoAlt: 'Sumeru logo',
    summary:
      'Built and launched an end-to-end platform using Next.js, tRPC, NestJS, and MySQL with high-impact admin modules for RBAC and scheduling.',
  },
  {
    name: 'Metaverse Ventures',
    logo: '/images/work-4.svg',
    logoAlt: 'Metaverse Ventures logo',
    summary:
      'Migrated state architecture to Jotai and integrated Web3 onboarding flows with improved clarity, maintainability, and reliability.',
  },
];

export default function PortfolioApp() {
  const appRef = useRef(null);
  const workSectionRef = useRef(null);
  const workTrackWrapRef = useRef(null);
  const workTrackRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.16,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.0,
      wheelMultiplier: 0.85,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    const onAnchorClick = (event) => {
      const href = event.currentTarget.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      setMenuOpen(false);
      lenis.scrollTo(target, { offset: -92, duration: 1.18 });
    };

    anchors.forEach((anchor) => anchor.addEventListener('click', onAnchorClick));

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener('click', onAnchorClick));
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      lenis.destroy();
    };
  }, [isLoading]);

  useIsomorphicLayoutEffect(() => {
    if (isLoading || !appRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from('.hero-word', {
        yPercent: 120,
        opacity: 0,
        stagger: 0.05,
        duration: 1.1,
        ease: 'expo.out',
      });

      gsap.utils.toArray('.reveal').forEach((item, index) => {
        gsap.from(item, {
          y: 36,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1,
          delay: index * 0.02,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true,
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add('(min-width: 920px)', () => {
        const trackEl = workTrackRef.current;
        const wrapEl = workTrackWrapRef.current;
        if (!trackEl || !wrapEl) {
          return;
        }

        const getShift = () => Math.max(0, trackEl.scrollWidth - wrapEl.clientWidth);

        gsap.to(trackEl, {
          x: () => -getShift(),
          ease: 'none',
          scrollTrigger: {
            trigger: workSectionRef.current,
            start: 'top top',
            end: () => `+=${getShift()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      gsap.utils.toArray('.parallax-wrap img').forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -8, scale: 1.08 },
          {
            yPercent: 10,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: image.closest('.parallax-wrap'),
              scrub: 0.8,
              start: 'top bottom',
              end: 'bottom top',
            },
          }
        );
      });

      gsap.utils.toArray('.morph-target').forEach((el) => {
        const setRadius = gsap.quickSetter(el, 'borderRadius', 'px');
        const setScale = gsap.quickSetter(el, 'scale');

        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          end: 'bottom top',
          scrub: 0.6,
          onUpdate: (self) => {
            const radius = 20 + self.progress * 240;
            const scale = 1 - self.progress * 0.08;
            setRadius(radius);
            setScale(scale);
          },
        });
      });

      ScrollTrigger.create({
        start: 'top -18',
        end: 99999,
        toggleClass: { targets: '.site-header', className: 'is-scrolled' },
      });
    }, appRef);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <div className="app" ref={appRef}>
      <div className={`loader ${isLoading ? 'is-visible' : ''}`} aria-hidden={!isLoading}>
        <p className="loader-word">SUKRIT®</p>
      </div>

      <header className="site-header">
        <div className="container nav-inner">
          <a className="logo" href="#top">
            Sukrit®
          </a>
          <nav className="desktop-nav" aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? 'Close -' : 'Menu +'}
          </button>
        </div>
        <nav id="mobile-nav" className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile Primary">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="container">
            <p className="hash">#</p>
            <h1>
              {['A', 'software', 'engineer', 'building', 'scalable', 'products', 'end', 'to', 'end'].map((word) => (
                <span className="hero-word" key={word}>
                  {word}
                </span>
              ))}
            </h1>
            <p className="hero-sub reveal">Engineered for performance. Built for outcomes.</p>
          </div>
        </section>

        <section className="work section-pad" id="work" ref={workSectionRef}>
          <div className="container work-head reveal">
            <p className="eyebrow">Featured Case Studies</p>
            <h2>Selected Work</h2>
          </div>
          <div className="work-track-wrap" ref={workTrackWrapRef}>
            <div className="work-track" ref={workTrackRef}>
              {cases.map((item) => (
                <article className="work-card" key={item.name}>
                  <div className="parallax-wrap">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </div>
                  <div className="card-copy">
                    <p>{item.index}</p>
                    <h3>{item.name}</h3>
                    <span>{item.meta}</span>
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                      Open project
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about section-pad reveal" id="about">
          <div className="container split">
            <div>
              <p className="eyebrow">About</p>
              <h2>An engineer focused on fast, reliable digital products.</h2>
            </div>
            <p>
              I build production-ready experiences across frontend, backend, and cloud. My stack includes React,
              Next.js, TypeScript, NestJS, Prisma, AWS, and event-driven systems. I focus on measurable outcomes:
              conversion lift, improved load speed, cleaner architecture, and product velocity.
            </p>
          </div>
        </section>

        <section className="clients section-pad" id="experience">
          <div className="container reveal">
            <p className="eyebrow">Experience</p>
            <h2>Companies I have worked with</h2>
          </div>
          <div className="container client-list">
            {experience.map((item) => (
              <article className="client-row reveal" key={item.name}>
                <div className="morph-target parallax-wrap">
                  <img src={item.logo} alt={item.logoAlt} loading="lazy" />
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section-pad reveal" id="contact">
          <div className="container">
            <p className="eyebrow">Let&apos;s Build</p>
            <h2>Have a product idea or engineering challenge? Let&apos;s build it.</h2>
            <a className="cta" href="mailto:sukritsaha27@gmail.com">
              Get in touch
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
