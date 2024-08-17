"use client"
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Breadcrumb = ({ blockSecondLast }: any) => {
    const pathname = usePathname();
    const pathArray = pathname.split('/').filter(path => path);

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb flex items-center gap-1 mb-3 text-xs md:text-sm">
                <li key="home" className="breadcrumb-item">
                    <Link className='flex gap-1 items-center' href="/">
                        {/* <Home size={14} className='mb-1 hidden lg:block' /> */}
                        <span>Home</span>
                    </Link>
                </li>
                {pathArray.map((path, index) => {
                    const href = '/' + pathArray.slice(0, index + 1).join('/');

                    // Capitalize the first letter of each breadcrumb part
                    const text = path.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

                    // Check if it's the last breadcrumb part (current page)
                    const isLast = index === pathArray.length - 1;
                    let isSecondLast = false;
                    if (blockSecondLast) isSecondLast = index === pathArray.length - 2;

                    return (
                        !isSecondLast && <li key={index} className={`breadcrumb-item ${index > 1 && 'hidden lg:block'} ${isLast ? 'active' : ''}`}>
                            {isLast ? (
                                <span className='flex gap-1 items-center'><ChevronRight size={14} />{text}</span>
                            ) : (
                                <Link className='flex gap-1 items-center' href={href}>
                                    <ChevronRight size={14} />{text}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
