import Script from 'next/script';

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const GtmScript = () => {
  if (!gtmId) {
    return (
      <Script id="gtm-stub" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'gtm.js', 'gtm.start': new Date().getTime() });
      `}</Script>
    );
  }

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}</Script>
      <noscript>
        <iframe
          title="gtm"
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
};
