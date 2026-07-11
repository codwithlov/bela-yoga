import { ImageLoaderProps } from "next/image"

const customLoader = (props: ImageLoaderProps) => {
    let params: any[] = [];
    // params = [`width=${props.width}`, `quality=${props.quality || 75}`]
    // return `${props.src}?${params.join('&')}`
    return `${props.src}`;
}
export default customLoader;

