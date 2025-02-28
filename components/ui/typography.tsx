import { cn } from "@/lib/utils";
import { ElementType } from "react"; // ElementType import edildi

interface TypographyProps extends React.HTMLAttributes<HTMLParagraphElement> {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "muted";
}

export function Typography({ variant = "p", className, ...props }: TypographyProps) {
    const componentMap: Record<string, ElementType> = {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        p: "p",
        span: "span",
        muted: "span"
    };
    const Component: ElementType = componentMap[variant] || "p"; // ElementType olarak belirtildi

    return <Component className={cn("text-gray-900 dark:text-gray-100", className)} {...props} />;
}
