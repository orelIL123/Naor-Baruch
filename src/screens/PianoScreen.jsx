import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'

export default function PianoScreen() {
    const navigate = useNavigate()
    const audioContextRef = useRef(null)
    const [activeKey, setActiveKey] = useState(null)

    // Initialize AudioContext
    useEffect(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        audioContextRef.current = new AudioContext()
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    const playNote = (frequency) => {
        if (!audioContextRef.current) return

        const osc = audioContextRef.current.createOscillator()
        const gainNode = audioContextRef.current.createGain()

        osc.type = 'triangle' // Softer sound than sine, more like an organ/piano
        osc.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)

        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1.5)

        osc.connect(gainNode)
        gainNode.connect(audioContextRef.current.destination)

        osc.start()
        osc.stop(audioContextRef.current.currentTime + 1.5)
    }

    const handleKeyPress = (note, frequency) => {
        setActiveKey(note)
        playNote(frequency)
        setTimeout(() => setActiveKey(null), 200)
    }

    const keys = [
        { note: 'C', freq: 261.63, type: 'white' },
        { note: 'C#', freq: 277.18, type: 'black' },
        { note: 'D', freq: 293.66, type: 'white' },
        { note: 'D#', freq: 311.13, type: 'black' },
        { note: 'E', freq: 329.63, type: 'white' },
        { note: 'F', freq: 349.23, type: 'white' },
        { note: 'F#', freq: 369.99, type: 'black' },
        { note: 'G', freq: 392.00, type: 'white' },
        { note: 'G#', freq: 415.30, type: 'black' },
        { note: 'A', freq: 440.00, type: 'white' },
        { note: 'A#', freq: 466.16, type: 'black' },
        { note: 'B', freq: 493.88, type: 'white' },
        { note: 'C2', freq: 523.25, type: 'white' },
    ]

    return (
        <div className="piano-screen" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(to bottom, #1a1a1a, #2d2d2d)',
            color: 'white'
        }}>
            <header className="nb-header" style={{ position: 'relative', background: 'transparent' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    <IoArrowBack size={24} />
                </button>
                <div className="nb-header__content" dir="rtl" style={{ textAlign: 'center', width: '100%' }}>
                    <h1 className="nb-title" style={{ fontSize: '1.5rem', margin: 0 }}>הפסנתר של הרב</h1>
                    <p className="nb-subtitle" style={{ opacity: 0.8 }}>ניגונים מיוחדים</p>
                </div>
            </header>

            <div className="piano-container" style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                overflowX: 'auto'
            }}>
                <div className="piano-keys" style={{
                    display: 'flex',
                    position: 'relative',
                    height: 300,
                    background: '#1a1a1a',
                    padding: '10px 10px 0',
                    borderRadius: 8,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {keys.map((key, idx) => {
                        const isBlack = key.type === 'black'
                        const isActive = activeKey === key.note

                        if (isBlack) return null // Render black keys separately to handle z-index/positioning easily in this simple flex layout? 
                        // Actually, standard piano layout usually mixes them. Let's do a simple absolute positioning for black keys or use a specific flex structure.
                        // For simplicity and robustness, let's just map them and use negative margins for black keys or a grid.
                        // Let's try a simpler approach: Render all white keys, and place black keys absolutely on top of them.
                        return (
                            <button
                                key={key.note}
                                className={`key white-key ${isActive ? 'active' : ''}`}
                                onMouseDown={() => handleKeyPress(key.note, key.freq)}
                                onTouchStart={(e) => { e.preventDefault(); handleKeyPress(key.note, key.freq) }}
                                style={{
                                    width: 60,
                                    height: '100%',
                                    background: isActive ? '#eee' : 'white',
                                    border: '1px solid #ccc',
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                    margin: '0 2px',
                                    position: 'relative',
                                    zIndex: 1,
                                    transform: isActive ? 'scale(0.98)' : 'none',
                                    transformOrigin: 'top',
                                    transition: 'all 0.1s',
                                    cursor: 'pointer'
                                }}
                            />
                        )
                    })}

                    {/* Render Black Keys */}
                    <div style={{ position: 'absolute', top: 10, left: 10, right: 10, height: 180, pointerEvents: 'none' }}>
                        {/* We need to manually position black keys based on the white keys layout. 
                 C (0), D (1), E (2), F (3), G (4), A (5), B (6)
                 C# is between C and D. D# between D and E.
                 F# between F and G. G# between G and A. A# between A and B.
             */}
                        {/* 
                White key width + margin = 64px approx.
                C# -> Left: 40px
                D# -> Left: 105px
                F# -> Left: 235px
                G# -> Left: 300px
                A# -> Left: 365px
             */}
                        {[
                            { note: 'C#', freq: 277.18, left: 45 },
                            { note: 'D#', freq: 311.13, left: 110 },
                            { note: 'F#', freq: 369.99, left: 240 },
                            { note: 'G#', freq: 415.30, left: 305 },
                            { note: 'A#', freq: 466.16, left: 370 },
                        ].map(k => (
                            <button
                                key={k.note}
                                className={`key black-key ${activeKey === k.note ? 'active' : ''}`}
                                onMouseDown={() => handleKeyPress(k.note, k.freq)}
                                onTouchStart={(e) => { e.preventDefault(); handleKeyPress(k.note, k.freq) }}
                                style={{
                                    position: 'absolute',
                                    left: k.left,
                                    width: 40,
                                    height: 180,
                                    background: activeKey === k.note ? '#333' : 'black',
                                    borderRadius: '0 0 4px 4px',
                                    zIndex: 2,
                                    pointerEvents: 'auto',
                                    border: 'none',
                                    boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ padding: 20, textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                לחץ על הקלידים כדי לנגן
            </div>
        </div>
    )
}
