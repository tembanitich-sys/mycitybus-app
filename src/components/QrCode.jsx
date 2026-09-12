import { QRCodeSVG } from 'qrcode.react'

export default function QrCode({ value, size = 148 }) {
  return (
    <div className="inline-flex rounded-xl bg-white p-3 border border-gray-100">
      <QRCodeSVG value={value} size={size} fgColor="#15161D" bgColor="#ffffff" level="M" />
    </div>
  )
}
