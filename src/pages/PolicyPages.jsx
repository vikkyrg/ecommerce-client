import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  FileText, 
  Lock, 
  ChevronRight, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  PackageCheck,
  CreditCard
} from 'lucide-react';
import businessConfig from '../config/businessConfig';

// Reusable Breadcrumb & Header Component
function PolicyHeader({ tag, title, description, lastUpdated = 'November 2026' }) {
  return (
    <div className="border-b border-[#e2e3e1] pb-6 mb-8">
      <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-neutral-800 font-medium">{title}</span>
      </div>
      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full inline-block mb-2">
        {tag}
      </span>
      <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl lg:text-4xl text-black tracking-tight">
        {title}
      </h1>
      <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-4 text-[11px] text-neutral-400">
        <span>Official Policy</span>
        <span>•</span>
        <span>Last Updated: {lastUpdated}</span>
      </div>
    </div>
  );
}

// Reusable Contact Box for Bottom of Policy Pages
function PolicyContactBox() {
  return (
    <div className="mt-10 pt-8 border-t border-[#e2e3e1]">
      <div className="bg-[#fcfcfb] rounded-xl border border-[#e2e3e1] p-5 sm:p-6">
        <h3 className="font-['Manrope'] font-bold text-sm text-black mb-1">
          Have Questions or Need Assistance?
        </h3>
        <p className="text-xs text-neutral-600 mb-4">
          Our customer support team is available Monday through Saturday to answer questions about orders, policies, or product specifications.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href={businessConfig.phoneTel}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-[#e2e3e1] bg-white hover:border-[#D4AF37] hover:bg-neutral-50 transition-colors"
          >
            <Phone className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-[10px] text-neutral-500 font-medium">Direct Call</p>
              <p className="font-semibold text-black">{businessConfig.phone}</p>
            </div>
          </a>
          <a
            href={businessConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-lg border border-[#e2e3e1] bg-white hover:border-[#25D366] hover:bg-neutral-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <div>
              <p className="text-[10px] text-neutral-500 font-medium">WhatsApp</p>
              <p className="font-semibold text-black">{businessConfig.whatsapp}</p>
            </div>
          </a>
          <a
            href={businessConfig.emailMailto}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-[#e2e3e1] bg-white hover:border-[#D4AF37] hover:bg-neutral-50 transition-colors"
          >
            <Mail className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-[10px] text-neutral-500 font-medium">Email Support</p>
              <p className="font-semibold text-black truncate">{businessConfig.email}</p>
            </div>
          </a>
        </div>
        <div className="mt-3 text-[11px] text-neutral-500 flex flex-wrap gap-4 pt-2">
          <span>Working Hours: {businessConfig.supportHours}</span>
          <span>•</span>
          <span>Location: {businessConfig.address}</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. SHIPPING & DELIVERY POLICY PAGE (/shipping)
// -------------------------------------------------------------
export function ShippingPolicy() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <PolicyHeader
            tag="Logistics & Dispatch"
            title="Shipping & Delivery Information"
            description={`Comprehensive delivery policies, dispatch timeframes, and tracking procedures for ${businessConfig.companyName}.`}
          />

          <div className="space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-['Inter']">
            {/* Delivery Coverage */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                1. Delivery Coverage Across India
              </h2>
              <p>
                {businessConfig.companyName} delivers stone care chemicals, polishing powders, sealers, tile adhesives, epoxy grouts, and diamond cutting accessories across India. We service over 19,000+ pin codes nationwide through trusted surface courier networks and registered logistics partners.
              </p>
              <p>
                Whether your site or workshop is situated in major metropolitan centres or remote construction locations, our transport partners ensure insured and secure transit.
              </p>
            </section>

            {/* Order Processing */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                2. Order Processing & Dispatch Timelines
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>Orders placed Monday through Saturday before 2:00 PM IST are verified and packed within 24 business hours.</li>
                <li>Orders received on Sundays or gazetted public holidays are processed on the subsequent working business day.</li>
                <li>Special chemical packaging (including tamper-evident caps and leak-proof safety barriers) is applied before handing over packages to the courier network.</li>
              </ul>
            </section>

            {/* Delivery Timelines */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-amber-600" />
                3. Estimated Delivery Timeframes
              </h2>
              <div className="bg-[#fcfcfb] border border-[#e2e3e1] rounded-xl p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#e2e3e1] text-neutral-500 uppercase tracking-wider text-[10px]">
                      <th className="pb-2 font-bold">Region</th>
                      <th className="pb-2 font-bold">Estimated Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="py-2.5 font-medium text-black">South India / Bangalore Hub</td>
                      <td className="py-2.5 text-neutral-600">1 – 3 Business Days</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-black">Metro Cities (Mumbai, Delhi-NCR, Hyderabad, Chennai, Kolkata)</td>
                      <td className="py-2.5 text-neutral-600">3 – 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-black">Rest of India (Tier 2 / Tier 3 Towns)</td>
                      <td className="py-2.5 text-neutral-600">4 – 7 Business Days</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-black">Special Logistics / Remote PIN Codes</td>
                      <td className="py-2.5 text-neutral-600">6 – 9 Business Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-neutral-500 italic">
                * Timelines are indicative and depend on courier hub transit schedules, local weather, and road transport regulations.
              </p>
            </section>

            {/* Shipping Charges */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                4. Shipping Charges & Conditions
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li><strong>Free Shipping:</strong> Standard complimentary doorstep shipping applies to all qualifying orders above ₹1,999.</li>
                <li><strong>Standard Orders:</strong> Orders below ₹1,999 incur a nominal flat shipping fee of ₹150 calculated at checkout.</li>
                <li><strong>Heavy / Bulk Orders:</strong> For wholesale drums, palletized crates, or multi-bag tile adhesive consignments (above 50 kg), door delivery freight or transporter godown pickup can be arranged via WhatsApp assistance.</li>
                <li>All charges are transparently displayed in your shopping cart before payment or COD confirmation. No hidden surcharge is levied.</li>
              </ul>
            </section>

            {/* Order Tracking */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                5. Live Order Tracking
              </h2>
              <p>
                Once your order has been dispatched, you will receive an automated notification with your assigned consignment number. You can monitor your delivery milestone anytime through our live tracking page:
              </p>
              <div className="pt-1">
                <Link
                  to="/track-order"
                  className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors shadow-2xs"
                >
                  <span>Track Your Order Live</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </Link>
              </div>
            </section>

            {/* Delivery Support */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                6. Delivery-Related Customer Support
              </h2>
              <p>
                If your package is delayed, if the courier attempted delivery when you were unavailable, or if you need to update your contact landmark, reach out to our delivery desk directly via WhatsApp at <strong>{businessConfig.phone}</strong> or email <strong>{businessConfig.email}</strong>.
              </p>
            </section>
          </div>

          <PolicyContactBox />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. RETURNS & REFUNDS POLICY PAGE (/returns)
// -------------------------------------------------------------
export function ReturnPolicy() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <PolicyHeader
            tag="Customer Guarantee"
            title="Returns & Refunds Policy"
            description={`Clear, fair guidelines for product returns, replacements, and refund processing at ${businessConfig.companyName}.`}
          />

          <div className="space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-['Inter']">
            {/* Overview */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                1. 7-Day Return Window
              </h2>
              <p>
                At {businessConfig.companyName}, we stand behind the authenticity and quality of every chemical and abrasive we supply. If you receive an incorrect item, or if you change your mind prior to unsealing the container, you may request a return within <strong>7 calendar days</strong> from the date of confirmed delivery.
              </p>
            </section>

            {/* Eligible Conditions */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                2. Conditions Eligible for Return
              </h2>
              <p>To qualify for a standard return and refund, the product must meet the following criteria:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>The item must be in its original, unopened, unadulterated condition.</li>
                <li>Factory induction seals, tamper-evident neck bands, and original labels must be completely intact.</li>
                <li>The original outer product box, technical data sheet, and tax invoice must be included.</li>
                <li>The item was purchased directly through our official website ({businessConfig.websiteDisplay}) or direct phone/WhatsApp counter.</li>
              </ul>
            </section>

            {/* Non-Returnable Products */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                3. Non-Returnable Products
              </h2>
              <p>Due to safety regulations, shelf-life integrity, and chemical stabilization, the following items cannot be returned once opened:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>Unsealed or partially used liquid chemicals (crystallizers, sealers, acid cleaners, impregnators).</li>
                <li>Pre-mixed epoxy grouts, resin tubs, or hardener bottles whose protective seal is broken.</li>
                <li>Custom-cut abrasive belts or specialized machine diamond pads that exhibit operational wear.</li>
                <li>Items returned past the 7-day post-delivery inspection window.</li>
              </ul>
            </section>

            {/* Damaged or Incorrect Products */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                4. Damaged, Leaking or Incorrect Product Handling
              </h2>
              <p>
                If your parcel arrives with visible transit damage, outer bottle leakage, or incorrect SKU contents:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-neutral-600">
                <li>Notify our customer team within <strong>48 hours</strong> of package delivery.</li>
                <li>Share clear photos or a short video showing the outer shipping box, airway bill label, and the affected container/seal.</li>
                <li>Send these details via WhatsApp at <strong>{businessConfig.phone}</strong> or email to <strong>{businessConfig.email}</strong> with your Order ID (e.g. NSC-2026-XXXXX).</li>
                <li>Upon verification, we will immediately dispatch a <strong>free replacement</strong> or process an immediate complete refund. You will not incur any return shipping charges for damaged or defective items.</li>
              </ol>
            </section>

            {/* Return Request Procedure */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                5. Step-by-Step Return Request Procedure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#fcfcfb] border border-[#e2e3e1] p-4 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">1</span>
                  <h4 className="font-bold text-black text-xs mb-1">Initiate Request</h4>
                  <p className="text-[11px] text-neutral-600">Contact our support team with your Order ID and photo of the sealed item.</p>
                </div>
                <div className="bg-[#fcfcfb] border border-[#e2e3e1] p-4 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">2</span>
                  <h4 className="font-bold text-black text-xs mb-1">Pickup or Ship</h4>
                  <p className="text-[11px] text-neutral-600">We schedule a reverse courier pickup or provide verified return hub dispatch details.</p>
                </div>
                <div className="bg-[#fcfcfb] border border-[#e2e3e1] p-4 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center mb-2">3</span>
                  <h4 className="font-bold text-black text-xs mb-1">Inspection & Refund</h4>
                  <p className="text-[11px] text-neutral-600">Upon warehouse receipt and verification, refund is initiated within 3 business days.</p>
                </div>
              </div>
            </section>

            {/* Refund Processing */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                6. Refund Processing Timelines & Methods
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li><strong>Prepaid Online Orders (Card / Net Banking / UPI):</strong> The refund amount will be credited back to your original payment method within 3 to 5 business days after inspection.</li>
                <li><strong>Cash on Delivery (COD) Orders:</strong> The refund will be transferred directly to your bank account via NEFT/IMPS or UPI handle after you provide your beneficiary details to our team.</li>
              </ul>
            </section>
          </div>

          <PolicyContactBox />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. PRIVACY POLICY PAGE (/privacy-policy)
// -------------------------------------------------------------
export function PrivacyPolicy() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <PolicyHeader
            tag="Data Privacy & Protection"
            title="Privacy Policy"
            description={`How ${businessConfig.companyName} collects, handles, safeguards, and respects your personal and transaction data.`}
          />

          <div className="space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-['Inter']">
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                1. Introduction
              </h2>
              <p>
                This Privacy Policy describes the practices of <strong>{businessConfig.companyName}</strong> ("we", "us", or "our") regarding the collection, storage, and processing of personal data gathered through our website (<strong>{businessConfig.websiteDisplay}</strong>) and related customer communication channels.
              </p>
              <p>
                We are committed to operating transparently in accordance with the Information Technology Act, 2000 and applicable digital privacy regulations in India. By accessing our services, creating an account, or placing an order, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                2. Information We Collect
              </h2>
              <p>We collect only the minimum required information necessary to provide e-commerce purchasing and logistics services:</p>
              
              <div className="space-y-3 pl-2">
                <div>
                  <h4 className="font-bold text-black text-xs sm:text-sm">A. Personal Information</h4>
                  <p className="text-neutral-600 mt-0.5">
                    Your full name, contact mobile number, email address, and billing/shipping addresses provided during checkout, account creation, or inquiry submissions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-black text-xs sm:text-sm">B. Account Information</h4>
                  <p className="text-neutral-600 mt-0.5">
                    If you register a customer account, we store your login credentials (passwords are securely hashed with bcrypt and never stored in plain text), order history, and saved address book entries.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-black text-xs sm:text-sm">C. Order and Transaction Information</h4>
                  <p className="text-neutral-600 mt-0.5">
                    Details of products purchased, order identification numbers, quantities, prices, payment status (e.g. Paid, Cash on Delivery), invoice records, and shipping instructions.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-black text-xs sm:text-sm">D. Shipping and Delivery Information</h4>
                  <p className="text-neutral-600 mt-0.5">
                    Consignee name, destination PIN code, delivery phone number, landmark directions, and courier airway bill tracking references.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>To process, pack, invoice, and deliver your orders.</li>
                <li>To send transactional notifications (order confirmation, dispatch updates, tracking IDs).</li>
                <li>To provide responsive technical advice and customer service via phone, email, and WhatsApp.</li>
                <li>To verify and prevent fraudulent transactions or duplicate order attempts.</li>
                <li>To comply with statutory tax (GST) and accounting recordkeeping mandates.</li>
              </ul>
            </section>

            {/* 4. Cookies and Website Usage */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                4. Cookies & Website Usage
              </h2>
              <p>
                Our store uses essential browser session cookies and local storage tokens to remember your shopping cart items, preserve your customer login session, and maintain wishlist state. We do not use intrusive spyware or third-party behavioral ad trackers across unrelated websites.
              </p>
            </section>

            {/* 5. Payment Information and Security */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                5. Payment Information & Security
              </h2>
              <p>
                Your financial safety is paramount:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li><strong>No Card Storage:</strong> {businessConfig.companyName} never stores, sees, or logs your complete credit card numbers, debit card details, CVVs, or net banking passwords on our servers.</li>
                <li><strong>Secure Gateways:</strong> All digital payments are processed through PCI-DSS compliant Indian payment gateways (such as Razorpay / UPI). Transmission is encrypted via Transport Layer Security (TLS 1.3 / SSL).</li>
                <li><strong>Cash on Delivery (COD):</strong> For cash-on-delivery orders, payment is handed directly to the courier executive upon physical parcel handover.</li>
              </ul>
            </section>

            {/* 6. Sharing of Information */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                6. Sharing of Information
              </h2>
              <p>
                We do <strong>not</strong> sell, rent, monetize, or trade customer contact information to marketing brokers. We share customer information only with the following essential service partners:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li><strong>Logistics Partners:</strong> Verified surface and air courier networks solely to enable physical package delivery and GPS tracking.</li>
                <li><strong>Payment Processors:</strong> Authorized financial gateways to authenticate and complete payment captures.</li>
                <li><strong>Legal Mandates:</strong> Law enforcement or judicial authorities only when required by valid court order or statutory Indian legal obligation.</li>
              </ul>
            </section>

            {/* 7. Data Protection & Retention */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                7. Data Protection & Retention
              </h2>
              <p>
                We maintain appropriate technological safeguards (including firewalled MongoDB database environments, encrypted passwords, and secure JWT authentication) to protect against unauthorized data access, alteration, or disclosure.
              </p>
              <p>
                Customer account and transactional records are retained for as long as your account remains active or as required by commercial tax, invoicing, and audit requirements under Indian law.
              </p>
            </section>

            {/* 8. Customer Rights */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                8. Your Customer Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>Access, review, or update your saved shipping addresses in your Customer Account portal.</li>
                <li>Request correction of erroneous account information.</li>
                <li>Request deletion or deactivation of your customer profile by contacting our support desk.</li>
              </ul>
            </section>

            {/* 9. Policy Updates */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                9. Policy Updates
              </h2>
              <p>
                We may periodically update this Privacy Policy to reflect improvements in our operations or regulatory statutory amendments. Any modifications will be posted here with an updated revision date.
              </p>
            </section>
          </div>

          <PolicyContactBox />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. TERMS OF SERVICE / TERMS & CONDITIONS PAGE (/terms)
// -------------------------------------------------------------
export function TermsConditions() {
  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container max-w-4xl mx-auto">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <PolicyHeader
            tag="Commercial Agreement"
            title="Terms of Service"
            description={`General commercial terms, website usage rules, and customer purchase conditions for ${businessConfig.companyName}.`}
          />

          <div className="space-y-8 text-xs sm:text-sm text-neutral-700 leading-relaxed font-['Inter']">
            {/* 1. Website Usage Terms */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                1. Website Usage Terms
              </h2>
              <p>
                These Terms of Service govern your access to and use of <strong>{businessConfig.websiteDisplay}</strong>, operated by <strong>{businessConfig.companyName}</strong>. By visiting our site or purchasing our products, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            {/* 2. Customer Account Responsibilities */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                2. Customer Account Responsibilities
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>You are responsible for maintaining the confidentiality of your account credentials and password.</li>
                <li>You agree to provide true, accurate, and complete information regarding your name, shipping address, contact phone number, and tax details.</li>
                <li>You agree to notify us immediately of any unauthorized use or security breach of your account.</li>
              </ul>
            </section>

            {/* 3. Product Information and Pricing */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                3. Product Information, Technical Specs & Pricing
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>All products listed (polishing chemicals, crystallization powders, adhesives, impregnating sealers, abrasives) are genuine and sourced through authorized brand channels.</li>
                <li>Prices are displayed in Indian Rupees (INR ₹) and are inclusive or exclusive of GST as explicitly stated on product pages and final checkout.</li>
                <li>While we endeavor to keep specifications and imagery accurate, packaging design or manufacturer labels may change slightly between batches without altering chemical specifications.</li>
                <li><strong>Spot Testing Recommended:</strong> Because natural stones (marble, granite, limestone, travertine) exhibit significant natural chemical variations, users must always perform a sample test on an inconspicuous corner before extensive surface treatment.</li>
              </ul>
            </section>

            {/* 4. Orders and Order Confirmation */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                4. Orders & Order Confirmation
              </h2>
              <p>
                When you place an order on our store:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li>You will receive an immediate onscreen confirmation showing your designated Order ID (e.g. NSC-2026-XXXXX).</li>
                <li>We reserve the right to verify, decline, or cancel any order in situations involving incorrect pricing, stock unavailability, or incomplete address details. In such cases, any prepaid funds will be refunded promptly.</li>
              </ul>
            </section>

            {/* 5. Payment Conditions */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                5. Payment Conditions
              </h2>
              <p>
                We accept major Indian payment methods including UPI, Net Banking, Debit/Credit Cards, and Cash on Delivery (COD) for eligible serviceable PIN codes. For COD orders, payment in full must be made to the logistics agent upon parcel delivery prior to package opening.
              </p>
            </section>

            {/* 6. Shipping & Delivery Terms */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                6. Shipping & Delivery Terms
              </h2>
              <p>
                Deliveries are executed through authorized commercial couriers. Dispatch and delivery timeframes are estimates and may occasionally be influenced by transport holidays or regional transit restrictions. Detailed logistics provisions are governed by our <Link to="/shipping" className="text-amber-700 underline font-semibold">Shipping Policy</Link>.
              </p>
            </section>

            {/* 7. Returns, Refunds & Cancellations */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                7. Returns, Refunds & Cancellation Policy
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                <li><strong>Cancellation:</strong> You may cancel an order free of charge before it has been dispatched by calling or messaging our WhatsApp desk with your Order ID.</li>
                <li><strong>Returns:</strong> Returns are accepted within 7 calendar days for sealed, unused items per our <Link to="/returns" className="text-amber-700 underline font-semibold">Returns & Refunds Policy</Link>.</li>
                <li><strong>Refunds:</strong> Processed to the original payment source or provided bank account within 3 to 5 business days post-inspection.</li>
              </ul>
            </section>

            {/* 8. Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                8. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable Indian law, {businessConfig.companyName} shall not be liable for indirect, incidental, or consequential damages resulting from improper chemical application, failure to follow technical safety data sheets, or surface mismatch. Our total liability for any claim arising out of a purchase shall not exceed the amount actually paid by you for the specific product in question.
              </p>
            </section>

            {/* 9. Governing Law & Jurisdiction */}
            <section className="space-y-3">
              <h2 className="font-['Manrope'] font-bold text-base sm:text-lg text-black">
                9. Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms and all purchase transactions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Bangalore, Karnataka, India.
              </p>
            </section>
          </div>

          <PolicyContactBox />
        </div>
      </div>
    </div>
  );
}
