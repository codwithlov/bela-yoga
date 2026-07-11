import NavBar from "@/components/guest/NavBar";
import ContactSupport from "@/components/guest/ContactSupport";
import ScrollToTop from "@/components/guest/ScrollToTop";
import StoreProvider from "@/store/StoreProvider";
import React from "react";
import AdminNavBar from "@/components/guest/AdminNavBar";
import GoogleAnalytics from "@/components/script/GoogleAnalytics";
import { getPublicMenus } from "@/services/api/discovery";
import { templateSiteConfig } from "@/config/template/site";
// import Footer from "@/components/guest/Footer";
// import ChatWidget from "@/components/script/ChatWidget";
// const ChatWidget = dynamic(() => import('@/components/script/ChatWidget'), { ssr: false })
import dynamic from "next/dynamic";
const Footer = dynamic(() => import('@/components/guest/Footer'))

async function GuestLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [headerMenus, footerMenus, accountMenus] = await Promise.all([
		getPublicMenus('header'),
		getPublicMenus('footer'),
		getPublicMenus('account'),
	]);

	return (
		<>
			<StoreProvider>
				<AdminNavBar />
				<NavBar menuList={headerMenus} />
				<div className="min-h-screen bg-sgt-bg-primary">
					{children}
				</div>
				<Footer footerMenus={footerMenus} accountMenus={accountMenus} />
				{templateSiteConfig.features.showContactSupport && <ContactSupport />}
				{/* <ChatWidget /> */}
				{templateSiteConfig.features.showGoogleAnalytics && <GoogleAnalytics />}
				{templateSiteConfig.features.showScrollToTop && <ScrollToTop />}
			</StoreProvider>
		</>
	);
}
export default GuestLayout