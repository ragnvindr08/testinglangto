import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import Sidebar from "./navbar"; // adjust path if needed

function HomePage() {
  const [dashboard, setDashboard] = useState({});
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);


  
  const [newCompany, setNewCompany] = useState({
    name: "",
    address: "",
    contact_person: "",
    contact_email: "",
  });

  const [newInternship, setNewInternship] = useState({
    company_id: "",
    position: "",
    description: "",
    slots: 1,
  });

  const [newApplication, setNewApplication] = useState({
    student_name: "",
    internship_id: "",
    status: "Pending",
  });

  const baseURL = "http://127.0.0.1:8000/api/";

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchDashboard();
    fetchCompanies();
    fetchInternships();
    fetchApplications();
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${baseURL}dashboard/`);
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${baseURL}companies/`);
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInternships = async () => {
    try {
      const res = await axios.get(`${baseURL}internships/`);
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const fetchApplications = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://127.0.0.1:8000/api/applications/", {
      headers: { Authorization: `Token ${token}` },
    });
    setApplications(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err);
  }
};

  // --- Add functions ---
  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseURL}companies/`, newCompany);
      setNewCompany({ name: "", address: "", contact_person: "", contact_email: "" });
      fetchCompanies();
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

const handleAddInternship = async (e) => {
  e.preventDefault();
  try {
    if (!newInternship.company_id) {
      alert("Please select a company.");
      return;
    }

    // Map company_id to 'company' field for Django
    await axios.post(`${baseURL}internships/`, {
      company: newInternship.company_id,
      position: newInternship.position,
      description: newInternship.description,
      slots: newInternship.slots,
    });

    setNewInternship({ company_id: "", position: "", description: "", slots: 1 });
    fetchInternships();
    fetchDashboard();
  } catch (err) {
    console.error(err);
    alert("Failed to add internship. Check console for details.");
  }
};

const handleAddApplication = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token"); // must exist

    if (!token) {
      alert("You must be logged in to submit an application.");
      return;
    }

    await axios.post(
      "http://127.0.0.1:8000/api/applications/",
      { internship: newApplication.internship_id },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    alert("Application submitted!");
    setNewApplication({ internship_id: "" });
    fetchApplications();
    fetchDashboard();
  } catch (err) {
    console.error(err.response ? err.response.data : err);
    alert("Failed to submit application. Check console for details.");
  }
};

  // --- Delete functions ---
  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`${baseURL}${type}/${id}/`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="homepage">
      <Sidebar />
      <div className="dashboard-content">
        <h1>🎓 EARIST Internship Dashboard</h1>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          <div className="card">🏢 Companies: {dashboard.total_companies || 0}</div>
          <div className="card">💼 Internships: {dashboard.total_internships || 0}</div>
          <div className="card">📝 Applications: {dashboard.total_applications || 0}</div>
        </div>

        {/* Add Company */}
        <div className="add-section">
          <h2>Add New Company</h2>
          <form onSubmit={handleAddCompany}>
            <input
              type="text"
              placeholder="Company Name"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={newCompany.address}
              onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Contact Person"
              value={newCompany.contact_person}
              onChange={(e) => setNewCompany({ ...newCompany, contact_person: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Contact Email"
              value={newCompany.contact_email}
              onChange={(e) => setNewCompany({ ...newCompany, contact_email: e.target.value })}
              required
            />
            <button type="submit">Add Company</button>
          </form>
        </div>

        {/* Add Internship */}
        <div className="add-section">
          <h2>Add New Internship</h2>
          <form onSubmit={handleAddInternship}>
            <select
              value={newInternship.company_id}
              onChange={(e) => setNewInternship({ ...newInternship, company_id: e.target.value })}
              required
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Position"
              value={newInternship.position}
              onChange={(e) => setNewInternship({ ...newInternship, position: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newInternship.description}
              onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Slots"
              value={newInternship.slots}
              onChange={(e) => setNewInternship({ ...newInternship, slots: e.target.value })}
              min="1"
              required
            />
            <button type="submit">Add Internship</button>
          </form>
        </div>

        {/* Add Application */}
        <div className="add-section">
          <h2>Add New Application</h2>
          <form onSubmit={handleAddApplication}>
            <input
              type="text"
              placeholder="Student Name"
              value={newApplication.student_name}
              onChange={(e) => setNewApplication({ ...newApplication, student_name: e.target.value })}
              required
            />
            <select
              value={newApplication.internship_id}
              onChange={(e) => setNewApplication({ ...newApplication, internship_id: e.target.value })}
              required
            >
              <option value="">Select Internship</option>
              {internships.map((i) => (
                <option key={i.id} value={i.id}>{i.position} @ {i.company.name}</option>
              ))}
            </select>
            <button type="submit">Add Application</button>
          </form>
        </div>

        {/* Tables Section */}
        <div className="data-section">
          <h2>🏢 Companies List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.contact_person}</td>
                  <td>{c.contact_email}</td>
                  <td>{c.address}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete("companies", c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="data-section">
          <h2>💼 Internships List</h2>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Description</th>
                <th>Slots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((i) => (
                <tr key={i.id}>
                  <td>{i.position}</td>
                  <td>{i.company.name}</td>
                  <td>{i.description}</td>
                  <td>{i.slots}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete("internships", i.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="data-section">
          <h2>📝 Applications List</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Internship</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {applications.map((a) => (
    <tr key={a.id}>
      <td>{a.student_name}</td>
      <td>{a.internship.position} @ {a.internship.company_name}</td>
      <td>{a.status}</td>
      <td>
        <button className="delete-btn" onClick={() => handleDelete("applications", a.id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default HomePage;
