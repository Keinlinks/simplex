const simplex = new Simplex();

let variables = 4;
var form = {
  z: [],
  subjectTo: [],
};

const createFormLine = (values = [0, 0, 0, 0, 0]) => {
  let numInputs = values.length - 1;
  if (numInputs < 0) return;
  let row = form.subjectTo.length;
  const formLine = document.createElement("div");
  formLine.classList.add("form-line");
  //Xi
  for (let i = 1; i <= numInputs; i++) {
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

  paragraph = document.createElement("p");

  xText = document.createTextNode("=");

  paragraph.classList.add("subtitle");

  paragraph.appendChild(xText);

  cellContainer.appendChild(paragraph);
  cellContainer.appendChild(input);
  formLine.appendChild(cellContainer);
  subject_container.appendChild(formLine);

  form.subjectTo.push({
    x: [...values, 1],
    element: formLine,
  });
  return formLine;
};

const subject_container = document.getElementById("subject_container");

const addSubjectButton = document.getElementById("add_subject");
addSubjectButton.addEventListener("click", () => {
  createFormLine([0, 0, 0, 0]);
});

const removeSubjectButton = document.getElementById("remove_subject");
removeSubjectButton.addEventListener("click", () => {
  if (form.subjectTo.length === 0) return;
  form.subjectTo.pop();
  const lastChild = subject_container.lastChild;
  subject_container.removeChild(lastChild);
});

const calcButton = document.getElementById("calc");
var $result_ = document.getElementById("result_container");
calcButton.addEventListener("click", () => {
  if ($result_) $result_.innerHTML = "";
  getZ();
  simplex.setZ(form.z);
  simplex.setSubjectTo(form.subjectTo.map((subject) => subject.x));
  const result = simplex.main();
  const resultContainer = document.getElementById("result_container");
  const dataTable = result.current_dict.map((row, index) => {
    if (index === 0) return ["Z", ...row];
    if (result.basics[index - 1] === undefined) return row;
    return [result.basics[index - 1], ...row];
  });
  const table = createTable(dataTable);
  resultContainer.appendChild(table);
});

function getZ() {
  z_x1 = document.getElementById("z_x1").value;
  z_x2 = document.getElementById("z_x2").value;
  z_x3 = document.getElementById("z_x3").value;
  z_x4 = document.getElementById("z_x4").value;
  z_c = document.getElementById("z_c").value;
  form.z = [+z_x1, +z_x2, +z_x3, +z_x4, +z_c];
}
const z_form = createZForm([0, 0, 0, 0, 0]);
createFormLine([0, 0, 0, 0]);

const z_container = document.getElementById("z_container");
z_container.appendChild(z_form);

function createZForm(values = [0, 0, 0, 0, 0, 0]) {
  let z_main = document.createElement("div");
  z_main.className = "form-line z_line";

  let data = [
    { id: "z_x1", value: values[0], label: "X", subtitle: "1" },
    { id: "z_x2", value: values[1], label: "X", subtitle: "2" },
    { id: "z_x3", value: values[2], label: "X", subtitle: "3" },
    { id: "z_x4", value: values[3], label: "X", subtitle: "4" },
    { id: "z_c", value: values[4], label: "C", subtitle: "" },
  ];

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
