function initCommandBuilder(commandData, vscode) {
  const commandSelect = document.getElementById("commandSelect");
  const optionsContainer = document.getElementById("optionsContainer");
  const commandPreview = document.getElementById("commandPreview");
  const runButton = document.getElementById("runButton");

  function log(message) {
    vscode.postMessage({ type: "log", message: message });
  }

  log("Command Builder initialized");

  commandSelect.addEventListener("change", function () {
    log("Command selected: " + this.value);
    const selectedCommand = commandData.find((cmd) => cmd.value === this.value);
    if (selectedCommand) {
      log("Command found: " + JSON.stringify(selectedCommand));
      displayOptions(selectedCommand);
      runButton.disabled = false;
    } else {
      log("No command found");
      clearOptions();
      runButton.disabled = true;
    }
    updateCommandPreview();
  });

  runButton.addEventListener("click", function () {
    const command = buildCommand();
    log("Running command: " + command);
  });

  function displayOptions(command) {
    log("Displaying options");
    optionsContainer.innerHTML = "";

    if (command.options && command.options.length > 0) {
      log("Command has options: " + command.options.length);
      command.options.forEach((option) => {
        optionsContainer.appendChild(createInputElement(option, "option"));
      });
    }
  }

  function createInputElement(item, type) {
    const div = document.createElement("div");
    div.className = `${type}-input`;

    const topRow = document.createElement("div");
    topRow.className = "top-row";

    const labelContainer = document.createElement("div");
    labelContainer.className = "label-container";

    const label = document.createElement("vscode-label");
    label.textContent = item.name;

    const infoIcon = document.createElement("vscode-button");
    infoIcon.appearance = "icon";
    infoIcon.innerHTML = "?";
    infoIcon.addEventListener("click", () => {
      vscode.postMessage({
        type: "showInfo",
        value: item.description,
      });
    });

    labelContainer.appendChild(label);
    labelContainer.appendChild(infoIcon);
    topRow.appendChild(labelContainer);

    if (item.type === "flag") {
      const checkbox = document.createElement("vscode-checkbox");
      checkbox.id = item.name;
      checkbox.dataset.name = item.name;
      checkbox.dataset.type = type;
      topRow.appendChild(checkbox);
    }

    div.appendChild(topRow);

    if (item.type !== "flag") {
      const input = document.createElement("vscode-text-field");
      input.placeholder = item.placeholder || "";
      input.dataset.name = item.name;
      input.dataset.type = type;
      div.appendChild(input);
    }

    return div;
  }

  function clearOptions() {
    optionsContainer.innerHTML = "";
  }

  function updateCommandPreview() {
    const command = buildCommand();
    commandPreview.value = command;
  }

  function buildCommand() {
    const selectedCommand = commandSelect.value;
    let command = `soroban contract ${selectedCommand}`;

    optionsContainer
      .querySelectorAll("vscode-checkbox, vscode-text-field")
      .forEach((input) => {
        if (input.tagName === "VSCODE-CHECKBOX" && input.checked) {
          command += ` ${input.dataset.name}`;
        } else if (input.tagName === "VSCODE-TEXT-FIELD" && input.value) {
          command += ` ${input.dataset.name} ${input.value}`;
        }
      });

    return command;
  }

  // Add event listeners to update preview
  optionsContainer.addEventListener("input", updateCommandPreview);
  optionsContainer.addEventListener("change", updateCommandPreview);
}

// Make sure to expose the function to the global scope
window.initCommandBuilder = initCommandBuilder;
