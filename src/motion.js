import { useMotionValue, useSpring, useTransform } from 'motion/react'

/* Shared motion vocabulary. Variants keep the choreography in one place so
   the hero, the cards and the feature grid all move with the same character. */

// a block that rises into place
export const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } },
}

// a container that lets its children in one after another
export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

// a lockup that pops in with a little overshoot
export const pop = {
  hidden: { opacity: 0, scale: 0.74, rotate: -5 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 170, damping: 14 } },
}

// once-only entrance when a block scrolls into view
export const inView = { once: true, amount: 0.2, margin: '0px 0px -6% 0px' }

/* Pointer tilt for a card: the card leans towards the cursor, springs back
   when it leaves. Returns motion values and the handlers to wire up. */
export function useTilt(max = 7) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 22 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 22 })

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return
    const r = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - r.left) / r.width)
    py.set((event.clientY - r.top) / r.height)
  }
  const onPointerLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return { style: { rotateX, rotateY, transformPerspective: 900 }, onPointerMove, onPointerLeave }
}
