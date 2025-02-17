import React from "react";

export const Switch = ({ checked, onChange, className = "" }) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 peer-focus:ring-4 peer-focus:ring-blue-300 transition-all"></div>
      <span className="ml-3 text-sm font-medium text-gray-900">{checked ? "On" : "Off"}</span>
    </label>
  );
};
