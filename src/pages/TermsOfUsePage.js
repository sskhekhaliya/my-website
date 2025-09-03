import React from 'react';
import SEO from '../components/SEO';

const TermsOfUsePage = () => (
    <>
        <SEO
            title="Terms of Use - SSKhekhaliya"
            description="Read the terms of use for my website."
            name="SSKhekhaliya"
            type="website"
        />
        <div className="space-y-10">
            <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">Terms of Use</h1>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using this website, you agree to comply with and be bound by these Terms of Use, as well as all applicable laws and regulations. 
                        If you do not agree, you are prohibited from using or accessing this site.
                    </p>

                    <h2>2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial, 
                        transitory viewing only. This is a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul>
                        <li>Modify or copy the materials.</li>
                        <li>Use the materials for any commercial purpose or public display (commercial or non-commercial).</li>
                        <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                        <li>Remove any copyright or proprietary notations from the materials.</li>
                        <li>Transfer the materials to another person or “mirror” the materials on any other server.</li>
                    </ul>

                    <h2>3. Affiliate Disclaimer</h2>
                    <p>
                        This website may contain affiliate links (including Amazon Associate links). This means that if you click on a link and 
                        make a purchase, I may earn a small commission at no additional cost to you. These commissions help support the 
                        maintenance of this site and content creation.
                    </p>

                    <h2>4. Advertising</h2>
                    <p>
                        In the future, this website may display advertisements or sponsored content. These ads help keep the website free for users. 
                        While I aim to provide relevant and safe advertising, I do not endorse or take responsibility for the content, products, or 
                        services promoted in external advertisements.
                    </p>

                    <h2>5. Content Accuracy</h2>
                    <p>
                        The materials on this website are provided for general informational and educational purposes. While I strive to ensure accuracy, 
                        I do not guarantee that any content is free of errors, complete, or up-to-date. Use of information from this site is at your own risk.
                    </p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        In no event shall I or this website be liable for any damages (including, without limitation, damages for loss of data, profit, or 
                        business interruption) arising from the use or inability to use the materials on the website, even if I have been notified orally or 
                        in writing of the possibility of such damage.
                    </p>

                    <h2>7. Links to Other Websites</h2>
                    <p>
                        This website may contain links to third-party websites. These links are provided for your convenience, but I am not responsible for 
                        the content, policies, or practices of any third-party sites.
                    </p>

                    <h2>8. Modifications</h2>
                    <p>
                        I may revise these Terms of Use at any time without notice. By using this website you agree to be bound by the current version 
                        of these Terms.
                    </p>

                    <h2>9. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of India, and you irrevocably submit to the 
                        exclusive jurisdiction of the courts in that location.
                    </p>

                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        Effective Date: 27 August 2025
                    </p>
                </div>
            </div>
        </div>
    </>
);

export default TermsOfUsePage;
