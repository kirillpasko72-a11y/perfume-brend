import "./Footer.css";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">NOIRÉ</span>
            <p className="body-md footer__tagline">
              A quiet maison de parfum for those who collect memories instead
              of things.
            </p>
          </div>

          <nav className="footer__col" aria-label="Explore">
            <h3 className="footer__col-title">Explore</h3>
            <ul>
              <li>
                <a href="#notes">Fragrance</a>
              </li>
              <li>
                <a href="#story">Story</a>
              </li>
              <li>
                <a href="#collection">Collection</a>
              </li>
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Connect">
            <h3 className="footer__col-title">Connect</h3>
            <ul>
              <li>
                <a href="mailto:atelier@noire-parfum.com">atelier@noire-parfum.com</a>
              </li>
              <li>
                <a href="#top">Back to top</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">© {YEAR} NOIRÉ. All rights reserved.</span>
          <span className="footer__copy">Crafted in small batches.</span>
        </div>
      </div>
    </footer>
  );
}
