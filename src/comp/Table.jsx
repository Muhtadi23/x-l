import { useEffect, useState } from "react";

const Table = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedCheckbox, setSelectedCheckbox] = useState({});
    const [visibleColumn, setVisibleColumn] = useState([]);

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/comments")
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
                if (data.length > 0) {
                    setVisibleColumn(Object.keys(data[0]));
                }
            });
    }, []);

    const columns = employees.length > 0 ? Object.keys(employees[0]) : [];

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedCheckbox(prev => ({ ...prev, [name]: checked }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const selectedColumns = Object.keys(selectedCheckbox).filter(key => selectedCheckbox[key]);
        setVisibleColumn(selectedColumns.length > 0 ? selectedColumns : Object.keys(employees[0]));
    };

    return (
        <div className="p-8">
            <form onSubmit={handleSearch} className="flex gap-8 p-8">
                {columns.map((column) => (
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
                <button type="submit" className="btn">Submit</button>
            </form>

            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            {visibleColumn.map((column) => <th key={column}>{column}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                {visibleColumn.map((key) => <td key={key}>{employee[key]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
