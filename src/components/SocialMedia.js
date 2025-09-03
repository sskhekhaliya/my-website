import { Github, Instagram, Linkedin, Youtube } from 'lucide-react'
import React from 'react'

const SocialMedia = () => {
  return (
    <>
        <a href="https://www.instagram.com/sskhekhaliya/" target="_blank" rel="noopener noreferrer" className="text-gray-500"><Instagram size={28}/></a>
        <a href="https://www.youtube.com/@sskhekhaliya" target="_blank" rel="noopener noreferrer" className="text-gray-500"><Youtube size={28}/></a>
        <a href="https://github.com/sskhekhaliya" target="_blank" rel="noopener noreferrer" className="text-gray-500"><Github size={28}/></a>
        <a href="https://www.linkedin.com/in/sskhekhaliya/" target="_blank" rel="noopener noreferrer" className="text-gray-500"><Linkedin size={28}/></a>
    </>
  )
}

export default SocialMedia