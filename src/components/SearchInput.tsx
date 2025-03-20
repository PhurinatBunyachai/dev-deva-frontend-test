import React from 'react';

interface SearchInputProps {
  searchWord: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
}

export default function SearchInput({ searchWord, onSearch, onEnter, onSearchSubmit }: SearchInputProps) {
  return (
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
  );
}