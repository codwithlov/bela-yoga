import type { Metadata } from "next";
import "../styles/globals.scss";
// import '@fortawesome/fontawesome-svg-core/styles.css';
// import 'ckeditor5/ckeditor5.css';
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";
// import { fas } from '@fortawesome/free-solid-svg-icons';
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import Script from "next/script";

import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleTagManagerScript from "@/components/script/GoogleTagManagerScript";
import GoogleTagManagerNoScript from "@/components/script/GoogleTagManagerNoScript";
import AntdCompatibility from "@/components/general/AntdCompatibility";
import { templateSiteConfig } from "@/config/template/site";
import { templateTheme } from "@/config/template/theme";

// inter.style.fontStyle = 'normal';
// library.add(fab, fas);
export const metadata: Metadata = {
  title: templateSiteConfig.metadata.title,
  description: templateSiteConfig.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_CLIENT_ID?.trim();

  return (
    <html lang={templateSiteConfig.locale} className="!scroll-smooth" suppressHydrationWarning>
      <head>
        {/* <link rel="preconnect" href="https://cdn.saigontimestravel.com" />
        <link rel="dns-prefetch" href="https://cdn.saigontimestravel.com" /> */}
        <link rel='icon' sizes="32x32" href={templateSiteConfig.assets.favicon} />
        <link rel="apple-touch-icon" sizes="180x180" href={templateSiteConfig.assets.appleTouchIcon} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={templateTheme.colors.secondaryDark} />
        <Script id="strip-extension-hydration-attrs" strategy="beforeInteractive">
          {`
            (() => {
              const shouldRemove = (name) =>
                name === 'bis_register' ||
                name === 'bis_skin_checked' ||
                name.startsWith('__processed_');

              const cleanNode = (node) => {
                if (!(node instanceof Element)) return;

                for (const attr of Array.from(node.attributes)) {
                  if (shouldRemove(attr.name)) {
                    node.removeAttribute(attr.name);
                  }
                }

                for (const child of Array.from(node.children)) {
                  cleanNode(child);
                }
              };

              const cleanDocument = () => cleanNode(document.documentElement);

              cleanDocument();

              const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                  if (mutation.type === 'attributes' && mutation.target instanceof Element) {
                    if (shouldRemove(mutation.attributeName || '')) {
                      mutation.target.removeAttribute(mutation.attributeName);
                    }
                  }

                  for (const node of Array.from(mutation.addedNodes)) {
                    cleanNode(node);
                  }
                }
              });

              observer.observe(document.documentElement, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ['bis_register', 'bis_skin_checked'],
              });

              window.addEventListener('load', () => {
                setTimeout(() => observer.disconnect(), 3000);
              }, { once: true });
            })();
          `}
        </Script>
        <GoogleTagManagerScript />
      </head>
      <body id="__sgt" suppressHydrationWarning>
        <AntdCompatibility />
        <GoogleTagManagerNoScript />
        <main>
          <AntdRegistry>
            <ConfigProvider theme={{
              token: {
                fontFamily: templateTheme.fontFamily,
                colorPrimary: templateTheme.colors.primaryDefault,
                colorInfo: templateTheme.colors.primaryDefault,
                colorSuccess: templateTheme.colors.tertiaryDefault,
                colorTextBase: templateTheme.colors.secondaryDefault,
                colorBgBase: templateTheme.colors.backgroundPrimary,
                borderRadius: templateTheme.layout.radius,
              },
              components: {
                Message: {
                  zIndexPopup: 9999,
                },
              },
            }}>
              {googleClientId ? (
                <GoogleOAuthProvider clientId={googleClientId}>
                  {children}
                </GoogleOAuthProvider>
              ) : (
                children
              )}
            </ConfigProvider>
          </AntdRegistry>
        </main>
      </body>
    </html>
  );
}
