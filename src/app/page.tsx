'use client';

import { useState, useEffect } from 'react';

const PRESETS = [
    { name: 'FROST', hex: '#88C0D0' },
    { name: 'SAKURA', hex: '#B48EAD' },
    { name: 'SAND', hex: '#EBCB8B' },
    { name: 'CRIMSON', hex: '#BF616A' },
    { name: 'SNOW', hex: '#ECEFF4' },
    { name: 'MINT', hex: '#A3BE8C' },
    { name: 'DUSK', hex: '#D08770' },
    { name: 'SLATE', hex: '#5E81AC' },
];

const FAN_SPEEDS = [0, 25, 50, 75, 100];

export default function CoreDashboard() {
    const [ledConfig, setLedConfig] = useState({ mode: 'static', color: '#88C0D0', brightness: 75 });
    const [fanSpeed, setFanSpeed] = useState(50);

    const [images, setImages] = useState({ banner: '', avatar: '' });
    const [userName, setUserName] = useState('USER');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Carrega os dados salvos no Local Storage assim que a página é montada
    useEffect(() => {
        const savedName = localStorage.getItem('core_userName');
        const savedAvatar = localStorage.getItem('core_avatar');
        const savedBanner = localStorage.getItem('core_banner');

        if (savedName) setUserName(savedName);
        if (savedAvatar || savedBanner) {
            setImages({
                avatar: savedAvatar || '',
                banner: savedBanner || ''
            });
        }
    }, []);

    const metrics = { cpuUsage: 22, cpuTemp: 42, gpuUsage: 64, gpuTemp: 58 };
    const currentRpm = Math.round((fanSpeed / 100) * 2500);

    const handleUpload = (type: 'banner' | 'avatar') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setImages(prev => ({ ...prev, [type]: event.target?.result as string }));
            reader.readAsDataURL(file);
        }
    };

    // Função que salva no Local Storage e fecha o menu
    const handleSaveSettings = () => {
        localStorage.setItem('core_userName', userName);
        localStorage.setItem('core_avatar', images.avatar);
        localStorage.setItem('core_banner', images.banner);
        setIsMenuOpen(false);
    };

    return (
        <main className="min-h-[100dvh] w-full flex flex-col relative selection:bg-base-text selection:text-base-bg overflow-x-hidden">

            {/* BANNER */}
            {images.banner && (
                <div className="absolute top-0 left-0 w-full h-72 sm:h-96 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-bg/60 to-base-bg z-10" />
                    <img src={images.banner} alt="Banner" className="w-full h-full object-cover opacity-60 grayscale-[10%]" />
                </div>
            )}

            {/* MODAL DE CONFIGURAÇÃO */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-sm p-4 pt-10 sm:pt-20">
                    <div className="tactical-panel w-full max-w-sm flex flex-col shadow-2xl shadow-black/50">

                        <div className="flex justify-between items-center border-b border-base-border p-4 bg-base-bg/50">
                            <span className="text-xs font-mono text-base-text tracking-widest uppercase">
                                Configurações
                            </span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="text-base-muted hover:text-base-text transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-6 bg-base-bg">

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-base-muted uppercase tracking-widest">Designação</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="USER"
                                    maxLength={15}
                                    className="w-full bg-base-panel border border-base-border text-base-text px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-base-muted transition-colors placeholder:text-base-muted/30"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-mono text-base-muted uppercase tracking-widest">Módulos Visuais</label>

                                <label className="flex items-center justify-between bg-base-panel border border-base-border p-3 cursor-pointer hover:border-base-muted transition-colors">
                                    <span className="text-xs font-mono text-base-text uppercase tracking-widest">Avatar</span>
                                    <span className="text-[10px] text-base-muted">UPLOAD</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload('avatar')} />
                                </label>

                                <label className="flex items-center justify-between bg-base-panel border border-base-border p-3 cursor-pointer hover:border-base-muted transition-colors">
                                    <span className="text-xs font-mono text-base-text uppercase tracking-widest">Banner</span>
                                    <span className="text-[10px] text-base-muted">UPLOAD</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload('banner')} />
                                </label>
                            </div>

                            <div className="flex flex-col gap-2 opacity-50 pointer-events-none mt-2">
                                <label className="text-[9px] font-mono text-base-muted uppercase tracking-widest flex justify-between">
                                    <span>Temas Corporativos</span>
                                    <span className="text-[8px]">(EM BREVE)</span>
                                </label>
                                <div className="h-12 border border-base-border border-dashed bg-base-panel/50 flex items-center justify-center">
                                    <span className="text-[9px] font-mono text-base-muted">MÓDULO BLOQUEADO</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-base-border bg-base-bg flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                className="bg-base-text text-base-bg px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-base-muted transition-colors"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTEÚDO PRINCIPAL */}
            <div className="relative z-10 w-full p-4 sm:p-8 max-w-[1600px] mx-auto flex flex-col gap-6">

                {/* HEADER */}
                <header className="flex pb-4 mt-2 sm:mt-8">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="flex items-center gap-4 group text-left"
                    >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-base-panel border border-base-border group-hover:border-base-muted flex items-center justify-center overflow-hidden transition-colors shrink-0 shadow-lg shadow-black/50">
                            {images.avatar ? (
                                <img src={images.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] font-mono text-base-muted">IMG</span>
                            )}
                        </div>

                        <div className="flex flex-col justify-center">
                            <h1 className="text-xl sm:text-2xl font-light tracking-[0.2em] text-base-text uppercase truncate max-w-[200px] sm:max-w-md group-hover:text-white transition-colors drop-shadow-md">
                                {userName || 'USER'}
                            </h1>
                        </div>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mt-2">

                    <section className="lg:col-span-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">

                            {/* CPU */}
                            <div className="tactical-panel p-4 sm:p-5 flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-base-muted tracking-widest uppercase">CPU</span>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-3xl sm:text-4xl font-light text-base-text">{metrics.cpuTemp}°</span>
                                    <span className="text-[10px] sm:text-xs font-mono text-base-muted mb-1">{metrics.cpuUsage}%</span>
                                </div>
                                <div className="flex gap-[2px] h-[2px] sm:h-[3px] w-full mt-2 sm:mt-3">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`flex-1 ${i < (metrics.cpuUsage / 10) ? 'bg-base-text' : 'bg-base-border'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* GPU */}
                            <div className="tactical-panel p-4 sm:p-5 flex flex-col gap-1">
                                <span className="text-[10px] font-mono text-base-muted tracking-widest uppercase">GPU</span>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-3xl sm:text-4xl font-light text-base-text">{metrics.gpuTemp}°</span>
                                    <span className="text-[10px] sm:text-xs font-mono text-base-muted mb-1">{metrics.gpuUsage}%</span>
                                </div>
                                <div className="flex gap-[2px] h-[2px] sm:h-[3px] w-full mt-2 sm:mt-3">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className={`flex-1 ${i < (metrics.gpuUsage / 10) ? 'bg-base-text' : 'bg-base-border'}`} />
                                    ))}
                                </div>
                            </div>

                            {/* FANS */}
                            <div className="tactical-panel p-4 sm:p-5 flex flex-col col-span-2 lg:col-span-1 gap-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-mono text-base-muted tracking-widest uppercase mb-1">Fans</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-2xl sm:text-3xl font-light transition-colors ${fanSpeed === 0 ? 'text-base-muted opacity-50' : 'text-base-text'}`}>
                                            {currentRpm}
                                        </span>
                                        <span className="text-[9px] font-mono text-base-muted">RPM</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {FAN_SPEEDS.map(speed => (
                                        <button
                                            key={speed}
                                            onClick={() => setFanSpeed(speed)}
                                            className={`flex-1 py-1.5 text-[9px] font-mono border transition-all ${fanSpeed === speed
                                                ? speed === 0
                                                    ? 'bg-base-border/50 text-base-muted border-base-border font-bold opacity-70'
                                                    : 'bg-base-text text-base-bg border-base-text font-bold'
                                                : speed === 0
                                                    ? 'bg-base-bg text-base-muted border-base-border hover:border-base-muted opacity-50 hover:opacity-100'
                                                    : 'bg-base-bg text-base-muted border-base-border hover:border-base-muted'
                                                }`}
                                        >
                                            {speed === 0 ? 'OFF' : `${speed}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="lg:col-span-8 flex flex-col">
                        <div className="tactical-panel p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8">

                            {/* MODOS DE ILUMINAÇÃO */}
                            <div className="flex flex-col gap-2 sm:gap-3">
                                <div className="flex gap-2">
                                    {['static', 'breathing', 'rainbow', 'off'].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setLedConfig({ ...ledConfig, mode })}
                                            className={`flex-1 h-10 text-[9px] sm:text-[10px] uppercase tracking-widest font-mono border transition-all ${ledConfig.mode === mode
                                                ? mode === 'off'
                                                    ? 'bg-base-border/50 text-base-muted border-base-border font-bold opacity-70'
                                                    : 'bg-base-text text-base-bg border-base-text font-bold'
                                                : mode === 'off'
                                                    ? 'bg-transparent text-base-muted border-base-border hover:border-base-muted opacity-50 hover:opacity-100'
                                                    : 'bg-transparent text-base-muted border-base-border hover:border-base-muted'
                                                }`}
                                        >
                                            {mode === 'static' ? 'Estático' : mode === 'breathing' ? 'Pulso' : mode === 'rainbow' ? 'Arco-Íris' : 'OFF'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CORES */}
                            <div className={`flex flex-col gap-3 transition-opacity ${(ledConfig.mode === 'rainbow' || ledConfig.mode === 'off') ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                                    {PRESETS.map((p, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setLedConfig({ ...ledConfig, color: p.hex })}
                                            className="h-10 sm:h-12 w-full flex items-center justify-center border transition-all"
                                            style={{
                                                backgroundColor: `${p.hex}20`,
                                                borderColor: ledConfig.color === p.hex ? p.hex : 'transparent',
                                            }}
                                        >
                                            <span className="w-3 sm:w-4 h-1" style={{ backgroundColor: p.hex }} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* INTENSIDADE E SELETOR DE CORES NATIVO SIMPLIFICADO */}
                            <div className={`flex flex-col gap-6 sm:gap-8 mt-2 transition-opacity ${ledConfig.mode === 'off' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>

                                <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                                    <div className="flex justify-between text-[9px] sm:text-[10px] font-mono tracking-widest text-base-muted uppercase">
                                        <span>Intensidade</span>
                                        <span className="text-base-text">{ledConfig.mode === 'off' ? '0' : ledConfig.brightness}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={ledConfig.mode === 'off' ? 0 : ledConfig.brightness}
                                        onChange={(e) => setLedConfig({ ...ledConfig, brightness: Number(e.target.value) })}
                                        className="w-full h-1 bg-base-border appearance-none cursor-pointer focus:outline-none"
                                        style={{ accentColor: (ledConfig.mode === 'rainbow' || ledConfig.mode === 'off') ? '#ffffff' : ledConfig.color }}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-base-muted tracking-widest uppercase">Cor Customizada</span>
                                    <div className="w-12 h-10 border border-base-border bg-base-panel focus-within:border-base-muted transition-colors relative overflow-hidden">
                                        <input
                                            type="color"
                                            value={ledConfig.color}
                                            onChange={(e) => setLedConfig({ ...ledConfig, color: e.target.value })}
                                            className="absolute -inset-2 w-16 h-16 cursor-pointer"
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}