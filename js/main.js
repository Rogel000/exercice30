import Student from "./classe/student.js";

const students = [];
const subjects = [];

// Ajouter des écouteurs d'événements pour la visibilité des formulaires
document
  .getElementById("add-student-visibility")
  .addEventListener("click", () =>
    toggleVisibility("add-student-form", "add-student-visibility")
  );
document
  .getElementById("add-lessonfield-visibility")
  .addEventListener("click", () =>
    toggleVisibility("add-lessonfield-form", "add-lessonfield-visibility")
  );
document
  .getElementById("add-grade-visibility")
  .addEventListener("click", () =>
    toggleVisibility("add-grade-form", "add-grade-visibility")
  );

// Fonction pour basculer la visibilité des éléments
function toggleVisibility(elementId, buttonId) {
  const element = document.getElementById(elementId);
  const visibilityToggle = document.getElementById(buttonId);

  if (!element || !visibilityToggle) {
    console.error(`Element with ID ${elementId} or ${buttonId} not found.`);
    return;
  }

  const isHidden = element.classList.toggle("hidden");
  visibilityToggle.textContent = isHidden ? "OFF" : "ON";
}

// Formate le texte : tout en majuscule pour le nom, et première lettre en majuscule pour le prénom et la matière
function formatInput(input, type = "capitalize") {
  if (type === "uppercase") {
    return input.toUpperCase();
  } else if (type === "capitalize") {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
  return input;
}

// Ajouter un étudiant
document.getElementById("btnajoutstudent").addEventListener("click", () => {
  let lastname = document.getElementById("student-lastname").value.trim();
  let firstname = document.getElementById("student-firstname").value.trim();

  // Appliquer le formatage
  lastname = formatInput(lastname, "uppercase");
  firstname = formatInput(firstname, "capitalize");

  if (lastname && firstname) {
    const student = new Student(lastname, firstname);
    students.push(student);
    updateStudentSelect();
    clearStudentForm();
  }
});

// Ajouter une matière
document.getElementById("btnajoutmatiere").addEventListener("click", () => {
  let subject = document.getElementById("lesson-field").value.trim();

  // Appliquer le formatage
  subject = formatInput(subject, "capitalize");

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
    updateGradeTable();
    updateAverageGrade();
    clearGradeForm();
  }
});

// Mettre à jour la liste des étudiants
function updateStudentSelect() {
  updateSelectOptions(
    "grade-student",
    "student-choice",
    students,
    (student) => student.getFullName(),
    "Tous les étudiants"
  );
}

// Mettre à jour la liste des matières
function updateSubjectSelect() {
  updateSelectOptions(
    "grade-field",
    "lessonfield-choice",
    subjects,
    (subject) => subject,
    "Toutes les matières"
  );
}

// Fonction générique pour mettre à jour les options d'un select
function updateSelectOptions(
  selectId,
  choiceId,
  items,
  getText = (item) => item,
  defaultText = "Sélectionner une option"
) {
  const select = document.getElementById(selectId);
  const choice = document.getElementById(choiceId);
  select.innerHTML = "";
  choice.innerHTML = "";

  // Ajouter une option par défaut
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = defaultText;
  select.appendChild(defaultOption);
  choice.appendChild(defaultOption.cloneNode(true));

  items.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = getText(item);
    select.appendChild(option);
    choice.appendChild(option.cloneNode(true));
  });
}

// Mettre à jour la table des notes
function updateGradeTable() {
  const tableData = document.getElementById("table-data");
  tableData.innerHTML = "";

  const studentIndex = document.getElementById("student-choice").value;
  const subjectIndex = document.getElementById("lessonfield-choice").value;

  if (studentIndex === "") {
    students.forEach((student) => {
      const subjectsToDisplay =
        subjectIndex !== ""
          ? [subjects[subjectIndex]]
          : Object.keys(student.grades);
      subjectsToDisplay.forEach((subject) => {
        if (student.grades[subject]) {
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
      });
    });
  } else {
    const student = students[studentIndex];
    if (student) {
      const subjectsToDisplay =
        subjectIndex !== ""
          ? [subjects[subjectIndex]]
          : Object.keys(student.grades);
      subjectsToDisplay.forEach((subject) => {
        if (student.grades[subject]) {
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
      });
    }
  }
}

// Mettre à jour l'affichage de la moyenne générale
function updateAverageGrade() {
  const studentIndex = document.getElementById("student-choice").value;
  const subjectIndex = document.getElementById("lessonfield-choice").value;

  if (studentIndex === "") {
    if (subjectIndex !== "") {
      const subjectGrades = students.flatMap(
        (student) => student.grades[subjects[subjectIndex]] || []
      );

      const totalAverage =
        subjectGrades.length > 0
          ? subjectGrades.reduce((sum, grade) => sum + grade, 0) /
            subjectGrades.length
          : 0;

      document.getElementById(
        "average-grade"
      ).innerText = `Moyenne générale de la classe en ${
        subjects[subjectIndex]
      }: ${totalAverage.toFixed(2)}`;
    } else {
      const classGrades = students.flatMap((student) =>
        Object.values(student.grades).flat()
      );

      const totalAverage =
        classGrades.length > 0
          ? classGrades.reduce((sum, grade) => sum + grade, 0) /
            classGrades.length
          : 0;

      document.getElementById(
        "average-grade"
      ).innerText = `Moyenne générale de la classe: ${totalAverage.toFixed(2)}`;
    }
  } else {
    const student = students[studentIndex];
    if (student) {
      if (subjectIndex === "") {
        const studentGrades = Object.values(student.grades).flat();
        const totalAverage =
          studentGrades.length > 0
            ? studentGrades.reduce((sum, grade) => sum + grade, 0) /
              studentGrades.length
            : 0;

        document.getElementById(
          "average-grade"
        ).innerText = `Moyenne générale de ${student.getFullName()}: ${totalAverage.toFixed(
          2
        )}`;
      } else {
        const subjectGrades = student.grades[subjects[subjectIndex]] || [];
        const totalAverage =
          subjectGrades.length > 0
            ? subjectGrades.reduce((sum, grade) => sum + grade, 0) /
              subjectGrades.length
            : 0;

        document.getElementById(
          "average-grade"
        ).innerText = `Moyenne de ${student.getFullName()} en ${
          subjects[subjectIndex]
        }: ${totalAverage.toFixed(2)}`;
      }
    } else {
      document.getElementById("average-grade").innerText = "";
    }
  }
}

// Fonctions pour nettoyer les formulaires
function clearStudentForm() {
  document.getElementById("student-lastname").value = "";
  document.getElementById("student-firstname").value = "";
}

function clearGradeForm() {
  document.getElementById("grade-student").value = "";
  document.getElementById("grade").value = "";
  document.getElementById("grade-field").value = "";
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
