import { X } from "lucide-react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function ModalComponent({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 p-[50px] bg-[#fefefe] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button
        className="flex items-center text-2xl hover:text-purple-500"
        onClick={onClose}
      >
        <X size={48} className="mr-2" /> {title}
      </button>

      {/* Modal Content */}
      <div className="grow flex justify-center items-center">
        {children}
      </div>
    </div>
  )
}
