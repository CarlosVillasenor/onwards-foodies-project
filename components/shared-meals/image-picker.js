'use client';

import classes from './image-picker.module.css';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function ImagePicker({ label, name }) {
  const imageInputRef = useRef();
  const [pickedImage, setPickedImage] = useState(null);

  function handlePickImage() {
    imageInputRef.current.click();
  }

  function handleImageChange(event) {
    // Get the selected file from the file input
    const file = event.target.files[0];

    // If no file was selected, do nothing
    if (!file) {
      setPickedImage(null);
      return;
    }

    // Convert the file to a data URL for previewing
    const fileReader = new FileReader();

    // Read the file as a data URL (base64 encoded)
    fileReader.readAsDataURL(file);

    // When the file is loaded, set the picked image state to the data URL
    fileReader.onload = function () {
      // Set the picked image as a data URL for previewing
      setPickedImage(fileReader.result);
    }
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && <Image src={pickedImage} alt="Picked Image" fill />}
        </div>
        <input
          ref={imageInputRef}
          className={classes.input}
          type='file'
          id={name}
          name={name}
          onChange={handleImageChange}
          accept='image/png, image/jpg'
          required
        />
        <button className={classes.button} type="button" onClick={handlePickImage}>
          Pick an Image
        </button>
      </div>
    </ div>
  );
}
