
import { usePathname } from 'next/navigation';
import { useMemo } from 'react'
const usePathUrlToSlugOfSearch = () => {
    const pathname = usePathname();
    const convertPathUrlToParams = useMemo((() => {
        let pathnameConvert = pathname?.split('/').splice(1, pathname?.split('/').length) as any;
        let slug = pathnameConvert[0].search('search') == -1 ? pathnameConvert.join('/') : null;
        return slug;
    }), [pathname]);
    return convertPathUrlToParams;
}

export default usePathUrlToSlugOfSearch