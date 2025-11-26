import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {currentYear} mkmcgrath.dev - All rights reserved</p>
        <div className="footer-links">
          <a href="https://github.com/mkmcgrath" target="_blank" rel="noopener noreferrer">Github</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
