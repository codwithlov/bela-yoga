const GoogleTagManagerNoScript: React.FC = () => {
    return (
        <noscript>
            <iframe
                loading="lazy"
                src="https://www.googletagmanager.com/ns.html?id=GTM-N6PNLDP"
                height="0" width="0" style={{ display: "none", visibility: "hidden" }}>
            </iframe>
        </noscript>
    );
};

export default GoogleTagManagerNoScript;
