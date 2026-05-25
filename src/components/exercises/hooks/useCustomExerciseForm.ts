import { useEffect, useRef, useState } from 'react';
import { createUserExerciseAdvanced, getExerciseAttributes, titleCaseName, uploadUserExerciseImage } from '../../../services/api';
import type { CustomExercisePayload, CreatedExercise, ExerciseAttributes } from '../types';

export interface UseCustomExerciseFormOptions {
  onClose: () => void;
  onCreated: (item: CreatedExercise) => void;
}

export function useCustomExerciseForm({ onClose, onCreated }: UseCustomExerciseFormOptions) {
  const [loading, setLoading] = useState(true);
  const [attrs, setAttrs] = useState<ExerciseAttributes>({ equipments: [], target_muscles: [] });
  const [name, setName] = useState('');
  const [equipment, setEquipment] = useState('');
  const [primary, setPrimary] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getExerciseAttributes();
        if (!cancelled) {
          setAttrs(data as ExerciseAttributes);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : 'Failed to fetch attributes');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleImageSelect(file: File | null) {
    if (!file) {
      setImageFile(null);
      setImageUrl('');
      return;
    }

    setImageFile(file);
    setImageUploading(true);
    setError(null);

    try {
      const uploadResult = await uploadUserExerciseImage(file);
      setImageUrl(uploadResult.public_url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image');
      setImageFile(null);
      setImageUrl('');
    } finally {
      setImageUploading(false);
    }
  }

  async function save() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please provide a name');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: CustomExercisePayload = {
        name: titleCaseName(trimmedName)
      };

      if (equipment) {
        payload.equipment = equipment;
      }

      if (primary) {
        payload.target_muscles = [primary];
      }

      if (imageUrl) {
        payload.image_url = imageUrl;
      }

      const createdExercise = await createUserExerciseAdvanced(payload);
      onCreated(createdExercise as CreatedExercise);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImageUrl('');
  }

  return {
    loading,
    attrs,
    name,
    setName,
    equipment,
    setEquipment,
    primary,
    setPrimary,
    saving,
    error,
    imageFile,
    imageUploading,
    imageUrl,
    fileInputRef,
    handleImageSelect,
    save,
    clearImage
  };
}
