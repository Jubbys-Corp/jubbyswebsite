import { useMemo } from 'react'

/* Everything the home page shows is fetched once behind the opening curtain.
   Images go into the browser's cache; the clips are kept as in-memory blobs,
   so a <video> that mounts later plays from RAM instead of the network (iOS
   in particular will not reuse a fetched file for its range requests). */
const blobs = new Map()

export const mediaSrc = (url) => blobs.get(url) ?? url

/* A <video> must keep whatever src it mounted with: if the blob lands later
   and the src flips underneath a playing element, it reloads - and on iOS a
   reloaded video shows nothing until it is asked to play again. */
export const useStableSrc = (url) => useMemo(() => mediaSrc(url), [url])

export const preloadImage = (url) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = url
  })

export const preloadVideo = async (url) => {
  try {
    const res = await fetch(url)
    if (!res.ok) return
    blobs.set(url, URL.createObjectURL(await res.blob()))
  } catch {
    /* offline or blocked: the clip just streams from the network later */
  }
}

/* Second tier: a few at a time so they never crowd out what the reader is
   looking at. Videos first (the opening cycles through them soon), then
   the pictures further down the page. */
export const preloadQueue = (videos, images, concurrency = 3) => {
  const jobs = [...videos.map((u) => () => preloadVideo(u)), ...images.map((u) => () => preloadImage(u))]
  const next = () => {
    const job = jobs.shift()
    if (job) job().then(next, next)
  }
  for (let i = 0; i < concurrency; i++) next()
}
