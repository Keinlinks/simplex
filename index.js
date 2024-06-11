let variables = 4;
var form = {
  z: [],
  subjectTo: [],
};

let inputs = [];

const createFormLine = (values = [0, 0, 0, 0, 0]) => {
  let numInputs = values.length - 1;
  if (numInputs < 0) return;
  let row = form.subjectTo.length;
  const formLine = document.createElement("div");
  formLine.classList.add("form-line");
  let inputs_array = [];
  //Xi
  for (let i = 1; i <= numInputs + 1; i++) {
    const cellContainer = document.createElement("div");
    cellContainer.classList.add("cell_container");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", values[i - 1]);
    input.id = `${row}_x${i}`;

    input.addEventListener("change", (e) => {
      const value = e.target.value;
      x = `x${i}`;
      form.subjectTo[row].x[i - 1] = +value;
    });
    inputs_array.push(input);

    const paragraph = document.createElement("p");

    const xText = document.createTextNode("X");
    const subtitleSpan = document.createElement("span");
    subtitleSpan.classList.add("subtitle");
    subtitleSpan.textContent = i;

    paragraph.appendChild(xText);
    paragraph.appendChild(subtitleSpan);

    cellContainer.appendChild(input);
    cellContainer.appendChild(paragraph);

    formLine.appendChild(cellContainer);
  }

  const numberOfInputs = inputs.length;

  //x clearance
  let cellContainer = document.createElement("div");
  cellContainer.classList.add("cell_container");

  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("value", "1");
  input.id = `${row}_x_clearance_${row}`;

  input.addEventListener("change", (e) => {
    const value = e.target.value;
    form.subjectTo[row].x[numInputs + 1] = +value;
  });
  inputs_array.push(input);

  let paragraph = document.createElement("p");

  let xText = document.createTextNode("X");
  let subtitleSpan = document.createElement("span");
  subtitleSpan.classList.add("subtitle");
  subtitleSpan.textContent = "h";

  paragraph.appendChild(xText);
  paragraph.appendChild(subtitleSpan);

  cellContainer.appendChild(input);
  cellContainer.appendChild(paragraph);

  formLine.appendChild(cellContainer);

  //EQUAL
  cellContainer = document.createElement("div");
  cellContainer.classList.add("cell_container");

  input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("value", values[numInputs]);
  input.id = `$result_${row}`;

  input.addEventListener("change", (e) => {
    const value = e.target.value;
    form.subjectTo[row].x[numInputs] = +value;
  });
  inputs_array.push(input);

  paragraph = document.createElement("p");

  xText = document.createTextNode("=");

  paragraph.classList.add("subtitle");

  paragraph.appendChild(xText);

  cellContainer.appendChild(paragraph);
  cellContainer.appendChild(input);
  formLine.appendChild(cellContainer);
  subject_container.appendChild(formLine);
  inputs.push(inputs_array);
  form.subjectTo.push({
    x: [...values, 1],
    element: formLine,
  });
  return formLine;
};

const subject_container = document.getElementById("subject_container");

const addSubjectButton = document.getElementById("add_subject");
addSubjectButton.addEventListener("click", () => {
  const variables = +document.getElementById("variables").value;
  let values = [];
  for (let i = 0; i < variables; i++) {
    values.push(0);
  }
  createFormLine(values);
});

const removeSubjectButton = document.getElementById("remove_subject");
removeSubjectButton.addEventListener("click", () => {
  if (form.subjectTo.length === 0) return;
  form.subjectTo.pop();
  inputs.pop();
  const lastChild = subject_container.lastChild;
  subject_container.removeChild(lastChild);
});

const calcButton = document.getElementById("calc");
var $result_ = document.getElementById("result_container");
calcButton.addEventListener("click", () => {
  if ($result_) $result_.innerHTML = "";
  getZ();

  const simplex = new Simplex();
  simplex.setZ(form.z);
  simplex.setSubjectTo(getSubjectsInputs());
  console.log(getSubjectsInputs());
  const mode = document.getElementById("select").value;
  const result = simplex.main(mode);
  const resultContainer = document.getElementById("result_container");
  let dataTable;
  dataTable = result.current_dict.map((row, index) => {
    if (index === 0) return ["Z", ...row];
    if (result.basics[index - 1] === undefined) return row;
    return [result.basics[index - 1], ...row];
  });
  let table_header = ["-", "Z"];
  for (let i = 0; i < result.current_dict[1].length - 2; i++) {
    table_header.push(`X_${i + 1}`);
  }
  table_header.push("R");

  dataTable = [table_header].concat(dataTable);
  const table = createTable(dataTable);
  resultContainer.appendChild(table);
  const resultLabel = document.getElementById("result_label");
  resultLabel.textContent = `Resultado: ${result.status}`;
});

const cleanButton = document.getElementById("clean");
cleanButton.addEventListener("click", () => {
  $result_.innerHTML = "";
});

function getZ() {
  const variables = +document.getElementById("variables").value;
  let values = [];
  for (let i = 0; i < variables; i++) {
    let key = `z_x${i + 1}`;
    values.push(+document.getElementById(key).value);
  }

  form.z = values;
}

function getSubjectsInputs() {
  subjectTo = [];
  inputs.forEach((input) => {
    let values = [];
    input.forEach((input) => {
      values.push(+input.value);
    });
    subjectTo.push(values);
  });
  return subjectTo;
}

function createZForm(values = [0, 0, 0, 0, 0, 0]) {
  let z_main = document.createElement("div");
  z_main.className = "form-line z_line";

  let data = [];
  values.forEach((value, index) => {
    data.push({
      id: `z_x${index + 1}`,
      value: value,
      label: "X",
      subtitle: index + 1,
    });
  });
  data.forEach((item) => {
    let cellContainer = document.createElement("div");
    cellContainer.className = "cell_container";

    let input = document.createElement("input");
    input.id = item.id;
    input.type = "text";
    input.value = item.value;

    let p = document.createElement("p");
    p.textContent = item.label;

    if (item.subtitle) {
      const span = document.createElement("span");
      span.className = "subtitle";
      span.textContent = item.subtitle;
      p.appendChild(span);
    }

    cellContainer.appendChild(input);
    cellContainer.appendChild(p);
    z_main.appendChild(cellContainer);
  });

  return z_main;
}

function createTable(data) {
  const table = document.createElement("table");
  table.border = 1;
  data.forEach((rowData) => {
    console.log(rowData);
    const tr = document.createElement("tr");

    rowData.forEach((cellData) => {
      const td = document.createElement("td");
      td.textContent = cellData;
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  return table;
}

const buttonInit = document.getElementById("buttonInit");
buttonInit.addEventListener("click", () => {
  document.getElementById("main_container").style.display = "block";
  const variables = +document.getElementById("variables").value;
  let values = [];
  for (let i = 0; i < variables; i++) {
    values.push(0);
  }
  const z_form = createZForm(values);
  createFormLine(values);
  const z_container = document.getElementById("z_container");
  z_container.appendChild(z_form);
});
