"use client";

import Script from 'next/script';

const SchemaOrg = ({ pageId }: { pageId?: string }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Studio",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0199",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://facebook.com/studio",
      "https://twitter.com/studio",
      "https://instagram.com/studio"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Studio",
    "url": "https://example.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://example.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Studio provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a comprehensive range of creative services including brand identity design, architectural photography, interior design consultation, and digital product development."
        }
      },
      {
        "@type": "Question",
        "name": "How do you approach a new project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every project begins with a deep discovery phase. We immerse ourselves in your brand, market, and audience to uncover insights that drive purposeful design."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default SchemaOrg;
