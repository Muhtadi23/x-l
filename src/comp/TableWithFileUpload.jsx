"use client"

import { useState } from "react"
import * as XLSX from "xlsx"

const TableWithFileUpload = () => {
    const [employees, setEmployees] = useState([])
    const [visibleColumn, setVisibleColumn] = useState([])
    const [allColumns, setAllColumns] = useState([])
    const [error, setError] = useState("")

    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const validTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
        if (!validTypes.includes(file.type)) {
            setError("Invalid file type. Please upload an Excel file.")
            return
        }

        setError("")
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (e) => {
            const binaryStr = e.target.result
            const workbook = XLSX.read(binaryStr, { type: "binary" })
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]

            const data = XLSX.utils.sheet_to_json(sheet)
            if (data.length === 0) {
                setError("Uploaded file contains no data.")
                return
            }

            setEmployees(data)
            const columns = Object.keys(data[0]).filter((col) => col.trim() && col !== "_EMPTY")
            setAllColumns(columns)
            setVisibleColumn(columns)
        }
    }

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target
        setVisibleColumn((prev) => (checked ? [...prev, name] : prev.filter((col) => col !== name)))
    }

    return (
        <div className="p-6 w-full mx-auto bg-gradient-to-b from-gray-50 to-white min-h-screen">
            <div className="  max-w-6xl mx-auto shadow-xl rounded-xl p-8 bg-white border border-gray-100 transition-all duration-300 hover:shadow-2xl ">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Upload your Excel File</h2>
                <div className="relative">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="w-full border-2 border-gray-300 border-dashed rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        aria-label="Upload Excel file"
                    />
                    <p className="mt-2 text-sm text-gray-500">Supported formats: .xlsx, .xls</p>
                </div>
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                        <p className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </p>
                    </div>
                )}
            </div>

            {employees.length > 0 && (
                <div className="mt-8 shadow-xl rounded-xl p-8 bg-white border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Select Columns to Display</h3>
                    <div className="flex flex-wrap gap-3">
                        {allColumns.map((column) => (
                            <label
                                key={column}
                                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    checked={visibleColumn.includes(column)}
                                    onChange={handleCheckboxChange}
                                    name={column}
                                    className="w-4 h-4 accent-blue-600 rounded"
                                />
                                <span className="text-gray-700 font-medium">{column}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {visibleColumn.length > 0 && employees.length > 0 && (
                <div className="mt-8 shadow-xl rounded-xl p-6 bg-white border border-gray-100 transition-all duration-300 hover:shadow-2xl overflow-hidden">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Data Table</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full min-w-max">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {visibleColumn.map((column) => (
                                        <th
                                            key={column}
                                            className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                                        >
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {employees.map((employee, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                                        {visibleColumn.map((key) => (
                                            <td key={key} className="py-3 px-6 text-sm text-gray-700 whitespace-nowrap">
                                                {employee[key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">Showing {employees.length} records</div>
                </div>
            )}
        </div>
    )
}

export default TableWithFileUpload

