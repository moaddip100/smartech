import React from 'react'
import emailIcon from '../../img/icon/Email.png'
import whatsAppIcon from '../../img/icon/WhatsApp.png'
import facebookIcon from '../../img/icon/Facebook.png'
import tiktokIcon from '../../img/icon/TikTok.png'
import instagramIcon from '../../img/icon/Instagram.png'
import youtubeIcon from '../../img/icon/YouTube.png'
import linkedinIcon from '../../img/icon/LinkedIn.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="social-icons">
        <div className="social-icon"><a href="mailto:order@smartech.prof" aria-label="Send email to ruslanlav547@gmail.com"><img loading="lazy" width="40" height="40" src={emailIcon} alt="Email" /></a></div>
        <div className="social-icon"><a href="https://wa.me/995597753355" aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="40" height="40" src={whatsAppIcon} alt="WhatsApp" /></a></div>
        <div className="social-icon"><a href="https://www.facebook.com/share/1CVVnMXzhL/?mibextid=wwXIfr" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="40" height="40" src={facebookIcon} alt="Facebook" /></a></div>
        <div className="social-icon"><a href="https://www.tiktok.com/@smartech.prof" aria-label="TikTok" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="40" height="40" src={tiktokIcon} alt="TikTok" /></a></div>
        <div className="social-icon"><a href="https://instagram.com/smartech.prof" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="40" height="40" src={instagramIcon} alt="Instagram" /></a></div>
        <div className="social-icon"><a href="https://youtube.com/@smartech-prof" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="40" height="40" src={youtubeIcon} alt="YouTube" /></a></div>
        <div className="social-icon"><a href="https://www.linkedin.com/company/smartech-prof//" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><img loading="lazy" width="40" height="40" src={linkedinIcon} alt="LinkedIn" /></a></div>
      </div>
      <div className="copyright">
        <p>2025</p>
      </div>
    </footer>
  )
}
