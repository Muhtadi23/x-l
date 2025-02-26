import { useState } from "react";
import * as XLSX from "xlsx";

const TableWithFileUpload = () => {
    const [employees, setEmployees] = useState([]);
    const [visibleColumn, setVisibleColumn] = useState([]);
    const [allColumns, setAllColumns] = useState([]);
    const [error, setError] = useState("");

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ];
        if (!validTypes.includes(file.type)) {
            setError("Invalid file type. Please upload an Excel file.");
            return;
        }

        setError("");
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const data = XLSX.utils.sheet_to_json(sheet);
            if (data.length === 0) {
                setError("Uploaded file contains no data.");
                return;
            }

            setEmployees(data);
            const columns = Object.keys(data[0]).filter(col => col.trim() && col !== "_EMPTY");
            setAllColumns(columns);
            setVisibleColumn(columns);
        };
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setVisibleColumn((prev) =>
            checked ? [...prev, name] : prev.filter((col) => col !== name)
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Upload your Excel File</h2>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    aria-label="Upload Excel file"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {employees.length > 0 && (
                <div className="mt-6  shadow-lg rounded-lg p-6">
                    <h3 className="text-lg font-medium  mb-3">Select Columns to Display</h3>
                    <div className="flex flex-wrap gap-3">
                        {allColumns.map((column) => (
                            <label key={column} className="flex items-center space-x-2 px-3 py-1 rounded-md">
                                <input
                                    type="checkbox"
                                    checked={visibleColumn.includes(column)}
                                    onChange={handleCheckboxChange}
                                    name={column}
                                    className="accent-blue-500"
                                />
                                <span className="">{column}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {visibleColumn.length > 0 && employees.length > 0 && (
                <div className="mt-6 shadow-lg rounded-lg p-4 overflow-x-auto">
                    <table className="w-full min-w-max border rounded-lg overflow-hidden">
                        <thead>
                            <tr className="">
                                {visibleColumn.map((column) => (
                                    <th key={column} className="py-3 px-4 text-left">{column}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 hover:text-black hover:text-semibold">
                                    {visibleColumn.map((key) => (
                                        <td key={key} className="py-2 px-4">{employee[key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TableWithFileUpload;
