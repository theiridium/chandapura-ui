import { cn, Radio, RadioProps, useRadio, VisuallyHidden } from "@heroui/react";
import { IndianRupee } from 'lucide-react';
import React from 'react'

const PricingRadio = (props: RadioProps) => {
    const {
        Component,
        children,
        description,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio(props);
    return (
        <Component
            {...getBaseProps()}
            className={cn(
                "group inline-flex items-center justify-between hover:bg-primary/20 flex-row-reverse",
                "max-w-full cursor-pointer border-2 border-primary/30 rounded-lg gap-4 p-4",
                "data-[selected=true]:border-primary"
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <span {...getWrapperProps()}
                className={cn(
                    "relative inline-flex items-center justify-center flex-shrink-0 overflow-hidden",
                    "border-solid border-medium box-border border-primary/30 rounded-full group-data-[hover-unselected=true]:bg-default-100",
                    "outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus",
                    "group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background group-data-[selected=true]:border-primary",
                    "w-5 h-5 group-data-[pressed=true]:scale-95 transition-transform-colors motion-reduce:transition-none"
                )}
            >
                <span {...getControlProps()} />
            </span>
            <div {...getLabelWrapperProps()}>
                {children && <span {...getLabelProps()}>{children}</span>}
            </div>
        </Component>
    )
}

export default PricingRadio