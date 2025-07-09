// GSAP animations for smooth scrolling and effects
gsap.registerPlugin(ScrollTrigger);

gsap.from("#hero h1", {
    duration: 1.5,
    y: -50,
    opacity: 0,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#hero",
        start: "top center",
        toggleActions: "play none none reverse"
    }
});

gsap.from("#about, #skills, #portfolio, #contact", {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.3,
    scrollTrigger: {
        trigger: "#about",
        start: "top center",
        toggleActions: "play none none reverse"
    }
});