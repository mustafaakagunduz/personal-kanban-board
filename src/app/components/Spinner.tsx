// /src/app/components/Spinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => (
    <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
);

export default Spinner;
