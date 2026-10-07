// Get HTML elements
const jobForm = document.getElementById("jobForm");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");

const applicationList = document.getElementById("applicationList");
const searchInput = document.getElementById("search");
const filterStatus = document.getElementById("filterStatus");

const totalApplications = document.getElementById("totalApplications");
const interviews = document.getElementById("interviews");
const selected = document.getElementById("selected");
const rejected = document.getElementById("rejected");
const successRate = document.getElementById("successRate");
const successProgress = document.getElementById("successProgress");

// Load saved applications
let applications = JSON.parse(localStorage.getItem("applications")) || [];
let editingId = null;


// Add / Update application
jobForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (editingId !== null) {

        const application = applications.find(function (application) {
            return application.id === editingId;
        });

        if (application) {
            application.company = companyInput.value;
            application.role = roleInput.value;
            application.date = dateInput.value;
            application.status = statusInput.value;
        }

        editingId = null;

        document.getElementById("submitButton").textContent =
            "Add Application";

    } else {

        const application = {
            id: Date.now(),
            company: companyInput.value,
            role: roleInput.value,
            date: dateInput.value,
            status: statusInput.value
        };

        applications.push(application);
    }

    saveApplications();
    displayApplications();

    jobForm.reset();
});

// Save data
function saveApplications() {
    localStorage.setItem("applications", JSON.stringify(applications));
}


// Display applications
function displayApplications() {

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;

    const filteredApplications = applications.filter(function (application) {

        const matchesSearch =
            application.company.toLowerCase().includes(searchText) ||
            application.role.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            application.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    if (filteredApplications.length === 0) {

        applicationList.innerHTML = `
            <p class="empty-message">
                No applications found.
            </p>
        `;

        updateDashboard();
        return;
    }


    applicationList.innerHTML = filteredApplications.map(function (application) {

        return `
            <div class="application-item">

                <div>
                    <h3>${application.company}</h3>

                    <p>${application.role}</p>

                    <small>
                        Applied on: ${application.date}
                    </small>
                </div>


                <div>

                    <select
                        onchange="changeStatus(${application.id}, this.value)"
                    >
                        <option value="Applied"
                            ${application.status === "Applied" ? "selected" : ""}>
                            Applied
                        </option>

                        <option value="Interview"
                            ${application.status === "Interview" ? "selected" : ""}>
                            Interview
                        </option>

                        <option value="Selected"
                            ${application.status === "Selected" ? "selected" : ""}>
                            Selected
                        </option>

                        <option value="Rejected"
                            ${application.status === "Rejected" ? "selected" : ""}>
                            Rejected
                        </option>
                    </select>
                    <span class="status-badge status-${application.status.toLowerCase()}">
    ${application.status}
</span>


                    <br><br>


                    <button
                        onclick="editApplication(${application.id})"
                    >
                        Edit
                    </button>


                    <button
                        onclick="deleteApplication(${application.id})"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;

    }).join("");


    updateDashboard();
}


// Change status
function changeStatus(id, newStatus) {

    const application = applications.find(function (application) {
        return application.id === id;
    });

    if (application) {
        application.status = newStatus;
    }

    saveApplications();
    displayApplications();
}


// Edit application
function editApplication(id) {

    const application = applications.find(function (application) {
        return application.id === id;
    });

    if (!application) return;

    companyInput.value = application.company;
    roleInput.value = application.role;
    dateInput.value = application.date;
    statusInput.value = application.status;

    editingId = id;

    document.getElementById("submitButton").textContent =
        "Update Application";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete application
function deleteApplication(id) {

    applications = applications.filter(function (application) {
        return application.id !== id;
    });

    saveApplications();
    displayApplications();
}


// Dashboard
function updateDashboard() {

    totalApplications.textContent = applications.length;

    interviews.textContent =
        applications.filter(function (application) {
            return application.status === "Interview";
        }).length;

    selected.textContent =
        applications.filter(function (application) {
            return application.status === "Selected";
        }).length;

    rejected.textContent =
        applications.filter(function (application) {
            return application.status === "Rejected";
        }).length;

    const selectedCount =
    applications.filter(function (application) {
        return application.status === "Selected";
    }).length;

const totalCount = applications.length;

const rate = totalCount === 0
    ? 0
    : Math.round((selectedCount / totalCount) * 100);

successRate.textContent = rate + "%";
successProgress.style.width = rate + "%";


}


// Search
searchInput.addEventListener("input", displayApplications);


// Filter
filterStatus.addEventListener("change", displayApplications);


// Initial load
displayApplications();