import React, { useState, useRef } from 'react';
import { User, Camera } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileSettingsProps {
  currentUser: UserType;
  onUpdateProfile: (userData: Partial<UserType>) => void;
}

export function ProfileSettings({ currentUser, onUpdateProfile }: ProfileSettingsProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUser.profilePhoto);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
        onUpdateProfile({ id: currentUser.id, profilePhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(undefined);
    onUpdateProfile({ id: currentUser.id, profilePhoto: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Changer la photo
            </button>
            {previewUrl && (
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