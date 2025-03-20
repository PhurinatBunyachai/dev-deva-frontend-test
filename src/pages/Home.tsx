import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '@/components/SearchInput';
import UserTable from '@/components/UserTable';
import type { Header, Item } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const [headers, setHeader] = useState<Header[]>([]);
  const [items, setItem] = useState<Item[]>([]);
  const [searchWord, setSearch] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const defaultHeaders = [
      { key: 'profile_picture', name: 'Profile Picture' },
      { key: 'first_name', name: 'First Name' },
      { key: 'last_name', name: 'Last Name' },
      { key: 'gender', name: 'Gender' },
      { key: 'birthday', name: 'Birthday' },
      { key: 'action', name: 'Action' },
    ];

    setHeader(defaultHeaders);
    const onInitData = async () => {
      setLoading(true);
      await onGetUsers();
      setLoading(false);
    };
    onInitData();
  }, []);

  const onGetUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.APP_BACKEND_URL}api/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { users } = await response.json();
      setItem(users);
    } catch (error) {
      console.log(error);
      // setError(error);
    } finally {
      // setLoading(false);
    }
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setSearch(value);
  };
  const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };
  const onSearchSubmit = async () => {
    if (!searchWord) {
      await onGetUsers();
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.APP_BACKEND_URL}api/users/${searchWord}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { users } = await response.json();
      setItem(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteUser = async ({ id }: { id: number }) => {
    if (!id) {
      return;
    }
    if (!confirm('Are you sure?')) {
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.APP_BACKEND_URL}api/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      await onGetUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const onEditUser = (item: Item) => {
    if (!item.id) {
      return;
    }

    // Navigate to the edit user page with the user data in state
    navigate(`/edit-user/${item.id}`, {
      state: {
        userData: {
          id: item.id,
          image: item.image,
          firstName: item.firstName,
          lastName: item.lastName,
          gender: item.gender,
          birthDate: item.birthDate,
        },
      },
    });
  };
  return (
    <div className="max-w-[1280px] mx-auto px-2">
      <div className="flex items-center justify-between mt-5 w-full">
        <div>User List</div>
        <SearchInput
          searchWord={searchWord}
          onSearch={onSearch}
          onEnter={onEnter}
          onSearchSubmit={onSearchSubmit}
        />
        <div>
          <button
            className="btn btn-active btn-info text-white"
            onClick={() => navigate('/add-user')}
          >
            Add +
          </button>
        </div>
      </div>
      <div className="rounded-box border border-base-content/5 bg-base-100 overflow-x-auto mt-5 px-2">
        <UserTable
          headers={headers}
          items={items}
          isLoading={isLoading}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
        />
      </div>
    </div>
  );
}
