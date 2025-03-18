export default function Header() {
  return (
    <div className="flex items-center justify-between px-5 min-h-[60px] bg-[#0090ff] text-white">
      <div>User Management</div>
      <div className="avatar avatar-placeholder">
        <div className="bg-white text-neutral-content w-10 rounded-full">
          <span className="text-gray-500">D</span>
        </div>
      </div>
    </div>
  );
}
