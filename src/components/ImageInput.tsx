import React, { useState } from 'react';
import styles from './ImageInput.module.scss';

interface ImageInputProps {
  initialImage?: string;
  onImageChange: (imageUrl: string) => void;
  onError: (error: string) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  initialImage = '',
  onImageChange,
  onError
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onImageChange(value);
    setImagePreview(value);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageChange(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    } catch {
      onError('Failed to process image');
    }
  };

  return (
    <div className={styles.formGroup}>
      <label>Image</label>
      <div className={styles.imageInputs}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className={styles.fileInput}
        />
        <div className={styles.urlInput}>
          <label>or paste image URL:</label>
          <input
            type="url"
            value={initialImage}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
      {imagePreview && (
        <div className={styles.imagePreview}>
          <img src={imagePreview} alt="Preview" />
        </div>
      )}
    </div>
  );
}; 