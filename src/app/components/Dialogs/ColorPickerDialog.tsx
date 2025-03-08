import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, RefreshCw, BookmarkPlus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ColorPickerDialogProps {
    open: boolean;
    onClose: () => void;
    startColor: string;
    endColor: string;
    onStartColorChange: (color: string) => void;
    onEndColorChange: (color: string) => void;
    onReset: () => void;
}

interface SavedColorScheme {
    id: string;
    startColor: string;
    endColor: string;
    isSingle: boolean;
    singleColor?: string;
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

    const activeColor = useRef<'start' | 'end' | 'single'>('start');
    const [selectedScheme, setSelectedScheme] = useState<SavedColorScheme | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [colorMode, setColorMode] = useState<'gradient' | 'solid' | 'saved'>('gradient');
    const [singleColor, setSingleColor] = useState<string>(startColor);
    const pickerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef<boolean>(false);


    // Kaydedilen renk şemalarını saklamak için local storage hook'u
    const [savedColorSchemes, setSavedColorSchemes] = useLocalStorage<SavedColorScheme[]>('savedColorSchemes', []);

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

        // Reset the selected scheme when dialog opens
        if (open) {
            setSelectedScheme(null);
        }
    }, [startColor, endColor, open]);

    const handleReset = () => {
        // Yeni varsayılan renkler
        const defaultStartColor = "#2D9596"; // Turkuaz-yeşil
        const defaultEndColor = "#265073"; // Koyu mavi

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

    // Mevcut renk şemasını kaydet
    const handleSaveColorScheme = () => {
        const newColorScheme: SavedColorScheme = {
            id: Math.random().toString(36).slice(2, 11),
            startColor: startColorHex,
            endColor: endColorHex,
            isSingle: colorMode === 'solid',
            singleColor: colorMode === 'solid' ? singleColorHex : undefined
        };

        setSavedColorSchemes([...savedColorSchemes, newColorScheme]);
        setSaveSuccess(true);

        // 2 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
            setSaveSuccess(false);
        }, 2000);
    };

    // Kaydedilen renk şemasını uygula
    const handleApplySavedColorScheme = (scheme: SavedColorScheme) => {
        if (scheme.isSingle) {
            const color = scheme.singleColor || scheme.startColor;
            setSingleColor(color);
            setSingleColorHex(color);
            onStartColorChange(color);
            onEndColorChange(color);
            setColorMode('solid');
        } else {
            setStartColorHex(scheme.startColor);
            setEndColorHex(scheme.endColor);
            onStartColorChange(scheme.startColor);
            onEndColorChange(scheme.endColor);
            setColorMode('gradient');
        }
    };

    // Kaydedilen renk şemasını sil
    const handleDeleteSavedColorScheme = (id: string) => {
        // Eğer silinen şema seçiliyse, seçimi kaldır
        if (selectedScheme && selectedScheme.id === id) {
            setSelectedScheme(null);
        }
        setSavedColorSchemes(savedColorSchemes.filter(scheme => scheme.id !== id));
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
            <DialogContent className="max-w-[550px] w-[90vw] p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
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
                    <button
                        onClick={() => setColorMode('saved')}
                        className={cn(
                            "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all",
                            colorMode === 'saved'
                                ? "bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                    >
                        Kaydedilenler
                    </button>
                </div>

                {colorMode !== 'saved' && (
                    <>
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
                            <>
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

                                {/* Mevcut ayarı kaydet butonu */}
                                <div className="mb-3 mt-4">
                                    <Button
                                        onClick={handleSaveColorScheme}
                                        className={cn(
                                            "w-full h-9 text-sm gap-1 text-white transition-colors",
                                            saveSuccess
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-indigo-500 hover:bg-indigo-600"
                                        )}
                                        size="sm"
                                    >
                                        {saveSuccess ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Kaydedildi
                                            </>
                                        ) : (
                                            <>
                                                <BookmarkPlus className="w-4 h-4" />
                                                Tercihi Kaydet
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
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

                                {/* Mevcut ayarı kaydet butonu */}
                                <div className="mb-3 mt-4">
                                    <Button
                                        onClick={handleSaveColorScheme}
                                        className={cn(
                                            "w-full h-9 text-sm gap-1 text-white transition-colors",
                                            saveSuccess
                                                ? "bg-green-500 hover:bg-green-600"
                                                : "bg-indigo-500 hover:bg-indigo-600"
                                        )}
                                        size="sm"
                                    >
                                        {saveSuccess ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Kaydedildi
                                            </>
                                        ) : (
                                            <>
                                                <BookmarkPlus className="w-4 h-4" />
                                                Tercihi Kaydet
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
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
                    </>
                )}

                {colorMode === 'saved' && (
                    <>
                        <div className="mb-4 max-h-80 overflow-y-auto px-1">
                            {savedColorSchemes.length === 0 ? (
                                <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
                                    Henüz kaydedilmiş renk şeması bulunmamaktadır.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {savedColorSchemes.map((scheme) => (
                                        <div
                                            key={scheme.id}
                                            className={cn(
                                                "border border-gray-200 dark:border-gray-700 rounded-lg mx-1 my-0.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer overflow-hidden",
                                                selectedScheme?.id === scheme.id ? "ring-1 ring-inset ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : ""
                                            )}
                                            onClick={() => setSelectedScheme(scheme)}
                                        >
                                            <div className="flex flex-col px-2 pt-1.5 pb-1.5">

                                                <div className="flex justify-between items-center">
                                                    <div
                                                        className="h-10 flex-grow rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                                                        style={{
                                                            background: scheme.isSingle
                                                                ? scheme.singleColor || scheme.startColor
                                                                : `linear-gradient(to right, ${scheme.startColor}, ${scheme.endColor})`
                                                        }}
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSavedColorScheme(scheme.id);
                                                        }}
                                                        className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {savedColorSchemes.length > 0 && (
                            <Button
                                onClick={() => selectedScheme && handleApplySavedColorScheme(selectedScheme)}
                                disabled={!selectedScheme}
                                className="w-[96%] mx-auto h-10 mb-4 text-sm bg-indigo-500 hover:bg-indigo-600 text-white disabled:bg-indigo-300 dark:disabled:bg-indigo-800"
                            >
                                Seçili Temayı Uygula
                            </Button>
                        )}
                    </>
                )}

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