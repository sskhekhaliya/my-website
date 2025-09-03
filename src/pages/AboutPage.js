import React from 'react';
import SEO from '../components/SEO';

const AboutPage = () => (
    <>
        <SEO
            title="About Me - SSKhekhaliya"
            description="Know more about Saurav Singh Khekhaliya – a fitness enthusiast, creator, and lifelong learner passionate about health, transformation, and storytelling."
            name="Saurav Singh Khekhaliya"
            type="website"
        />
        <div className="space-y-12">
            <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                    About Me
                </h1>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Hi, I’m <span className="font-semibold">Saurav Singh Khekhaliya</span>.  
                    At my core, I am a <span className="font-semibold">fitness enthusiast</span>, 
                    a believer in consistency, and someone who is deeply passionate about the 
                    transformation journey — not only for myself but for everyone who 
                    aspires to change their life. 
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-gray-50">
                    My Journey
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Like most people, I didn’t start with perfect discipline or motivation. 
                    I started with curiosity, with a desire to test my limits and 
                    see how far I could go. Over time, the gym became more than a place 
                    to build muscle — it became a mirror of life itself. 
                    Every rep taught me resilience, every routine taught me discipline, 
                    and every day of showing up made me realize that transformation 
                    is never sudden — it is the reward of <span className="italic">consistency</span>.  
                    <br /><br />
                    That realization inspired my vlog series, 
                    <span className="italic"> Our Consistency</span>, and later my fitness guide 
                    series <span className="italic">GRIND</span>, where I share practical advice, 
                    beginner-friendly workouts, and my personal experiences with people 
                    who are just starting out. 
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-gray-50">
                    Beyond Fitness
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    While fitness is at the center of my life, I am also a 
                    <span className="font-semibold"> creator and a lifelong learner</span>.  
                    I love exploring different ways of expressing ideas — whether it’s 
                    through <span className="font-semibold">writing</span> novels that mix 
                    mythology and philosophy, experimenting in the kitchen with 
                    <span className="font-semibold"> healthy protein snacks</span>, 
                    or building <span className="font-semibold">modern websites</span> with React.  
                    These creative outlets keep me grounded and remind me that growth 
                    doesn’t come from a single path, but from constantly trying, failing, 
                    and evolving.  
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-gray-50">
                    What I’m Building
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Right now, I’m working on expanding my vision in multiple directions.  
                    Through <span className="italic">GRIND</span>, I want to make fitness 
                    less intimidating and more approachable for beginners.  
                    With my homemade <span className="font-semibold">protein bars and cakes</span>, 
                    I’m aiming to create affordable and healthy options for everyday people.  
                    And through my stories and content, I’m constantly trying to inspire 
                    those who feel stuck, reminding them that small daily efforts lead 
                    to extraordinary results.  
                </p>

                <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-900 dark:text-gray-50">
                    My Vision
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    My future goal is simple yet powerful:  
                    <span className="italic"> to help people in their transformation journey.</span>  
                    For me, transformation isn’t just about a lean physique or a perfect diet plan —  
                    it’s about building confidence, self-discipline, and a mindset 
                    that refuses to quit.  
                    <br /><br />
                    If my journey can inspire even one person to take that first step, 
                    to believe that change is possible, then I consider it a success.  
                    Because at the end of the day, fitness is not only about lifting weights;  
                    it’s about lifting yourself.  
                </p>

                <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-50">
                        A Few Things About Me
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                        <li>🌱 Fitness enthusiast & content creator</li>
                        <li>💪 Founder of homemade protein bar project</li>
                        <li>📖 Writer exploring mythology, time shifts & philosophy</li>
                        <li>💻 Lifelong learner in tech and web development</li>
                        <li>🎯 Mission: to guide people in their transformation journey</li>
                    </ul>
                </div>
            </div>
        </div>
    </>
);

export default AboutPage;
