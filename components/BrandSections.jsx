'use client'

import { useState } from 'react'
import Link from 'next/link'

function Accordion({ title, body, readMoreHref, readMoreLabel, isRTL }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="border-t border-[#D1CCC6]" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 hover:text-[#A67B5B] transition-colors"
            >
                <span
                    className="text-xl md:text-2xl font-light text-black"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                >{title}</span>
                <span className="text-xl leading-none text-[#A67B5B] ml-4">{open ? '−' : '+'}</span>
            </button>
            {open && (
                <div className="pb-6">
                    <p
                        className="text-sm md:text-base text-black leading-relaxed whitespace-pre-line mb-6"
                        style={{ fontFamily: 'var(--font-inter)' }}
                    >{body}</p>
                    {readMoreHref && (
                        <Link href={readMoreHref} className="inline-block border border-black text-black px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors">
                            {readMoreLabel}
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

export default function BrandSections({ locale, b, isRTL }) {
    return (
        <section className="py-10 px-6 lg:px-12 bg-white">
            <div className="max-w-[900px] mx-auto">
                <Accordion
                    title={b.storyTitle}
                    body={b.storyBody}
                    readMoreHref={`/${locale}/about`}
                    readMoreLabel={b.readMore}
                    isRTL={isRTL}
                />
                {b.values.map((v) => (
                    <Accordion
                        key={v.title}
                        title={v.title}
                        body={v.desc}
                        isRTL={isRTL}
                    />
                ))}
                <div className="border-t border-[#D1CCC6]" />
            </div>
        </section>
    )
}
