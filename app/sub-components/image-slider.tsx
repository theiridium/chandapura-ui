import EmblaCarousel from "../components/embla-carousel/embla-carousel"
import { EmblaOptionsType } from 'embla-carousel'

const OPTIONS: EmblaOptionsType = { loop: true }

const ImageSlider = ({ imageProp }: any) => {
    let imgList: any = []
    let urls: any = []
    imageProp.forEach((x: any) => {
        let image: any = {}
        image.src = x.url;
        image.alt = x.alternativeText;
        imgList.push(image);
        urls.push(x.ad_url);
    });

    const SLIDES = Array.from(imgList, (x: any, i) => <img className="h-auto lg:h-96" key={i} src={x.src} alt={x.alt} />)
    return (
        <EmblaCarousel bg="bg-black" radius="rounded-none content-center" height={'h-auto'} slides={SLIDES} options={OPTIONS} isAutoplay={false} urls={urls} />
    )
}

export default ImageSlider