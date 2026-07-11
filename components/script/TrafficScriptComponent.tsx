
import Script from 'next/script';

const TrafficScriptComponent: React.FC = () => {
    return (
        <>
            <Script
                src="https://cloud.vsm.vn/js/traffic.js?ver=1gzq"
                strategy="lazyOnload" // Tải script khi trang đã tải xong
                rel='preconnect'
                defer
            />
        </>
    );
};

export default TrafficScriptComponent;
