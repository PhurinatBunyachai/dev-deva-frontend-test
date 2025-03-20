import type { Header, Item } from '@/types';

interface UserTableProps {
  headers: Header[];
  items: Item[];
  isLoading: boolean;
  onEditUser: (item: Item) => void;
  onDeleteUser: ({ id }: { id: number }) => void;
}

export default function UserTable({
  headers,
  items,
  isLoading,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  return (
    <table className="table table-pin-rows bg-base-200">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header.name}</th>
          ))}
        </tr>
      </thead>
      {isLoading && (
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

      {!isLoading && items.length <= 0 && (
        <tbody>
          <tr>
            <td colSpan={headers.length} className="text-center">
              No data found
            </td>
          </tr>
        </tbody>
      )}
      {!isLoading && items.length > 0 && (
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>
                <div className="avatar avatar-placeholder">
                  <div className="bg-blue-600 text-neutral-content w-10 rounded-full">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white text-2xl">{item.firstName.slice(0, 2)}</span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <span>{item.firstName}</span>
              </td>
              <td>
                <span>{item.lastName}</span>
              </td>
              <td>
                <span>{item.gender}</span>
              </td>
              <td>
                <span>
                  {new Date(item.birthDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-warning text-white" onClick={() => onEditUser(item)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-error text-white"
                    onClick={() => onDeleteUser({ id: item.id })}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
