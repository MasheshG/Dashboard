// Initialize data structure
const STORAGE_KEY = 'institute_students';
const COURSES = ['Fullstack', 'Java', 'MERN', 'DevOps'];
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

// Initialize storage if not exists
if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

let editingStudentId = null;

// Get students from localStorage
function getStudents() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// Save students to localStorage
function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    updateDashboard();
}

// Add or update student
function saveStudent(studentData) {
    const students = getStudents();
    
    if (editingStudentId) {
        // Update existing student
        const index = students.findIndex(s => s.id === editingStudentId);
        if (index !== -1) {
            students[index] = { ...students[index], ...studentData };
        }
        editingStudentId = null;
    } else {
        // Add new student
        const newStudent = {
            id: Date.now().toString(),
            ...studentData,
            enrolledDate: new Date().toISOString().split('T')[0]
        };
        students.push(newStudent);
    }
    
    saveStudents(students);
}

// Delete student
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        const students = getStudents();
        const filtered = students.filter(s => s.id !== id);
        saveStudents(filtered);
    }
}

// Edit student
function editStudent(id) {
    const students = getStudents();
    const student = students.find(s => s.id === id);
    
    if (student) {
        editingStudentId = id;
        document.getElementById('modal-title').textContent = 'Edit Student';
        document.getElementById('submit-btn').textContent = 'Update Student';
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-course').value = student.course;
        document.getElementById('student-time').value = student.timeSlot;
        document.getElementById('student-status').value = student.status;
        openModal();
    }
}

// Calculate statistics
function getStatistics() {
    const students = getStudents();
    return {
        total: students.length,
        placed: students.filter(s => s.status === 'Placed').length,
        training: students.filter(s => s.status === 'In Training').length
    };
}

// Get course statistics
function getCourseStats() {
    const students = getStudents();
    const stats = {};
    
    COURSES.forEach(course => {
        stats[course] = students.filter(s => s.course === course).length;
    });
    
    return stats;
}

// Get time slot statistics
function getTimeSlotStats() {
    const students = getStudents();
    const stats = {};
    
    TIME_SLOTS.forEach(slot => {
        stats[slot] = students.filter(s => s.timeSlot === slot).length;
    });
    
    return stats;
}

// Update dashboard
function updateDashboard() {
    const stats = getStatistics();
    document.getElementById('total-students').textContent = stats.total;
    document.getElementById('placed-students').textContent = stats.placed;
    document.getElementById('training-students').textContent = stats.training;
    
    // Update courses overview
    updateCoursesOverview();
    
    // Update time slots overview
    updateTimeSlotsOverview();
    
    // Update courses detail page
    updateCoursesDetail();
    
    // Update students table
    updateStudentsTable();
    
    // Update schedule section
    updateSchedule();
}

// Update courses overview
function updateCoursesOverview() {
    const courseStats = getCourseStats();
    const coursesGrid = document.getElementById('courses-grid');
    const colors = {
        'Fullstack': '#3b82f6',
        'Java': '#10b981',
        'MERN': '#f59e0b',
        'DevOps': '#8b5cf6'
    };
    
    coursesGrid.innerHTML = '';
    
    COURSES.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.style.borderTopColor = colors[course];
        card.innerHTML = `
            <h3>${course}</h3>
            <div class="course-count">${courseStats[course]}</div>
            <div class="course-label">Students Enrolled</div>
        `;
        coursesGrid.appendChild(card);
    });
}

// Update time slots overview
function updateTimeSlotsOverview() {
    const timeStats = getTimeSlotStats();
    const timeSlotsGrid = document.getElementById('time-slots-grid');
    const timeRanges = {
        'Morning': '8:00 AM - 12:00 PM',
        'Afternoon': '12:00 PM - 4:00 PM',
        'Evening': '4:00 PM - 8:00 PM'
    };
    
    timeSlotsGrid.innerHTML = '';
    
    TIME_SLOTS.forEach(slot => {
        const card = document.createElement('div');
        card.className = 'time-slot-card';
        card.innerHTML = `
            <h3>${slot} Batch</h3>
            <div class="time-range">${timeRanges[slot]}</div>
            <div class="slot-count">${timeStats[slot]}</div>
        `;
        timeSlotsGrid.appendChild(card);
    });
}

// Update courses detail page
function updateCoursesDetail() {
    const students = getStudents();
    const coursesDetailGrid = document.getElementById('courses-detail-grid');
    const colors = {
        'Fullstack': '#3b82f6',
        'Java': '#10b981',
        'MERN': '#f59e0b',
        'DevOps': '#8b5cf6'
    };
    
    coursesDetailGrid.innerHTML = '';
    
    COURSES.forEach(course => {
        const courseStudents = students.filter(s => s.course === course);
        const placed = courseStudents.filter(s => s.status === 'Placed').length;
        const training = courseStudents.filter(s => s.status === 'In Training').length;
        
        const card = document.createElement('div');
        card.className = 'course-detail-card';
        card.innerHTML = `
            <div class="course-detail-header">
                <h3 style="color: ${colors[course]}">${course}</h3>
            </div>
            <div class="course-detail-stats">
                <div class="course-stat-item">
                    <span>Total Students</span>
                    <strong>${courseStudents.length}</strong>
                </div>
                <div class="course-stat-item">
                    <span>Placed</span>
                    <strong style="color: #10b981">${placed}</strong>
                </div>
                <div class="course-stat-item">
                    <span>In Training</span>
                    <strong style="color: #f59e0b">${training}</strong>
                </div>
            </div>
        `;
        coursesDetailGrid.appendChild(card);
    });
}

// Update students table
function updateStudentsTable() {
    const students = getStudents();
    const tbody = document.getElementById('students-tbody');
    
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">
                    No students found. Click "Add Student" to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${student.name}</strong></td>
            <td>${student.course}</td>
            <td>${student.timeSlot}</td>
            <td>
                <span class="status-badge ${student.status === 'Placed' ? 'placed' : 'training'}">
                    ${student.status}
                </span>
            </td>
            <td>${student.enrolledDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editStudent('${student.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteStudent('${student.id}')">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update schedule section
function updateSchedule() {
    const students = getStudents();
    
    TIME_SLOTS.forEach(slot => {
        const slotStudents = students.filter(s => s.timeSlot === slot);
        const slotId = slot.toLowerCase();
        
        // Update count
        document.getElementById(`${slotId}-count`).textContent = slotStudents.length;
        
        // Update student list
        const studentList = document.getElementById(`${slotId}-students`);
        studentList.innerHTML = '';
        
        if (slotStudents.length === 0) {
            studentList.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">No students enrolled</p>';
        } else {
            slotStudents.forEach(student => {
                const item = document.createElement('div');
                item.className = 'student-item';
                item.innerHTML = `
                    <div class="student-name">${student.name}</div>
                    <div class="student-course">${student.course} - ${student.status}</div>
                `;
                studentList.appendChild(item);
            });
        }
    });
}

// Modal functions
function openModal() {
    document.getElementById('student-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('student-modal').classList.remove('active');
    document.getElementById('student-form').reset();
    editingStudentId = null;
    document.getElementById('modal-title').textContent = 'Add New Student';
    document.getElementById('submit-btn').textContent = 'Add Student';
}

// Navigation
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Update page title
    const titles = {
        'dashboard': 'Dashboard Overview',
        'courses': 'Courses Management',
        'students': 'Students Management',
        'schedule': 'Schedule & Time Slots'
    };
    document.getElementById('page-title').textContent = titles[sectionName];
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    updateDashboard();
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Modal controls
    document.getElementById('add-student-btn').addEventListener('click', openModal);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    
    // Close modal on outside click
    document.getElementById('student-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Form submission
    document.getElementById('student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentData = {
            name: document.getElementById('student-name').value,
            course: document.getElementById('student-course').value,
            timeSlot: document.getElementById('student-time').value,
            status: document.getElementById('student-status').value
        };
        
        saveStudent(studentData);
        closeModal();
    });
});

// Make functions globally accessible
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;