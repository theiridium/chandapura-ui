"use client"
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

const ListArrow = ({ size, row, infinite, minirow, displayInMobile, displayArrowLg }: any) => {
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [screenWidth, setScreenWidth] = useState(0);
    const scrollInterval = useRef<any>(null);
    const onLeftClick = () => {
        let el = document.getElementsByClassName(row)[0];
        el.scrollBy({ left: -size, behavior: 'smooth' });
    }
    const onRightClick = () => {
        let el = document.getElementsByClassName(row)[0];
        el.scrollBy({ left: size, behavior: 'smooth' });
    }
    const startScrolling = () => {
        if (displayArrowLg && infinite && screenWidth > 1279) {
            if (canScrollRight) {
                scrollInterval.current = setInterval(() => {
                    onRightClick();
                }, 4000);
            } else {
                scrollInterval.current = setTimeout(() => {
                    let el = document.getElementsByClassName(row)[0];
                    el.scrollBy({ left: -el.scrollLeft, behavior: 'smooth' });
                }, 4000);
            }
        }
    };
    const stopScrolling = () => {
        clearInterval(scrollInterval.current);
        clearTimeout(scrollInterval.current);
    };
    useEffect(() => {
        setScreenWidth(window.screen.width);
        const wrapper: any = document.querySelector('.' + row);
        const arrows = document.querySelectorAll('.btn-list-arrow');
        const updateButtons = () => {
            if (displayArrowLg) {
                const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
                setCanScrollLeft(wrapper.scrollLeft > 0);
                setCanScrollRight(wrapper.scrollLeft < maxScrollLeft);
            }
            else {
                setCanScrollLeft(false);
                setCanScrollRight(false);
            }
        };

        wrapper.addEventListener('scroll', updateButtons);
        updateButtons();

        const handleMouseEnter = () => stopScrolling();
        const handleMouseLeave = () => startScrolling();

        wrapper.addEventListener('mouseenter', handleMouseEnter);
        wrapper.addEventListener('mouseleave', handleMouseLeave);

        arrows.forEach(arrow => {
            arrow.addEventListener('mouseenter', handleMouseEnter);
            arrow.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            wrapper.removeEventListener('scroll', updateButtons);
            wrapper.removeEventListener('mouseenter', handleMouseEnter);
            wrapper.removeEventListener('mouseleave', handleMouseLeave);

            arrows.forEach(arrow => {
                arrow.removeEventListener('mouseenter', handleMouseEnter);
                arrow.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, [canScrollLeft, canScrollRight]);
    useEffect(() => {
        startScrolling();
        window.addEventListener("resize", () => {
            setScreenWidth(window.screen.width);
        });
        return () => {
            stopScrolling();
        };
    }, [canScrollRight, screenWidth])
    return (
        <div className={`${(displayInMobile) ? `flex justify-between mt-5 xl:block xl:mt-0` : `hidden xl:block`}`}>
            <button className={`btn-list-arrow mx-3 xl:mx-0 xl:absolute ${(minirow) ? `${minirow}` : `top-1/2`} bottom-1/2 left-0 ${(screenWidth > 1378) && 'left-[-20px]'} ${!canScrollLeft ? 'invisible' : 'visible'}`} onClick={onLeftClick}>{(screenWidth > 1279) ? <ArrowLeft color='white' strokeWidth={2} size={28} /> : <div className='flex items-center text-color1d'><ArrowLeft className='mr-1' color='#650081' strokeWidth={1} size={24} />Prev</div>}</button>
            <button className={`btn-list-arrow mx-3 xl:mx-0 xl:absolute ${(minirow) ? `${minirow}` : `top-1/2`} bottom-1/2 right-0 ${(screenWidth > 1378) && 'right-[-20px]'} ${!canScrollRight ? 'invisible' : 'visible'}`} onClick={onRightClick}>{(screenWidth > 1279) ? <ArrowRight color='white' strokeWidth={2} size={28} /> : <div className='flex items-center text-color1d'>Next<ArrowRight className='ml-1' color='#650081' strokeWidth={1} size={24} /></div>}</button>
        </div>
    )
}

export default ListArrow