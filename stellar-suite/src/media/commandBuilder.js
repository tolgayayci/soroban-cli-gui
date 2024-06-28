function initCommandBuilder(commandData) {
  const commandSelect = document.getElementById("commandSelect");
  const optionsContainer = document.getElementById("optionsContainer");
  const commandPreview = document.getElementById("commandPreview");
  const runButton = document.getElementById("runButton");

  function updateOptions(commandValue) {
    const command = commandData.find((cmd) => cmd.value === commandValue);
    optionsContainer.innerHTML = "";
    if (command) {
      command.options.forEach((option) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "option";

        const label = document.createElement("label");
        label.textContent = option.name;
        optionDiv.appendChild(label);

        if (option.type === "flag") {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = option.name;
          optionDiv.appendChild(checkbox);
        } else {
          const input = document.createElement("input");
          input.type = "text";
          input.id = option.name;
          input.placeholder = option.placeholder || "";
          optionDiv.appendChild(input);
        }

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = option.description;
        optionDiv.appendChild(description);

        optionsContainer.appendChild(optionDiv);
      });
    }
    updateCommandPreview();
  }

  function updateCommandPreview() {
    const commandValue = commandSelect.value;
    let preview = `soroban contract ${commandValue}`;

    const options = optionsContainer.querySelectorAll(".option");
    options.forEach((optionDiv) => {
      const input = optionDiv.querySelector("input");
      if (input.type === "checkbox" && input.checked) {
        preview += ` ${input.id}`;
      } else if (input.type === "text" && input.value) {
        preview += ` ${input.id} ${input.value}`;
      }
    });

    commandPreview.textContent = preview;
  }

  commandSelect.addEventListener("change", () => {
    updateOptions(commandSelect.value);
  });

  optionsContainer.addEventListener("change", updateCommandPreview);
  optionsContainer.addEventListener("input", updateCommandPreview);

  runButton.addEventListener("click", () => {
    vscode.postMessage({
      type: "runCommand",
      value: commandPreview.textContent,
    });
  });

  updateOptions(commandSelect.value);
}
