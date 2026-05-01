import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

interface Props {
  animationData: object
  loop?: boolean
  className?: string
}

export default function LottieAnimation({ animationData, loop = false, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const anim = lottie.loadAnimation({
      container: ref.current,
      renderer: 'svg',
      loop,
      autoplay: true,
      animationData: animationData as unknown as object,
    })
    return () => anim.destroy()
  }, [animationData, loop])

  return <div ref={ref} className={className} />
}
