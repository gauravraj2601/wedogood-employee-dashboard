import React, { useState, useMemo } from 'react';
import { useSearch } from './useSearch';
import { employeeData } from '../db';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(employeeData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('default'); 
  const [filterGender, setFilterGender] = useState('all');
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Apply search and filter first
  const searchedEmployees = useSearch(employees, searchTerm);
  const filteredEmployees = searchedEmployees.filter(employee =>
    filterGender === 'all' ? true : employee.gender === filterGender
  );

  // Sort filtered employees
  const sortedEmployees = useMemo(() => {
    if (sortDirection === 'default') {
      return filteredEmployees;
    }
    return [...filteredEmployees].sort((a, b) => {
      if (a.salary < b.salary) return sortDirection === 'asc' ? -1 : 1;
      if (a.salary > b.salary) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortDirection]);

  // Paginate sorted employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedEmployees.slice(startIndex, endIndex);
  }, [sortedEmployees, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

   const handleSort = () => {
    setSortDirection(prevDirection => {
      if (prevDirection === 'default') return 'asc';
      if (prevDirection === 'asc') return 'desc';
      if (prevDirection === 'desc') return 'default';
    });
  };

  const handleFilterGender = (e) => {
    setFilterGender(e.target.value);
    setCurrentPage(1);  // Reset to first page
  };

  const handleChange = (id, field, value) => {
    setEmployees(employees.map(emp =>
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const handleEditClick = (id) => {
    if (editingEmployeeId === id) {
      setEditingEmployeeId(null); 
    } else {
      setEditingEmployeeId(id); 
    }
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
   
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < sortedEmployees.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-[90%] m-auto mx-auto py-8 shadow-md">
      <div className="w-[80%] m-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSort}
            className="px-4 py-2 border rounded-md border-gray-300 bg-white text-gray-700"
          >
            Sort by Salary {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↔'}
          </button>
          <select
            value={filterGender}
            onChange={handleFilterGender}
            className="px-4 py-2 border rounded-md border-gray-300 bg-white text-gray-700"
          >
            <option value="all">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className='bg-red-300'>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEmployees.map(employee => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingEmployeeId === employee.id ? (
                    <input
                      type="text"
                      value={employee.first_name}
                      onChange={(e) => handleChange(employee.id, 'first_name', e.target.value)}
                      className="bg-yellow-50 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                    />
                  ) : (
                    <span>{employee.first_name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingEmployeeId === employee.id ? (
                    <input
                      type="text"
                      value={employee.last_name}
                      onChange={(e) => handleChange(employee.id, 'last_name', e.target.value)}
                      className="bg-yellow-50 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                    />
                  ) : (
                    <span>{employee.last_name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingEmployeeId === employee.id ? (
                    <input
                      type="text"
                      value={employee.email}
                      onChange={(e) => handleChange(employee.id, 'email', e.target.value)}
                      className="bg-yellow-50 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                    />
                  ) : (
                    <span>{employee.email}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {editingEmployeeId === employee.id ? (
                    <select
                      value={employee.gender}
                      onChange={(e) => handleChange(employee.id, 'gender', e.target.value)}
                      className="bg-yellow-50 border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <span>{employee.gender}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {editingEmployeeId === employee.id ? (
                    <input
                      type="number"
                      value={employee.salary}
                      onChange={(e) => handleChange(employee.id, 'salary', Number(e.target.value))}
                      className="bg-yellow-50 border border-gray-300 rounded-md px-2 py-1 focus:outline-none text-center"
                    />
                  ) : (
                    <span>${employee.salary.toLocaleString()}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {editingEmployeeId === employee.id ? (
                    <button
                      onClick={() => handleEditClick(employee.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(employee.id)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="max-w-sm m-auto flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {Math.ceil(sortedEmployees.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= sortedEmployees.length}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
