"use client";

import { ChevronDown, UserPlus } from "lucide-react";
import React, { useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { RecipientType } from "@/interfaces/recipient";
import RecipientView from "./RecipientView";

const users: RecipientType[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@gmail.com",
    userColor: "#FFE8E0",
  },
  {
    id: "2",
    firstName: "Amelia",
    lastName: "Novak",
    email: "amelia.novak@example.com",
    userColor: "#E0F7F1",
  },
  {
    id: "3",
    firstName: "Lucas",
    lastName: "Richter",
    email: "lucas.richter@example.com",
    userColor: "#FFF8E0",
  },
  {
    id: "4",
    firstName: "Ethan",
    lastName: "Kowalski",
    email: "ethan.kowalski@example.com",
    userColor: "#E8F0FF",
  },
];

const initialRecipient = users[0];

const RecipientDropdown = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] =
    useState<RecipientType | null>(initialRecipient);

  useClickOutside(ref, () => setIsOpen(false));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRecipientSelect = (user: RecipientType) => {
    console.log(user);
    setSelectedRecipient(user);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        id="dropdownUsersButton"
        className="flex w-full items-center justify-between border-b border-gray-300 px-2 py-2 text-center text-sm font-medium"
        type="button"
        onClick={toggleDropdown}
      >
        {selectedRecipient ? (
          <RecipientView recipient={selectedRecipient} />
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
            {users.map((recipient) => (
              <li key={recipient.id}>
                <RecipientView
                  isList
                  selectedRecipient={selectedRecipient}
                  recipient={recipient}
                  onSelect={handleRecipientSelect}
                />
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
