'use client';

const WHATSAPP_NUMBER = '94777180599';
const WHATSAPP_MESSAGE = encodeURIComponent('Hello! I have a question about a booking at White Vintage Bungalow.');

export default function WhatsAppButton() {
  return (
    <div className="whatsapp-entrance fixed bottom-6 right-6 z-50 flex items-center gap-3 group opacity-0">
      {/* "Chat with us" label — fades + slides in on hover */}
      <div className="pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
        <div className="bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-100 whitespace-nowrap flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse" />
          Chat with us
        </div>
      </div>

      {/* Button */}
      <div className="relative flex-shrink-0">
        {/* Outer pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        {/* Inner glow ring */}
        <span className="absolute inset-[-3px] rounded-full bg-[#25D366] opacity-15 group-hover:opacity-30 transition-opacity duration-300" />

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:bg-[#1ebe57] hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)] active:scale-95 transition-all duration-200 ease-out"
        >
          <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.63 4.64 1.827 6.64L2.667 29.333l6.88-1.8A13.28 13.28 0 0 0 16.004 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.004 2.667zm0 24a11 11 0 0 1-5.6-1.533l-.4-.24-4.08 1.067 1.093-3.96-.267-.413A11.04 11.04 0 0 1 5 16c0-6.08 4.92-11 11.004-11C23.093 5 28 9.92 28 16s-4.907 11-11.996 11zm6.027-8.24c-.333-.167-1.96-.96-2.267-1.067-.306-.12-.52-.173-.747.173-.213.347-.84 1.067-1.027 1.28-.186.213-.373.24-.706.08-.333-.173-1.4-.52-2.667-1.64-.987-.88-1.653-1.96-1.853-2.293-.187-.333-.02-.507.14-.68.147-.147.333-.387.5-.573.167-.187.213-.32.32-.533.107-.213.053-.4-.027-.573-.08-.173-.747-1.8-1.027-2.467-.267-.64-.547-.547-.747-.56-.187-.013-.4-.013-.614-.013-.213 0-.56.08-.853.387-.293.307-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.467 4.827.76.333 1.36.533 1.827.68.76.24 1.453.207 2 .12.613-.093 1.88-.76 2.147-1.493.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.627-.373z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
