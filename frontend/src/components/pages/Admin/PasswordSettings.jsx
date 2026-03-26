import { useState } from "react";

export default function PasswordSettings() {

  const [password, setPassword] = useState("");

  return (
    <div className="bg-gray-900 p-5 rounded-xl">

      <h2 className="mb-4">Change Password</h2>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-gray-800 px-3 py-2 w-full"
      />
    </div>
  );
}