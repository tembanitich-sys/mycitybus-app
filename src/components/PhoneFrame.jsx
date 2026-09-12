// Persistent phone-frame preview for laptop demos. On real phone-width viewports the bezel
// disappears via the `sm:` breakpoint and the content fills the viewport naturally.

export default function PhoneFrame({ children }) {
  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1b4bb0_0%,_#0b1330_60%,_#050712_100%)] sm:p-8 p-0">
      <div
        className="relative w-full h-dvh bg-paper overflow-hidden
                   sm:w-[390px] sm:h-[844px] sm:rounded-[3rem] sm:border-[10px] sm:border-[#0c0d12]
                   sm:shadow-phone"
      >
        {/* Notch — desktop preview only */}
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 z-50 h-6 w-32 rounded-b-2xl bg-[#0c0d12] items-center justify-center">
          <div className="h-1.5 w-10 rounded-full bg-[#232634]" />
        </div>
        <div className="relative h-full w-full flex flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
