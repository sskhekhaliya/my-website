import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            
            &copy; {new Date().getFullYear()} S.S.Khekhaliya. <br />All Rights Reserved.
            <div className="mt-2">
                <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <span className="mx-2">·</span>
                <Link to="/terms-of-use" className="hover:underline">Terms of Use</Link>
            </div>
        </footer>
    );
};

export default Footer;

