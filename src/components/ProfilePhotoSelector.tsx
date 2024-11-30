import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { defaultAvatars } from '../utils/defaultAvatars';

interface ProfilePhotoSelectorProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
}

export function ProfilePhotoSelector({ currentPhoto, onPhotoChange }: ProfilePhotoSelectorProps) {
  const [showDefaultAvatars, setShowDefaultAvatars] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 2 MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onPhotoChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange('');
    setShowDefaultAvatars(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            title="Changer la photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Format accepté: JPG, PNG</p>
            <p>Taille maximale: 2 MB</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setShowDefaultAvatars(!showDefaultAvatars)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Choisir un avatar par défaut
            </button>
            {currentPhoto && (
              <button
                onClick={handleRemovePhoto}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {showDefaultAvatars && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Avatars par défaut
            </h3>
            <button
              onClick={() => setShowDefaultAvatars(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {defaultAvatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => {
                  onPhotoChange(avatar.url);
                  setShowDefaultAvatars(false);
                }}
                className={`relative rounded-full overflow-hidden aspect-square hover:ring-2 hover:ring-blue-500 transition-all ${
                  currentPhoto === avatar.url ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={avatar.url}
                  alt={avatar.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}