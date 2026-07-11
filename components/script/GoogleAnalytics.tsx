import Script from 'next/script';

const GoogleAnalytics: React.FC = () => {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-M4X1303E0N"
        strategy="afterInteractive"
        defer
        rel='preconnect'
      />
      <Script id="google-analytics"
        strategy="afterInteractive"
        defer
        rel='preconnect'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M4X1303E0N');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
