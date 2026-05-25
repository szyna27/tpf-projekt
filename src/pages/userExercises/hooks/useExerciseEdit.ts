import { useEffect, useRef, useState } from 'react';
import { deleteUserExercise, updateUserExercise, uploadUserExerciseImage } from '../../../services/api';
import type { UserExercise } from '../types';

export interface UseExerciseEditOptions {
  exercise: UserExercise;
  onUpdated: (exercise: UserExercise) => void;
  onDeleted: () => void;
}

export function useExerciseEdit({ exercise, onUpdated, onDeleted }: UseExerciseEditOptions) {
  const [name, setName] = useState(exercise.name);
  const [equipment, setEquipment] = useState(exercise.equipment ?? exercise.metadata?.equipments?.[0] ?? '');
  const [primary, setPrimary] = useState(exercise.target_muscles?.[0] ?? exercise.metadata?.targetMuscles?.[0] ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(exercise.image_url || exercise.metadata?.image_url || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setName(exercise.name);
    setEquipment(exercise.equipment ?? exercise.metadata?.equipments?.[0] ?? '');
    setPrimary(exercise.target_muscles?.[0] ?? exercise.metadata?.targetMuscles?.[0] ?? '');
    setImageUrl(exercise.image_url || exercise.metadata?.image_url || '');
    setImageFile(null);
    setSaving(false);
    setImageUploading(false);
    setError(null);
  }, [exercise]);

  async function handleImageSelect(file: File | null) {
    if (!file) {
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setImageUploading(true);
    setError(null);

    try {
      const uploadResult = await uploadUserExerciseImage(file);
      setImageUrl(uploadResult.public_url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload');
      setImageFile(null);
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
      const payload: {
        name: string;
        equipment: string | null;
        target_muscles: string[];
        image_url: string | null;
      } = {
        name: trimmedName,
        equipment: equipment || null,
        target_muscles: primary ? [primary] : [],
        image_url: imageUrl || null
      };

      const updatedExercise = await updateUserExercise(exercise.id, payload);
      onUpdated(updatedExercise as UserExercise);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm('Delete exercise?')) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteUserExercise(exercise.id);
      onDeleted();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete');
    } finally {
      setSaving(false);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImageUrl('');
  }

  return {
    name,
    setName,
    equipment,
    setEquipment,
    primary,
    setPrimary,
    saving,
    error,
    imageUploading,
    imageUrl,
    imageFile,
    fileInputRef,
    handleImageSelect,
    save,
    remove,
    clearImage
  };
}
