"use client"

import React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"

interface AnimatedCharactersProps {
  mounted: boolean
}

export function AnimatedCharacters({ mounted }: AnimatedCharactersProps) {
  const [showPeter, setShowPeter] = useState(false)
  const [showStewie, setShowStewie] = useState(false)
  const [showPeterBubble, setShowPeterBubble] = useState(false)
  const [showStewieBubble, setShowStewieBubble] = useState(false)

  useEffect(() => {
    if (!mounted) return

    // Staggered animation sequence
    const peterTimer = setTimeout(() => setShowPeter(true), 500)
    const peterBubbleTimer = setTimeout(() => setShowPeterBubble(true), 1000)
    const stewieTimer = setTimeout(() => setShowStewie(true), 1500)
    const stewieBubbleTimer = setTimeout(() => setShowStewieBubble(true), 2000)

    return () => {
      clearTimeout(peterTimer)
      clearTimeout(peterBubbleTimer)
      clearTimeout(stewieTimer)
      clearTimeout(stewieBubbleTimer)
    }
  }, [mounted])

  return (
    <>
      {/* Peter - Center Left - Flush to edge */}
      <div 
        className={`fixed -left-2 bottom-[15%] md:bottom-[20%] z-50 transition-transform duration-700 ease-out ${
          showPeter ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative">
          {/* Speech Bubble - positioned above and to the right */}
          <div 
            className={`absolute -top-32 left-24 md:left-36 lg:left-44 transition-all duration-500 z-10 ${
              showPeterBubble ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <SpeechBubble direction="left">
              <span className="text-xs md:text-sm font-medium text-brainrot-brown">
                Oh hey! Someone&apos;s here to make brainrot for their already brainrotted brain! 
                <span className="text-brainrot-coral"> Hehehehe</span>
              </span>
            </SpeechBubble>
          </div>
          
          {/* Peter Image - Larger */}
          <Image
            src="/images/gemini-generated-image-7cg9pr7cg9pr7cg9.png"
            alt="Peter Griffin peeking"
            width={400}
            height={500}
            className="w-44 md:w-56 lg:w-72 h-auto drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Stewie - Right Side - Flush to edge */}
      <div 
        className={`fixed -right-2 bottom-0 z-50 transition-transform duration-700 ease-out ${
          showStewie ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative">
          {/* Speech Bubble - positioned clearly above and to the left */}
          <div 
            className={`absolute -top-36 -left-44 md:-left-40 transition-all duration-500 z-20 ${
              showStewieBubble ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <SpeechBubble direction="right">
              <span className="text-xs md:text-sm font-medium text-brainrot-brown">
                Respect, <span className="text-brainrot-coral">fatman</span>. They are our 
                <span className="text-brainrot-orange"> valued customer</span>. 
                Now generate that <span className="italic">exquisite</span> brainrot.
              </span>
            </SpeechBubble>
          </div>
          
          {/* Stewie Image */}
          <Image
            src="/images/stewie.png"
            alt="Stewie Griffin"
            width={240}
            height={320}
            className="w-32 md:w-40 lg:w-48 h-auto drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </>
  )
}

function SpeechBubble({ children, direction }: { children: React.ReactNode; direction: "left" | "right" }) {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl px-3 py-2 max-w-[180px] md:max-w-[220px] shadow-xl border-2 border-brainrot-coral/20">
        {children}
      </div>
      {/* Bubble tail */}
      <div 
        className={`absolute -bottom-2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white ${
          direction === "left" ? "left-6" : "right-6"
        }`}
      />
    </div>
  )
}
