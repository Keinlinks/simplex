class Simplex {
  z = [];
  subjectTo = [];

  current_dict = [[]];

  limit_tries = 100;

  basics = [];

  constructor() {}

  setZ(z) {
    this.z = z;
  }
  setSubjectTo(subjectTo) {
    console.log(subjectTo);
    this.subjectTo = subjectTo;
  }

  updateDict(z, subjectTo) {}

  checkMoreNegativeZ(z) {
    let column = 0;
    let min = 99999999;
    z.forEach((zF, index) => {
      if (zF < min) {
        min = zF;
        column = index;
      }
    });
    if (min < 0) return column;
    else return null;
  }

  checkOutVariable(column, subjectTo) {
    let pivot = -1;
    let min = 99999999;
    subjectTo.forEach((subject, index) => {
      if (index == 0) return;
      if (subject[column] <= 0) return;
      let result = subject[subject.length - 1] / subject[column];
      if (result < min) {
        min = result;
        pivot = index;
      }
    });
    if (pivot === -1) return null;
    return pivot;
  }

  countVariables() {
    let countX = 0;
    let countSubject = 0;
    this.subjectTo.forEach((subject) => {
      countSubject++;
      let size = subject.length;
      countX = size - 2;
    });
    return { countX, countSubject };
  }

  initDict(z, subjectTo) {
    this.current_dict[0] = z.filter((zF, index) => {
      if (index == z.length - 1) return true;
      if (index < z.length - 1 && zF != 0) {
        return true;
      } else {
        return false;
      }
    });

    this.current_dict[0] = this.current_dict[0].map((zF) => +zF);
    let variables = this.current_dict[0].length - 1;
    let countSubject = this.countVariables().countSubject;
    let row = 1;
    subjectTo.forEach((subject) => {
      this.current_dict[0].push(0);
      let rest = subject.slice(0, variables);
      let last = subject.slice(-2);
      for (let i = 0; i < countSubject; i++) {
        if (i + 1 == row) {
          rest.push(last[1]);
        } else rest.push(0);
      }
      this.current_dict[row] = [...rest, last[0]];
      this.current_dict[row] = [0, ...this.current_dict[row]];
      row++;
    });

    this.current_dict[0] = [1, ...this.current_dict[0]];
    this.current_dict[0].forEach((value, index) => {
      if (index == 0 || index > countSubject) return;
      this.basics.push(`X_${index + variables}`);
    });
  }

  step4(column, pivot) {
    let pivotValue = this.current_dict[pivot][column];
    this.current_dict[pivot].forEach((value, index) => {
      this.current_dict[pivot][index] = value / pivotValue;
    });
  }
  step5(column, pivot) {
    this.current_dict.forEach((row, index) => {
      if (index == pivot) return;
      let pf = this.current_dict[index][column];
      let fn = this.current_dict[pivot];
      let newRow = [];
      row.forEach((fa, index) => {
        let newValue = fn[index] * pf;
        newRow.push(fa - newValue);
      });
      this.current_dict[index] = newRow;
    });
  }

  main() {
    this.initDict(this.z, this.subjectTo);
    let tries = 0;
    while (true) {
      if (tries > this.limit_tries) break;
      let column = this.checkMoreNegativeZ(this.current_dict[0]);
      if (column === null) {
        console.log("No mas negativos en Z");
        break;
      }
      let pivot = this.checkOutVariable(column, this.current_dict);
      if (pivot === null) {
        console.log("No mas variables en subjectTo");
        break;
      }
      this.basics[pivot - 1] = `X_${column}`;

      this.step4(column, pivot);
      this.step5(column, pivot);
      tries++;
    }
    return {
      basics: this.basics,
      current_dict: this.current_dict,
    };
  }
}
