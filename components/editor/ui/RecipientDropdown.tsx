"use client";

import { ChevronDown, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { generateAvatarColors } from "@/utils/colors";
import { getInitials } from "@/utils/user-helpers";

const users = [
  { id: 1, name: "Jese Leos", color: generateAvatarColors("#F3E9FF", 0.3) },
  { id: 2, name: "Robert Gough", color: generateAvatarColors("#E0F7F1", 0.3) },
  { id: 3, name: "Bonnie Green", color: generateAvatarColors("#FFE8E0", 0.3) },
  {
    id: 4,
    name: "Leslie Livingston",
    color: generateAvatarColors("#E8F0FF", 0.3),
  },
  { id: 5, name: "Michael Gough", color: generateAvatarColors("#FFF8E0", 0.3) },
  { id: 6, name: "Neil Sims", color: generateAvatarColors("#E0FFE8", 0.3) },
];

const RecipientDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        id="dropdownUsersButton"
        className="flex w-full items-center justify-between border-b border-gray-300 px-2 py-2 text-center text-sm font-medium"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedUser ? (
          <div className="flex items-center">
            <div
              className="me-2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[10px]"
              style={{
                color: selectedUser.color.textHex,
                background: selectedUser.color.bgRgba,
                borderColor: selectedUser.color.ringHex,
              }}
            >
              {getInitials(selectedUser.name)}
            </div>
            <span>{selectedUser.name}</span>
            <span
              className="mx-2 h-[8px] w-[8px] rounded-full"
              style={{ background: selectedUser.color.ringHex }}
            ></span>
          </div>
        ) : (
          "Project users"
        )}
        <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div
          id="dropdownUsers"
          className="absolute z-10 mt-2 w-60 rounded-lg border border-gray-200 bg-white shadow"
        >
          <ul
            className="h-48 overflow-y-auto py-2 text-gray-700"
            aria-labelledby="dropdownUsersButton"
          >
            {users.map((user) => (
              <li key={user.id}>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleUserSelect(user)}
                >
                  <div
                    className="me-2 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[10px]"
                    style={{
                      color: user.color.textHex,
                      background: user.color.bgRgba,
                      borderColor: user.color.ringHex,
                    }}
                  >
                    {getInitials(user.name)}
                  </div>
                  {user.name}
                </a>
              </li>
            ))}
          </ul>
          <button className="flex w-full items-center rounded-b-lg border-t border-gray-200 bg-gray-50 p-3 text-sm font-medium text-blue-600 hover:bg-gray-100">
            <UserPlus className="mr-2 p-[2px]" size={25} />
            Create new recipient
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipientDropdown;
