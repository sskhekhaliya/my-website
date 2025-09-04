import React from 'react';
import SEO from '../components/SEO';

const PersonalPage = () => (
  <>
    <SEO
      title="Personal Page - S. S. Khekhaliya"
      description="Welcome to my personal space. Explore my fitness journey, projects, books, and creative work."
      name="Saurav Singh Khekhaliya"
      type="website"
    />
    <div className="space-y-10">
      {/* Intro Section */}
      <div className="animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
          Welcome to My Space
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          I'm Saurav Singh Khekhaliya — passionate about fitness, technology, art, and writing. This page is a showcase of my journey, thoughts, and creative projects. I believe in lifelong learning and embrace every opportunity to explore new skills and ideas.
        </p>
      </div>

      {/* Fitness Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 pb-2 mb-4">
          Fitness & Lifestyle
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Fitness is at the core of my life. Through consistent training, diet discipline, and mindful routines, I strive for a lean and aesthetic physique. I document my journey in my vlog series <span className="font-semibold">"Our Consistency"</span> and beginner fitness guide <span className="font-semibold">"GRIND"</span>, where I share practical advice, workouts, and motivational stories to inspire others.
        </p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
          {['Strength Training', 'Bodybuilding Aesthetics', 'Nutrition & Dieting', 'Discipline & Mindset', 'Content Creation (Fitness Vlogs)', 'Coaching Beginners'].map(item => (
            <li key={item} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-3">◆</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Creative Work Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 pb-2 mb-4">
          Writing & Creativity
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Beyond fitness and tech, I express myself through writing and art. I'm working on multiple novels, including <span className="font-semibold">"Eklavya – अधूरी प्रतिज्ञा"</span>, a Hindi mythological fiction, and another that explores the theory of a timeline shift in 2020. I also write thoughtful articles, blending philosophy, society, and personal insights. Writing allows me to connect deeply with ideas and share stories that matter.
        </p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
          {['Novel Writing', 'Article Writing', 'Philosophy & Storytelling', 'Mythological Fiction', 'Hinduism Studies', 'Creative Exploration'].map(item => (
            <li key={item} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-3">◆</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Tech Skills Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 pb-2 mb-4">
          Technology & Skills
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          I’m a tech enthusiast with a growing focus on React development, design, and problem-solving. I believe technology is a creative medium that shapes meaningful digital experiences. I keep expanding my skills whenever I get the chance, staying curious and adaptive.
        </p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
          {['React', 'JavaScript (ES6+)', 'Node.js', 'Tailwind CSS', 'UI/UX Design', 'Firebase'].map(skill => (
            <li key={skill} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-3">◆</span> {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Hobbies Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 pb-2 mb-4">
          Hobbies & Interests
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Outside of my main work, I enjoy hobbies that help me grow creatively and intellectually. Whether it’s reading books, playing the piano, or exploring new fields of knowledge, I value the process of learning and expression in every form.
        </p>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
          {['Reading Books', 'Playing Piano', 'Exploring New Knowledge', 'Philosophy & Spirituality', 'Art & Expression', 'Continuous Learning'].map(item => (
            <li key={item} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center">
              <span className="text-gray-500 dark:text-gray-400 mr-3">◆</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </>
);

export default PersonalPage;
