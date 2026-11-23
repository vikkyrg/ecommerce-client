// Central Business Configuration for NS Stone Chemicals
export const businessConfig = {
  companyName: "NS Stone Chemicals",
  legalName: "NS Stone Chemicals",
  tagline: "Premium Stone Care & Surface Solutions",
  
  // Contact details
  phone: "+91 97388 93424",
  phoneRaw: "+919738893424",
  phoneTel: "tel:+919738893424",
  
  whatsapp: "+91 97388 93424",
  whatsappRaw: "919738893424",
  whatsappUrl: "https://wa.me/919738893424",
  
  email: "nsstonechemicals2025@gmail.com",
  emailMailto: "mailto:nsstonechemicals2025@gmail.com",
  
  website: "https://nsstonechemicals.com",
  websiteDisplay: "nsstonechemicals.com",

  // Hours & Address
  supportHours: "Mon - Sat: 9:00 AM - 7:30 PM",
  responseTime: "Replies within minutes on WhatsApp",
  location: "India",
  address: "Bangalore, Karnataka, India",

  // Helpers
  getWhatsAppProductUrl: (productName, sku) => {
    const text = encodeURIComponent(
      `Hello NS Stone Chemicals! I am interested in purchasing:\n*${productName}*${sku ? ` (SKU: ${sku})` : ''}.\nPlease share availability and order details.`
    );
    return `https://wa.me/919738893424?text=${text}`;
  }
};

export default businessConfig;
