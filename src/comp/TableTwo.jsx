import { useEffect, useState } from "react";


const TableTwo = () => {
    const [employees, setEmployees] = useState([])
    const [selectedCheckbox, setSelectedCheckbox] = useState({})
    const [visibleColumn, setVisibleColumn] = useState([])

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

    // to get the columns from the fetched data
    // Ensures that column names are extracted dynamically from the first data object.
    const columns = employees.length > 0 ? Object.keys(employees[0]) : []

    // Updates selectedCheckbox whenever a checkbox is clicked.
    // this function will handle the checkbox change and update the selected checkbox state with spread operator
    const handleCheckBoxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedCheckbox((previousSelectedCheckbox) => ({
            ...previousSelectedCheckbox,
            [name]: checked
        }))
    }

    const handleSearch = e => {
        e.preventDefault()
        // we are filtering the objects keys from the selected checkbox to find which columns are selected 
        const selectedColumns = Object.keys(selectedCheckbox).filter(key => selectedCheckbox[key])
        // then we are inserting the selected column according to the selected checkbox
        setVisibleColumn(selectedColumns)

        // conditional rendering checking any of the columns are selected or not if selected show only the selected ones if not show all
        setVisibleColumn(selectedColumns.length > 0 ? selectedColumns : Object.keys(employees[0]))
    }


    return (
        <div>
            <h1 className="text-center">Practice Table </h1>
            <div className="p-8">
                <form onSubmit={handleSearch} className="flex gap-8 p-8">
                    {
                        columns.map((column, index) =>
                            <label className=" inline-flex items-center space-x-2" key={index + 1}>
                                <input
                                    type="checkbox"
                                    name={column}
                                    onChange={handleCheckBoxChange}
                                    checked={selectedCheckbox[column] || false}
                                ></input>
                                <span>{column}</span>
                            </label>
                        )
                    }

                    <button type="submit" className="btn">Submit</button>
                </form>

                <div className="overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className="">
                                {
                                    columns.map((column, index) => <th key={index}>{column}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {/*i> First we will map our employees to loop and get every single data
                            --The key attribute for each row uses employee._id to ensure that each row has a unique identifier, which is important for React’s list rendering.--
                            */}
                            {
                                employees.map((employee) => <tr key={employee._id}>
                                    {
                                        // get data dynamically for each row according to the column key
                                        // here using visibleColumn coz we set the visibleColumn data during data fetching.
                                        visibleColumn.map((key) => <td key={key}>{employee[key]}</td>)
                                    }
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableTwo;