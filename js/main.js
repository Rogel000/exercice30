import Student from "./classe/student.js";

const students = [];
const subjects = [];

// Ajouter des écouteurs d'événements pour la visibilité des formulaires
document
  .getElementById("add-student-visibility")
  .addEventListener("click", () => {
    toggleVisibility("add-student-form", "add-student-visibility");
  });

document
  .getElementById("add-lessonfield-visibility")
  .addEventListener("click", () => {
    toggleVisibility("add-lessonfield-form", "add-lessonfield-visibility");
  });

document
  .getElementById("add-grade-visibility")
  .addEventListener("click", () => {
    toggleVisibility("add-grade-form", "add-grade-visibility");
  });

// Fonction pour basculer la visibilité des éléments
function toggleVisibility(elementId, buttonId) {
  const element = document.getElementById(elementId);
  const visibilityToggle = document.getElementById(buttonId);

  if (!element || !visibilityToggle) {
    console.error(`Element with ID ${elementId} or ${buttonId} not found.`);
    return;
  }

  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
    visibilityToggle.textContent = "ON";
  } else {
    element.classList.add("hidden");
    visibilityToggle.textContent = "OFF";
  }
}

// Ajouter un étudiant
document.getElementById("btnajoutstudent").addEventListener("click", () => {
  const lastname = document.getElementById("student-lastname").value;
  const firstname = document.getElementById("student-firstname").value;

  if (lastname && firstname) {
    const student = new Student(lastname, firstname);
    students.push(student);
    updateStudentSelect();
    document.getElementById("student-lastname").value = "";
    document.getElementById("student-firstname").value = "";
  }
});

// Ajouter une matière
document.getElementById("btnajoutmatiere").addEventListener("click", () => {
  const subject = document.getElementById("lesson-field").value;

  if (subject) {
    subjects.push(subject);
    updateSubjectSelect();
    document.getElementById("lesson-field").value = "";
  }
});

// Ajouter une note
document.getElementById("btnajoutnote").addEventListener("click", () => {
  const studentIndex = document.getElementById("grade-student").value;
  const grade = parseFloat(document.getElementById("grade").value);
  const subjectIndex = document.getElementById("grade-field").value;

  if (!isNaN(grade) && studentIndex !== "" && subjectIndex !== "") {
    const student = students[studentIndex];
    const subject = subjects[subjectIndex];
    student.addGrade(subject, grade);
    updateAverageGrade(); 
    document.getElementById("grade-student").value = "";
    document.getElementById("grade").value = "";
    document.getElementById("grade-field").value = "";
  }
});

// Mettre à jour la liste des étudiants
function updateStudentSelect() {
  const studentSelect = document.getElementById("grade-student");
  const studentChoice = document.getElementById("student-choice");
  studentSelect.innerHTML = "";
  studentChoice.innerHTML = "";

  // Ajouter une option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Sélectionner un étudiant";
  studentSelect.appendChild(defaultOption);
  studentChoice.appendChild(defaultOption.cloneNode(true));

  students.forEach((student, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = student.getFullName(); 
    studentSelect.appendChild(option);
    studentChoice.appendChild(option.cloneNode(true));
    
  });
}

// Mettre à jour la liste des matières avec une valeur par défaut
function updateSubjectSelect() {
  const subjectSelect = document.getElementById("grade-field");
  const subjectChoice = document.getElementById("lessonfield-choice");
  subjectSelect.innerHTML = "";
  subjectChoice.innerHTML = "";

  // Ajouter une option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Toutes les matières";
  subjectSelect.appendChild(defaultOption);
  subjectChoice.appendChild(defaultOption.cloneNode(true));

  subjects.forEach((subject, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = subject;
    subjectSelect.appendChild(option);
    subjectChoice.appendChild(option.cloneNode(true));
  });
}

// Mettre à jour la table des notes pour l'étudiant sélectionné
function updateGradeTable() {
    const tableData = document.getElementById("table-data");
    tableData.innerHTML = "";
    
    const studentIndex = document.getElementById("student-choice").value;
    const subjectIndex = document.getElementById("lessonfield-choice").value;
    const student = students[studentIndex];
  
    if (student) {
      if (subjectIndex !== "") {
        const subject = subjects[subjectIndex];
        student.grades[subject].forEach((grade) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                            <td>${student.lastname}</td>
                            <td>${student.firstname}</td>
                            <td>${subject}</td>
                            <td>${grade}</td>
                        `;
          tableData.appendChild(row);
        });
      } else {
        for (const subject in student.grades) {
          student.grades[subject].forEach((grade) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                              <td>${student.lastname}</td>
                              <td>${student.firstname}</td>
                              <td>${subject}</td>
                              <td>${grade}</td>
                          `;
            tableData.appendChild(row);
          });
        }
      }
    }
  }

// Mettre à jour l'affichage de la moyenne générale
function updateAverageGrade() {
  const studentIndex = document.getElementById("student-choice").value;
  const student = students[studentIndex];
  
  if (student) {
    const grades = Object.keys(student.grades).map(subject => student.calculateAverage(subject)).filter(avg => avg !== null);
    const totalAverage = grades.length > 0 ? grades.reduce((sum, avg) => sum + avg, 0) / grades.length : 0;
    
    document.getElementById("average-grade").innerText = `Moyenne générale: ${totalAverage.toFixed(2)}`;
  } else {
    document.getElementById("average-grade").innerText = "";
  }
}

// Écouter les changements de sélection pour mettre à jour le tableau des notes et la moyenne générale
document.getElementById("student-choice").addEventListener("change", () => {
    updateGradeTable();
    updateAverageGrade();
  });
  
  document.getElementById("lessonfield-choice").addEventListener("change", () => {
    updateGradeTable();
    updateAverageGrade();
  });