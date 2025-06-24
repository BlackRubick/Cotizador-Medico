import React from 'react';
import ProfileForm from '../../molecules/ProfileForm';

const ProfileEditor = ({ profile, onSave, isAdmin = false }) => {
  const handleSave = (formData) => {
    onSave(formData);
  };

  return (
    <div className="max-w-md mx-auto">
      <ProfileForm
        profile={profile}
        onSubmit={handleSave}
        isEditable={isAdmin}
      />
    </div>
  );
};

export default ProfileEditor;
