import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPhotos } from "../store/Slices/photosSlice"
import LightGallery from "lightgallery/react"

import "lightgallery/css/lightgallery.css"
import "lightgallery/css/lg-zoom.css"
import "lightgallery/css/lg-thumbnail.css"
import "lightgallery/css/lg-autoplay.css"
import "lightgallery/css/lg-fullscreen.css"
import "lightgallery/css/lg-share.css"
import "lightgallery/css/lg-rotate.css"

import lgThumbnail from "lightgallery/plugins/thumbnail"
import lgZoom from "lightgallery/plugins/zoom"
import lgAutoplay from "lightgallery/plugins/autoplay"
import lgFullscreen from "lightgallery/plugins/fullscreen"
import lgShare from "lightgallery/plugins/share"
import lgRotate from "lightgallery/plugins/rotate"
import lgVideo from "lightgallery/plugins/video"

const staticImages = Array.from({ length: 0 }, (_, i) => ({
  src: `/${i}.jpg`,
  thumb: `/${i}.jpg`,
  alt: `Static ${i}`,
  type: "image",
}))

export default function Gallery() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((s) => s.photos)

  useEffect(() => { dispatch(fetchPhotos()) }, [dispatch])

  const dynamicMedia = items.map((p) => ({
    src: p.url,
    thumb: p.url,
    type: "image",
    alt: p.title || "Photo",
  }))

  const allMedia = [...staticImages, ...dynamicMedia]

  if (status === "loading") return <div style={{ padding: 16 }}>Yüklənir…</div>
  if (status === "failed")  return <div style={{ padding: 16, color: "red" }}>Xəta: {error}</div>

  return (
    <div style={{ padding: 16 }}>
      <LightGallery
        speed={500}
        plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen, lgShare, lgRotate, lgVideo]}
        mode="lg-fade"
        closeOnTap={true}
      >
        {allMedia.map((item, idx) => (
          <a key={idx} href={item.src}>
            <img alt={item.alt} src={item.thumb || item.src} style={{ width: 200, height: 140, objectFit: "cover", margin: 6 }} />
          </a>
        ))}
      </LightGallery>
    </div>
  )
}
