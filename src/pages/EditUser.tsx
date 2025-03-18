import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface UserFormData {
  profile_picture: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: Date | null;
}

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const userData = location.state?.userData;

  const [formData, setFormData] = useState<UserFormData>({
    profile_picture: '',
    first_name: '',
    last_name: '',
    gender: '',
    birthday: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        profile_picture: userData.image || '',
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        gender: userData.gender || '',
        birthday: userData.birthDate ? new Date(userData.birthDate) : null,
      });

      if (userData.image) {
        setPreviewImage(userData.image);
      }
    } else {
      setError('No user data provided');
    }
  }, [id, userData]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      birthday: value ? new Date(value) : null,
    });
  };

  const onProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({
          ...formData,
          profile_picture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDeletePicture = () => {
    setPreviewImage(null);
    setFormData({
      ...formData,
      profile_picture: '',
    });
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Format the data for API submission
      const userData = {
        image: formData.profile_picture,
        firstName: formData.first_name,
        lastName: formData.last_name,
        gender: formData.gender,
        birthDate: formData.birthday ? formData.birthday.toISOString().split('T')[0] : null,
      };

      // Make API call to update user
      const response = await fetch(`${import.meta.env.APP_BACKEND_URL}api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      // Handle successful response
      const result = await response.json();
      console.log('User updated:', result);

      // Navigate back to the user list page
      navigate('/');
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-2 py-5">
      <h2 className="text-xl mb-4">Edit User</h2>
      {error && (
        <div className="alert alert-error mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="avatar avatar-placeholder mb-4">
              <div className="bg-base-200 text-neutral-content w-40 h-40 rounded-full">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-gray-500 text-4xl">+</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="btn btn-info text-white">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onProfilePictureUpload}
                  ref={fileInputRef}
                />
              </label>
              <button
                type="button"
                className="btn btn-error text-white"
                onClick={onDeletePicture}
                disabled={!previewImage}
              >
                Delete Picture
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="first_name"
                placeholder="Please enter First name"
                className="input input-bordered w-full"
                value={formData.first_name}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="last_name"
                placeholder="Please enter Last name"
                className="input input-bordered w-full"
                value={formData.last_name}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <select
                name="gender"
                className="select select-bordered w-full"
                value={formData.gender}
                onChange={onInputChange}
                required
              >
                <option value="" disabled>
                  -- Please select Gender --
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Birthday</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="birthday"
                  className="input input-bordered w-full pr-10"
                  placeholder="DD/MM/YYYY"
                  value={formData.birthday ? formData.birthday.toISOString().split('T')[0] : ''}
                  onChange={onDateChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-neutral uppercase"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success text-white uppercase"
            disabled={isLoading}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
