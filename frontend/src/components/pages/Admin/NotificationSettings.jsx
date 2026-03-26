import { useState } from "react";

export default function NotificationSettings() {

  const [settings, setSettings] = useState({
    admin: true,
    department: true,
    operator: true
  });

  return (
    <div className="bg-gray-900 p-5 rounded-xl">

      <h2 className="mb-4">Notifications</h2>

      {Object.keys(settings).map((key) => (
        <div key={key} className="flex justify-between mb-2">

          <span>{key}</span>

          <input
            type="checkbox"
            checked={settings[key]}
            onChange={() =>
              setSettings({
                ...settings,
                [key]: !settings[key]
              })
            }
          />
        </div>
      ))}
    </div>
  );
}