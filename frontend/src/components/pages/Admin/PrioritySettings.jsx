import { useState } from "react";

export default function PrioritySettings() {

  const [rules, setRules] = useState({
    fire: 80,
    pothole: 40
  });

  return (
    <div className="bg-gray-900 p-5 rounded-xl">

      <h2 className="mb-4">Priority Rules</h2>

      {Object.keys(rules).map((key) => (
        <div key={key} className="flex gap-3 mb-2">

          <span className="w-24">{key}</span>

          <input
            type="number"
            value={rules[key]}
            onChange={(e) =>
              setRules({
                ...rules,
                [key]: Number(e.target.value)
              })
            }
            className="bg-gray-800 px-2 py-1"
          />
        </div>
      ))}
    </div>
  );
}