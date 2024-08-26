export default class Student {
    constructor(lastname, firstname) {
        this.lastname = lastname;
        this.firstname = firstname;
        this.grades = {}; 
    }

    addGrade(subject, grade) {
        if (!this.grades[subject]) {
            this.grades[subject] = [];
        }
        this.grades[subject].push(grade);
    }

    calculateAverage(subject) {
        if (!this.grades[subject] || this.grades[subject].length === 0) {
            return null;
        }
        const total = this.grades[subject].reduce((acc, curr) => acc + curr, 0);
        return total / this.grades[subject].length;
    }

    getFullName() {
        return `${this.lastname} ${this.firstname}`;
    }
}


