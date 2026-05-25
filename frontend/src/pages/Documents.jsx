import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../services/api";
import DocumentDetailsModal from "../components/DocumentDetailsModal";
import {  uploadDocument, getDocumentStats, getDocuments, getDocumentById } from "../services/api";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({total_uploads: 0, ocr_success: 0, validation_passed: 0});
const fetchStats = async () => {
    try {
        const data = await getDocumentStats();
        setStats(data);
    } catch (error) {
        console.log(error);
    }
};
  const handleView = async (id) => {
    const res = await API.get(
      ` /api/documents/${id}`
    );
    setSelectedDocument(res.data);
    setShowModal(true);
  };
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    await API.post(
      "/api/documents/upload",
      formData
    );
    fetchDocuments();
  };
  const fetchDocuments = async () => {
    const res = await API.get("/api/documents");
    setDocuments(res.data);
  };
  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Intelligence</h1>
        <p className="text-gray-500 mt-2">Upload and analyze trade documents</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">
          Upload Document
        </h2>
        <div className="flex gap-4">
      <input type="file"
            onChange={(e) =>setFile(e.target.files[0])}
            className="border p-3 rounded-lg w-full"/>
      <button onClick={handleUpload} className="bg-black text-white px-6 rounded-lg">
          Upload
      </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">
          Total Uploads
        </h2>
      <p className="text-4xl font-bold mt-4">
          {stats.total_uploads}
        </p>
    </div>
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">
          OCR Success
      </h2>
      <p className="text-4xl font-bold mt-4">
        {stats.ocr_success}%
      </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold">
          Validation Passed
        </h2>
        <p className="text-4xl font-bold mt-4">
          {stats.validation_passed}%</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">
          Upload History
        </h2>
        <div className="overflow-x-auto">
    <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">File</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Buyer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Unit-Price</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
          </tr>
        </thead>
    <tbody>
          {documents.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="p-3"> {doc.file_name} </td>
                  <td className="p-3"> {doc.invoice_number} </td>
                  <td className="p-3"> {doc.buyer_name} </td>
                  <td className="p-3"> {doc.product} </td>
                  <td className="p-3"> {doc.currency} {doc.unit_price} </td>
                  <td className="p-3"> {doc.currency} {doc.total_amount} </td>
             <td className="p-3">
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {doc.ocr_status}
                </span>
              </td>
                  <td className="p-3"> 
                <button onClick={() => handleView(doc.id)} className="bg-black text-white px-4 py-2 rounded-lg">
                      View
                </button>
                    </td>
          </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <DocumentDetailsModal
          document={selectedDocument}
          onClose={() => setShowModal(false)}
        />
      )}

    </DashboardLayout>
  );
}
