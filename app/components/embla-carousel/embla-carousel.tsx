"use client"
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel'
import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-buttons'
import Autoplay from 'embla-carousel-autoplay'
import { MutableRefObject, useEffect, useRef } from 'react'

type PropType = {
    slides: any[]
    options?: EmblaOptionsType
    height: string
    isAutoplay: boolean
    urls: any[]
}

const EmblaCarousel = (props: PropType) => {
    const { slides, options, isAutoplay, urls } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ stopOnInteraction: false, stopOnMouseEnter: true })])
    useEffect(() => {
        if (emblaApi) {
            const autoplay: any = emblaApi.plugins().autoplay;
            isAutoplay ? autoplay.play() : autoplay.stop();
        }
    }, [emblaApi])

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)
    return (
        <section className="embla">
            <div className={`embla__viewport relative rounded-md ${props.height}`} ref={emblaRef}>
                <div className="embla__container h-full">
                    {slides.map((x, i) => (
                        <div className="rounded-md bg-gray-200 embla__slide grid justify-items-center" key={i}>
                            {urls[i] ? <a target='_blank' href={urls[i]}>{x}</a> : x}
                        </div>
                    ))}
                </div>
                <div className='hidden absolute top-0 left-0 lg:flex h-full items-center justify-center px-4'>
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                </div>
                <div className='hidden absolute top-0 right-0 lg:flex h-full items-center justify-center px-4'>
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel