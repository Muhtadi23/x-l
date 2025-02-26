import { useState } from "react";
import * as XLSX from "xlsx";

const TableWithFileUpload = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedCheckbox, setSelectedCheckbox] = useState({});
    const [visibleColumn, setVisibleColumn] = useState([]);
    const [allColumns, setAllColumns] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
        if (!validTypes.includes(file.type)) {
            alert("Invalid file type. Please upload an Excel file.");
            return;
        }

        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const data = XLSX.utils.sheet_to_json(sheet);
            if (data.length === 0) {
                alert("Uploaded file contains no data.");
                return;
            }

            setEmployees(data);
            const columns = Object.keys(data[0]);
            setAllColumns(columns);
            setVisibleColumn(columns);
            setSelectedCheckbox(columns.reduce((acc, col) => ({ ...acc, [col]: true }), {}));
        };
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedCheckbox(prev => ({ ...prev, [name]: checked }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const selectedColumns = Object.keys(selectedCheckbox).filter(key => selectedCheckbox[key]);
        setVisibleColumn(selectedColumns.length > 0 ? selectedColumns : allColumns);
    };

    return (
        <div className="p-8">
            <div>
                <h2>Upload your Excel File</h2>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            </div>

            {employees.length > 0 && (
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 p-8">
                    {allColumns.map((column) => (
                        <label key={column} className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedCheckbox[column] || false}
                                onChange={handleCheckboxChange}
                                name={column}
                            />
                            <span>{column}</span>
                        </label>
                    ))}
                    <button type="submit" className="btn">Filter</button>
                </form>
            )}

            {visibleColumn.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                {visibleColumn.map((column) => <th key={column}>{column}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={index}>
                                    {visibleColumn.map((key) => <td key={key}>{employee[key]}</td>)}
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
