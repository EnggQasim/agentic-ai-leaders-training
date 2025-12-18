import React, { useState } from 'react';
import styles from './styles.module.css';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: '/img/gallery/training-3.jpeg',
    alt: 'Certificate Distribution Ceremony',
    caption: 'Participants receiving certificates of completion',
  },
  {
    src: '/img/gallery/training-4.jpeg',
    alt: 'Training Group Photo',
    caption: 'SIEHS AI Architects - Training participants group photo',
  },
  {
    src: '/img/gallery/training-2.jpeg',
    alt: 'Shield Presentation to DG',
    caption: 'Shield presentation to DG SIEHS',
  },
  {
    src: '/img/gallery/training-1.jpeg',
    alt: 'Training Session',
    caption: 'Gift presentation during the training',
  },
];

function ImageModal({
  image,
  onClose
}: {
  image: GalleryImage | null;
  onClose: () => void;
}) {
  if (!image) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <img src={image.src} alt={image.alt} className={styles.modalImage} />
        <p className={styles.modalCaption}>{image.caption}</p>
      </div>
    </div>
  );
}

export default function Gallery(): JSX.Element {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <section className={styles.gallery}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Training Highlights</h2>
        <p className={styles.sectionSubtitle}>
          Moments from the SIEHS Agentic AI Training Program
        </p>

        {/* YouTube Video */}
        <div className={styles.videoContainer}>
          <iframe
            className={styles.videoFrame}
            src="https://www.youtube.com/embed/gGIyTzOvNHM"
            title="SIEHS Agentic AI Training Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Image Gallery */}
        <div className={styles.imageGrid}>
          {galleryImages.map((image, idx) => (
            <div
              key={idx}
              className={styles.imageCard}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.imageOverlay}>
                <p className={styles.imageCaption}>{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </section>
  );
}
