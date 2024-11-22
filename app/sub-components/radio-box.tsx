import { RadioGroup, Radio, cn } from "@nextui-org/react";

export const RadioBox = (props: any) => {
    const { children, ...otherProps } = props;

    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    "inline-flex m-0 bg-content2 hover:bg-default-200 items-center justify-between",
                    "flex-row-reverse flex-1 max-w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                ),
            }}
        >
            {children}
        </Radio>
    );
};