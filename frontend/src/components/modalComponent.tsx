import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  variant?: "box" | "side"
}

type modalStyleType = {
  initial: {}
  animate: {}
  classStyle: string
  containerStyle: string
}

export default function ModalComponent({ isOpen, onClose, title, children, variant = "box" }: ModalProps) {
  const sideStyle: modalStyleType = {
    initial: {
      opacity: 0,
      translateX: "40%"
    },
    animate: {
      opacity: 1,
      translateX: 0
    },
    classStyle: "max-w-[618px] h-full w-full p-10",
    containerStyle: "flex flex-col items-end"
  }
  const boxStyle: modalStyleType = {
    initial: {
      opacity: 0,
      scale: 0.5
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    classStyle: "max-w-[605px] w-full p-6 rounded-lg",
    containerStyle: "flex justify-center items-center"
  }
  const style = variant === "box" ? boxStyle : sideStyle

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 z-50 bg-black/30 ${style.containerStyle}`}
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence>
        <motion.div
          initial={style.initial}
          animate={style.animate}
          exit={style.initial}
          transition={{ duration: 0.3 }}
          className={`bg-white ${style.classStyle}`}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl">{title}</div>
            <button
              className="flex items-center text-2xl hover:text-purple-500"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
