// getOperatorDetails
// OperatorDetails.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DepartmentLayout from "../../layout/DepartmentLayout";

const OperatorDetails = () => {
 const { operatorId } = useParams();
 const [data, setData] = useState(null);

 const token = localStorage.getItem("token");

 useEffect(() => {
 const fetchData = async () => {
 try {
 const res = await axios.get(
 `http://127.0.0.1:5000/api/operator/${operatorId}`,
 {
 headers: {
 Authorization: `Bearer ${token}`,
 },
 }
 );

 setData(res.data);

 } catch (err) {
 console.log(err);
 }
 };

 fetchData();
 }, [operatorId]);

 if (!data) return <p>Loading...</p>;

 return (
 <DepartmentLayout>
 <div className="space-y-6">

 {/* Stats */}
 <div className="grid grid-cols-4 gap-4">
 <div className="bg-[#111c2e] p-4 rounded">
 <p>Total</p>
 <h2>{data.total}</h2>
 </div>

 <div className="bg-yellow-500/20 p-4 rounded">
 <p>Pending</p>
 <h2>{data.pending}</h2>
 </div>

 <div className="bg-blue-500/20 p-4 rounded">
 <p>In Progress</p>
 <h2>{data.inProgress}</h2>
 </div>

 <div className="bg-green-500/20 p-4 rounded">
 <p>Completed</p>
 <h2>{data.completed}</h2>
 </div>
 </div>

 {/* Issues List */}
 <div className="space-y-3">
 {data.issues.map((issue) => (
 <div
 key={issue._id}
 className="bg-[#0b1624] p-4 rounded border border-gray-800"
 >
 <h3 className="font-semibold">{issue.title}</h3>
 <p className="text-sm text-gray-400">
 {issue.category} | {issue.status}
 </p>
 <p className="text-xs text-gray-500">
 Zone: {issue.zone}
 </p>
 </div>
 ))}
 </div>

 </div>
 </DepartmentLayout>
 );
};

export default OperatorDetails;

