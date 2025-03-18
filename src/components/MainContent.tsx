import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface Header {
  key: string;
  name: string;
}
interface Item {
  profile_picture: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: Date;
}
export default function MainContent() {
  const navigate = useNavigate();
  const [headers, setHeader] = useState<Header[]>([]);
  const [items, setItem] = useState<Item[]>([]);
  const [searchWord, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
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
      console.log(users);
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
  const onSearchSubmit = () => {
    console.log('search');
  };
  return (
    <div className="max-w-[1280px] mx-auto px-2">
      <div className="flex items-center justify-between mt-5 w-full">
        <div>User List</div>
        <div className="flex items-center gap-1 basis-2/3">
          <label className="input w-full">
            <input
              type="search"
              className="grow"
              placeholder="Search"
              value={searchWord}
              onChange={onSearch}
              onKeyDown={onEnter}
            />
            <kbd className="kbd kbd-sm">Enter</kbd>
          </label>
          <svg
            className="h-[1.5rem] cursor-pointer invisible md:visible"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            onClick={onSearchSubmit}
          >
            <g fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
        </div>
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
        <table className="table table-pin-rows bg-base-200">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header.name}</th>
              ))}
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan={headers.length} className="text-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="skeleton h-[50px] w-full mt-2"></div>
                  ))}
                </td>
              </tr>
            </tbody>
          )}

          {!loading && items.length <= 0 && (
            <tbody>
              <tr>
                <td colSpan={headers.length} className="text-center">
                  No data found
                </td>
              </tr>
            </tbody>
          )}
          {!loading && items.length > 0 && (
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="avatar avatar-placeholder">
                      <div className="bg-blue-600 text-neutral-content w-10 rounded-full">
                        <span className="text-white">D</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>{item.first_name}</span>
                  </td>
                  <td>
                    <span>{item.last_name}</span>
                  </td>
                  <td>
                    <span>{item.gender}</span>
                  </td>
                  <td>
                    <span>{item.birthday.toLocaleDateString()}</span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn btn-warning text-white">Edit</button>
                      <button className="btn btn-error text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
