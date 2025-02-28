import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerDialogProps {
    open: boolean;
    onClose: () => void;
    startColor: string;
    endColor: string;
    onStartColorChange: (color: string) => void;
    onEndColorChange: (color: string) => void;
    onReset: () => void;
}

// Convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
};

// Convert Hex to RGB
const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
};

// HSL to Hex conversion (already included in your original code)
function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Validate Hex color
const isValidHex = (hex: string): boolean => {
    return /^#?([a-f\d]{6}|[a-f\d]{3})$/i.test(hex);
};

const ColorPickerDialog: React.FC<ColorPickerDialogProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 startColor,
                                                                 endColor,
                                                                 onStartColorChange,
                                                                 onEndColorChange,
                                                                 onReset
                                                             }) => {
    const [colorMode, setColorMode] = useState<'gradient' | 'solid'>('gradient');
    const [singleColor, setSingleColor] = useState<string>(startColor);
    const pickerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<boolean>(false);
    const activeColor = useRef<'start' | 'end' | 'single'>('start');

    // Hex input states
    const [startColorHex, setStartColorHex] = useState<string>(startColor);
    const [endColorHex, setEndColorHex] = useState<string>(endColor);
    const [singleColorHex, setSingleColorHex] = useState<string>(singleColor);

    // Mouse position state
    const [startColorPos, setStartColorPos] = useState<{ x: number, y: number }>({ x: 0.25, y: 0.5 });
    const [endColorPos, setEndColorPos] = useState<{ x: number, y: number }>({ x: 0.75, y: 0.5 });
    const [singleColorPos, setSingleColorPos] = useState<{ x: number, y: number }>({ x: 0.5, y: 0.5 });

    // Initialize positions based on colors
    useEffect(() => {
        // We could calculate positions from colors, but it's complex to reverse HSL from hex
        // For simplicity, we'll just set default positions
        setStartColorHex(startColor);
        setEndColorHex(endColor);
        setSingleColorHex(startColor);
        setSingleColor(startColor);
    }, [startColor, endColor, open]);

    const handleReset = () => {
        const defaultStartColor = "#312e81"; // indigo-900
        const defaultEndColor = "#1e40af"; // blue-800

        onStartColorChange(defaultStartColor);
        onEndColorChange(defaultEndColor);
        setSingleColor(defaultStartColor);
        setStartColorHex(defaultStartColor);
        setEndColorHex(defaultEndColor);
        setSingleColorHex(defaultStartColor);
        setColorMode('gradient');
        setStartColorPos({ x: 0.25, y: 0.5 });
        setEndColorPos({ x: 0.75, y: 0.5 });
        setSingleColorPos({ x: 0.5, y: 0.5 });
    };

    const handleSave = () => {
        if (colorMode === 'solid') {
            onStartColorChange(singleColor);
            onEndColorChange(singleColor);
        }
        onClose();
    };

    // Color input handlers
    const handleStartColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStartColorHex(value);
        if (isValidHex(value)) {
            onStartColorChange(value.startsWith('#') ? value : `#${value}`);
        }
    };

    const handleEndColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEndColorHex(value);
        if (isValidHex(value)) {
            onEndColorChange(value.startsWith('#') ? value : `#${value}`);
        }
    };

    const handleSingleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSingleColorHex(value);
        if (isValidHex(value)) {
            const formattedValue = value.startsWith('#') ? value : `#${value}`;
            setSingleColor(formattedValue);
        }
    };

    // Handle color picker click/drag functions
    const handleColorPickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!pickerRef.current) return;
        isDragging.current = true;
        updateColorFromMousePosition(e);
    };

    const handleColorPickerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging.current || !pickerRef.current) return;
        updateColorFromMousePosition(e);
    };

    const handleColorPickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        updateColorFromMousePosition(e);
    };

    const updateColorFromMousePosition = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!pickerRef.current) return;
        const rect = pickerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // Normalized x position (0 to 1)
        const y = (e.clientY - rect.top) / rect.height;  // Normalized y position (0 to 1)

        // Calculate HSL values based on position
        const hue = x * 360; // Hue from 0 to 360
        const saturation = 100; // Always full saturation
        const lightness = 100 - (y * 100); // Lightness from 100 to 0

        // Convert HSL to Hex
        const color = hslToHex(hue, saturation, lightness);

        if (colorMode === 'gradient') {
            if (e.altKey) {
                // Alt key pressed - update end color
                activeColor.current = 'end';
                onEndColorChange(color);
                setEndColorHex(color);
                setEndColorPos({ x, y });
            } else {
                // No alt key - update start color
                activeColor.current = 'start';
                onStartColorChange(color);
                setStartColorHex(color);
                setStartColorPos({ x, y });
            }
        } else {
            // Single color mode
            activeColor.current = 'single';
            setSingleColor(color);
            setSingleColorHex(color);
            setSingleColorPos({ x, y });
        }
    };

    // Add global mouse event handlers
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            isDragging.current = false;
        };

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !pickerRef.current) return;

            const rect = pickerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

            // Calculate HSL values based on position
            const hue = x * 360;
            const saturation = 100;
            const lightness = 100 - (y * 100);

            // Convert HSL to Hex
            const color = hslToHex(hue, saturation, lightness);

            if (activeColor.current === 'start') {
                onStartColorChange(color);
                setStartColorHex(color);
                setStartColorPos({ x, y });
            } else if (activeColor.current === 'end') {
                onEndColorChange(color);
                setEndColorHex(color);
                setEndColorPos({ x, y });
            } else {
                setSingleColor(color);
                setSingleColorHex(color);
                setSingleColorPos({ x, y });
            }
        };

        if (open) {
            window.addEventListener('mouseup', handleGlobalMouseUp);
            window.addEventListener('mousemove', handleGlobalMouseMove);
        }

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [open, onStartColorChange, onEndColorChange]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-[400px] p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <DialogHeader className="mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <DialogTitle className="text-base font-semibold text-center">Arkaplan Rengini
                        Özelleştir</DialogTitle>
                </DialogHeader>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md mb-4">
                    <button
                        onClick={() => setColorMode('gradient')}
                        className={cn(
                            "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all",
                            colorMode === 'gradient'
                                ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        Gradyan Renk
                    </button>
                    <button
                        onClick={() => setColorMode('solid')}
                        className={cn(
                            "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all",
                            colorMode === 'solid'
                                ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        Tek Renk
                    </button>
                </div>

                {/* Interactive color picker */}
                <div
                    ref={pickerRef}
                    className="w-full h-56 rounded-lg cursor-pointer mb-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    onClick={handleColorPickerClick}
                    onMouseDown={handleColorPickerMouseDown}
                    onMouseMove={handleColorPickerMouseMove}
                    style={{
                        background: 'linear-gradient(to bottom, white, black), linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))',
                        backgroundBlendMode: 'multiply'
                    }}
                >
                    <div className="w-full h-full relative">
                        {colorMode === 'gradient' ? (
                            <>
                                <span
                                    className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{
                                        backgroundColor: startColor,
                                        left: `${startColorPos.x * 100}%`,
                                        top: `${startColorPos.y * 100}%`,
                                    }}
                                ></span>


                                <span
                                    className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{
                                        backgroundColor: endColor,
                                        left: `${endColorPos.x * 100}%`,
                                        top: `${endColorPos.y * 100}%`,
                                    }}
                                ></span>
                            </>
                        ) : (
                            <span
                                className="absolute w-6 h-6 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    backgroundColor: singleColor,
                                    left: `${singleColorPos.x * 100}%`,
                                    top: `${singleColorPos.y * 100}%`,
                                }}
                            ></span>
                        )}
                    </div>
                </div>

                {colorMode === 'gradient' ? (
                    <div className="grid grid-cols-2 gap-3 mb-3">


                        <div>
                            <p className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Başlangıç(Seçiciden mouse ile seçin) : </p>
                            <div className="flex gap-2 items-center">
                                <div
                                    className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600"
                                    style={{backgroundColor: startColor}}
                                ></div>
                                <Input
                                    type="text"
                                    value={startColorHex}
                                    onChange={handleStartColorChange}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Bitiş
                                Rengi:[Alt(Opt) + mouse ile seçin]</p>
                            <div className="flex gap-2 items-center">
                                <div
                                    className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600"
                                    style={{backgroundColor: endColor}}
                                ></div>
                                <Input
                                    type="text"
                                    value={endColorHex}
                                    onChange={handleEndColorChange}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-3">
                        <p className="text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Renk</p>
                        <div className="flex gap-2 items-center">
                            <div
                                className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600"
                                style={{backgroundColor: singleColor}}
                            ></div>
                            <Input
                                type="text"
                                value={singleColorHex}
                                onChange={handleSingleColorChange}
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>
                )}

                <div
                    className="h-12 rounded-lg mb-4 overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div
                        className="h-full w-full"
                        style={{
                            background: colorMode === 'gradient'
                                ? `linear-gradient(to right, ${startColor}, ${endColor})`
                                : singleColor
                        }}
                    ></div>
                </div>



                <DialogFooter
                    className="flex justify-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="gap-1.5 h-8 text-xs"
                        size="sm"
                    >
                        <RefreshCw className="w-3 h-3"/>
                        Varsayılana Dön
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="gap-1.5 h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                        size="sm"
                    >
                        <Check className="w-3 h-3"/>
                        Kaydet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ColorPickerDialog;