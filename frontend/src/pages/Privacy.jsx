import { Link } from 'react-router-dom'
import lewocoLogo from '../assets/images/LEWOCOLOGO.jpeg'
import './Privacy.css'

/*
  DRAFT: LEWOCO management should read this and confirm it matches
  how the organization really handles personal information
  (ideally with legal advice) before the website goes live.
*/
const LAST_UPDATED = '13 November 2026'

function Privacy() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <Link to="/" className="privacy-brand">
          <img src={lewocoLogo} alt="LEWOCO logo" />
          <span>LEWOCO</span>
        </Link>
        <Link to="/" className="privacy-back">← Back to the website</Link>
      </header>

      <main className="privacy-content">
        <h1>Privacy Notice</h1>
        <p className="privacy-updated">Last updated: {LAST_UPDATED}</p>

        <p>
          Lower Eastern Women Cooperative Society Ltd (LEWOCO) respects your
          privacy. This notice explains what personal information we collect
          through this website and in our membership records, why we collect
          it, and what your rights are.
        </p>

        <h2>Who we are</h2>
        <p>
          LEWOCO is based in Masii, Machakos County, Kenya. You can contact us
          at <a href="mailto:info@lewocomcultd.co.ke">info@lewocomcultd.co.ke</a> or
          on <a href="tel:+254722937900">+254 722 937900</a>.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>When you send us an enquiry:</strong> your name, email address,
            phone number, the subject you choose and your message.
          </li>
          <li>
            <strong>If you are a LEWOCO member:</strong> the details in your
            membership record, which can include your name, contact details,
            address, county, date of birth, gender, membership number and
            membership date and status. These are entered by LEWOCO
            administrators.
          </li>
          <li>
            <strong>When you order from our shop:</strong> your name, email
            address, phone number, delivery details, the items you order and the
            M-Pesa transaction code of your payment. You pay from your own
            phone through M-Pesa, so we never see your M-Pesa PIN.
          </li>
        </ul>
        <p>
          We do not use advertising or tracking cookies on this website.
        </p>

        <h2>Why we use it</h2>
        <ul>
          <li>To reply to your enquiry and follow up on it.</li>
          <li>To check your payment, process and deliver your order, and keep order records.</li>
          <li>To manage membership and run LEWOCO's programmes and activities.</li>
          <li>To keep reasonable records and prepare summary reports for LEWOCO management.</li>
        </ul>

        <h2>Who can see it</h2>
        <p>
          Only authorised LEWOCO administrators who need the information to do
          their work can see it. Administrators sign in with their own accounts,
          and membership records are limited to senior administrators. We do not
          sell your information.
        </p>

        <h2>Third-party services on this website</h2>
        <p>
          To display this website, your browser loads fonts from Google Fonts and
          some images from Unsplash. When it does, those services can see your
          IP address and basic browser details, as with any website that uses
          them.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep enquiries only for as long as we need them to respond and to
          keep reasonable records. Membership records are kept while you are a
          member and for a reasonable period afterwards. You can ask us to
          delete your information at any time (see below).
        </p>

        <h2>Keeping it safe</h2>
        <p>
          Access to our administration system requires a password, different
          administrators have different levels of access, and the website is
          served over a secure connection.
        </p>

        <h2>Your rights</h2>
        <p>
          Under Kenya's Data Protection Act, 2019, you can ask to know what
          information we hold about you, to see it, to have it corrected, to have
          it deleted, and to object to how we use it. To do any of these, email
          us at <a href="mailto:info@lewocomcultd.co.ke">info@lewocomcultd.co.ke</a>.
          If you are not satisfied with how we handle your information, you may
          complain to the Office of the Data Protection Commissioner of Kenya
          (<a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">odpc.go.ke</a>).
        </p>

        <h2>Changes to this notice</h2>
        <p>
          We may update this notice from time to time. The date at the top shows
          when it was last changed.
        </p>
      </main>
    </div>
  )
}

export default Privacy
