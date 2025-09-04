import React from 'react';
import SEO from '../components/SEO';
import { Instagram, Youtube, Github, Linkedin } from 'lucide-react';

const ContactPage = () => (
    <>
        <SEO
            title="Contact Me - S. S. Khekhaliya"
            description="Get in touch with me through my social media channels."
            name="Saurav SIngh Khekhaliya"
            type="website"
        />
        <div className="space-y-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-8 animate-fade-in-up">Contact Me</h1>
            <div className="animate-fade-in-up">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Feel free to reach out to me through any of the following platforms.
                </p>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-500"><Instagram size={22}/></a>
                    <a href="#" className="text-gray-500"><Youtube size={22}/></a>
                    <a href="#" className="text-gray-500"><Github size={22}/></a>
                    <a href="#" className="text-gray-500"><Linkedin size={22}/></a>
                </div>
            </div>
        </div>
    </>
);

export default ContactPage;